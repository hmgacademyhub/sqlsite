# 💎 SQL Workflow v6 | The HMG Ultimate Data Intelligence OS

Welcome to **SQL Workflow v6**, the final and most comprehensive evolution of the HMG SQL ecosystem. This version transforms the platform from a workbench into a **Complete Data Intelligence Operating System**, designed by **Adewale Samson Adeagbo** to provide a professional, zero-cost, and private environment for data science.

V6 is the culmination of all previous versions, incorporating every feature from the QueryFlow and QueryPilot suites, and enhancing them with industry-standard features found in platforms like SQLBolt, SQLZoo, and Kaggle.

## 🚀 The v6 "Ultimate" Feature Set

### 1. 📓 The Analysis Notebook (New!)
Inspired by Jupyter and Kaggle, v6 introduces a **Notebook-style Workflow**. Instead of a single editor, users can now create "Analysis Stories" by mixing:
*   **Markdown Cells:** For documenting the "Why" and "How" of the analysis.
*   **SQL Cells:** Executable blocks of code that return data.
*   **Visualization Cells:** Pinned charts that describe a specific insight.
*   **Export as Report:** The entire notebook can be exported as a professional HTML report.

### 2. 🔍 Execution Plan Profiler (New!)
To move users from "writing queries" to "optimizing queries," v6 integrates the **Explain Profiler**:
*   **Execution Path:** Uses `EXPLAIN QUERY PLAN` to show if the database is doing a "Full Table Scan" or using an "Index."
*   **Optimization Tips:** The system analyzes the plan and suggests adding indexes or simplifying JOINs to improve speed.

### 3. 🎓 Interactive Pedagogy (Enhanced Academy)
Moving beyond simple challenges, the Academy now features **Guided Learning**:
*   **Step-by-Step Flow:** Lessons are broken into tiny, interactive steps where the user must solve a small part of the problem before moving on.
*   **Contextual Feedback:** Instead of "Correct/Incorrect," the system analyzes the SQL and gives hints (e.g., "You forgot the GROUP BY clause for the non-aggregated column").
*   **Certification Path:** A structured journey from "Novice" to "Architect."

### 4. 🔗 Project Portability (Collaboration)
*   **State Export/Import:** Users can export their entire project (database, snippets, and notebook) as a single `.hmg` project file.
*   **Project Sharing:** The ability to import another person's project file to collaborate or learn from their analysis.

### 5. 🤖 Intelligence Pilot & Diagnostic Suite (Refined)
*   **No-AI Pattern Pilot:** 60+ rule-based patterns for instant SQL generation.
*   **Visual Builders:** Standard, JOIN, and Subquery wizards for no-code construction.
*   **Complexity Estimator:** Risk scoring for production safety.
*   **Error Explainer:** Plain-English translation of cryptic DB errors.

---

## 📂 The v6 Architecture
```text
sql v6/
├── index.html          # Brand Portal & Ecosystem Gateway
├── workbench.html      # Professional IDE + Explain Profiler
├── notebook.html       # Analysis Notebook (Markdown + SQL)
├── academy.html        # Interactive Learning Hub
├── diagnostics.html    # The Toolset (Diff, Error, Complexity)
├── dashboard.html      # Executive KPI Dashboard
├── about.html          # The HMG Brand & Visioner Hub
├── script-core.js      # Global state, brand links, theme
├── script-workbench.js # IDE & Execution Logic
├── script-notebook.js  # Notebook cell management
├── script-academy.js   # Interactive pedagogy logic
├── script-diagnostics.js# Diagnostic suite logic
├── script-dashboard.js # Pinned analysis logic
├── pilot.js            # Rule-based NLP engine
├── diagnostics.js      # Complexity & Error engine
├── utils.js            # Global helpers & Dialect translation
├── datasets.js         # Industry-standard data packs
└── README.md           # Documentation
```

---

## 🚀 Deployment Guide (Enterprise Standard)

This is a **Static Multi-Page Application (MPA)** optimized for the Edge.

### Recommended Providers
*   **Cloudflare Pages** (Best for global low-latency).
*   **Vercel** (Best for fast iterations).
*   **Netlify** (Best for simple GitHub sync).

### Deployment Steps
1.  **GitHub Sync:** Create a public repository and push all files in the `sql v6/` folder.
2.  **Connect Provider:** Log into your provider and select **"Import from GitHub"**.
3.  **Configuration:**
    *   **Build Command:** `None`.
    *   **Output Directory:** `.` (Root).
4.  **Live:** Your platform will be available at a secure HTTPS domain (e.g., `hmg-sql.pages.dev`).

### Local Testing
```bash
python3 -m http.server 8000
```
Visit `http://localhost:8000` to test.

---

## 🛠️ Technical Stack
- **Engine:** `sql.js` (SQLite WASM)
- **UI/UX:** CSS Grid/Flexbox, Glassmorphism, HMG Brand System
- **Visuals:** `Chart.js` & `SVG`
- **Editor:** `CodeMirror`
- **Data Processing:** `PapaParse`
- **Intelligence:** Rule-based Pattern Matching & Regular Expressions
- **Storage:** `LocalStorage` & `IndexedDB`
