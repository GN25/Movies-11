const fs = require("node:fs/promises");
const path = require("node:path");

const SOURCE_PATH = path.join(process.cwd(), "data", "movies.json");

let cachedCatalog = null;
let cachedMtimeMs = 0;

module.exports = async function handler(req, res) {
  try {
    const catalog = await loadCatalog();
    const dayOverride = parseDayOverride(queryValue(req.query?.day));
    const variantOverride = parseVariantOverride(queryValue(req.query?.variant));
    const todayKey = dayOverride || formatDateKey(new Date());
    const seedKey = variantOverride ? `${todayKey}|${variantOverride}` : todayKey;

    const payload = buildPublicCatalog(catalog, seedKey);

    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).send(
      `window.CINECLASH_CATALOG=${JSON.stringify(payload.catalog)};window.CINECLASH_CATALOG_META=${JSON.stringify(payload.meta)};`
    );
  } catch (error) {
    console.error("daily-catalog error", error);
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.status(200).send("window.CINECLASH_CATALOG=[];window.CINECLASH_CATALOG_META={error:true};");
  }
};

async function loadCatalog() {
  const stats = await fs.stat(SOURCE_PATH);
  if (cachedCatalog && cachedMtimeMs === stats.mtimeMs) {
    return cachedCatalog;
  }

  const raw = await fs.readFile(SOURCE_PATH, "utf8");
  const parsed = JSON.parse(raw);
  const sanitized = dedupeCatalogByTitle(
    (Array.isArray(parsed) ? parsed : [])
      .map(sanitizeMovieRecord)
      .filter(Boolean)
  ).sort(compareMoviesByRank);

  cachedCatalog = sanitized;
  cachedMtimeMs = stats.mtimeMs;
  return sanitized;
}

function buildPublicCatalog(catalog, seedKey) {
  const selected = dedupeCatalogByTitle(catalog).map((movie) => ({
    title: movie.title,
    year: movie.year,
    genres: movie.genres.slice(0, 4),
    cast: movie.cast.slice(0, 6),
    rating: movie.rating,
    votes: movie.votes,
    popularity: movie.popularity,
    clue: movie.clue
  }));

  return {
    catalog: selected,
    meta: {
      seedKey,
      total: selected.length
    }
  };
}

function sanitizeMovieRecord(record) {
  if (!record || typeof record !== "object") return null;

  const rawTitle =
    typeof record.title === "string"
      ? record.title
      : typeof record.names === "string"
        ? record.names
        : typeof record["movie name"] === "string"
          ? record["movie name"]
          : "";
  const title = rawTitle.trim();
  if (!title) return null;

  const year = Number(parseYearValue(record.year ?? record.date_x));
  const safeYear = Number.isFinite(year) ? Math.max(1900, Math.min(2100, Math.round(year))) : 2000;

  const genres = parseGenreList(record.genre ?? record.genres);
  const cast =
    record.stars != null || record.cast != null
      ? parseStarsList(record.stars ?? record.cast)
      : parseCrewMembersList(record.crew);

  if (!genres.length || !cast.length) return null;

  const safeRating = parseRatingValue(record.rating ?? record.score);
  const safeVotes = parseVotesValue(record.votes ?? record.budbet_x ?? record.budget_x);

  const rawDescription =
    typeof record.description === "string"
      ? record.description.trim()
      : typeof record.overview === "string"
        ? record.overview.trim()
        : typeof record.clue === "string"
          ? record.clue.trim()
          : "";

  const description = normalizeDescriptionText(rawDescription);
  if (isLikelyNonMovieSpecial(title, genres, description)) return null;

  const popularity = Number(record.popularity);
  const safePopularity = Number.isFinite(popularity)
    ? Math.max(1, Math.min(100, Math.round(popularity)))
    : scorePopularityFromRatingVotes(safeRating, safeVotes);

  const clue =
    description ||
    `${title} is a ${genres[0]} title released in ${safeYear}.`;

  return {
    title,
    year: safeYear,
    genres: genres.slice(0, 4),
    cast: cast.slice(0, 6),
    rating: safeRating,
    votes: safeVotes,
    popularity: safePopularity,
    clue
  };
}

function parseYearValue(value) {
  const raw = String(value || "");
  const match = raw.match(/(\d{4})/);
  return match ? Number(match[1]) : Number(raw);
}

function parseGenreList(input) {
  if (Array.isArray(input)) {
    return [...new Set(input.map((genre) => String(genre || "").trim()).filter(Boolean))];
  }

  return [...new Set(
    String(input || "")
      .split(",")
      .map((genre) => String(genre || "").trim())
      .filter(Boolean)
  )];
}

function parseStarsList(input) {
  if (Array.isArray(input)) {
    return [...new Set(input.map((name) => String(name || "").trim()).filter(Boolean))];
  }

  const raw = String(input || "").trim();
  if (!raw) return [];

  const out = [];
  const regex = /'((?:\\'|[^'])*)'/g;
  let match = regex.exec(raw);
  while (match) {
    const name = String(match[1] || "")
      .replace(/\\'/g, "'")
      .replace(/,\s*$/, "")
      .trim();
    if (name) out.push(name);
    match = regex.exec(raw);
  }

  if (out.length) {
    return normalizeStarsList(out);
  }

  return normalizeStarsList(
    raw
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .map((name) => String(name || "").replace(/^['"]|['"]$/g, "").trim())
      .filter(Boolean)
  );
}

function parseCrewMembersList(input) {
  const raw = String(input || "").trim();
  if (!raw) return [];

  const parts = raw
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((name) => String(name || "").replace(/^['"]|['"]$/g, "").trim())
    .filter(Boolean);

  if (parts.length >= 4) {
    const evenParts = parts.filter((_value, index) => index % 2 === 0);
    if (evenParts.length >= 2) return normalizeStarsList(evenParts);
  }

  return normalizeStarsList(parts);
}

function parseRatingValue(value) {
  const numeric = Number(String(value || "").replace(",", "."));
  if (!Number.isFinite(numeric)) return 0;
  if (numeric > 10) {
    return Math.max(0, Math.min(10, Number((numeric / 10).toFixed(1))));
  }
  return Math.max(0, Math.min(10, Number(numeric.toFixed(1))));
}

function parseVotesValue(value) {
  if (Number.isFinite(Number(value))) return Math.max(0, Math.round(Number(value)));
  const digits = String(value || "").replace(/[^0-9]/g, "");
  const numeric = Number(digits);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.round(numeric));
}

function normalizeDescriptionText(value) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.replace(/\s*(?:\.{3}|…)?\s*see\s+full\s+(?:summary|synopsis)\s*»?\s*$/i, "").trim();
}

function isLikelyNonMovieSpecial(title, genres, description) {
  const titleText = String(title || "").toLowerCase();
  const descText = String(description || "").toLowerCase();
  const genreTokens = (Array.isArray(genres) ? genres : []).map((genre) => normalize(String(genre || "")));

  if (genreTokens.some((genre) => ["news", "talk show", "game show", "reality tv"].includes(genre))) {
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

function scorePopularityFromRatingVotes(rating, votes) {
  const voteScore = Math.min(100, Math.round((Math.log10(Math.max(1, votes) + 1) / 6) * 100));
  const ratingScore = Math.min(100, Math.max(0, Math.round((rating / 10) * 100)));
  return Math.max(1, Math.min(100, Math.round(voteScore * 0.7 + ratingScore * 0.3)));
}

function normalizeStarsList(stars) {
  const list = Array.isArray(stars) ? stars.map((name) => String(name || "").trim()).filter(Boolean) : [];
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

function compareMoviesByRank(a, b) {
  const votesA = parseVotesValue(a?.votes);
  const votesB = parseVotesValue(b?.votes);
  if (votesB !== votesA) return votesB - votesA;

  const ratingA = parseRatingValue(a?.rating);
  const ratingB = parseRatingValue(b?.rating);
  if (ratingB !== ratingA) return ratingB - ratingA;

  const popularityA = Number(a?.popularity) || 0;
  const popularityB = Number(b?.popularity) || 0;
  if (popularityB !== popularityA) return popularityB - popularityA;

  const yearA = Number(a?.year) || 0;
  const yearB = Number(b?.year) || 0;
  if (yearB !== yearA) return yearB - yearA;

  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

function dedupeCatalogByTitle(movieCatalog) {
  const bestByTitle = new Map();

  movieCatalog.forEach((movie) => {
    const key = normalize(movie?.title);
    if (!key) return;

    const current = bestByTitle.get(key);
    if (!current || compareMoviesByRank(movie, current) < 0) {
      bestByTitle.set(key, movie);
    }
  });

  return [...bestByTitle.values()];
}

function parseDayOverride(raw) {
  const value = String(raw || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = dateFromKey(value);
  if (Number.isNaN(date.getTime())) return "";
  if (formatDateKey(date) !== value) return "";
  return value;
}

function parseVariantOverride(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 32);
}

function queryValue(value) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function dateFromKey(dateKey) {
  const [year, month, day] = String(dateKey || "")
    .split("-")
    .map((part) => Number(part));
  return new Date(year, month - 1, day);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
