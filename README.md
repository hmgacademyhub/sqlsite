# SQL v5 — HMG Searchable Multi-Page SQL Intelligence Platform

SQL v5 is the enhanced, SEO-ready, multi-page static platform that preserves and extends everything from SQL v4:

1. **ClassDesk SQL Intelligence** — workbench, academy, notebook, diagnostics, dashboard.
2. **QueryFlow v3 Static Lab** — no-code SQL, QueryFlow-style builder, profiler, pivot, insights, sharing and history.
3. **QueryPilot v9 Console** — extracted QueryPilot PWA with 11 modes, 8 SQL tools, 25 enterprise features and 118-lesson Data Science Learning Hub.
4. **HMG Brand Embedding** — dedicated builder/persona and ecosystem pages based on Adewale Samson Adeagbo and HMG Concepts brand sites.
5. **Search Engine Readiness** — sitemap, robots file, semantic multi-page structure, meta tags, Open Graph tags, structured data, local search and documentation.

## Main pages

| Page | Purpose |
|---|---|
| `index.html` | Main SEO gateway and product overview |
| `workbench.html` | SQL workbench / IDE |
| `queryflow.html` | Static QueryFlow v3 Lab |
| `querypilot-v9.html` | Full QueryPilot v9 Console |
| `enterprise-suite.html` | Enterprise governance overview |
| `academy.html` | SQL Academy path |
| `notebook.html` | Markdown + SQL + chart notebook |
| `diagnostics.html` | SQL diagnostics and security tools |
| `dashboard.html` | Executive pinned dashboard |
| `search.html` | Local platform search |
| `persona.html` | Adewale Samson Adeagbo builder profile |
| `ecosystem.html` | HMG Concepts ecosystem page |
| `about.html` | About and feature explanation |

## SEO and discoverability files

```text
robots.txt
sitemap.xml
humans.txt
manifest.webmanifest
querypilot-manifest.json
```

The sitemap currently uses:

```text
https://hmgacademyhub.github.io/sqlsite/
```

If you deploy on a different custom domain, update `sitemap.xml` and `robots.txt` with your final domain.

## HMG identity embedded

SQL v5 includes details from:

- Adewale Samson Adeagbo portfolio — `https://cssadewale.pages.dev`
- HMG Concepts — `https://hmgconcepts.pages.dev`
- HMG Academy — `https://hmgacademy.pages.dev`
- HMG Technologies — `https://hmgtechnologies.pages.dev`
- HMG Media — `https://hmgmedia.pages.dev`
- HMG Gospel — `https://hmggospel.pages.dev`

## Free/no-cost architecture

- Static HTML/CSS/JavaScript.
- Optional free `sql.js` CDN.
- Local fallback SQL engine.
- LocalStorage persistence.
- Native Canvas charts.
- PWA/offline support.
- No paid AI API.
- No required backend.

## Local testing

```bash
cd "sql v5"
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Deployment

See `DEPLOYMENT.md`.

## Detailed features

See `FEATURES.md`, `ENTERPRISE.md`, `LEARNING_HUB.md`, `RECHECK_AND_V4_AUDIT.md` and `QUERYFLOW_AUDIT.md`.

## License

MIT. See `LICENSE`.
