# SQL v4 — Recheck, QueryFlow Verification, QueryPilot v9 Audit & Extraction Report

Date: 2026-06-22

## 1. Recheck of SQL v3 work

The previous `sql v3` build was rechecked against the submitted QueryFlow Streamlit repository and sites.

### Streamlit live-site status

Both submitted Streamlit URLs returned the Streamlit inactive/sleep page at audit time. Therefore, interactive live extraction was not possible from the hosted apps. The cloned repository `https://github.com/hmgtechnologies/queryflow` was used as the authoritative source.

### QueryFlow features already extracted into SQL v3

The following QueryFlow v3 features were verified as extracted into `sql v3` and preserved in `sql v4`:

1. Multi-source data concept.
2. Embedded HMG datasets.
3. Sample data packs.
4. Active table switcher.
5. CSV upload.
6. JSON upload.
7. Public CSV/JSON URL loading where CORS allows.
8. Advanced visual query builder.
9. DISTINCT.
10. Aggregates: SUM, AVG, COUNT, COUNT DISTINCT, MIN, MAX, MEDIAN and STDDEV-style summary.
11. WHERE filters.
12. GROUP BY.
13. HAVING.
14. ORDER BY.
15. LIMIT.
16. JOIN builder.
17. Plain-English-to-SQL parser.
18. Rule-based natural language processing with no AI API.
19. Raw SQL editor.
20. Read-only SQL guard.
21. SQL formatter.
22. SQL validator/dry-run style validation.
23. Explain plan.
24. Optimization hints.
25. Pivot/cross-tab builder.
26. Automatic profiler.
27. Top-value style profiling through the profile/data quality view.
28. Rule-based insights.
29. Duplicate-row detection.
30. Data quality table.
31. Charts: bar, line, pie, scatter-style, area-style, histogram and box-style summaries.
32. Pinned dashboard.
33. Shareable query tokens and `?q=` restore.
34. Saved queries.
35. Query history.
36. Question-template packs.
37. HMG/Adewale creator profile.
38. Multi-format exports: CSV, JSON, Markdown, HTML and SQL INSERT.

### Static-site limitation retained deliberately

The Streamlit/DuckDB app supports Excel, Parquet, SQLite and private external DB connections through Python libraries. In a static Cloudflare/Netlify/Vercel deployment, private DB credentials cannot be safely placed in browser JavaScript. Therefore, the static build supports browser-safe data sources directly and documents private DB access as a future serverless/API extension.

## 2. QueryPilot v9 live-site audit

Reviewed site:

```text
https://querypilot-hmgacademy.vercel.app/
```

No separate QueryPilot GitHub repository URL was supplied in the prompt. A web search did not reveal a clear public repository for this exact deployment. Therefore, the live static deployment and its downloadable assets/docs were audited directly.

## 3. QueryPilot assets extracted

The QueryPilot v9 site is a static PWA. The following assets/docs were downloaded and packaged into SQL v4:

- `querypilot-v9.html` — extracted QueryPilot v9 app page.
- `qp_assets/app.js` — main SQL assistant logic.
- `qp_assets/enterprise.js` — 25 enterprise features.
- `qp_assets/curriculum.js`.
- `qp_assets/curriculum_part2.js`.
- `qp_assets/curriculum_part3.js`.
- `qp_assets/curriculum_part4.js`.
- `qp_assets/learn.js` — Learning Hub renderer.
- `qp_assets/styles.css`.
- `qp_assets/enterprise.css`.
- `qp_assets/learn.css`.
- `querypilot-manifest.json`.
- `ENTERPRISE.md`.
- `LEARNING_HUB.md`.
- `AUTHOR.md`.

The HTML asset paths were rewritten from `assets/...` to `qp_assets/...` so the extracted app can run inside SQL v4 without colliding with the existing SQL v4 assets.

## 4. QueryPilot v9 features extracted — complete inventory

### 4.1 Main platform features

1. Plain-English SQL assistant.
2. 45+ offline SQL pattern families.
3. No API / no paid AI dependency.
4. Schema-aware table/column inference.
5. SQL syntax highlighting.
6. SQL result cards.
7. Mock preview tables.
8. Deep clause-by-clause explanations.
9. SQL validation.
10. Performance hints.
11. Saved queries.
12. Saved query tags.
13. Tag filtering.
14. History.
15. Snippet library.
16. User templates.
17. Share by URL.
18. Import schema from SQL/JSON.
19. Default schema panel.
20. Result search.
21. Copy SQL.
22. Download `.sql`.
23. Send generated SQL between panels.
24. Word wrap toggle.
25. Query statistics.
26. Session summary.
27. Settings panel.
28. Font-size settings.
29. Default SQL dialect setting.
30. Auto-format on send.
31. Auto-save to history.
32. Show/hide mock preview.
33. Show/hide performance hints.
34. Word-wrap default setting.
35. Four themes: dark, light, high contrast and solarized.
36. PWA install prompt.
37. Offline-first app architecture.
38. Keyboard shortcuts overlay.
39. Help / quick reference modal.
40. About the Builder modal.
41. Creator links and project list.
42. HMG brand/persona integration.

### 4.2 SQL modes — 11 modes

1. Ask in English.
2. Visual Query Builder.
3. JOIN Builder.
4. Subquery Builder.
5. Multi-table JOIN Builder.
6. Compare SQL Queries.
7. SQL Tools.
8. Learn SQL.
9. Learning Hub.
10. Export & Share.
11. Enterprise Console.

### 4.3 Plain-English SQL patterns

QueryPilot v9 advertises and implements many rule families, including:

1. Top N queries.
2. Count by status/category.
3. Duplicate detection.
4. Average by group.
5. Ranking.
6. Date filters.
7. Aggregates.
8. JOINs.
9. CTEs.
10. Window functions.
11. Pivot-style output.
12. Year-over-year growth.
13. Cohort-style analysis.
14. Rolling averages.
15. Percentages.
16. LIKE pattern matching.
17. NULL checks.
18. BETWEEN ranges.
19. Overdue items.
20. Current date / recent period queries.

### 4.4 Visual Query Builder features

1. Table selector.
2. Column selector with data types.
3. Aggregate selector.
4. Aggregate target column.
5. WHERE filter builder.
6. GROUP BY selector.
7. HAVING input.
8. ORDER BY selector.
9. Direction ASC/DESC.
10. LIMIT.
11. OFFSET.
12. Live SQL preview.
13. Copy SQL.
14. Send to chat.
15. Download SQL.
16. Save query.
17. Reset builder.

### 4.5 JOIN Builder features

1. Left table selector.
2. Join type selector.
3. Right table selector.
4. Auto-detected ON columns.
5. Column matching UI.
6. Output column selector.
7. WHERE condition.
8. ORDER BY.
9. LIMIT.
10. Generated JOIN SQL.
11. Copy / send / download / save.
12. Join diagram.
13. Join types: INNER, LEFT, RIGHT, FULL OUTER, CROSS.

### 4.6 Subquery Builder features

1. Inner query editor.
2. Alias field.
3. Outer SELECT columns.
4. Outer WHERE condition.
5. Outer ORDER BY.
6. Outer LIMIT.
7. Generated nested query.
8. Copy/send/download/save.

### 4.7 Multi-table JOIN Builder

1. Base table selector.
2. Add multiple joined tables.
3. Auto ON detection using `id` and `{table}_id` conventions.
4. Optional WHERE.
5. Optional ORDER BY.
6. Optional LIMIT.
7. Live generated SQL.
8. Send to chat and copy.

### 4.8 SQL Compare

1. Original query box.
2. Revised query box.
3. Line-by-line diff.
4. Added-line highlighting.
5. Removed-line highlighting.
6. Change summary.
7. Change percentage.

### 4.9 SQL Tools — 8 tools

1. SQL Formatter.
2. SQL Error Explainer.
3. Query Complexity Estimator.
4. ASCII Schema Diagram Viewer.
5. Stored Procedure Template Generator.
6. IN-Clause Builder.
7. Performance Tips and Index Suggester.
8. SVG ER Diagram Generator.

### 4.10 Export features

1. Export saved queries as `.sql`.
2. Export Markdown report.
3. Export JSON.
4. Export CSV summary.
5. Per-query Markdown export.
6. Print query library as PDF.
7. DDL generator / `CREATE TABLE` statements.
8. Session summary.

### 4.11 Learn SQL legacy track

17 interactive lessons:

1. SELECT.
2. WHERE.
3. ORDER BY.
4. LIMIT.
5. COUNT.
6. SUM, AVG, MAX, MIN.
7. GROUP BY.
8. HAVING.
9. INNER JOIN.
10. LEFT JOIN.
11. LIKE.
12. IN and BETWEEN.
13. Subqueries.
14. CTEs.
15. CASE WHEN.
16. RANK / window functions.
17. NULL handling / COALESCE.

Each lesson includes explanation, SQL example, output description and Try button.

### 4.12 Data Science Learning Hub v9

A complete 9-module, 118-lesson curriculum:

1. Module 1 — What is Data Science? — 8 lessons.
2. Module 2 — Data Literacy & Spreadsheet Thinking — 12 lessons.
3. Module 3 — SQL for Data Analysis — 25 lessons.
4. Module 4 — Statistics — The Honest Version — 14 lessons.
5. Module 5 — Python for Data Science — 14 lessons.
6. Module 6 — Data Wrangling with Pandas — 12 lessons.
7. Module 7 — Data Visualization & Storytelling — 10 lessons.
8. Module 8 — Machine Learning Foundations — 18 lessons.
9. Capstone — Build & Deploy — 5 lessons.

Learning Hub capabilities:

1. Module cards.
2. Lesson pages.
3. Search.
4. Progress tracking.
5. Module progress.
6. Lesson completion markers.
7. Profile storage.
8. Quizzes/exercises/projects embedded in lesson objects.
9. Certificate view after 80% completion.
10. Printable certificate.
11. Nigerian-context examples.
12. No-subscription/free curriculum.

### 4.13 Keyboard shortcuts

1. Enter — send query.
2. Shift+Enter — new line.
3. Esc — clear input / close overlay.
4. Ctrl+F — search results.
5. Ctrl+B — toggle sidebar.
6. Ctrl+, — open settings.
7. Ctrl+Shift+T — cycle theme.
8. `?` — shortcuts overlay.
9. Ctrl+S — save current chat/schema.
10. Ctrl+E — export saved queries.

### 4.14 Enterprise Console — 25 features

1. Multi-Workspace Manager.
2. Audit Log.
3. Role-Based Access Control.
4. SQL Governance Rules.
5. PII / Sensitive Data Detector.
6. Query Approval Workflow.
7. Data Lineage Viewer.
8. SQL Linter with 50+ rules.
9. Migration Generator.
10. Test Data Generator.
11. Query Cost Estimator.
12. Query Versioning.
13. Scheduled Reminders.
14. Webhook / Email Bridge.
15. Backup & Restore.
16. Compliance Report Generator.
17. Profile / Role Switcher.
18. Team Comments on Queries.
19. Encrypted Local Vault.
20. Onboarding Tour.
21. Usage Dashboard.
22. Print Documentation Pack.
23. Multi-Tab Workspace Sync.
24. Health Check Dashboard.
25. Glossary / Data Dictionary.

### 4.15 Enterprise roles

1. Viewer.
2. Analyst.
3. DBA.
4. Admin.

### 4.16 Enterprise audit events

The enterprise app records events such as:

- Workspace create/rename/delete/switch.
- Role switch.
- Query run.
- Governance block/warning.
- Approval request/approve/reject.
- Schedule add/fire.
- Migration generation.
- Test data generation.
- Lint run.
- Cost estimate.
- Backup create/restore.
- Compliance report.
- Vault store/read/deny/clear.
- PII reports.
- Lineage operations.
- Glossary add.
- Comment add.
- Tour end.
- Bridge built.
- Documentation pack print.
- RBAC deny.
- Audit clear.

## 5. How SQL v4 includes QueryPilot

SQL v4 preserves the existing SQL Workflow For Data Analyst/Data Scientist and QueryFlow pages, then adds QueryPilot v9 as a full extracted app:

```text
querypilot-v9.html
qp_assets/
ENTERPRISE.md
LEARNING_HUB.md
AUTHOR.md
querypilot-manifest.json
```

Navigation and the home page now link to QueryPilot v9. The service worker cache list includes QueryPilot assets.

## 6. Verification performed

- JavaScript syntax checked with `node --check` for SQL v4 assets.
- Local references checked for missing files.
- Local HTTP server used to confirm all main HTML pages respond.
- QueryPilot assets copied and paths rewritten.
- Zip archive generated and tested.
