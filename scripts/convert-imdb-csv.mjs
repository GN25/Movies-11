#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const INPUT_CSV = path.resolve(process.env.IMDB_CSV_PATH || "IMBD.csv");
const MOVIES_JSON = path.resolve("data/movies.json");
const TV_SHOWS_JSON = path.resolve("data/tv-shows.json");
const CATALOG_JS = path.resolve("data/catalog.js");
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
  const required = ["title", "year", "duration", "genre", "rating", "description", "stars", "votes", "certificate"];
  for (const column of required) {
    if (!header.includes(column)) {
      throw new Error(`CSV missing expected column: ${column}`);
    }
  }

  const indexByColumn = new Map(header.map((column, index) => [column, index]));
  const works = [];

  for (const row of rows.slice(1)) {
    const title = cleanCell(row[indexByColumn.get("title")]);
    if (!title) continue;

    const yearRaw = cleanCell(row[indexByColumn.get("year")]);
    const certificate = cleanCell(row[indexByColumn.get("certificate")]);
    const year = parseFirstYear(yearRaw);
    if (!Number.isFinite(year)) continue;

    const duration = cleanCell(row[indexByColumn.get("duration")]);
    const genre = normalizeGenre(cleanCell(row[indexByColumn.get("genre")]));
    const rating = parseRating(cleanCell(row[indexByColumn.get("rating")]));
    const description = cleanCell(row[indexByColumn.get("description")]);
    const stars = parseStars(cleanCell(row[indexByColumn.get("stars")]));
    const votes = parseVotes(cleanCell(row[indexByColumn.get("votes")]));

    const record = {
      title,
      year,
      duration,
      genre,
      rating,
      description,
      stars,
      votes
    };

    works.push({
      record,
      isTvShow: detectTvShow(yearRaw, certificate, duration, description)
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
  const catalogJs = [
    `/* Auto-generated from ${path.basename(INPUT_CSV)} on ${generatedAt}. */`,
    "window.CINECLASH_CATALOG = ",
    `${JSON.stringify(movies, null, 2)};`,
    ""
  ].join("\n");
  await fs.writeFile(CATALOG_JS, catalogJs, "utf8");

  const uniqueStars = new Set();
  movies.forEach((movie) => movie.stars.forEach((star) => uniqueStars.add(star)));
  const meta = {
    source: path.basename(INPUT_CSV),
    generatedAt,
    format: "csv-to-json",
    outputColumns: ["title", "year", "duration", "genre", "rating", "description", "stars", "votes"],
    tvSeriesRule: "Series if year has a range OR (TV certificate AND episodic runtime/keywords).",
    crossTypeConflictsRemovedFromMovies: moviesRaw.length - moviesRawWithoutSeriesKeys.length,
    moviesCount: movies.length,
    tvShowsCount: tvShows.length,
    uniqueMovieStars: uniqueStars.size
  };
  await fs.writeFile(META_JSON, JSON.stringify(meta, null, 2) + "\n", "utf8");

  console.log(`Wrote ${movies.length} movies to ${MOVIES_JSON}`);
  console.log(`Wrote ${tvShows.length} tv shows to ${TV_SHOWS_JSON}`);
  console.log(`Wrote catalog JS to ${CATALOG_JS}`);
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

function parseRating(rawRating) {
  const value = Number(String(rawRating || "").replace(",", "."));
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, Number(value.toFixed(1))));
}

function parseVotes(rawVotes) {
  const digits = String(rawVotes || "").replace(/[^0-9]/g, "");
  const value = Number(digits);
  return Number.isFinite(value) ? value : 0;
}

function parseStars(rawStars) {
  const text = String(rawStars || "").trim();
  if (!text) return [];

  const values = [];
  const regex = /'((?:\\'|[^'])*)'/g;
  let match = regex.exec(text);
  while (match) {
    const value = cleanCell(String(match[1] || "").replace(/\\'/g, "'").replace(/,\s*$/g, ""));
    if (value) values.push(value);
    match = regex.exec(text);
  }

  if (values.length === 0) {
    return normalizeStars(
      text
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((part) => cleanCell(part.replace(/^['"]|['"]$/g, "")))
        .filter(Boolean)
    );
  }

  return normalizeStars(values);
}

function detectTvShow(rawYear, certificate, duration, description) {
  const yearText = String(rawYear || "").replace(/[()]/g, "").trim();
  const cert = String(certificate || "").toUpperCase();
  if (/\d{4}\s*[–-]\s*(\d{4}|$)/.test(yearText)) return true;
  if (!cert.startsWith("TV-")) return false;

  const minutes = parseDurationMinutes(duration);
  if (Number.isFinite(minutes) && (minutes <= 70 || minutes >= 220)) return true;

  const text = String(description || "").toLowerCase();
  if (/\b(series|episodes?|season|seasons|miniseries|sitcom|anthology)\b/.test(text)) return true;

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
      record.votes > current.votes ||
      (record.votes === current.votes && record.rating > current.rating) ||
      (record.votes === current.votes && record.rating === current.rating && record.description.length > current.description.length)
    ) {
      bestByKey.set(key, record);
    }
  });

  return [...bestByKey.values()];
}

function buildRecordKey(record) {
  return `${normalizeKey(record?.title)}|${record?.year}`;
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compareByPopularity(a, b) {
  if (b.votes !== a.votes) return b.votes - a.votes;
  if (b.rating !== a.rating) return b.rating - a.rating;
  if (b.year !== a.year) return b.year - a.year;
  return a.title.localeCompare(b.title);
}

function parseDurationMinutes(value) {
  const match = String(value || "").match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
}

function normalizeStars(stars) {
  const list = Array.isArray(stars) ? stars.map((star) => cleanCell(star)).filter(Boolean) : [];
  const splitIndex = list.lastIndexOf("|");
  const candidateList = splitIndex >= 0 ? list.slice(splitIndex + 1) : list;

  return [...new Set(
    candidateList.filter((value) => {
      const lower = String(value || "").toLowerCase().replace(/:$/, "");
      if (!value || value === "|") return false;
      if (lower === "star" || lower === "stars" || lower === "director" || lower === "directors") return false;
      return true;
    })
  )];
}
