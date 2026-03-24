# CineClash Data Source

The site reads movie/actor data from `data/catalog.js`.

- If `window.CINECLASH_CATALOG` has enough records, the app uses it.
- Otherwise it falls back to the built-in dataset in `app.js`.

## Commercial-safe Source (Recommended): Wikidata

Wikidata content is published under CC0 (public domain dedication), which allows commercial use.

Refresh catalog from Wikidata:

```bash
node ./scripts/update-wikidata-catalog.mjs
```

Reliable command (movies + series, smaller chunks):

```bash
WIKIDATA_QUERY_LIMIT=70 \
WIKIDATA_YEAR_STEP=4 \
WIKIDATA_MAX_RETRIES=9 \
WIKIDATA_REQUEST_DELAY_MS=300 \
WIKIDATA_CLAIMS_BATCH_SIZE=35 \
WIKIDATA_LABELS_BATCH_SIZE=50 \
WIKIDATA_API_MIN_INTERVAL_MS=900 \
WIKIDATA_INCLUDE_SERIES=1 \
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
WIKIDATA_INCLUDE_SERIES=1 \
WIKIDATA_CLAIMS_BATCH_SIZE=40 \
WIKIDATA_LABELS_BATCH_SIZE=50 \
WIKIDATA_API_MIN_INTERVAL_MS=900 \
WIKIDATA_TIMEOUT_MS=28000 \
WIKIDATA_POOL_FACTOR=3 \
node ./scripts/update-wikidata-catalog.mjs
```

If you hit 429 or timeouts, reduce `WIKIDATA_QUERY_LIMIT`, increase `WIKIDATA_API_MIN_INTERVAL_MS`, and lower `WIKIDATA_CLAIMS_BATCH_SIZE`.
Depending on endpoint load, a full refresh usually takes around 2-10 minutes.

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

- `data/catalog.js`
- `data/catalog.meta.json`
# Movies-11
