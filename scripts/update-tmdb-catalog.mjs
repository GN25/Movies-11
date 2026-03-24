#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const TMDB_BASE = "https://api.themoviedb.org/3";
const OUTPUT_JS = path.resolve("data/catalog.js");
const OUTPUT_META = path.resolve("data/catalog.meta.json");

await loadDotEnvFiles();

const token = process.env.TMDB_BEARER_TOKEN || process.env.TMDB_API_READ_TOKEN || "";
if (!token) {
  console.error("Missing TMDB bearer token.");
  console.error("Set TMDB_BEARER_TOKEN (or TMDB_API_READ_TOKEN) in env or .env and rerun.");
  process.exit(1);
}

const pages = clampInt(process.env.TMDB_PAGES, 8, 1, 20);
const maxMovies = clampInt(process.env.TMDB_MAX_MOVIES, 180, 60, 300);
const minVoteCount = clampInt(process.env.TMDB_MIN_VOTE_COUNT, 300, 0, 5000);
const language = process.env.TMDB_LANGUAGE || "en-US";

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function run() {
  console.log(`Fetching TMDb genres (${language})...`);
  const genreMap = await fetchGenreMap(language);

  console.log(`Fetching TMDb popular movies (${pages} pages)...`);
  const popular = await fetchPopularMovies(pages, language);
  const sorted = [...popular]
    .filter((movie) => Number(movie.vote_count || 0) >= minVoteCount)
    .sort((a, b) => Number(b.popularity || 0) - Number(a.popularity || 0));

  const deduped = [];
  const seen = new Set();
  for (const movie of sorted) {
    if (seen.has(movie.id)) continue;
    seen.add(movie.id);
    deduped.push(movie);
  }

  console.log(`Fetching details and credits for ${deduped.length} movies...`);
  const detailed = await mapWithConcurrency(deduped, 6, async (movie) => {
    try {
      return await tmdbFetch(`/movie/${movie.id}`, {
        append_to_response: "credits",
        language
      });
    } catch (_error) {
      return null;
    }
  });

  const records = detailed
    .filter(Boolean)
    .map((movie) => toCatalogMovie(movie, genreMap))
    .filter(Boolean);

  const actorFrequency = new Map();
  records.forEach((movie) => {
    new Set(movie.cast).forEach((actor) => {
      actorFrequency.set(actor, (actorFrequency.get(actor) || 0) + 1);
    });
  });

  const filtered = records
    .map((movie) => ({
      ...movie,
      cast: movie.cast.filter((actor) => (actorFrequency.get(actor) || 0) >= 2)
    }))
    .filter((movie) => movie.cast.length > 0)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, maxMovies);

  const uniqueActors = new Set();
  filtered.forEach((movie) => movie.cast.forEach((actor) => uniqueActors.add(actor)));

  if (filtered.length < 60) {
    throw new Error(`TMDb output too small (${filtered.length} movies). Increase TMDB_PAGES or lower TMDB_MIN_VOTE_COUNT.`);
  }

  await fs.mkdir(path.dirname(OUTPUT_JS), { recursive: true });

  const generatedAt = new Date().toISOString();
  const js = [
    `/* Auto-generated from TMDb on ${generatedAt}. */`,
    "window.CINECLASH_CATALOG = ",
    `${JSON.stringify(filtered, null, 2)};`,
    ""
  ].join("\n");
  await fs.writeFile(OUTPUT_JS, js, "utf8");

  const meta = {
    source: "TMDb",
    generatedAt,
    language,
    pages,
    maxMovies,
    minVoteCount,
    movieCount: filtered.length,
    uniqueActors: uniqueActors.size
  };
  await fs.writeFile(OUTPUT_META, JSON.stringify(meta, null, 2) + "\n", "utf8");

  console.log(`Wrote ${filtered.length} movies / ${uniqueActors.size} actors to ${OUTPUT_JS}`);
  console.log(`Wrote metadata to ${OUTPUT_META}`);
}

async function fetchGenreMap(languageCode) {
  const data = await tmdbFetch("/genre/movie/list", { language: languageCode });
  const map = new Map();
  (data.genres || []).forEach((genre) => {
    map.set(Number(genre.id), String(genre.name || "").trim());
  });
  return map;
}

async function fetchPopularMovies(pageCount, languageCode) {
  const pagesToFetch = [];
  for (let page = 1; page <= pageCount; page += 1) {
    pagesToFetch.push(page);
  }

  const results = await mapWithConcurrency(pagesToFetch, 4, async (page) => {
    const data = await tmdbFetch("/movie/popular", { language: languageCode, page });
    return Array.isArray(data.results) ? data.results : [];
  });
  return results.flat();
}

function toCatalogMovie(movie, genreMap) {
  const title = String(movie.title || "").trim();
  const year = Number(String(movie.release_date || "").slice(0, 4));
  const titleTokenCount = titleLetters(title).length;
  if (!title || !Number.isFinite(year) || year < 1900 || year > 2100) return null;
  if (titleTokenCount < 4 || titleTokenCount > 20) return null;

  const genreNames = Array.isArray(movie.genres)
    ? movie.genres.map((genre) => String(genre.name || "").trim()).filter(Boolean)
    : Array.isArray(movie.genre_ids)
      ? movie.genre_ids.map((id) => genreMap.get(Number(id)) || "").filter(Boolean)
      : [];
  const genres = [...new Set(genreNames)].slice(0, 4);
  if (genres.length === 0) return null;

  const cast = Array.isArray(movie.credits?.cast)
    ? movie.credits.cast
        .slice(0, 8)
        .map((entry) => String(entry.name || "").trim())
        .filter(Boolean)
    : [];
  if (cast.length === 0) return null;

  const overview = String(movie.overview || "").replace(/\s+/g, " ").trim();
  const clue = overview || `${title} is a ${genres[0]} movie released in ${year}.`;

  return {
    title,
    year,
    genres,
    cast,
    popularity: Math.max(1, Math.min(100, Math.round(Number(movie.popularity || 60)))),
    clue: clue.slice(0, 240)
  };
}

async function tmdbFetch(pathname, query = {}) {
  const url = new URL(`${TMDB_BASE}${pathname}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TMDb ${response.status} on ${pathname}: ${body.slice(0, 180)}`);
  }

  return response.json();
}

async function mapWithConcurrency(items, concurrency, iterator) {
  const results = new Array(items.length);
  let index = 0;

  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const current = index;
      index += 1;
      if (current >= items.length) return;
      results[current] = await iterator(items[current], current);
    }
  });

  await Promise.all(workers);
  return results;
}

function titleLetters(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/[^A-Z0-9]/g, "");
}

function clampInt(input, fallback, min, max) {
  const value = Number(input);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

async function loadDotEnvFiles() {
  const envPaths = [path.resolve(".env"), path.resolve(".env.local")];
  const merged = {};

  for (const envPath of envPaths) {
    const parsed = await parseDotEnvFile(envPath);
    Object.assign(merged, parsed);
  }

  Object.entries(merged).forEach(([key, value]) => {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

async function parseDotEnvFile(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const out = {};

    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const withoutExport = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
      const eq = withoutExport.indexOf("=");
      if (eq <= 0) return;

      const key = withoutExport.slice(0, eq).trim();
      let value = withoutExport.slice(eq + 1).trim();
      if (!key) return;

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      out[key] = value;
    });

    return out;
  } catch (_error) {
    return {};
  }
}
