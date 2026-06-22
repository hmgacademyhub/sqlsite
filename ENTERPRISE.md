# 🏢 QueryPilot v8 Enterprise — Complete Feature Reference

> **The single source of truth for all 25 enterprise features added in v8.** Bookmark this file. Every feature is explained — what it does, why it exists, where it lives, who can use it (RBAC), and exactly which buttons to click.

> *Built by **[Adewale Samson Adeagbo](AUTHOR.md)** — Founder of [HMG Concepts](https://hmgconcepts.pages.dev), Lagos, Nigeria. Shipped from an Android tablet using Acode editor, on zero budget. **No AI API. No backend. No subscription. Ever.***

> 🆕 **In v9** — In addition to these 25 enterprise features, QueryPilot now ships a complete **[Data Science Learning Hub](LEARNING_HUB.md)** with 118 lessons across 9 modules. The Enterprise console and the Learning Hub are independent — use either, both, or neither.

---

## 📋 Table of Contents

| # | Feature | Lives in | Min role |
|---|---|---|---|
| 1 | [Multi-Workspace Manager](#1-multi-workspace-manager) | Sidebar `📁 WS` + Enterprise `📁 Workspaces` | Analyst (use) / DBA (create) |
| 2 | [Audit Log](#2-audit-log) | Enterprise `📜 Audit Log` | Viewer (read) / Admin (clear) |
| 3 | [Role-Based Access Control](#3-role-based-access-control) | Topbar `👑 chip` + Enterprise `👥 Roles` | Anyone (switch role) |
| 4 | [SQL Governance Rules](#4-sql-governance-rules) | Enterprise `🛡️ Governance` | DBA / Admin |
| 5 | [PII / Sensitive Data Detector](#5-pii--sensitive-data-detector) | Enterprise `🔍 PII Scanner` | Analyst |
| 6 | [Query Approval Workflow](#6-query-approval-workflow) | Enterprise `✅ Approvals` | Analyst (submit) / DBA (decide) |
| 7 | [Data Lineage Viewer](#7-data-lineage-viewer) | Enterprise `🌳 Lineage` | Viewer |
| 8 | [SQL Linter (50+ rules)](#8-sql-linter) | Enterprise `🧹 Linter` | Viewer |
| 9 | [Migration Generator](#9-migration-generator) | Enterprise `🔄 Migrations` | DBA |
| 10 | [Test Data Generator](#10-test-data-generator) | Enterprise `🎲 Test Data` | Analyst |
| 11 | [Query Cost Estimator](#11-query-cost-estimator) | Enterprise `💰 Cost` | Viewer |
| 12 | [Query Versioning](#12-query-versioning) | Enterprise `📚 Versions` | Analyst |
| 13 | [Scheduled Reminders](#13-scheduled-reminders) | Enterprise `⏰ Schedules` | DBA |
| 14 | [Webhook / Email Bridge](#14-webhook--email-bridge) | Enterprise `🌉 Bridge` | Analyst |
| 15 | [Backup & Restore](#15-backup--restore) | Enterprise `💾 Backup` | Admin |
| 16 | [Compliance Report Generator](#16-compliance-report-generator) | Enterprise `📋 Compliance` | Admin |
| 17 | [Profile / Role Switcher](#17-profile--role-switcher) | (Same as RBAC) | Anyone |
| 18 | [Team Comments on Queries](#18-team-comments-on-queries) | Enterprise `💬 Comments` | Analyst |
| 19 | [Encrypted Local Vault](#19-encrypted-local-vault) | Enterprise `🔐 Vault` | Anyone |
| 20 | [Onboarding Tour](#20-onboarding-tour) | Auto / Health subtab button | Anyone |
| 21 | [Usage Dashboard](#21-usage-dashboard) | Enterprise `📊 Dashboard` | Viewer |
| 22 | [Print Documentation Pack](#22-print-documentation-pack) | Enterprise `📋 Compliance` (button) | Anyone |
| 23 | [Multi-Tab Workspace Sync](#23-multi-tab-workspace-sync) | Automatic | n/a |
| 24 | [Health Check Dashboard](#24-health-check-dashboard) | Enterprise `🩺 Health` | Viewer |
| 25 | [Glossary / Data Dictionary](#25-glossary--data-dictionary) | Enterprise `📖 Glossary` | DBA |

[How RBAC works](#understanding-rbac) · [How storage works](#how-storage-works) · [Architectural principles](#architectural-principles)

---

## 1. Multi-Workspace Manager

**What it is.** An "isolated environment" abstraction. Each workspace has its own:
- Schema definition (the textarea in the sidebar)
- Active SQL dialect
- Saved queries (bookmarks)
- Snippets, user templates, history, comments, glossary entries, versions

**Why enterprises need it.** A single browser instance often serves multiple contexts — *Production* vs *Staging*, *Client A* vs *Client B*, *Personal* vs *Team*. Without isolation, schemas overlap and a query saved for one context pollutes another.

**Where it lives.**
- Sidebar tab: **`📁 WS`** — quick switcher and creation form
- Header chip: **`📁 {workspace name}`** — one-click open
- Enterprise console: **`📁 Workspaces`** subtab — full management

**How to use it.**
1. Click the **`📁 WS`** sidebar tab (or the workspace chip in the header).
2. To create: type a name, optional description, click **➕ Create Workspace**. The new workspace inherits your current schema as a starting point.
3. To switch: click any workspace card. The schema textarea, dialect dropdown, and all sidebar panels switch atomically.
4. To rename: hover a workspace, click the ✎ icon.
5. To delete: hover, click 🗑. (At least one workspace must remain.)

**RBAC.** All roles can *use* (switch). Only **DBA / Admin** can *create / edit / delete*.

**Audited as.** `WORKSPACE_CREATE`, `WORKSPACE_RENAME`, `WORKSPACE_DELETE`, `WORKSPACE_SWITCH`.

---

## 2. Audit Log

**What it is.** An **immutable, append-only, time-stamped event journal** of every action across QueryPilot v8. Capped at 5,000 most-recent events to prevent unbounded localStorage growth.

**Why enterprises need it.** Regulators (NDPR, GDPR, ISO 27001) require evidence of *who did what, when*. Even in single-user mode, the audit log is the backbone of post-incident analysis ("did anyone DROP that table?").

**Events captured.**
| Action | When fired |
|---|---|
| `WORKSPACE_CREATE` / `RENAME` / `DELETE` / `SWITCH` | Workspace operations |
| `ROLE_SWITCH` | RBAC role change |
| `QUERY_RUN` | User submits a NL query in chat |
| `GOV_BLOCK` / `GOV_WARN` | Governance engine fires |
| `APPROVAL_REQUEST` / `APPROVED` / `REJECTED` | Approval workflow |
| `SCHEDULE_ADD` / `FIRE` | Reminders |
| `MIGRATION_GEN` | Migration script generated |
| `TESTDATA_GEN` | Test data generated |
| `LINT_RUN` | Linter executed |
| `COST_ESTIMATE` | Cost estimator run |
| `BACKUP_CREATE` / `RESTORE` | Backup operations |
| `COMPLIANCE_REPORT` | Compliance report exported |
| `VAULT_STORE` / `READ` / `DENY` / `CLEAR` | Encrypted vault operations |
| `PII_REPORT`, `LINEAGE_*`, `GLOSSARY_ADD`, `COMMENT_ADD`, `TOUR_END`, `BRIDGE_BUILT`, `DOC_PACK_PRINT` | Other operations |
| `RBAC_DENY` | A user attempted an action above their role |
| `AUDIT_CLEAR` | The log itself was cleared |

**Where it lives.** Enterprise → **`📜 Audit Log`** subtab.

**How to use it.**
1. Open the Audit Log subtab.
2. Filter with the search input (matches action, actor, message, workspace).
3. Click **⬇ JSON** or **⬇ CSV** to export. CSV is SIEM-friendly.
4. **Admin only:** **🗑 Clear** wipes the log (and writes an `AUDIT_CLEAR` entry as the first event of the new log).

**RBAC.** All roles can read; only **Admin** can clear.

---

## 3. Role-Based Access Control

**What it is.** Four roles with cumulative permissions. The UI honors the active role by disabling buttons the role cannot use.

| Role | Icon | Rank | Permissions |
|---|---|---|---|
| **Viewer** | 👁️ | 1 | Read queries / browse only |
| **Analyst** | 📊 | 2 | + run, save, snippets, comments |
| **DBA** | 🛠️ | 3 | + governance edit, approvals, migrations, schedules, glossary, workspace mgmt |
| **Admin** | 👑 | 4 | All (`*` wildcard) |

**Why enterprises need it.** Even in single-user mode, role-switching enforces *intentionality*. A DBA dropping into Viewer mode to investigate something cannot accidentally trigger destructive actions.

**Where it lives.**
- Topbar chip: **`👑 Admin`** (click to jump to roles)
- Enterprise → **`👥 Roles`** subtab — full role-switcher with permission counts

**How to use it.**
1. Click the **`👑`** chip in the topbar (or open Enterprise → Roles).
2. Click any role card. The active card is highlighted; the chip updates.
3. Any blocked button gets a 🔒 hover-tooltip and a dimmed/grayscale appearance.

**Honor system disclaimer.** This is **not real auth**. It is workflow discipline + audit trail. For multi-tenant production with separation of duties, layer this with OS-level user accounts or your IdP.

**Audited as.** `ROLE_SWITCH`, `RBAC_DENY` (when a user attempts something their role disallows).

---

## 4. SQL Governance Rules

**What it is.** A rules engine that **BLOCKS** or **WARNS** when a generated SQL statement matches dangerous patterns. The engine runs on every result card *inline*, before any Copy / Run / Download button is usable.

**Default rules (DBA / Admin can toggle).**
| Rule | Severity | Default |
|---|---|---|
| Block `DROP` statements | error | ON |
| Block `TRUNCATE` statements | error | ON |
| Require `WHERE` on `DELETE` | error | ON |
| Require `WHERE` on `UPDATE` | error | ON |
| Block `GRANT` / `REVOKE` | error | ON |
| Block injection patterns (`--` inside strings) | error | ON |
| Warn on `SELECT *` | warn | OFF |

**Plus parameterised lists.**
- **Max LIMIT allowed** (default 10,000). Queries exceeding it produce a warning.
- **Allow-list tables** (comma-separated). If non-empty, *only* listed tables are allowed.
- **Deny-list tables** (comma-separated). Always blocked.

**Why enterprises need it.** Defense-in-depth. Even if a junior analyst writes `DELETE FROM customers;` in chat mode, the result card displays a red banner explaining what was blocked and audit-logs the attempt.

**Where it lives.** Enterprise → **`🛡️ Governance`** subtab.

**How to use it.**
1. Toggle any rule on/off using its switch.
2. Configure Max LIMIT, allow-list, deny-list inputs and click **💾 Save Allow/Deny Lists**.
3. Run any matching SQL in the Ask / Visual / JOIN modes — a banner appears on the result card.

**RBAC.** DBA / Admin only for edit. Everyone sees the enforcement.

**Audited as.** `GOVERNANCE_UPDATE`, `GOV_BLOCK`, `GOV_WARN`.

---

## 5. PII / Sensitive Data Detector

**What it is.** A pattern matcher that flags columns whose names look like PII (Personally Identifiable Information) or sensitive data, with severity and per-type advice.

**Patterns detected (15+).**
- 🇳🇬 Nigerian-specific: NIN, BVN
- 🌐 Global: SSN, credit card / PAN / CVV, email, phone, DOB, address, salary, password, token, API key, IP address, passport, religion/ethnicity, medical, geolocation

**Why enterprises need it.** NDPR Article 2.6 and GDPR Article 9 require *special categories of personal data* to be specifically identified and protected. This tool gives you a first-pass inventory.

**Where it lives.** Enterprise → **`🔍 PII Scanner`** subtab.

**How to use it.**
1. Ensure your schema is loaded (Schema sidebar tab).
2. Click **🔍 Run Scan on Current Schema**.
3. Review findings grouped by severity (high / medium / low).
4. Click **📄 Export PII Report (Markdown)** for a compliance artifact.

**RBAC.** All roles can scan. The export is audited.

**Audited as.** `PII_REPORT`.

---

## 6. Query Approval Workflow

**What it is.** A formal request → review → decision loop for sensitive SQL. Analysts submit; DBAs / Admins approve or reject with notes.

**Why enterprises need it.** Four-eyes principle for any query that touches production, PII, or large row counts.

**Lifecycle.**
1. **Analyst** opens Enterprise → Approvals, fills Title + SQL + Justification, clicks **📨 Submit Request**.
2. **DBA / Admin** sees the request in the same panel with **✓ Approve** / **✗ Reject** buttons.
3. Decision adds an optional note, marks status, audits the action.
4. Either role can **🗑 Delete** an approved/rejected request to clear it.

**Where it lives.** Enterprise → **`✅ Approvals`** subtab.

**RBAC.** Analyst+ to request; DBA / Admin to decide.

**Audited as.** `APPROVAL_REQUEST`, `APPROVAL_APPROVED`, `APPROVAL_REJECTED`.

---

## 7. Data Lineage Viewer

**What it is.** A visual graph (SVG) showing which queries (current session + saved bookmarks) read which tables. Inferred by parsing `FROM` / `JOIN` clauses.

**Why enterprises need it.** Impact analysis. "If I rename `customers.region`, which 17 queries break?" — the lineage view answers visually.

**Where it lives.** Enterprise → **`🌳 Lineage`** subtab.

**How to use it.**
1. Run / save several queries first.
2. Open Lineage, click **🌳 Generate Lineage**.
3. Tables on the left (📋), queries on the right (⚡). Lines connect query → table dependencies.
4. **⬇ Download SVG** for documentation or wiki embed.

**RBAC.** All roles.

---

## 8. SQL Linter

**What it is.** A free, deterministic, ES5-compatible "sqlfluff-lite" with **50 built-in rules** across:
- **Style** — snake_case, multiple spaces, tabs, indentation
- **Correctness** — `= NULL` instead of `IS NULL`, missing semicolon, trailing commas
- **Security** — SQL injection patterns, `GRANT`/`REVOKE`, sensitive keywords in comments
- **Performance** — leading-% `LIKE`, function on indexed column, missing `LIMIT` with `ORDER BY`
- **Schema** — VARCHAR length ≥1000, ORDER BY by column position

**Severity.** `E` (error) / `W` (warning) / `I` (info).

**Where it lives.** Enterprise → **`🧹 Linter`** subtab.

**How to use it.**
1. Paste SQL into the textarea.
2. Click **🧹 Lint**. Findings list with rule IDs (e.g. `L023`) appear, plus severity tallies.

**RBAC.** All roles.

**Audited as.** `LINT_RUN`.

---

## 9. Migration Generator

**What it is.** A schema-diff tool that compares two QueryPilot schema definitions (old vs new) and emits a runnable `.sql` migration script with `CREATE TABLE`, `DROP TABLE`, `ALTER TABLE ADD COLUMN`, `ALTER TABLE DROP COLUMN` statements.

**Why enterprises need it.** Schema evolution is constant. This tool replaces the "I need to remember what changed" hand-coding step.

**Where it lives.** Enterprise → **`🔄 Migrations`** subtab.

**How to use it.**
1. Paste the OLD schema in the left textarea.
2. Optionally paste the NEW schema in the right textarea — or leave blank to use the active workspace's current schema.
3. Click **🔄 Generate**. Review the SQL in the preview.
4. Click **⬇ Download .sql** to save.

**RBAC.** DBA / Admin.

**Audited as.** `MIGRATION_GEN`.

---

## 10. Test Data Generator

**What it is.** Generates realistic `INSERT INTO ... VALUES (...)` statements using a built-in **Faker** seeded with **Nigerian-context defaults** — real first/last names (Adewale, Chinwe, Tunde, Bisi…), real cities (Lagos, Abuja, Port Harcourt, Kano, Ibadan…), Nigerian-format phone numbers (+234…), six geopolitical zones, etc.

Column-type inference picks the right faker per column name:
- `*_id`, `id` → integers
- `*name*` → person name
- `*email*` → realistic email at common Nigerian domains
- `*phone*` → +234 prefix
- `*city*`, `*region*`, `*department*`, `*category*`, `*status*` → curated lists
- `*price*`, `*total*`, `*amount*`, `*salary*` → decimals
- `*stock*`, `*qty*`, `*quantity*` → integers
- `*date*`, `*_at*` → ISO date in last 2 years

**Where it lives.** Enterprise → **`🎲 Test Data`** subtab.

**How to use it.**
1. Pick a table from the dropdown (auto-populated from your schema).
2. Choose row count (1–1000).
3. Click **🎲 Generate**, then **⬇ .sql** to download.

**RBAC.** Analyst+.

**Audited as.** `TESTDATA_GEN`.

---

## 11. Query Cost Estimator

**What it is.** Heuristic **rows-scanned, bytes-scanned, duration estimate** for any SQL, based on:
- Number of tables (assumes 100k rows/table)
- Number of JOINs (each multiplies result × 1.4)
- Subqueries (each adds 30%)
- Window functions (+15%)
- Index hints (column `=` on `id` / `*_id` reduces × 0.1)
- WHERE presence (no WHERE × 1.0, WHERE × 0.5)
- LIMIT capping

Outputs:
- **Rows scanned** (humanised: K/M/B)
- **Bytes scanned** (B/KB/MB/GB) — uses 200 bytes/row default
- **Duration estimate** (ms, at 50M rows/sec)
- **Risk level** (low / medium / high)
- **Tables touched, index used, full-scan flag**

**Why enterprises need it.** BigQuery / Snowflake charge per byte scanned. Even on Postgres, knowing a query *might* scan 10M rows changes the conversation.

**Where it lives.** Enterprise → **`💰 Cost`** subtab.

**How to use it.** Paste SQL, click **💰 Estimate**.

**RBAC.** All roles.

**Audited as.** `COST_ESTIMATE`.

---

## 12. Query Versioning

**What it is.** Snapshot any saved query (50 snapshots max per query) with an optional note. View each snapshot's timestamp + author + diff against the current saved version.

**Why enterprises need it.** Saved queries are living documents. Versioning lets you audit how a KPI definition changed quarter-over-quarter.

**Where it lives.** Enterprise → **`📚 Versions`** subtab.

**How to use it.**
1. Save at least one query first (star ⭐ a result card).
2. Pick the query from the dropdown.
3. Type an optional note, click **📸 Snapshot now**.
4. Click any snapshot in the list to view its diff vs current.

**RBAC.** Analyst+.

**Audited as.** `VERSION_SAVE`.

---

## 13. Scheduled Reminders

**What it is.** A browser-Notification-API based scheduler. Pick a query title, a query text, a time, and weekdays. At that time the browser fires a notification (and an in-app toast).

**Free, no cron, no server.** Requires the QueryPilot tab open (or the PWA installed). Notification permission requested on first schedule.

**Why enterprises need it.** Daily KPI reminders, "remember to refresh the warehouse view at 09:00", etc. No need to pay for cron-as-a-service.

**Where it lives.** Enterprise → **`⏰ Schedules`** subtab.

**How to use it.**
1. Type Title + Time + Query reminder text.
2. Pick weekdays.
3. Click **⏰ Add Schedule**. Grant Notifications when prompted.

**RBAC.** DBA / Admin.

**Audited as.** `SCHEDULE_ADD`, `SCHEDULE_FIRE`.

---

## 14. Webhook / Email Bridge

**What it is.** Composes a `mailto:` link or a webhook URL with your SQL as a payload — pasteable into Zapier, Make.com, n8n, Slack incoming webhooks, Discord webhooks, etc.

**Crucially: no API call is made by QueryPilot itself.** It just builds the link. The user opens it (mail client / new browser tab / Zapier listener) on their own — preserving the no-API principle while still letting users wire into modern automation platforms.

**Where it lives.** Enterprise → **`🌉 Bridge`** subtab.

**How to use it.**
1. Choose type: `📧 mailto` or `🌐 webhook`.
2. Endpoint = email address or webhook URL.
3. Subject + SQL payload.
4. Click **🌉 Build Link**. Click the generated link to fire.

**RBAC.** Analyst+.

**Audited as.** `BRIDGE_BUILT`.

---

## 15. Backup & Restore

**What it is.** One-click JSON export of *everything* in QueryPilot's localStorage (all v6/v7 keys plus all enterprise keys). One-click restore from any backup JSON.

**Why enterprises need it.** Disaster recovery. Device migration. Cloning a Production-Analyst's environment for a junior to study.

**Where it lives.** Enterprise → **`💾 Backup`** subtab.

**How to use it.**
- Backup: click **⬇ Download Backup**.
- Restore: click **⬆ Restore from file…**, pick the JSON, confirm the overwrite warning. Page reloads.

**RBAC.** Admin only for restore (backup is open to all; the export contains your own data anyway).

**Audited as.** `BACKUP_CREATE`, `BACKUP_RESTORE`.

---

## 16. Compliance Report Generator

**What it is.** Generates a Markdown attestation report combining:
- Data locality statement (no network, all local)
- RBAC posture (roles + permissions)
- Governance posture (current rules + lists)
- PII inventory (current scan results)
- Audit activity summary (event counts by action)
- Attestation block signed by current role + timestamp

**Format.** Markdown — easy to convert to PDF (paste into Notion / Google Docs / Pandoc), submit as compliance evidence, attach to ISMS documentation.

**Where it lives.** Enterprise → **`📋 Compliance`** subtab.

**How to use it.**
1. **👁 Preview** to render in-app.
2. **⬇ Export .md** to download.
3. **🖨️ Print Data Pack** for an extended HTML print version (Section 22).

**RBAC.** All roles can generate; the report records which role generated it.

**Audited as.** `COMPLIANCE_REPORT`.

---

## 17. Profile / Role Switcher

Profiles and roles are unified in v8. See [#3 RBAC](#3-role-based-access-control). To switch identity, switch role. Each role acts as a separate audit-log actor.

---

## 18. Team Comments on Queries

**What it is.** Threaded text comments pinned to any saved query. Stored per-workspace, signed by the commenter's current role.

**Why enterprises need it.** Documentation rot. "Why does this query filter by `status != 'archived_v2'`?" — the answer should live next to the SQL.

**Where it lives.** Enterprise → **`💬 Comments`** subtab.

**How to use it.**
1. Save a few queries first (⭐ on result cards).
2. Pick a query from the dropdown.
3. Type a comment, click **💬 Post**.
4. Each comment can be deleted via the 🗑 button.

**RBAC.** Analyst+ to post; everyone reads.

**Audited as.** `COMMENT_ADD`.

---

## 19. Encrypted Local Vault

**What it is.** A single encrypted blob in localStorage, secured by **browser-native Web Crypto**: AES-256-GCM cipher, PBKDF2-SHA-256 with 120,000 iterations, per-store random 16-byte salt and 12-byte IV.

**Why enterprises need it.** Most QueryPilot data lives in plain localStorage. The Vault is the place to stash items you do not want sitting in plaintext: production credential reminders, sensitive schema descriptions, PII samples for testing.

**Properties.**
- **Zero-knowledge.** Passphrase is never stored. Forget it = data gone.
- **Free, offline, no third party.** All crypto runs in the browser.
- **Auditable.** Store / read / clear / failed-unlock are logged.

**Where it lives.** Enterprise → **`🔐 Vault`** subtab.

**How to use it.**
1. Type a passphrase (≥6 chars) + content.
2. Click **🔒 Encrypt & Store**.
3. Later: click 🔐, enter passphrase, **🔓 Unlock**.
4. **🗑 Clear** wipes the vault.

**Audited as.** `VAULT_STORE`, `VAULT_READ`, `VAULT_DENY`, `VAULT_CLEAR`.

---

## 20. Onboarding Tour

**What it is.** An 8-step product tour that auto-launches on first ever load, explaining workspaces, RBAC, governance, PII, approvals, audit log, compliance, and "you're all set".

**Where it lives.**
- Auto-runs on first load (gated by `qpe_tour_done` flag in localStorage)
- Manually restart via Enterprise → **`🩺 Health`** → **🎓 Restart Onboarding Tour**

**Audited as.** `TOUR_END`.

---

## 21. Usage Dashboard

**What it is.** A local-only telemetry view, derived entirely from your own audit log:
- Total events / events today / workspaces / saved queries / peak hour
- Top 5 actions (bar chart)
- Activity by role (bar chart)
- Top 5 most-queried tables (bar chart)
- Hourly distribution (24-hour sparkline)

**Nothing is sent anywhere.** These numbers exist only in your browser.

**Where it lives.** Enterprise → **`📊 Dashboard`** subtab.

**How to use it.** Click **📊 Refresh Dashboard**.

---

## 22. Print Documentation Pack

**What it is.** A one-click extended HTML document opened in a new tab, ready for **Save as PDF** via the browser print dialog. Includes:

1. Cover page (workspace, generator, date)
2. **Data Dictionary** — every table, every column, inferred type, PII flag, glossary definition
3. **PII inventory** with severity and advice
4. **Glossary / business definitions** table
5. **Saved Query Catalogue** with tags + SQL bodies
6. **Governance posture** snapshot (JSON)

**Use it for.** Auditor handovers. New-hire onboarding packets. Quarterly review documents.

**Where it lives.** Enterprise → **`📋 Compliance`** → **🖨️ Print Data Pack** button (also accessible from Health subtab).

**Audited as.** `DOC_PACK_PRINT`.

---

## 23. Multi-Tab Workspace Sync

**What it is.** Open QueryPilot in two browser tabs. Switch workspace in one → the other updates automatically. Implemented via the **BroadcastChannel API** (free, browser-native, no server).

**Where it lives.** Automatic. No UI element.

**Confirmed working when.** A small toast `🔄 Synced from another tab` appears in the second tab.

**Falls back gracefully** when BroadcastChannel is unsupported (very old browsers) — the app still works, just without cross-tab sync.

---

## 24. Health Check Dashboard

**What it is.** A self-test of the browser features QueryPilot Enterprise depends on:

- **localStorage** availability + usage (MB / quota %)
- **Service Worker** registration status
- **Web Crypto** (vault dependency)
- **Notifications** permission state (reminders dependency)
- **BroadcastChannel** (multi-tab sync dependency)
- **PWA install** state (standalone vs in-tab)
- **Network** online / offline status
- **Browser** identification
- **Audit log size** vs the 5,000-event cap
- **JS heap** usage (Chrome-only)

**Use it for.** First-time deployment validation on user devices. Troubleshooting "feature X doesn't work for me".

**Where it lives.** Enterprise → **`🩺 Health`** subtab → **🩺 Run Health Check** button.

---

## 25. Glossary / Data Dictionary

**What it is.** Per-workspace business definitions for columns or terms. Used by the [Print Documentation Pack](#22-print-documentation-pack).

**Why enterprises need it.** "What is `customers.region`?" — code doesn't say. Comments rot. A glossary survives.

**Where it lives.** Enterprise → **`📖 Glossary`** subtab.

**How to use it.**
1. Type "Column / term" (e.g. `customers.region`) and "Definition" (e.g. *Geographical sales zone (NW/NE/SS/SE/SW/NC)*).
2. Click **➕ Add**.
3. Definitions appear automatically in the printed Data Pack.

**RBAC.** DBA / Admin.

**Audited as.** `GLOSSARY_ADD`.

---

## Understanding RBAC

The role enforcement happens **in the UI layer** via the `data-rbac-perm="perm.name"` attribute. When you switch roles, every such element is checked and either enabled or disabled (`data-rbac-blocked="true"` + 🔒 tooltip).

This is *not* server-enforced (there is no server). It is **workflow discipline + audit trail**. The audit log captures every deny attempt (`RBAC_DENY` event), so you have evidence even if someone bypasses the UI by calling JS directly.

For true multi-tenant isolation, deploy separate QueryPilot instances per user (each on a different URL or different browser profile).

---

## How Storage Works

All v8 enterprise data lives in `localStorage` under the `qpe_` prefix:

| Key | Contents |
|---|---|
| `qpe_workspaces` | Array of workspace objects (schema, queries, snippets, comments, versions, glossary) |
| `qpe_active_ws` | ID of the currently active workspace |
| `qpe_role` | Currently selected role |
| `qpe_audit_log` | Last 5,000 audit events (newest first) |
| `qpe_governance` | Governance rule toggles + allow/deny lists + maxLimit |
| `qpe_approvals` | Approval requests array |
| `qpe_schedules` | Active reminder schedules |
| `qpe_vault` | Encrypted blob (AES-GCM ciphertext + salt + IV) |
| `qpe_tour_done` | Boolean flag — did the user finish the tour |
| `qpe_first_boot_done` | Boolean flag — has the app loaded at least once |

v6/v7 keys (`qp_*` prefix) remain unchanged — v8 cohabits cleanly.

---

## Architectural Principles

The 25 enterprise features adhere to the same principles as the rest of QueryPilot:

1. **No AI API.** All "intelligence" is rule-based: NL→SQL patterns, governance rules, PII regex, linter rules, cost heuristics, Faker dictionaries.
2. **No backend.** Browser-only. localStorage + Web Crypto + BroadcastChannel + Notifications API + Blob downloads + FileReader uploads.
3. **No external dependencies.** Vanilla ES5-compatible JavaScript. No npm. No bundler. No build step.
4. **Honor-system RBAC + audit trail.** Trust + evidence, not enforcement walls.
5. **Free forever.** MIT-licensed. Deploy to any free static host. Use it forever.
6. **Privacy by default.** Nothing leaves the browser. Even the webhook bridge composes URLs but doesn't call them.

---

## Migrating from v7 to v8

Drop-in upgrade. No data migration needed. The first time v8 loads:

1. Your existing v6/v7 schema (from `qp_schema`) is *not* automatically migrated into a workspace. v6/v7 keys remain readable.
2. v8 creates a `Default` workspace inheriting whatever's currently in the schema textarea.
3. The onboarding tour runs once.

To formally "move" your v6/v7 setup into a v8 workspace: open the **Workspaces** sidebar, click `Default`, the current schema is already loaded. Optionally rename it to something meaningful.

---

## Limitations / Honest Disclosure

- **RBAC is UI-only.** A user opening DevTools can call functions directly. The audit trail captures attempts.
- **5,000-event audit cap.** Export and rotate periodically for long-term retention.
- **Schedules require the tab open.** No background worker (would require server).
- **Vault depends on passphrase memory.** Lose it = data unrecoverable.
- **Cost estimator is a heuristic.** Calibrate constants (`rowsPerTable`, `bytesPerRow`) in `enterprise.js` for your domain.
- **Multi-tab sync is local-only.** Doesn't sync across devices (use Backup/Restore for that).

---

> *QueryPilot v8 Enterprise — built deliberately by **Adewale Samson Adeagbo**, Lagos, Nigeria. Released under MIT. Use it. Improve it. Pass it on.*
>
> *Questions? WhatsApp [+234 810 086 6322](https://wa.me/2348100866322) · [buildingmyictcareer@gmail.com](mailto:buildingmyictcareer@gmail.com)*
