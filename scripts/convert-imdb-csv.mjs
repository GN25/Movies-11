#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const INPUT_CSV = path.resolve(process.env.IMDB_CSV_PATH || "imdb_movies.csv");
const MOVIES_JSON = path.resolve("data/movies.json");
const TV_SHOWS_JSON = path.resolve("data/tv-shows.json");
const META_JSON = path.resolve("data/catalog.meta.json");

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function run() {
  const csvRaw = await fs.readFile(INPUT_CSV, "utf8");
  const rows = parseCsv(csvRaw);
  if (rows.length < 2) {
    throw new Error("CSV has no data rows.");
  }

  const header = rows[0].map((value) => String(value || "").trim().toLowerCase());
  const required = ["names", "date_x", "score", "genre", "overview", "crew", "budget_x"];
  for (const column of required) {
    if (!header.includes(column)) {
      throw new Error(`CSV missing expected column: ${column}`);
    }
  }

  const indexByColumn = new Map(header.map((column, index) => [column, index]));
  const works = [];

  for (const row of rows.slice(1)) {
    const names = cleanCell(row[indexByColumn.get("names")]);
    if (!names) continue;

    const movieName =
      cleanCell(row[indexByColumn.get("movie name")]) ||
      cleanCell(row[indexByColumn.get("orig_title")]) ||
      names;
    const dateX = cleanCell(row[indexByColumn.get("date_x")]);
    const year = parseFirstYear(dateX);
    const genre = normalizeGenre(cleanCell(row[indexByColumn.get("genre")]));
    const score = parseScore(cleanCell(row[indexByColumn.get("score")]));
    const overview = normalizeDescription(cleanCell(row[indexByColumn.get("overview")]));
    const crew = normalizeCrew(cleanCell(row[indexByColumn.get("crew")]));
    const budbetX = parseBudget(cleanCell(row[indexByColumn.get("budget_x")]));
    const status = cleanCell(row[indexByColumn.get("status")]);

    const record = {
      names,
      "movie name": movieName,
      date_x: dateX,
      score,
      genre,
      overview,
      crew,
      budbet_x: budbetX
    };

    works.push({
      record,
      year,
      isTvShow: detectTvShow(names, movieName, dateX, genre, overview, status)
    });
  }

  const moviesRaw = works.filter((item) => !item.isTvShow).map((item) => item.record);
  const tvShowsRaw = works.filter((item) => item.isTvShow).map((item) => item.record);
  const tvShowKeys = new Set(tvShowsRaw.map(buildRecordKey));
  const moviesRawWithoutSeriesKeys = moviesRaw.filter((record) => !tvShowKeys.has(buildRecordKey(record)));
  const movies = dedupeWorks(moviesRawWithoutSeriesKeys);
  const tvShows = dedupeWorks(tvShowsRaw);

  movies.sort(compareByPopularity);
  tvShows.sort(compareByPopularity);

  await fs.mkdir(path.dirname(MOVIES_JSON), { recursive: true });
  await fs.writeFile(MOVIES_JSON, JSON.stringify(movies, null, 2) + "\n", "utf8");
  await fs.writeFile(TV_SHOWS_JSON, JSON.stringify(tvShows, null, 2) + "\n", "utf8");

  const generatedAt = new Date().toISOString();

  const uniqueCrew = new Set();
  movies.forEach((movie) => parseCrewMembers(movie.crew).forEach((person) => uniqueCrew.add(person)));
  const meta = {
    source: path.basename(INPUT_CSV),
    generatedAt,
    format: "csv-to-json",
    outputColumns: ["names", "movie name", "date_x", "score", "genre", "overview", "crew", "budbet_x"],
    tvSeriesRule: "Series/special if status/title/overview indicate episodic content or special/event records.",
    crossTypeConflictsRemovedFromMovies: moviesRaw.length - moviesRawWithoutSeriesKeys.length,
    moviesCount: movies.length,
    tvShowsCount: tvShows.length,
    uniqueMovieCrewMembers: uniqueCrew.size
  };
  await fs.writeFile(META_JSON, JSON.stringify(meta, null, 2) + "\n", "utf8");

  console.log(`Wrote ${movies.length} movies to ${MOVIES_JSON}`);
  console.log(`Wrote ${tvShows.length} tv shows to ${TV_SHOWS_JSON}`);
  console.log(`Wrote metadata to ${META_JSON}`);
}

function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (next === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }
    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }
    if (char === "\r") {
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function cleanCell(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeDescription(value) {
  const text = cleanCell(value);
  return text.replace(/\s*(?:\.{3}|…)?\s*see\s+full\s+(?:summary|synopsis)\s*»?\s*$/i, "").trim();
}

function parseFirstYear(rawYear) {
  const value = String(rawYear || "");
  const match = value.match(/(\d{4})/);
  return match ? Number(match[1]) : NaN;
}

function normalizeGenre(rawGenre) {
  return String(rawGenre || "")
    .split(",")
    .map((part) => cleanCell(part))
    .filter(Boolean)
    .join(", ");
}

function parseScore(rawScore) {
  const value = Number(String(rawScore || "").replace(",", "."));
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(1));
}

function parseBudget(rawBudget) {
  const digits = String(rawBudget || "").replace(/[^0-9.-]/g, "");
  const value = Number(digits);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}

function normalizeCrew(rawCrew) {
  return cleanCell(rawCrew);
}

function parseCrewMembers(rawCrew) {
  const parts = String(rawCrew || "")
    .split(",")
    .map((part) => cleanCell(part))
    .filter(Boolean);

  if (!parts.length) return [];
  if (parts.length >= 4) {
    const even = parts.filter((_part, index) => index % 2 === 0);
    if (even.length >= 2) return [...new Set(even)];
  }

  return [...new Set(parts)];
}

function parseComparableScore(rawScore) {
  const numeric = Number(String(rawScore || "").replace(",", "."));
  if (!Number.isFinite(numeric)) return 0;
  if (numeric > 10) {
    return Math.max(0, Math.min(10, Number((numeric / 10).toFixed(1))));
  }
  return Math.max(0, Math.min(10, Number(numeric.toFixed(1))));
}

function detectTvShow(name, movieName, rawDate, genre, overview, status) {
  if (isLikelyNonMovieSpecial(name, genre, overview)) return true;
  if (isLikelyNonMovieSpecial(movieName, genre, overview)) return true;

  const statusText = String(status || "").toLowerCase();
  if (/\b(series|returning|in production|pilot|miniseries)\b/.test(statusText)) return true;

  const dateText = String(rawDate || "").trim();
  if (/\d{4}\s*[–-]\s*(\d{4}|$)/.test(dateText)) return true;

  const text = `${String(name || "")} ${String(movieName || "")} ${String(overview || "")}`.toLowerCase();
  if (/\b(series|episodes?|season|seasons|miniseries|sitcom|anthology)\b/.test(text)) return true;

  return false;
}

function isLikelyNonMovieSpecial(title, genre, description) {
  const titleText = String(title || "").toLowerCase();
  const descText = String(description || "").toLowerCase();
  const genreTokens = String(genre || "")
    .split(",")
    .map((item) => normalizeKey(item))
    .filter(Boolean);

  if (genreTokens.some((value) => ["news", "talk show", "game show", "reality tv"].includes(value))) {
    return true;
  }

  if (/\b(?:season\s*\d+|episode\s*\d+)\b/i.test(titleText)) return true;
  if (/\bthe oscars\b/i.test(titleText)) return true;
  if (/\bseries\b[:\s-]/i.test(titleText)) return true;

  const awardPattern =
    /\b(?:\d{1,3}(?:st|nd|rd|th)\s+)?(?:annual\s+)?(?:golden globe|primetime emmy|screen actors guild|academy awards?|grammy|bafta|independent spirit awards?)\b/i;
  if (awardPattern.test(titleText)) return true;
  if (/\bawards?\b/i.test(titleText) && /\b(golden globe|emmy|screen actors guild|academy|grammy|bafta|spirit awards?)\b/i.test(titleText)) {
    return true;
  }
  if (/\baward ceremony\b/i.test(`${titleText} ${descText}`)) return true;
  if (/\b(featurette|electronic press kit|behind the scenes|date announcement commercial|for your consideration)\b/i.test(`${titleText} ${descText}`)) {
    return true;
  }
  if (/\b(docuseries|miniseries)\b/i.test(descText)) return true;

  return false;
}

function dedupeWorks(records) {
  const bestByKey = new Map();

  records.forEach((record) => {
    const key = buildRecordKey(record);
    const current = bestByKey.get(key);
    if (!current) {
      bestByKey.set(key, record);
      return;
    }

    if (
      Number(record.budbet_x || 0) > Number(current.budbet_x || 0) ||
      (Number(record.budbet_x || 0) === Number(current.budbet_x || 0) && parseComparableScore(record.score) > parseComparableScore(current.score)) ||
      (Number(record.budbet_x || 0) === Number(current.budbet_x || 0) &&
        parseComparableScore(record.score) === parseComparableScore(current.score) &&
        String(record.overview || "").length > String(current.overview || "").length)
    ) {
      bestByKey.set(key, record);
    }
  });

  return [...bestByKey.values()];
}

function buildRecordKey(record) {
  return `${normalizeKey(record?.names)}|${parseFirstYear(record?.date_x) || 0}`;
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compareByPopularity(a, b) {
  const budgetA = Number(a.budbet_x || 0);
  const budgetB = Number(b.budbet_x || 0);
  if (budgetB !== budgetA) return budgetB - budgetA;

  const scoreA = parseComparableScore(a.score);
  const scoreB = parseComparableScore(b.score);
  if (scoreB !== scoreA) return scoreB - scoreA;

  const yearA = parseFirstYear(a.date_x) || 0;
  const yearB = parseFirstYear(b.date_x) || 0;
  if (yearB !== yearA) return yearB - yearA;

  return String(a.names || "").localeCompare(String(b.names || ""));
}
