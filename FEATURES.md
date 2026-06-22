# SQL v4 Feature Reference

SQL v4 combines three complementary systems in one deployable static package.

## 1. SQL Workflow For Data Analyst/Data Scientist Core

### Workbench

- Browser SQL execution.
- Optional sql.js SQLite WASM engine.
- Fallback local SELECT engine.
- CSV upload.
- Schema explorer.
- ER relationship map.
- Visual builder.
- SQL formatter.
- SQL linter.
- Explain/profiler guidance.
- CSV and HTML exports.
- Saved snippets.
- Query audit log.
- Native Canvas charts.
- Dashboard pinning.
- Project `.hmg.json` export/import.

### Academy

- SQL learning modules.
- Starter SQL.
- Hints.
- Expected-result validation.
- Badges.
- Local progress tracking.

### Notebook

- Markdown cells.
- SQL cells.
- Chart cells.
- Reordering/deleting cells.
- Dashboard pinning.
- HTML report export.

### Diagnostics

- Complexity/lint scoring.
- Error explainer.
- SQL dialect translator.
- Data-quality scanner.
- Security review.
- SQL diff.

### Dashboard

- Academy progress KPI.
- Snippet count.
- Audit count.
- Pinned charts.
- HTML dashboard export.

## 2. QueryFlow v3 Static Lab

Extracted from the submitted QueryFlow Streamlit repository and rebuilt as static JavaScript.

### Features

- Embedded HMG datasets.
- CSV/JSON upload.
- Public CSV/JSON URL loading when CORS permits.
- Active table selector.
- Schema preview.
- Advanced visual query builder.
- Plain-English-to-SQL rules.
- Raw SQL editor.
- Read-only guard.
- SQL tools: format, validate, explain and hints.
- Pivot/cross-tab builder.
- Automatic profiler.
- Rule-based insights.
- Data quality report.
- Duplicate detection.
- Charts: bar, line, pie, scatter-style, area-style, histogram and box-style summaries.
- Share tokens and `?q=` query restore.
- Saved queries and history.
- Question templates.
- Creator profile and HMG projects.
- Exports: CSV, JSON, Markdown, HTML and SQL INSERT.

## 3. QueryPilot v9 Console

A full extracted static PWA from `https://querypilot-hmgacademy.vercel.app/`.

### 3.1 SQL modes

1. Ask in English.
2. Visual Query Builder.
3. JOIN Builder.
4. Subquery Builder.
5. Multi-table JOIN Builder.
6. Compare SQL Queries.
7. SQL Tools.
8. Learn SQL.
9. Data Science Learning Hub.
10. Export & Share.
11. Enterprise Console.

### 3.2 Plain-English SQL Assistant

- 45+ pattern families.
- Dates.
- Aggregates.
- Status filters.
- Count/sum/avg/max/min.
- Rank.
- Percentage.
- CTE.
- LIKE.
- NULL.
- BETWEEN.
- Window functions.
- Duplicate detection.
- Overdue records.
- Year-over-year analysis.
- Rolling averages.
- Pivot-style patterns.
- Cohort-style patterns.
- Schema-aware table and column choice.
- Deep explanation of generated SQL.

### 3.3 Visual Builder

- Table selector.
- Column toggle.
- Column type labels.
- Aggregates.
- WHERE filters.
- GROUP BY.
- HAVING.
- ORDER BY.
- ASC/DESC.
- LIMIT.
- OFFSET.
- Live SQL preview.
- Copy/send/download/save/reset.

### 3.4 JOIN Builder

- Left table.
- Right table.
- Join type.
- Auto ON detection.
- Output columns.
- Filter.
- Sort.
- Limit.
- Diagram.
- INNER, LEFT, RIGHT, FULL OUTER and CROSS JOIN.

### 3.5 Subquery Builder

- Inner query.
- Alias.
- Outer SELECT.
- Outer WHERE.
- Outer ORDER BY.
- Outer LIMIT.
- Generated nested SQL.

### 3.6 Multi-table JOIN Builder

- 3+ table chaining.
- Base table.
- Add joined tables.
- Auto ON detection.
- Filter/sort/limit.
- Live generated SQL.

### 3.7 SQL Compare

- Original query input.
- Revised query input.
- Line-by-line diff.
- Added/removed highlighting.
- Change count and percentage.

### 3.8 SQL Tools

1. Formatter.
2. Error Explainer.
3. Complexity Estimator.
4. ASCII Schema Diagram Viewer.
5. Stored Procedure Template Generator.
6. IN-Clause Builder.
7. Performance Tips and Index Suggester.
8. SVG ER Diagram Generator.

### 3.9 Learn SQL track

17 lessons:

1. SELECT.
2. WHERE.
3. ORDER BY.
4. LIMIT.
5. COUNT.
6. SUM/AVG/MAX/MIN.
7. GROUP BY.
8. HAVING.
9. INNER JOIN.
10. LEFT JOIN.
11. LIKE.
12. IN and BETWEEN.
13. Subqueries.
14. CTEs.
15. CASE WHEN.
16. RANK/window functions.
17. NULL handling/COALESCE.

### 3.10 Data Science Learning Hub

9 modules, 118 lessons:

1. What is Data Science?
2. Data Literacy & Spreadsheet Thinking.
3. SQL for Data Analysis.
4. Statistics — The Honest Version.
5. Python for Data Science.
6. Data Wrangling with Pandas.
7. Data Visualization & Storytelling.
8. Machine Learning Foundations.
9. Capstone — Build & Deploy.

Features:

- Module cards.
- Lesson search.
- Progress tracking.
- Module completion.
- Lesson completion.
- Quizzes/exercises/projects.
- Printable certificate at 80% completion.
- Nigerian-context examples.

### 3.11 Export and share

- Export saved queries as `.sql`.
- Export Markdown report.
- Export JSON.
- Export CSV summary.
- Per-query Markdown.
- Print to PDF.
- Generate DDL.
- Session summary.
- Share by URL.

### 3.12 Enterprise Console — 25 features

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

### 3.13 Settings and UX

- Font size.
- Default SQL dialect.
- Auto-format.
- Auto-history.
- Mock preview toggle.
- Performance hints toggle.
- Word-wrap default.
- Dark, light, high contrast and solarized themes.
- Keyboard shortcuts.
- PWA install.
- Offline capability.

## 4. Enterprise/free-based philosophy

- No paid AI API.
- No backend required.
- Browser-local storage.
- Static deployment.
- PWA support.
- Exportable backups.
- Governance and compliance tooling.
- Works on low-cost devices after first load.

---

# SQL v5 Additions — Searchable, Brand-Embedded, Multi-Page Platform

SQL v5 preserves every SQL v4 feature and adds the following enhancements.

## 1. Search engine readiness

SQL v5 includes:

- `robots.txt` for crawler guidance.
- `sitemap.xml` with all major pages and documentation.
- Page-level meta descriptions.
- Robots index/follow directives.
- Open Graph tags for social previews.
- Twitter card metadata.
- JSON-LD structured data for software, person and organisation pages.
- Semantic multi-page architecture instead of a single hidden app screen.
- Human-readable documentation pages.

## 2. Local user search

The new `search.html` page provides a browser-local search index covering:

- Workbench.
- QueryFlow.
- QueryPilot.
- Enterprise suite.
- Academy.
- Notebook.
- Diagnostics.
- Dashboard.
- HMG ecosystem.
- Builder profile.
- Documentation.

## 3. Builder/persona page

The new `persona.html` page embeds Adewale Samson Adeagbo's profile:

- AI-Augmented Solutions Developer.
- Data Scientist.
- STEM Educator.
- Lagos, Nigeria.
- Founder / Visioner of HMG Concepts.
- EdTech, DataTech and FaithTech builder modes.
- Selected project proof.
- Portfolio, WhatsApp and author-document links.

## 4. HMG ecosystem page

The new `ecosystem.html` page explains the HMG brand structure:

- HMG Concepts.
- HMG Academy.
- HMG Technologies.
- HMG Media.
- HMG Gospel.

It also documents brand principles such as deliberate learning, authentic teaching, technology as a tool, access for all, community impact and values-driven work.

## 5. Enterprise overview page

The new `enterprise-suite.html` page explains enterprise capabilities in a more indexable and reader-friendly format:

- Workspaces.
- RBAC.
- Audit log.
- Governance rules.
- PII scanner.
- Approvals.
- Lineage.
- Linter.
- Migrations.
- Test data.
- Cost estimator.
- Vault.
- Compliance.

## 6. Better deployment handover

SQL v5 includes clearer guidance for:

- Cloudflare Pages.
- Netlify.
- Vercel.
- GitHub Pages.
- Custom-domain SEO update.
- Post-deployment QA.
- Search engine submission.

## 7. Continued no-AI-API policy

All intelligence remains free-based:

- Rules.
- Templates.
- Heuristics.
- Local browser state.
- Static documents.

No paid AI API is required.

---

# SQL v6 Additions — Benchmark-Inspired Learning, Practice and Analytics Engineering

SQL v6 preserves SQL v5 and adds four major feature groups based on benchmarking similar SQL/data platforms.

## 1. Practice Arena

Files:

```text
practice-arena.html
assets/js/practice-arena.js
```

Features:

- Interview-style SQL challenge bank.
- Difficulty filters: Easy, Medium, Hard.
- Skill filters: aggregation, joins, data quality, business logic, calculated metrics and more.
- Timed mock mode.
- Starter SQL.
- Hints.
- Official solution reveal.
- Exact result-set validation.
- Wrong-answer diagnostics showing column, row-count and first value differences.
- Skill radar chart.
- Local leaderboard.
- Badges.

## 2. Flashcards & Spaced Review

Files:

```text
flashcards.html
assets/js/flashcards.js
```

Features:

- Decks for SQL basics, joins, aggregation, window functions, governance, data quality, analytics engineering and performance.
- Show answer.
- Again / Good / Easy rating.
- Local spaced repetition schedule.
- Due count.
- Mastery progress.

## 3. Dataset & Portfolio Lab

Files:

```text
portfolio-lab.html
assets/js/portfolio-lab.js
```

Features:

- Dataset catalog.
- HMG Students case ideas.
- HMG Enrollments case ideas.
- HMG Projects case ideas.
- Sales case ideas.
- Ministry/FaithTech case ideas.
- Audience-specific case-study generator.
- Reproducibility checklist.
- Portfolio readiness score.
- Markdown portfolio brief export.

## 4. Analytics Engineering Lab

Files:

```text
analytics-engineering.html
assets/js/analytics-engineering.js
```

Features:

- dbt-inspired model planner.
- Layer selector: staging, intermediate, mart, semantic.
- Model SQL generator.
- Grain documentation.
- YAML docs/tests generator.
- Suggested not-null, unique, accepted-values and relationships tests.
- SVG lineage diagram.
- Run checklist.
- Semantic metric ideas.
- Project skeleton export.

## 5. Why these additions matter

SQL v6 now supports the full loop:

1. Learn.
2. Review.
3. Practise.
4. Diagnose errors.
5. Build portfolio cases.
6. Model analytics pipelines.
7. Govern enterprise SQL.
8. Export and deploy.

## 6. No paid AI API

All SQL v6 additions use static JavaScript, local browser storage, deterministic rules and file downloads. No paid AI API is used.
