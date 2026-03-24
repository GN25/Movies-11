#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_ENDPOINTS = [
  "https://query.wikidata.org/sparql",
  "https://qlever.dev/api/wikidata"
];

const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php";

const OUTPUT_JS = path.resolve("data/catalog.js");
const OUTPUT_META = path.resolve("data/catalog.meta.json");

const minYear = clampInt(process.env.WIKIDATA_MIN_YEAR, 1975, 1900, 2100);
const maxYear = clampInt(process.env.WIKIDATA_MAX_YEAR, new Date().getFullYear(), 1900, 2100);
const minSitelinks = clampInt(process.env.WIKIDATA_MIN_SITELINKS, 12, 0, 1000);
const queryLimit = clampInt(process.env.WIKIDATA_QUERY_LIMIT, 90, 20, 300);
const maxMovies = clampInt(process.env.WIKIDATA_MAX_MOVIES, 240, 80, 2000);
const minActorReuse = clampInt(process.env.WIKIDATA_MIN_ACTOR_REUSE, 2, 1, 10);
const yearStep = clampInt(process.env.WIKIDATA_YEAR_STEP, 5, 1, 25);
const maxRetries = clampInt(process.env.WIKIDATA_MAX_RETRIES, 7, 1, 12);
const requestDelayMs = clampInt(process.env.WIKIDATA_REQUEST_DELAY_MS, 220, 0, 3000);
const includeSeries = parseBool(process.env.WIKIDATA_INCLUDE_SERIES, true);
const claimsBatchSize = clampInt(
  process.env.WIKIDATA_CLAIMS_BATCH_SIZE ?? process.env.WIKIDATA_BATCH_SIZE,
  40,
  5,
  50
);
const labelsBatchSize = clampInt(
  process.env.WIKIDATA_LABELS_BATCH_SIZE ?? process.env.WIKIDATA_BATCH_SIZE,
  50,
  5,
  50
);
const timeoutMs = clampInt(process.env.WIKIDATA_TIMEOUT_MS, 28000, 5000, 120000);
const poolFactor = clampInt(process.env.WIKIDATA_POOL_FACTOR, 3, 1, 6);
const apiMinIntervalMs = clampInt(process.env.WIKIDATA_API_MIN_INTERVAL_MS, 900, 100, 10000);

const endpoints = parseEndpoints(process.env.WIKIDATA_ENDPOINTS, DEFAULT_ENDPOINTS);
const entityTypes = [{ qid: "Q11424", label: "movie" }];
if (includeSeries) entityTypes.push({ qid: "Q5398426", label: "series" });
let nextApiAllowedAt = 0;

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function run() {
  const yearRanges = buildYearRanges(minYear, maxYear, yearStep);
  console.log(
    `Querying Wikidata in chunks (${entityTypes.map((item) => item.label).join(", ")}; ${yearRanges.length} windows of ${yearStep} years)...`
  );

  const works = [];
  for (const entityType of entityTypes) {
    for (const range of yearRanges) {
      const query = buildWorksQuery({
        typeQid: entityType.qid,
        minYear: range.from,
        maxYear: range.to,
        minSitelinks,
        limit: queryLimit
      });

      const context = `${entityType.label} ${range.from}-${range.to}`;
      console.log(`- ${context} (limit ${queryLimit})`);
      const data = await fetchSparqlWithRetry(query, context);
      const chunk = parseWorks(data, entityType.label);
      console.log(`  -> ${chunk.length} candidates`);
      works.push(...chunk);

      if (requestDelayMs > 0) await sleep(requestDelayMs);
    }
  }

  if (works.length === 0) {
    throw new Error("No rows returned from Wikidata chunk queries.");
  }

  const dedupedWorks = dedupeById(works)
    .sort((a, b) => b.sitelinks - a.sitelinks)
    .slice(0, Math.max(maxMovies * poolFactor, 320));

  const workIds = dedupedWorks.map((work) => work.id);
  console.log(`Loaded ${workIds.length} unique works. Fetching claims in batches of ${claimsBatchSize}...`);

  const { claimsByWork } = await fetchWorkClaims(workIds);

  const mergedIds = dedupedWorks
    .map((work) => {
      const claims = claimsByWork.get(work.id) || { genres: [], cast: [] };
      const genreIds = claims.genres;
      const castIds = claims.cast;
      if (genreIds.length === 0 || castIds.length < 2) return null;

      return {
        id: work.id,
        year: work.year,
        sitelinks: work.sitelinks,
        mediaType: work.mediaType,
        genreIds,
        castIds
      };
    })
    .filter(Boolean);

  const actorFrequency = new Map();
  mergedIds.forEach((item) => {
    new Set(item.castIds).forEach((actorId) => {
      actorFrequency.set(actorId, (actorFrequency.get(actorId) || 0) + 1);
    });
  });

  const prefiltered = mergedIds
    .map((item) => ({
      ...item,
      castIds: item.castIds.filter((actorId) => (actorFrequency.get(actorId) || 0) >= minActorReuse)
    }))
    .filter((item) => item.castIds.length >= 2)
    .sort((a, b) => b.sitelinks - a.sitelinks)
    .slice(0, Math.max(maxMovies * 2, maxMovies + 120));

  const labelIds = new Set();
  prefiltered.forEach((item) => {
    labelIds.add(item.id);
    item.genreIds.forEach((id) => labelIds.add(id));
    item.castIds.forEach((id) => labelIds.add(id));
  });

  console.log(`Resolving labels for ${labelIds.size} entities in batches of ${labelsBatchSize}...`);
  const labelMap = await fetchLabels([...labelIds]);

  const filtered = prefiltered
    .map((item) => {
      const title = cleanText(labelMap.get(item.id));
      if (!title) return null;
      const genres = item.genreIds.map((id) => cleanText(labelMap.get(id))).filter(Boolean);
      const cast = item.castIds.map((id) => cleanText(labelMap.get(id))).filter(Boolean);
      if (genres.length === 0 || cast.length < 2) return null;
      return {
        title,
        year: item.year,
        sitelinks: item.sitelinks,
        mediaType: item.mediaType,
        genres: [...new Set(genres)].slice(0, 4),
        cast: [...new Set(cast)].slice(0, 8)
      };
    })
    .filter(Boolean)
    .filter((item) => {
      const len = titleLetters(item.title).length;
      return len >= 4 && len <= 24;
    })
    .slice(0, maxMovies);

  if (filtered.length < 80) {
    throw new Error(
      `Filtered output too small (${filtered.length}). Lower WIKIDATA_MIN_SITELINKS or increase WIKIDATA_QUERY_LIMIT.`
    );
  }

  const maxSitelinksValue = Math.max(...filtered.map((item) => item.sitelinks), 1);
  const catalog = filtered.map((item) => ({
    title: item.title,
    year: item.year,
    genres: item.genres,
    cast: item.cast.slice(0, 6),
    popularity: scorePopularity(item.sitelinks, maxSitelinksValue),
    clue: buildClue(item)
  }));

  const uniqueActors = new Set();
  catalog.forEach((entry) => entry.cast.forEach((actor) => uniqueActors.add(actor)));

  await fs.mkdir(path.dirname(OUTPUT_JS), { recursive: true });
  const generatedAt = new Date().toISOString();

  const js = [
    `/* Auto-generated from Wikidata on ${generatedAt}. */`,
    "window.CINECLASH_CATALOG = ",
    `${JSON.stringify(catalog, null, 2)};`,
    ""
  ].join("\n");
  await fs.writeFile(OUTPUT_JS, js, "utf8");

  const meta = {
    source: "Wikidata",
    generatedAt,
    endpoints,
    wikidataApiUrl: WIKIDATA_API_URL,
    minYear,
    maxYear,
    minSitelinks,
    queryLimit,
    maxMovies,
    minActorReuse,
    yearStep,
    maxRetries,
    requestDelayMs,
    includeSeries,
    claimsBatchSize,
    labelsBatchSize,
    timeoutMs,
    poolFactor,
    apiMinIntervalMs,
    entityTypes: entityTypes.map((item) => item.label),
    movieCount: catalog.length,
    uniqueActors: uniqueActors.size
  };
  await fs.writeFile(OUTPUT_META, JSON.stringify(meta, null, 2) + "\n", "utf8");

  console.log(`Wrote ${catalog.length} titles / ${uniqueActors.size} actors to ${OUTPUT_JS}`);
  console.log(`Wrote metadata to ${OUTPUT_META}`);
}

function buildWorksQuery({ typeQid, minYear: fromYear, maxYear: toYear, minSitelinks: minLinks, limit }) {
  return `
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

SELECT DISTINCT ?work ?year ?sitelinks WHERE {
  ?work wdt:P31 wd:${typeQid};
        wikibase:sitelinks ?sitelinks.

  {
    ?work wdt:P577 ?date.
  } UNION {
    ?work wdt:P571 ?date.
  } UNION {
    ?work wdt:P580 ?date.
  }

  BIND(YEAR(?date) AS ?year)
  FILTER(?year >= ${fromYear} && ?year <= ${toYear})
  FILTER(?sitelinks >= ${minLinks})
}
LIMIT ${limit}
`;
}

async function fetchWorkClaims(workIds) {
  const out = new Map();
  const chunks = chunkArray(workIds, claimsBatchSize);

  for (let i = 0; i < chunks.length; i += 1) {
    const ids = chunks[i];
    const context = `claims batch ${i + 1}/${chunks.length}`;
    const data = await fetchEntitiesWithRetry(ids, ["claims"], context);
    const entities = data?.entities || {};

    for (const [id, entity] of Object.entries(entities)) {
      const genres = extractClaimQids(entity?.claims?.P136).slice(0, 4);
      const cast = extractClaimQids(entity?.claims?.P161).slice(0, 8);
      out.set(id, { genres, cast });
    }

    if (requestDelayMs > 0) await sleep(requestDelayMs);
  }

  return { claimsByWork: out };
}

async function fetchLabels(ids) {
  const out = new Map();
  const chunks = chunkArray(ids, labelsBatchSize);

  for (let i = 0; i < chunks.length; i += 1) {
    const batch = chunks[i];
    const context = `labels batch ${i + 1}/${chunks.length}`;
    const data = await fetchEntitiesWithRetry(batch, ["labels"], context);
    const entities = data?.entities || {};

    for (const [id, entity] of Object.entries(entities)) {
      const label = pickEntityLabel(entity);
      if (label) out.set(id, label);
    }

    if (requestDelayMs > 0) await sleep(requestDelayMs);
  }

  return out;
}

function pickEntityLabel(entity) {
  const labels = entity?.labels || {};
  if (labels.en?.value) return labels.en.value;
  const first = Object.values(labels)[0];
  return typeof first?.value === "string" ? first.value : "";
}

function extractClaimQids(claims = []) {
  return [...new Set(
    claims
      .map((claim) => claim?.mainsnak?.datavalue?.value?.id)
      .map((value) => String(value || "").trim())
      .filter((value) => /^Q\d+$/.test(value))
  )];
}

async function fetchEntitiesWithRetry(ids, props, context) {
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt += 1;
    try {
      return await fetchEntities(ids, props);
    } catch (error) {
      const statusCode = Number(error?.statusCode || 0);
      const code = String(error?.code || "");
      const message = String(error?.message || "");
      const retriable =
        statusCode === 429 ||
        statusCode === 500 ||
        statusCode === 502 ||
        statusCode === 503 ||
        statusCode === 504 ||
        code === "maxlag" ||
        message.includes("fetch failed") ||
        message.includes("ETIMEDOUT") ||
        message.includes("ECONNRESET") ||
        message.includes("AbortError");

      if (!retriable || attempt >= maxRetries) {
        throw new Error(`${context} failed after ${attempt} attempts: ${message}`);
      }

      const retryAfterMs = Number(error?.retryAfterMs || 0);
      const baseBackoffMs =
        statusCode === 429
          ? Math.min(120000, 12000 * attempt)
          : Math.min(15000, 700 * 2 ** (attempt - 1));
      const waitMs = Math.max(baseBackoffMs, retryAfterMs) + Math.floor(Math.random() * 600);
      console.warn(`Retrying ${context} (${attempt}/${maxRetries}) in ${waitMs}ms...`);
      await sleep(waitMs);
    }
  }

  throw new Error(`Retry budget exhausted for ${context}.`);
}

async function fetchEntities(ids, props) {
  await waitForApiSlot();

  const url = new URL(WIKIDATA_API_URL);
  url.searchParams.set("action", "wbgetentities");
  url.searchParams.set("format", "json");
  url.searchParams.set("languages", "en");
  url.searchParams.set("ids", ids.join("|"));
  url.searchParams.set("props", props.join("|"));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "CineClashCatalogBot/1.0 (local)"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const body = await response.text();
      const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
      const error = new Error(`Wikidata API failed (${response.status}): ${body.slice(0, 220)}`);
      error.statusCode = response.status;
      error.retryAfterMs = retryAfterMs;
      throw error;
    }

    const json = await response.json();
    if (json?.error) {
      const error = new Error(`Wikidata API error (${json.error.code}): ${json.error.info || ""}`);
      error.code = json.error.code;
      throw error;
    }

    return json;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchSparqlWithRetry(query, context) {
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt += 1;
    const endpoint = endpoints[(attempt - 1) % endpoints.length];

    try {
      return await fetchSparql(endpoint, query);
    } catch (error) {
      const statusCode = Number(error?.statusCode || 0);
      const message = String(error?.message || "");
      const fallbackBadRequest = statusCode === 400 && endpoint !== endpoints[0];
      const retriable =
        statusCode === 429 ||
        statusCode === 500 ||
        statusCode === 502 ||
        statusCode === 503 ||
        statusCode === 504 ||
        fallbackBadRequest ||
        message.includes("fetch failed") ||
        message.includes("ETIMEDOUT") ||
        message.includes("ECONNRESET") ||
        message.includes("AbortError") ||
        message.includes("upstream request timeout");

      if (!retriable || attempt >= maxRetries) {
        throw new Error(`${context} failed after ${attempt} attempts: ${message}`);
      }

      const waitMs = Math.min(10000, 700 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 500);
      console.warn(`Retrying ${context} (${attempt}/${maxRetries}) via ${endpoint} in ${waitMs}ms...`);
      await sleep(waitMs);
    }
  }

  throw new Error(`Retry budget exhausted for ${context}.`);
}

async function fetchSparql(endpoint, query) {
  const url = new URL(endpoint);
  url.searchParams.set("query", query);
  url.searchParams.set("format", "json");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/sparql-results+json",
        "User-Agent": "CineClashCatalogBot/1.0 (local)"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const body = await response.text();
      const error = new Error(`Wikidata query failed (${response.status}): ${body.slice(0, 220)}`);
      error.statusCode = response.status;
      throw error;
    }

    return response.json();
  } finally {
    clearTimeout(timer);
  }
}

function parseWorks(data, mediaType) {
  const rows = data?.results?.bindings || [];
  return rows
    .map((row) => {
      const id = qidFromUri(row?.work?.value);
      const year = Number(row?.year?.value);
      const sitelinks = Number(row?.sitelinks?.value);
      if (!id || !Number.isFinite(year) || !Number.isFinite(sitelinks)) return null;
      return { id, year, sitelinks, mediaType };
    })
    .filter(Boolean);
}

function dedupeById(records) {
  const best = new Map();
  records.forEach((record) => {
    const current = best.get(record.id);
    if (
      !current ||
      record.sitelinks > current.sitelinks ||
      (record.sitelinks === current.sitelinks && record.year > current.year)
    ) {
      best.set(record.id, record);
    }
  });
  return [...best.values()];
}

function qidFromUri(uri) {
  const raw = String(uri || "");
  const match = raw.match(/Q\d+$/);
  return match ? match[0] : "";
}

function scorePopularity(sitelinks, maxSitelinksValue) {
  const ratio = Math.log1p(Math.max(1, sitelinks)) / Math.log1p(maxSitelinksValue);
  return Math.max(1, Math.min(100, Math.round(ratio * 100)));
}

function buildClue(entry) {
  const leadCast = entry.cast.slice(0, 2).join(" and ");
  const label = entry.mediaType === "series" ? "series" : "movie";
  return `Released in ${entry.year}. This ${label} includes genres ${entry.genres.slice(0, 2).join(" / ")} and cast such as ${leadCast}.`;
}

function parseEndpoints(raw, fallback) {
  const fromEnv = String(raw || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : fallback;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function titleLetters(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/&/g, "AND")
    .replace(/[^A-Z0-9]/g, "");
}

function chunkArray(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function buildYearRanges(fromYear, toYear, step) {
  const ranges = [];
  let cursor = fromYear;
  while (cursor <= toYear) {
    const end = Math.min(toYear, cursor + step - 1);
    ranges.push({ from: cursor, to: end });
    cursor = end + 1;
  }
  return ranges;
}

function clampInt(input, fallback, min, max) {
  const value = Number(input);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function parseBool(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function parseRetryAfterMs(value) {
  const raw = String(value || "").trim();
  if (!raw) return 0;

  const seconds = Number(raw);
  if (Number.isFinite(seconds)) {
    return Math.max(0, Math.round(seconds * 1000));
  }

  const dateMs = Date.parse(raw);
  if (Number.isFinite(dateMs)) {
    return Math.max(0, dateMs - Date.now());
  }

  return 0;
}

async function waitForApiSlot() {
  const now = Date.now();
  if (now < nextApiAllowedAt) {
    await sleep(nextApiAllowedAt - now);
  }
  nextApiAllowedAt = Date.now() + apiMinIntervalMs;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
