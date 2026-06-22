# QueryFlow / Streamlit Site & Repository Audit

Date: 2026-06-22  
Reviewed apps:

1. `https://sqlflow-4aduphcqdertphhve36fjv.streamlit.app/`
2. `https://hmgtehnologies-sql.streamlit.app/`

Reviewed repository:

- `https://github.com/hmgtechnologies/queryflow`

## Live-site finding

Both Streamlit URLs returned the Streamlit inactive-app screen: `Zzzz — This app has gone to sleep due to inactivity`. Therefore, live UI interaction was not available from the public pages at audit time. The repository was cloned and used as the primary source of truth.

## Repository health diagnosis

The QueryFlow repo is much healthier than the earlier static SQL repo. It contains a complete Streamlit/DuckDB app with modular engines. However, it is Streamlit-specific and is not directly deployable to Cloudflare Pages, Netlify or Vercel as a static website. It also includes placeholder/junk files named `a` in several folders.

## Features extracted from QueryFlow v3

1. Multi-source data loading:
   - Embedded HMG datasets.
   - Sample data.
   - CSV, Excel, JSON, Parquet.
   - SQLite import.
   - External DB via SQLAlchemy.
   - Public URL loading.

2. Visual Query Builder:
   - SELECT columns.
   - DISTINCT.
   - Aggregates: SUM, AVG, COUNT, COUNT DISTINCT, MIN, MAX, MEDIAN, STDDEV.
   - JOINs: INNER, LEFT, RIGHT, FULL.
   - WHERE filters.
   - GROUP BY.
   - HAVING.
   - ORDER BY.
   - LIMIT.

3. Plain-English Queries:
   - Rule-based, offline English-to-SQL.
   - No AI API.
   - Aggregate recognition.
   - `by <column>` grouping.
   - `top N` limits.
   - `where` filters.
   - Fuzzy column matching.
   - Explanation of interpretation.

4. Raw SQL Editor:
   - Direct SQL execution.
   - SQL beautify.

5. SQL Tools:
   - Format/beautify.
   - Validate by dry run.
   - Explain plan.
   - Optimization hints.

6. Pivot Table:
   - Spreadsheet-style rows × columns cross-tab.
   - Sum, average, count, min, max, median.
   - Optional totals.

7. Profiler:
   - Row and column counts.
   - Per-column dtype.
   - Non-null count.
   - Null percentage.
   - Unique count.
   - Numeric min/max/mean/median/std.
   - Top categorical values.

8. Auto-Insights:
   - Rule-based human-readable observations.
   - Numeric ranges and averages.
   - Top categories.
   - Duplicate-row detection.
   - Data-quality report.

9. Charts:
   - Bar, line, pie, scatter, area, histogram and box-style summaries.
   - Pin charts to dashboard.

10. Pinned Dashboard:
    - Multi-query dashboard.
    - Persistent pins in Streamlit version via SQLite.

11. Shareable Query Links:
    - Encodes SQL into a URL-safe token.
    - Restores query from `?q=` parameter.
    - No backend.

12. Saved Queries and History:
    - Saved queries.
    - Notes.
    - Recent history.
    - Persistent SQLite in Streamlit version.

13. Templates:
    - HMG/Adewale question pack.
    - Business/Sales pack.
    - EdTech/Students pack.
    - FaithTech/Ministry pack.
    - General exploration pack.

14. About the Builder:
    - Creator profile.
    - HMG brand identity.
    - Links.
    - Embedded project dataset.

15. Help tab:
    - Workflow guidance.
    - Explanation of free rule-based approach.

16. Read-only guard:
    - Blocks destructive SQL in read-only mode.
    - Allows SELECT/WITH only.

17. Multi-format export:
    - CSV.
    - JSON.
    - Excel in Streamlit.
    - Markdown.
    - HTML.
    - SQL INSERT statements.

## How these features were converted into this static `sql v3` build

Because this requested deliverable must deploy on Cloudflare, Netlify and Vercel — not Streamlit — Python-only features were converted to browser-native equivalents:

| Streamlit/DuckDB feature | Static website implementation |
|---|---|
| DuckDB | Optional free sql.js SQLite WASM plus local fallback SELECT engine |
| Pandas profiling | JavaScript profiling over result arrays |
| Plotly | Native Canvas charts |
| SQLite persistence | LocalStorage project state |
| Share.py zlib/base64 | URL-safe browser Base64 token |
| SQLAlchemy external DB | Documented as backend-only; static build supports CSV/JSON URL with CORS |
| Excel/Parquet import | Documented as optional conversion to CSV/JSON for static deployment |
| Streamlit tabs | HTML/CSS/JS tabbed QueryFlow v3 Lab |
| download_button exports | Browser Blob downloads |

## Files added for QueryFlow extraction

- `queryflow.html`
- `assets/js/queryflow.js`
- `assets/js/queryflow-data.js`
- Updated `assets/js/sql-engine.js` to load all embedded tables.
- Updated navigation and service worker.
- Updated documentation.

## Static deployment constraints

A pure static site cannot safely connect directly to private Postgres/MySQL databases without exposing credentials. For enterprise deployment, use one of these free-safe approaches:

1. Export database samples to CSV/JSON and upload/load them locally.
2. Publish public read-only CSV/JSON endpoints with CORS.
3. Add a separate serverless API later for credential-protected DB access.
4. Keep this frontend static and private-first.

## Cleanup recommendations for the QueryFlow repository

1. Remove placeholder files named `a`.
2. Fix typo in `hmgtehnologies` naming if it is unintentional.
3. Add screenshots or a static fallback landing page because sleeping Streamlit apps appear unavailable to users.
4. If keeping Streamlit, add a `runtime.txt` and health/deployment notes.
5. If switching to static, deploy this `sql v3` folder instead.
