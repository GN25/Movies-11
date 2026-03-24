# CineClash Data Source

The site reads movie data from `/api/daily-catalog.js` at runtime.

- The API exposes only a rotated, gameplay-focused movie subset (not the full raw dataset).
- If `window.CINECLASH_CATALOG` has enough records, the app uses it.
- Otherwise it falls back to the built-in dataset in `app.js`.

## CSV Source (Current Workflow)

Source file:

- `IMBD.csv`

Convert CSV into app datasets (movies + tv shows JSON + metadata):

```bash
node ./scripts/convert-imdb-csv.mjs
```

Generated files:

- `data/movies.json` (movies only)
- `data/tv-shows.json` (tv shows only)
- `data/catalog.meta.json`

The JSON records keep only these fields:

- `title`
- `year`
- `duration`
- `genre`
- `rating`
- `description`
- `stars`
- `votes`

Split rule:

- `tv-shows.json` gets series rows (year ranges like `2015–2022`, or TV certificate rows with episodic runtime/keywords).
- `movies.json` keeps movie rows (including non-series streaming/TV releases).

## Commercial-safe Source (Recommended): Wikidata

Wikidata content is published under CC0 (public domain dedication), which allows commercial use.

Refresh catalog from Wikidata:

```bash
node ./scripts/update-wikidata-catalog.mjs
```

Top 1,000 movies (movies only):

```bash
WIKIDATA_MIN_YEAR=1900 \
WIKIDATA_MIN_SITELINKS=6 \
WIKIDATA_QUERY_LIMIT=220 \
WIKIDATA_YEAR_STEP=3 \
WIKIDATA_MAX_MOVIES=1000 \
WIKIDATA_POOL_FACTOR=5 \
WIKIDATA_MIN_ACTOR_REUSE=1 \
WIKIDATA_CLAIMS_BATCH_SIZE=20 \
WIKIDATA_LABELS_BATCH_SIZE=20 \
WIKIDATA_MAX_RETRIES=10 \
WIKIDATA_REQUEST_DELAY_MS=300 \
WIKIDATA_API_MIN_INTERVAL_MS=1400 \
WIKIDATA_INCLUDE_SERIES=0 \
node ./scripts/update-wikidata-catalog.mjs
```

Top 5,000 movies (movies only, long run):

```bash
WIKIDATA_MIN_YEAR=1900 \
WIKIDATA_MIN_SITELINKS=2 \
WIKIDATA_QUERY_LIMIT=260 \
WIKIDATA_YEAR_STEP=2 \
WIKIDATA_MAX_MOVIES=5000 \
WIKIDATA_POOL_FACTOR=8 \
WIKIDATA_MIN_ACTOR_REUSE=1 \
WIKIDATA_PREFILTER_MULTIPLIER=1.3 \
WIKIDATA_PREFILTER_MIN_EXTRA=500 \
WIKIDATA_CLAIMS_BATCH_SIZE=15 \
WIKIDATA_LABELS_BATCH_SIZE=15 \
WIKIDATA_MAX_RETRIES=12 \
WIKIDATA_REQUEST_DELAY_MS=350 \
WIKIDATA_API_MIN_INTERVAL_MS=2200 \
WIKIDATA_TIMEOUT_MS=45000 \
WIKIDATA_INCLUDE_SERIES=0 \
node ./scripts/update-wikidata-catalog.mjs
```

Check how many titles were generated:

```bash
node -e "const m=require('./data/catalog.meta.json'); console.log('movieCount=',m.movieCount,'uniqueActors=',m.uniqueActors)"
```

Reliable command (movies only, smaller chunks):

```bash
WIKIDATA_QUERY_LIMIT=70 \
WIKIDATA_YEAR_STEP=4 \
WIKIDATA_MAX_RETRIES=9 \
WIKIDATA_REQUEST_DELAY_MS=300 \
WIKIDATA_CLAIMS_BATCH_SIZE=35 \
WIKIDATA_LABELS_BATCH_SIZE=50 \
WIKIDATA_API_MIN_INTERVAL_MS=900 \
node ./scripts/update-wikidata-catalog.mjs
```

Optional knobs:

```bash
WIKIDATA_MIN_YEAR=1980 \
WIKIDATA_MAX_YEAR=2026 \
WIKIDATA_MIN_SITELINKS=10 \
WIKIDATA_QUERY_LIMIT=180 \
WIKIDATA_YEAR_STEP=10 \
WIKIDATA_MAX_RETRIES=6 \
WIKIDATA_REQUEST_DELAY_MS=300 \
WIKIDATA_MAX_MOVIES=260 \
WIKIDATA_CLAIMS_BATCH_SIZE=40 \
WIKIDATA_LABELS_BATCH_SIZE=50 \
WIKIDATA_API_MIN_INTERVAL_MS=900 \
WIKIDATA_TIMEOUT_MS=28000 \
WIKIDATA_POOL_FACTOR=3 \
node ./scripts/update-wikidata-catalog.mjs
```

If you hit 429 or timeouts, reduce `WIKIDATA_QUERY_LIMIT`, increase `WIKIDATA_API_MIN_INTERVAL_MS`, and lower `WIKIDATA_CLAIMS_BATCH_SIZE`.
Depending on endpoint load, a full refresh usually takes around 2-10 minutes.
For 5,000 movies, expect a much longer run (commonly 20-60+ minutes).

## TMDb (Optional)

1. Create a TMDb API Read Access Token (v4).
2. Add it to `.env` in the project root:

```bash
cp .env.example .env
```

Then set `TMDB_BEARER_TOKEN=...`.
3. Run:

```bash
node ./scripts/update-tmdb-catalog.mjs
```

Optional knobs:

```bash
TMDB_PAGES=10 \
TMDB_MAX_MOVIES=220 \
TMDB_MIN_VOTE_COUNT=200 \
TMDB_LANGUAGE="en-US" \
node ./scripts/update-tmdb-catalog.mjs
```

Generated files:

- `data/catalog.meta.json`
- `data/movies.json`
- `data/tv-shows.json`
# Movies-11
