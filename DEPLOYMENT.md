# Deployment Guide — SQL v6

SQL v6 is a static, multi-page website. It does not require Streamlit, Python, Node build steps, a backend database, or paid AI APIs.

Deploy the **contents** of the `sql v6` folder.

## 1. Required files/folders

```text
index.html
workbench.html
practice-arena.html
queryflow.html
querypilot-v9.html
analytics-engineering.html
portfolio-lab.html
flashcards.html
enterprise-suite.html
academy.html
notebook.html
diagnostics.html
dashboard.html
search.html
persona.html
ecosystem.html
about.html
assets/
qp_assets/
robots.txt
sitemap.xml
humans.txt
manifest.webmanifest
querypilot-manifest.json
sw.js
.nojekyll
README.md
FEATURES.md
DEPLOYMENT.md
SQL_V6_RESEARCH_AND_VERIFICATION.md
ENTERPRISE.md
LEARNING_HUB.md
AUTHOR.md
```

## 2. Local testing

```bash
cd "sql v6"
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Recommended QA pages:

```text
/index.html
/workbench.html
/practice-arena.html
/queryflow.html
/querypilot-v9.html
/analytics-engineering.html
/portfolio-lab.html
/flashcards.html
/enterprise-suite.html
/academy.html
/notebook.html
/diagnostics.html
/dashboard.html
/search.html
/persona.html
/ecosystem.html
/about.html
```

## 3. Cloudflare Pages

1. Create/open a GitHub repository.
2. Copy the contents of `sql v6` into the repository root.
3. Commit and push.
4. Open Cloudflare Dashboard.
5. Go to **Workers & Pages**.
6. Click **Create application**.
7. Select **Pages**.
8. Connect your GitHub repository.
9. Build settings:

```text
Framework preset: None
Build command: leave blank
Build output directory: .
```

If keeping the folder inside the repo:

```text
Build output directory: sql v6
```

10. Deploy.

## 4. Netlify

1. Push files to GitHub.
2. Sign in to Netlify.
3. Click **Add new site → Import an existing project**.
4. Select the repository.
5. Build settings:

```text
Build command: blank
Publish directory: .
```

Or:

```text
Publish directory: sql v6
```

6. Deploy.

## 5. Vercel

1. Push files to GitHub.
2. Sign in to Vercel.
3. Add New Project.
4. Import your repository.
5. Use:

```text
Framework preset: Other
Build command: blank
Output directory: .
```

Or:

```text
Output directory: sql v6
```

6. Deploy.

## 6. GitHub Pages

### Root method

1. Put SQL v6 files in repository root.
2. Go to repository **Settings → Pages**.
3. Source: **Deploy from branch**.
4. Branch: `main`.
5. Folder: `/root`.
6. Save.

### Docs method

1. Rename/copy `sql v6` to `docs`.
2. Push.
3. Settings → Pages.
4. Branch: `main`.
5. Folder: `/docs`.
6. Save.

## 7. SEO setup after deployment

The included sitemap currently uses:

```text
https://hmgacademyhub.github.io/sqlsite/
```

If you deploy elsewhere, update:

```text
sitemap.xml
robots.txt
```

Submit the sitemap to:

- Google Search Console.
- Bing Webmaster Tools.

## 8. Post-deployment QA checklist

- Home opens.
- Navigation works on desktop and mobile.
- `robots.txt` opens.
- `sitemap.xml` opens.
- `search.html` returns local results.
- Practice Arena can run/check a challenge.
- Flashcards can show/rate a card.
- Portfolio Lab exports a brief.
- Analytics Engineering Lab exports a skeleton.
- QueryPilot v9 loads.
- QueryFlow plain-English query runs.
- Workbench sample query runs.
- Academy progress works.
- Notebook export works.
- Dashboard pins persist.
- Browser console shows no missing local asset errors.

## 9. Static-site security note

Never put private database passwords or API secrets in frontend files. If private database connectivity is needed later, use a serverless backend or secure API layer.

## 10. No AI API policy

SQL v6 uses rules, templates and local heuristics. No paid AI API is required.
