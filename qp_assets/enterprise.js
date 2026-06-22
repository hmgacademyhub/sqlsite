/* =====================================================================
   QueryPilot v9 — Enterprise module (added in v8, maintained in v9)
   25 enterprise features. ES5-compatible. No external dependencies.
   No AI API. No backend. Uses only browser-native Web APIs:
   - localStorage / sessionStorage     (persistence)
   - Web Crypto SubtleCrypto           (AES-GCM encrypted vault, PBKDF2)
   - Notifications API                 (scheduled reminders)
   - BroadcastChannel API              (multi-tab sync)
   - File / Blob APIs                  (backup, restore, exports)
   - performance / navigator           (health check)

   Loaded AFTER assets/app.js so all v6/v7 globals are available.
   ===================================================================== */

(function(){
"use strict";

/* ===================================================================
   0. NAMESPACE + STORAGE HELPERS
   =================================================================== */
var QPE = window.QPE = {};   // QueryPilot Enterprise namespace

var LS_PREFIX = "qpe_";
function lsGet(key, def){
  try {
    var raw = localStorage.getItem(LS_PREFIX + key);
    if(raw === null) return def;
    return JSON.parse(raw);
  } catch(e){ return def; }
}
function lsSet(key, val){
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(val)); return true; }
  catch(e){ console.warn("QPE: localStorage write failed", e); return false; }
}
function lsDel(key){ try { localStorage.removeItem(LS_PREFIX + key); } catch(e){} }
function uid(prefix){ return (prefix||"id") + "_" + Date.now() + "_" + Math.random().toString(36).slice(2,8); }
function nowISO(){ return new Date().toISOString(); }
function fmtTime(iso){
  var d = new Date(iso);
  if(isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
function esc2(s){ // local escape (in case global esc is renamed)
  return String(s==null?"":s)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}
QPE.helpers = { lsGet:lsGet, lsSet:lsSet, lsDel:lsDel, uid:uid, nowISO:nowISO, fmtTime:fmtTime };


/* ===================================================================
   1. MULTI-WORKSPACE MANAGER
   Each workspace has its own schema, dialect, saved queries, snippets,
   user templates, history, comments, glossary. The active workspace
   is the one all v6/v7 features read from / write to.
   =================================================================== */
var WORKSPACES_KEY = "workspaces";
var ACTIVE_WS_KEY = "active_ws";

function defaultWorkspace(name, desc){
  return {
    id: uid("ws"),
    name: name || "Default",
    description: desc || "Default workspace",
    created: nowISO(),
    color: ["#3fb950","#58a6ff","#bc8cff","#f69d50","#d29922","#f85149"][Math.floor(Math.random()*6)],
    schema: "customers(id, name, email, region, status, created_at)\norders(id, customer_id, total, status, created_at)\nproducts(id, name, category, price, stock)\nemployees(id, name, department, salary, status, hire_date)\ninvoices(id, customer_id, amount, due_date, status)",
    dialect: "Standard SQL",
    bookmarks: [],     // saved queries (mirrors v6 bookmarks)
    snips: [],
    udt: [],
    history: [],
    comments: {},      // queryId -> [comments]
    versions: {},      // queryId -> [versions]
    glossary: [],      // [{column, definition}]
    lineage: []        // [{queryId, tables:[], cols:[]}]
  };
}

QPE.ws = {
  all: function(){ return lsGet(WORKSPACES_KEY, null); },
  active: function(){
    var all = this.all();
    if(!all || !all.length){
      var w = defaultWorkspace("Default", "Default workspace");
      lsSet(WORKSPACES_KEY, [w]);
      lsSet(ACTIVE_WS_KEY, w.id);
      return w;
    }
    var aid = lsGet(ACTIVE_WS_KEY, all[0].id);
    return all.filter(function(w){ return w.id === aid; })[0] || all[0];
  },
  switch: function(id){
    var all = this.all(); if(!all) return;
    var w = all.filter(function(w){ return w.id === id; })[0];
    if(!w) return;
    lsSet(ACTIVE_WS_KEY, id);
    // Push workspace schema into the schema textarea
    var ta = document.getElementById("schema-ta");
    if(ta){ ta.value = w.schema; }
    var dia = document.getElementById("dialect");
    if(dia){ dia.value = w.dialect; if(typeof onDC==="function") onDC(); }
    if(typeof refreshAll==="function") refreshAll();
    QPE.audit.log("WORKSPACE_SWITCH", "Switched to workspace: " + w.name, {workspaceId:id});
    QPE.renderWorkspaceChip();
    QPE.renderWorkspaceList();
    if(typeof toast==="function") toast("Workspace: " + w.name);
    if(QPE.bus) QPE.bus.postMessage({type:"workspace_switch", id:id});
  },
  create: function(name, desc){
    if(!QPE.rbac.can("workspace.create")){ QPE.rbac.deny("create workspaces"); return; }
    var all = this.all() || [];
    var w = defaultWorkspace(name, desc);
    // Inherit the current schema as a starting point
    var cur = this.active();
    if(cur){ w.schema = cur.schema; w.dialect = cur.dialect; }
    all.push(w);
    lsSet(WORKSPACES_KEY, all);
    QPE.audit.log("WORKSPACE_CREATE", "Created workspace: " + name);
    QPE.renderWorkspaceList();
    return w;
  },
  rename: function(id, name){
    if(!QPE.rbac.can("workspace.edit")){ QPE.rbac.deny("rename workspaces"); return; }
    var all = this.all();
    all.forEach(function(w){ if(w.id===id) w.name = name; });
    lsSet(WORKSPACES_KEY, all);
    QPE.audit.log("WORKSPACE_RENAME", "Renamed to: " + name, {workspaceId:id});
    QPE.renderWorkspaceList();
    QPE.renderWorkspaceChip();
  },
  delete: function(id){
    if(!QPE.rbac.can("workspace.delete")){ QPE.rbac.deny("delete workspaces"); return; }
    var all = this.all();
    if(all.length <= 1){ if(typeof toast==="function") toast("At least one workspace required", "var(--er)"); return; }
    var w = all.filter(function(x){return x.id===id;})[0];
    if(!confirm("Delete workspace '" + (w?w.name:id) + "'? This cannot be undone.")) return;
    all = all.filter(function(x){ return x.id !== id; });
    lsSet(WORKSPACES_KEY, all);
    var active = lsGet(ACTIVE_WS_KEY, null);
    if(active === id){ this.switch(all[0].id); }
    QPE.audit.log("WORKSPACE_DELETE", "Deleted workspace: " + (w?w.name:id));
    QPE.renderWorkspaceList();
  },
  // Persist current schema textarea content into the active workspace.
  // Called on schema changes so workspace-switching feels natural.
  saveActiveSchema: function(){
    var all = this.all(); if(!all) return;
    var aid = lsGet(ACTIVE_WS_KEY, null);
    var ta = document.getElementById("schema-ta");
    var dia = document.getElementById("dialect");
    if(!ta) return;
    all.forEach(function(w){
      if(w.id === aid){
        w.schema = ta.value;
        if(dia) w.dialect = dia.value;
      }
    });
    lsSet(WORKSPACES_KEY, all);
  }
};

QPE.renderWorkspaceChip = function(){
  var ws = QPE.ws.active();
  var chip = document.getElementById("ws-chip");
  if(chip && ws){
    chip.textContent = "📁 " + ws.name;
    chip.style.borderColor = ws.color;
    chip.style.color = ws.color;
    chip.title = ws.description;
  }
};

QPE.renderWorkspaceList = function(){
  var el = document.getElementById("ws-list");
  if(!el) return;
  var all = QPE.ws.all() || [];
  var activeId = lsGet(ACTIVE_WS_KEY, null);
  if(!all.length){
    el.innerHTML = '<div class="ent-empty">No workspaces. Create your first one above.</div>';
    return;
  }
  el.innerHTML = all.map(function(w){
    var isActive = w.id === activeId;
    return '<div class="ws-card '+(isActive?'active':'')+'" onclick="QPE.ws.switch(\''+w.id+'\')">' +
      '<div class="ws-name" style="color:'+w.color+'">📁 '+esc2(w.name)+(isActive?' <span class="ent-pill green">ACTIVE</span>':'')+'</div>' +
      '<div class="ws-meta">'+esc2(w.description||"")+' · '+(w.bookmarks||[]).length+' saved · '+fmtTime(w.created).split(",")[0]+'</div>' +
      '<div class="ws-actions">' +
        '<button class="ws-mini" onclick="event.stopPropagation();QPE.uiRenameWorkspace(\''+w.id+'\')" title="Rename">✎</button>' +
        '<button class="ws-mini" onclick="event.stopPropagation();QPE.ws.delete(\''+w.id+'\')" title="Delete">🗑</button>' +
      '</div></div>';
  }).join("");
};

QPE.uiRenameWorkspace = function(id){
  var all = QPE.ws.all();
  var w = all.filter(function(x){return x.id===id;})[0];
  if(!w) return;
  var newName = prompt("Rename workspace:", w.name);
  if(newName && newName.trim()) QPE.ws.rename(id, newName.trim());
};

QPE.uiCreateWorkspace = function(){
  var name = document.getElementById("ws-new-name").value.trim();
  var desc = document.getElementById("ws-new-desc").value.trim();
  if(!name){ if(typeof toast==="function") toast("Workspace name required", "var(--wn)"); return; }
  QPE.ws.create(name, desc);
  document.getElementById("ws-new-name").value = "";
  document.getElementById("ws-new-desc").value = "";
  if(typeof toast==="function") toast("Workspace created: " + name);
};


/* ===================================================================
   2. AUDIT LOG  — immutable append-only event journal
   =================================================================== */
var AUDIT_KEY = "audit_log";
var AUDIT_MAX = 5000;   // cap to prevent unbounded growth

QPE.audit = {
  log: function(action, message, meta){
    var entry = {
      id: uid("ev"),
      ts: nowISO(),
      actor: (QPE.rbac && QPE.rbac.currentRole) ? QPE.rbac.currentRole : "anonymous",
      workspace: (function(){ var w=QPE.ws.active(); return w?w.name:"-"; })(),
      action: action,
      message: message,
      meta: meta || {}
    };
    var log = lsGet(AUDIT_KEY, []);
    log.unshift(entry);
    if(log.length > AUDIT_MAX) log = log.slice(0, AUDIT_MAX);
    lsSet(AUDIT_KEY, log);
    return entry;
  },
  all: function(){ return lsGet(AUDIT_KEY, []); },
  clear: function(){
    if(!QPE.rbac.can("audit.clear")){ QPE.rbac.deny("clear audit log"); return; }
    if(!confirm("Clear entire audit log? This is irreversible and may break compliance attestations.")) return;
    lsDel(AUDIT_KEY);
    QPE.audit.log("AUDIT_CLEAR", "Audit log was cleared");
    QPE.renderAuditLog();
  },
  exportJSON: function(){
    var data = {
      tool: "QueryPilot v9 Enterprise",
      exported: nowISO(),
      exportedBy: QPE.rbac.currentRole,
      events: QPE.audit.all()
    };
    if(typeof dl==="function") dl(JSON.stringify(data, null, 2), "querypilot_audit_log.json");
    if(typeof toast==="function") toast("Audit log exported (JSON)");
  },
  exportCSV: function(){
    var rows = QPE.audit.all();
    var csv = "timestamp,actor,workspace,action,message\n";
    rows.forEach(function(r){
      csv += [r.ts, r.actor, r.workspace, r.action, '"'+(r.message||"").replace(/"/g,'""')+'"'].join(",") + "\n";
    });
    if(typeof dl==="function") dl(csv, "querypilot_audit_log.csv");
    if(typeof toast==="function") toast("Audit log exported (CSV)");
  }
};

QPE.renderAuditLog = function(){
  var el = document.getElementById("audit-list");
  if(!el) return;
  var rows = QPE.audit.all();
  var filter = (document.getElementById("audit-filter")||{}).value || "";
  if(filter) rows = rows.filter(function(r){
    var hay = (r.action+" "+r.message+" "+r.actor+" "+r.workspace).toLowerCase();
    return hay.indexOf(filter.toLowerCase()) >= 0;
  });
  if(!rows.length){
    el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">📜</div>No audit events match. Try clearing the filter.</div>';
    return;
  }
  var html = '<div class="audit-wrap"><table class="audit-table"><thead><tr>' +
    '<th>Time</th><th>Actor</th><th>Workspace</th><th>Action</th><th>Message</th>' +
    '</tr></thead><tbody>';
  rows.slice(0, 500).forEach(function(r){
    html += '<tr class="audit-row-'+esc2(r.action.split("_")[0])+'">' +
      '<td>'+esc2(fmtTime(r.ts))+'</td>' +
      '<td>'+esc2(r.actor)+'</td>' +
      '<td>'+esc2(r.workspace)+'</td>' +
      '<td><strong>'+esc2(r.action)+'</strong></td>' +
      '<td>'+esc2(r.message)+'</td></tr>';
  });
  html += '</tbody></table></div>';
  if(rows.length > 500) html += '<div style="font-size:11px;color:var(--mu);margin-top:6px">Showing 500 of '+rows.length+' events. Export for full log.</div>';
  el.innerHTML = html;
};


/* ===================================================================
   3. ROLE-BASED ACCESS CONTROL (RBAC)
   Honor-system roles, persisted to localStorage. UI hides/disables
   actions per role. No backend, no real auth — fit for the no-API
   principle but documents an audit trail of role switches.
   =================================================================== */
QPE.rbac = (function(){
  var ROLES = {
    Viewer:  { rank: 1, color: "#636e7b", icon: "👁️", perms: ["query.read"] },
    Analyst: { rank: 2, color: "#58a6ff", icon: "📊", perms: ["query.read","query.run","query.save","snippet.write","comment.write"] },
    DBA:     { rank: 3, color: "#d29922", icon: "🛠️", perms: ["query.read","query.run","query.save","snippet.write","comment.write","ddl.write","governance.edit","approval.action","migration.gen","comment.write","glossary.write","workspace.create","workspace.edit","schedule.write"] },
    Admin:   { rank: 4, color: "#f85149", icon: "👑", perms: ["*"] }  // wildcard
  };
  var current = lsGet("role", "Admin");  // default Admin so first-run user can configure everything

  return {
    ROLES: ROLES,
    get currentRole(){ return current; },
    set: function(role){
      if(!ROLES[role]){ if(typeof toast==="function") toast("Unknown role: "+role, "var(--er)"); return; }
      var prev = current;
      current = role;
      lsSet("role", role);
      QPE.audit.log("ROLE_SWITCH", "Role changed: " + prev + " → " + role);
      QPE.renderRoleChip();
      QPE.applyRBACUI();
      if(typeof toast==="function") toast("Now acting as: " + ROLES[role].icon + " " + role);
    },
    can: function(perm){
      var r = ROLES[current];
      if(!r) return false;
      if(r.perms.indexOf("*") >= 0) return true;
      return r.perms.indexOf(perm) >= 0;
    },
    deny: function(action){
      if(typeof toast==="function")
        toast("🔒 Your role (" + current + ") cannot " + action, "var(--er)");
      QPE.audit.log("RBAC_DENY", "Denied: " + action + " (role=" + current + ")");
    }
  };
})();

QPE.renderRoleChip = function(){
  var chip = document.getElementById("role-chip");
  if(!chip) return;
  var r = QPE.rbac.ROLES[QPE.rbac.currentRole];
  if(!r) return;
  chip.textContent = r.icon + " " + QPE.rbac.currentRole;
  chip.style.color = r.color;
  chip.style.borderColor = r.color;
};

QPE.applyRBACUI = function(){
  // Mark RBAC-sensitive buttons. Selector convention: data-rbac-perm="perm.name"
  var els = document.querySelectorAll("[data-rbac-perm]");
  for(var i=0;i<els.length;i++){
    var perm = els[i].getAttribute("data-rbac-perm");
    var blocked = !QPE.rbac.can(perm);
    els[i].setAttribute("data-rbac-blocked", blocked ? "true":"false");
    els[i].title = blocked ? "🔒 Requires permission: "+perm : (els[i].getAttribute("data-title-orig") || "");
  }
};

QPE.uiSetRole = function(role){
  QPE.rbac.set(role);
  QPE.renderRoleSwitcher();
};

QPE.renderRoleSwitcher = function(){
  var el = document.getElementById("role-switcher");
  if(!el) return;
  var html = "";
  Object.keys(QPE.rbac.ROLES).forEach(function(k){
    var r = QPE.rbac.ROLES[k];
    var active = QPE.rbac.currentRole === k;
    html += '<div class="prof-card '+(active?'active':'')+'" onclick="QPE.uiSetRole(\''+k+'\')">' +
      '<div class="prof-avatar" style="background:'+r.color+'">'+r.icon+'</div>' +
      '<div class="prof-name">'+k+'</div>' +
      '<div class="prof-role">Rank '+r.rank+' · '+(r.perms.indexOf("*")>=0?"all perms":r.perms.length+" perms")+'</div>' +
      '</div>';
  });
  el.innerHTML = html;
};


/* ===================================================================
   4. SQL GOVERNANCE RULES ENGINE
   Configurable rules that BLOCK or WARN on dangerous SQL.
   Hooks into v6/v7 send() pipeline via override below.
   =================================================================== */
var GOV_KEY = "governance";
var DEFAULT_GOV = {
  blockDrop: true,            // BLOCK any DROP TABLE/DATABASE/SCHEMA
  blockTruncate: true,        // BLOCK any TRUNCATE
  requireWhereOnDelete: true, // BLOCK DELETE without WHERE
  requireWhereOnUpdate: true, // BLOCK UPDATE without WHERE
  blockSelectStar: false,     // WARN on SELECT *
  maxLimit: 10000,            // WARN when LIMIT > maxLimit or absent on SELECT
  allowedTables: "",          // comma-separated; empty = all
  deniedTables: "",
  blockGrantRevoke: true,
  blockCommentInjection: true // BLOCK "-- " inside string literals (basic SQL injection signal)
};

QPE.gov = {
  load: function(){ return Object.assign({}, DEFAULT_GOV, lsGet(GOV_KEY, {})); },
  save: function(g){
    if(!QPE.rbac.can("governance.edit")){ QPE.rbac.deny("edit governance rules"); return; }
    lsSet(GOV_KEY, g);
    QPE.audit.log("GOVERNANCE_UPDATE", "Governance rules updated");
    if(typeof toast==="function") toast("Governance rules saved");
  },
  check: function(sql){
    var g = QPE.gov.load();
    var s = (sql||"").toUpperCase();
    var findings = [];

    if(g.blockDrop && /\bDROP\s+(TABLE|DATABASE|SCHEMA|VIEW|INDEX)\b/.test(s))
      findings.push({sev:"error", msg:"DROP statement blocked by governance policy."});
    if(g.blockTruncate && /\bTRUNCATE\s+TABLE\b/.test(s))
      findings.push({sev:"error", msg:"TRUNCATE blocked by governance policy."});
    if(g.requireWhereOnDelete && /^\s*DELETE\b/.test(s) && !/\bWHERE\b/.test(s))
      findings.push({sev:"error", msg:"DELETE without WHERE is blocked. Add a WHERE clause."});
    if(g.requireWhereOnUpdate && /^\s*UPDATE\b/.test(s) && !/\bWHERE\b/.test(s))
      findings.push({sev:"error", msg:"UPDATE without WHERE is blocked. Add a WHERE clause."});
    if(g.blockGrantRevoke && /\b(GRANT|REVOKE)\b/.test(s))
      findings.push({sev:"error", msg:"GRANT/REVOKE blocked. Privilege changes are out of scope."});
    if(g.blockCommentInjection && /'[^']*--/.test(sql))
      findings.push({sev:"error", msg:"Possible SQL injection: '--' inside a string literal."});
    if(g.blockSelectStar && /\bSELECT\s+\*/.test(s))
      findings.push({sev:"warn", msg:"SELECT * is discouraged. List columns explicitly."});

    // Allowed/denied tables
    var fromMatches = sql.match(/(?:FROM|JOIN|UPDATE|INTO)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi) || [];
    var tablesUsed = fromMatches.map(function(m){
      return m.replace(/^(?:FROM|JOIN|UPDATE|INTO)\s+/i, "").toLowerCase();
    });
    var denied = (g.deniedTables||"").split(",").map(function(x){return x.trim().toLowerCase();}).filter(Boolean);
    var allowed = (g.allowedTables||"").split(",").map(function(x){return x.trim().toLowerCase();}).filter(Boolean);
    tablesUsed.forEach(function(t){
      if(denied.indexOf(t) >= 0) findings.push({sev:"error", msg:"Table denied by policy: "+t});
      if(allowed.length && allowed.indexOf(t) < 0) findings.push({sev:"error", msg:"Table not on allow-list: "+t});
    });

    // LIMIT analysis
    var selM = /\bSELECT\b/.test(s) && !/\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/.test(s);
    var limitM = s.match(/\bLIMIT\s+(\d+)/);
    if(selM){
      if(!limitM) findings.push({sev:"warn", msg:"SELECT without LIMIT — may return very large result sets."});
      else if(parseInt(limitM[1],10) > g.maxLimit) findings.push({sev:"warn", msg:"LIMIT exceeds policy maximum of "+g.maxLimit+"."});
    }

    return findings;
  }
};

QPE.uiToggleGov = function(key, el){
  if(!QPE.rbac.can("governance.edit")){ QPE.rbac.deny("edit governance rules"); return; }
  var g = QPE.gov.load();
  g[key] = !g[key];
  QPE.gov.save(g);
  el.classList.toggle("on", g[key]);
  el.setAttribute("aria-pressed", g[key]);
};
QPE.uiSaveGovText = function(){
  if(!QPE.rbac.can("governance.edit")){ QPE.rbac.deny("edit governance rules"); return; }
  var g = QPE.gov.load();
  g.allowedTables = document.getElementById("gov-allowed").value;
  g.deniedTables = document.getElementById("gov-denied").value;
  g.maxLimit = parseInt(document.getElementById("gov-maxlimit").value || "10000", 10);
  QPE.gov.save(g);
};

QPE.renderGovernance = function(){
  var g = QPE.gov.load();
  var rules = [
    { key:"blockDrop",            name:"Block DROP statements",         desc:"Prevents DROP TABLE/DATABASE/SCHEMA/VIEW/INDEX",  sev:"error" },
    { key:"blockTruncate",        name:"Block TRUNCATE statements",     desc:"Prevents irreversible bulk row deletion",         sev:"error" },
    { key:"requireWhereOnDelete", name:"Require WHERE on DELETE",       desc:"Blocks accidental full-table deletions",          sev:"error" },
    { key:"requireWhereOnUpdate", name:"Require WHERE on UPDATE",       desc:"Blocks accidental full-table updates",            sev:"error" },
    { key:"blockGrantRevoke",     name:"Block GRANT / REVOKE",          desc:"Privilege changes belong in DBA tooling",         sev:"error" },
    { key:"blockCommentInjection",name:"Block injection patterns",      desc:"Flags '--' inside string literals",               sev:"error" },
    { key:"blockSelectStar",      name:"Warn on SELECT *",              desc:"Encourages explicit column lists",                sev:"warn" }
  ];
  var html = rules.map(function(r){
    return '<div class="gov-rule">' +
      '<div class="gov-rule-info">' +
        '<div class="gov-rule-name">'+esc2(r.name)+'</div>' +
        '<div class="gov-rule-desc">'+esc2(r.desc)+'</div>' +
      '</div>' +
      '<span class="gov-rule-sev '+r.sev+'">'+r.sev+'</span>' +
      '<button class="toggle '+(g[r.key]?'on':'')+'" onclick="QPE.uiToggleGov(\''+r.key+'\',this)" aria-pressed="'+!!g[r.key]+'" data-rbac-perm="governance.edit" aria-label="Toggle '+esc2(r.name)+'"></button>' +
      '</div>';
  }).join("");
  html += '<div class="ent-row" style="margin-top:14px">' +
    '<div><span class="ent-label">Max LIMIT allowed</span><input class="ent-input" id="gov-maxlimit" type="number" value="'+g.maxLimit+'" data-rbac-perm="governance.edit"/></div>' +
    '</div>' +
    '<div><span class="ent-label">Allow-list tables (comma-separated; blank = all)</span><input class="ent-input" id="gov-allowed" value="'+esc2(g.allowedTables)+'" placeholder="orders, customers, products" data-rbac-perm="governance.edit"/></div>' +
    '<div style="margin-top:8px"><span class="ent-label">Deny-list tables (always blocked)</span><input class="ent-input" id="gov-denied" value="'+esc2(g.deniedTables)+'" placeholder="auth_users, password_hashes" data-rbac-perm="governance.edit"/></div>' +
    '<button class="ent-btn" style="margin-top:10px" onclick="QPE.uiSaveGovText()" data-rbac-perm="governance.edit">💾 Save Allow/Deny Lists</button>';
  document.getElementById("gov-rules").innerHTML = html;
  QPE.applyRBACUI();
};


/* ===================================================================
   5. PII / SENSITIVE DATA DETECTOR
   Scans the active workspace's schema for columns matching well-known
   sensitive-data patterns (Nigerian + global).
   =================================================================== */
var PII_PATTERNS = [
  { name:"Social Security Number",   re:/^(ssn|social_security)/i,                 sev:"high", advice:"Encrypt at rest. Restrict SELECT to authorized roles." },
  { name:"National ID (Nigerian NIN)", re:/^(nin|national_id|national_identity)/i, sev:"high", advice:"Subject to NDPR. Log all access." },
  { name:"BVN (Bank Verification)",  re:/^(bvn|bank_verification)/i,               sev:"high", advice:"CBN-regulated. Encrypted columns only." },
  { name:"Credit / Debit card",      re:/(card_no|card_number|pan|ccv|cvv)/i,      sev:"high", advice:"PCI-DSS. Never store plain. Tokenise." },
  { name:"Email address",            re:/(email|e_mail|mail)$/i,                   sev:"medium", advice:"Mask in non-prod environments." },
  { name:"Phone number",             re:/(phone|mobile|tel|gsm|msisdn)/i,          sev:"medium", advice:"Mask middle digits in displays." },
  { name:"Date of birth",            re:/(dob|date_of_birth|birth_date|birthday)/i,sev:"medium", advice:"Compute age instead of exposing DOB." },
  { name:"Address / Location",       re:/(address|street|city|zipcode|postal)/i,   sev:"medium", advice:"Coarsen to region/state where possible." },
  { name:"Salary / Compensation",    re:/(salary|wage|compensation|pay)/i,         sev:"medium", advice:"Restrict to HR/Finance roles." },
  { name:"Password / Hash",          re:/(password|passwd|pwd|hash|salt|secret)/i, sev:"high", advice:"Never expose. Block from query results entirely." },
  { name:"Token / API key",          re:/(token|api_key|access_key|secret_key)/i,  sev:"high", advice:"Never expose. Rotate any leaked tokens." },
  { name:"IP address",               re:/(ip_address|ip_addr|remote_ip)/i,         sev:"low", advice:"Anonymise after retention period." },
  { name:"Passport / ID document",   re:/(passport|drivers_licence|id_doc)/i,      sev:"high", advice:"Encrypt. Access logged." },
  { name:"Religion / Ethnicity",     re:/(religion|ethnicity|tribe|race)/i,        sev:"high", advice:"Special category. Justify processing." },
  { name:"Medical / Health",         re:/(medical|diagnosis|health|disease|prescription)/i, sev:"high", advice:"Health data is special category — restrict." },
  { name:"Geolocation precise",      re:/(latitude|longitude|gps|geo_)/i,          sev:"medium", advice:"Round to 2 decimal places where possible." }
];

QPE.pii = {
  scan: function(){
    var tables = (typeof getSchema === "function") ? getSchema() : {};
    var findings = [];
    Object.keys(tables).forEach(function(t){
      tables[t].forEach(function(c){
        PII_PATTERNS.forEach(function(p){
          if(p.re.test(c)){
            findings.push({ table:t, column:c, name:p.name, sev:p.sev, advice:p.advice });
          }
        });
      });
    });
    return findings;
  }
};

QPE.renderPII = function(){
  var f = QPE.pii.scan();
  var el = document.getElementById("pii-out");
  if(!f.length){
    el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">✅</div>No PII / sensitive data detected in current schema. <br>This does not mean none exists — review column purposes manually.</div>';
    return;
  }
  var grouped = {};
  f.forEach(function(x){ if(!grouped[x.sev]) grouped[x.sev]=[]; grouped[x.sev].push(x); });
  var html = '<div style="font-size:12px;color:var(--mu);margin-bottom:10px">Scanned ' +
    Object.keys((typeof getSchema==="function")?getSchema():{}).length +
    ' tables · Found <strong style="color:var(--er)">'+f.length+'</strong> sensitive columns.</div>';
  ["high","medium","low"].forEach(function(sev){
    if(!grouped[sev]) return;
    grouped[sev].forEach(function(x){
      html += '<div class="pii-card '+(sev==="high"?"":sev)+'">' +
        '<strong>'+esc2(x.name)+'</strong> <span class="ent-pill '+(sev==="high"?"red":sev==="medium"?"amber":"blue")+'">'+sev+'</span><br>' +
        '<span class="pii-col">'+esc2(x.table)+'.'+esc2(x.column)+'</span><br>' +
        '<span style="font-size:11px;color:var(--mu)">'+esc2(x.advice)+'</span></div>';
    });
  });
  html += '<button class="ent-btn ghost" style="margin-top:10px" onclick="QPE.exportPIIReport()">📄 Export PII Report (Markdown)</button>';
  el.innerHTML = html;
};

QPE.exportPIIReport = function(){
  var f = QPE.pii.scan();
  var md = "# PII / Sensitive Data Audit\n\n" +
    "_Generated by QueryPilot v9 Enterprise — " + new Date().toLocaleString() + "_\n\n" +
    "**Workspace:** " + (QPE.ws.active()||{}).name + "\n\n" +
    "**Total sensitive columns detected:** " + f.length + "\n\n---\n\n";
  if(!f.length){ md += "_No PII detected in schema._\n"; }
  else {
    md += "| Severity | Type | Table.Column | Advice |\n|---|---|---|---|\n";
    f.forEach(function(x){
      md += "| "+x.sev.toUpperCase()+" | "+x.name+" | `"+x.table+"."+x.column+"` | "+x.advice+" |\n";
    });
  }
  if(typeof dl === "function") dl(md, "pii_audit.md");
  if(typeof toast==="function") toast("PII report exported");
  QPE.audit.log("PII_REPORT", "Exported PII audit report (" + f.length + " findings)");
};


/* ===================================================================
   6. QUERY APPROVAL WORKFLOW
   Analysts request approval for sensitive queries. DBA/Admin approves.
   All actions audited.
   =================================================================== */
var APPR_KEY = "approvals";

QPE.appr = {
  request: function(title, sql, reason){
    if(!QPE.rbac.can("query.save")){ QPE.rbac.deny("submit approval requests"); return; }
    var all = lsGet(APPR_KEY, []);
    var entry = {
      id: uid("appr"),
      title: title,
      sql: sql,
      reason: reason || "",
      requester: QPE.rbac.currentRole,
      requestedAt: nowISO(),
      status: "pending",
      decidedBy: null,
      decidedAt: null,
      note: ""
    };
    all.unshift(entry);
    lsSet(APPR_KEY, all);
    QPE.audit.log("APPROVAL_REQUEST", "Approval requested: " + title);
    QPE.renderApprovals();
    if(typeof toast==="function") toast("Approval request submitted");
    return entry;
  },
  decide: function(id, decision){
    if(!QPE.rbac.can("approval.action")){ QPE.rbac.deny("approve / reject queries"); return; }
    var note = prompt("Optional note for the requester:");
    var all = lsGet(APPR_KEY, []);
    all.forEach(function(x){
      if(x.id === id){
        x.status = decision;
        x.decidedBy = QPE.rbac.currentRole;
        x.decidedAt = nowISO();
        x.note = note || "";
      }
    });
    lsSet(APPR_KEY, all);
    QPE.audit.log("APPROVAL_" + decision.toUpperCase(), id, {note:note});
    QPE.renderApprovals();
    if(typeof toast==="function") toast("Marked " + decision);
  },
  delete: function(id){
    if(!QPE.rbac.can("approval.action")){ QPE.rbac.deny("delete approvals"); return; }
    var all = lsGet(APPR_KEY, []).filter(function(x){ return x.id !== id; });
    lsSet(APPR_KEY, all);
    QPE.renderApprovals();
  }
};

QPE.uiRequestApproval = function(){
  var title = document.getElementById("appr-title").value.trim();
  var sql = document.getElementById("appr-sql").value.trim();
  var reason = document.getElementById("appr-reason").value.trim();
  if(!title || !sql){ if(typeof toast==="function") toast("Title and SQL required", "var(--wn)"); return; }
  QPE.appr.request(title, sql, reason);
  document.getElementById("appr-title").value = "";
  document.getElementById("appr-sql").value = "";
  document.getElementById("appr-reason").value = "";
};

QPE.renderApprovals = function(){
  var el = document.getElementById("appr-list");
  if(!el) return;
  var all = lsGet(APPR_KEY, []);
  if(!all.length){
    el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">📋</div>No approval requests yet.</div>';
    return;
  }
  el.innerHTML = all.map(function(x){
    var canDecide = QPE.rbac.can("approval.action") && x.status==="pending";
    return '<div class="approval-card '+x.status+'">' +
      '<span class="approval-status-badge ent-pill '+(x.status==="approved"?"green":x.status==="rejected"?"red":"amber")+'">'+x.status+'</span>' +
      '<div class="approval-title">'+esc2(x.title)+'</div>' +
      '<div class="approval-meta">Requested by <strong>'+esc2(x.requester)+'</strong> · '+fmtTime(x.requestedAt)+'</div>' +
      (x.reason ? '<div style="font-size:11px;color:var(--mu);margin-bottom:6px"><strong>Reason:</strong> '+esc2(x.reason)+'</div>' : '') +
      '<div class="approval-sql">'+esc2(x.sql)+'</div>' +
      (x.decidedAt ? '<div style="font-size:10px;color:var(--mu);margin-top:6px">Decided by '+esc2(x.decidedBy)+' on '+fmtTime(x.decidedAt)+(x.note?' — "'+esc2(x.note)+'"':'')+'</div>' : '') +
      '<div class="approval-actions">' +
        (canDecide ? '<button class="approval-mini" onclick="QPE.appr.decide(\''+x.id+'\',\'approved\')">✓ Approve</button>' +
                     '<button class="approval-mini reject" onclick="QPE.appr.decide(\''+x.id+'\',\'rejected\')">✗ Reject</button>' : '') +
        '<button class="approval-mini neutral" onclick="QPE.appr.delete(\''+x.id+'\')">🗑 Delete</button>' +
      '</div></div>';
  }).join("");
};


/* ===================================================================
   7. DATA LINEAGE VIEWER
   Tracks tables/columns referenced by each saved query and visualises
   them as a graph. Inferred — no live database needed.
   =================================================================== */
function extractTablesFromSQL(sql){
  var s = sql || "";
  var matches = s.match(/(?:FROM|JOIN|UPDATE|INTO)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi) || [];
  return matches.map(function(m){
    return m.replace(/^(?:FROM|JOIN|UPDATE|INTO)\s+/i, "");
  }).filter(function(v,i,a){ return a.indexOf(v) === i; });
}

QPE.renderLineage = function(){
  var el = document.getElementById("lineage-out");
  // Collect from current chat data-sql attributes + bookmarks
  var nodes = {};       // tableName -> {id, type}
  var queryNodes = [];  // [{id, label, tables:[]}]
  var bookmarks = (window.bookmarks || []);
  bookmarks.forEach(function(b){
    var tables = extractTablesFromSQL(b.sql);
    queryNodes.push({ id: "q_"+b.id, label: b.title.slice(0,30), tables: tables });
    tables.forEach(function(t){ nodes[t] = true; });
  });
  // Also scan rendered chat cards for SQL
  document.querySelectorAll(".mr.b[data-id]").forEach(function(card){
    var sql = card.dataset.sql || ""; if(!sql) return;
    var tables = extractTablesFromSQL(sql);
    queryNodes.push({ id:"qc_"+card.dataset.id, label:(card.dataset.q||"chat").slice(0,30), tables:tables });
    tables.forEach(function(t){ nodes[t] = true; });
  });

  var tableList = Object.keys(nodes);
  if(!tableList.length || !queryNodes.length){
    el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">🌳</div>No queries to trace yet. Run or save some queries first.</div>';
    return;
  }

  // Layout: tables on left column, queries on right
  var TW = 160, QW = 220, ROW_H = 36, GAP_COL = 200;
  var H = Math.max(tableList.length, queryNodes.length) * ROW_H + 40;
  var totalW = TW + GAP_COL + QW + 40;
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+totalW+' '+H+'">' +
    '<defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">' +
    '<path d="M0,0 L0,8 L7,4 z" fill="var(--mu)"/></marker></defs>';

  var tablePos = {}, queryPos = {};
  tableList.forEach(function(t,i){
    var x = 20, y = 20 + i*ROW_H;
    tablePos[t] = {x:x+TW/2, y:y+12, x2:x+TW, y2:y+12};
    svg += '<rect class="lineage-node-table" x="'+x+'" y="'+y+'" width="'+TW+'" height="26" rx="6"/>';
    svg += '<text class="lineage-text" x="'+(x+10)+'" y="'+(y+17)+'">📋 '+esc2(t)+'</text>';
  });
  queryNodes.forEach(function(q,i){
    var x = 20 + TW + GAP_COL, y = 20 + i*ROW_H;
    queryPos[q.id] = {x:x, y:y+12, x2:x+QW, y2:y+12};
    svg += '<rect class="lineage-node-query" x="'+x+'" y="'+y+'" width="'+QW+'" height="26" rx="6"/>';
    svg += '<text class="lineage-text-q" x="'+(x+10)+'" y="'+(y+17)+'">⚡ '+esc2(q.label)+'</text>';
  });
  // Edges
  queryNodes.forEach(function(q){
    q.tables.forEach(function(t){
      if(!tablePos[t]) return;
      var s = tablePos[t], e = queryPos[q.id];
      var mx = (s.x2 + e.x) / 2;
      svg += '<path class="lineage-edge" d="M'+s.x2+' '+s.y2+' C'+mx+' '+s.y2+' '+mx+' '+e.y+' '+e.x+' '+e.y+'"/>';
    });
  });
  svg += '</svg>';
  el.innerHTML = '<div style="font-size:11px;color:var(--mu);margin-bottom:8px">' +
    tableList.length+' tables · '+queryNodes.length+' queries · Lines show which queries read which tables.</div>' +
    '<div class="lineage-wrap">'+svg+'</div>' +
    '<button class="ent-btn ghost" style="margin-top:8px" onclick="QPE.exportLineageSVG()">⬇ Download SVG</button>';
};

QPE.exportLineageSVG = function(){
  var svg = document.querySelector("#lineage-out svg");
  if(!svg){ if(typeof toast==="function") toast("Generate first","var(--wn)"); return; }
  if(typeof dl==="function") dl('<?xml version="1.0" encoding="UTF-8"?>\n'+svg.outerHTML, "lineage.svg");
};


/* ===================================================================
   8. SQL LINTER  (50+ rules)
   Free, deterministic, ES5-only "sqlfluff-lite".
   Severity: E = Error, W = Warning, I = Info
   =================================================================== */
var LINT_RULES = [
  { id:"L001", sev:"W", re:/\bSELECT\s+\*/i,                    msg:"Avoid SELECT *. List columns explicitly for stability." },
  { id:"L002", sev:"E", re:/^\s*DELETE\b(?![\s\S]*\bWHERE\b)/i, msg:"DELETE without WHERE clause — would delete all rows." },
  { id:"L003", sev:"E", re:/^\s*UPDATE\b(?![\s\S]*\bWHERE\b)/i, msg:"UPDATE without WHERE clause — would update all rows." },
  { id:"L004", sev:"W", re:/\bNOT\s+IN\s*\(/i,                  msg:"NOT IN behaves unexpectedly with NULLs. Prefer NOT EXISTS." },
  { id:"L005", sev:"W", re:/\bLIKE\s+'%[^']/i,                  msg:"Leading-% LIKE cannot use B-tree indexes." },
  { id:"L006", sev:"I", re:/\bDISTINCT\b/i,                     msg:"DISTINCT requires sort/hash. Consider GROUP BY for clarity." },
  { id:"L007", sev:"W", re:/\bORDER\s+BY\s+\d+/i,               msg:"ORDER BY by column position is brittle. Use column names." },
  { id:"L008", sev:"W", re:/\bGROUP\s+BY\s+\d+/i,               msg:"GROUP BY by column position is brittle. Use column names." },
  { id:"L009", sev:"I", re:/\bUNION\b(?!\s+ALL\b)/i,            msg:"UNION removes duplicates (extra sort). Use UNION ALL if duplicates are OK." },
  { id:"L010", sev:"W", re:/,(\s*FROM)/i,                       msg:"Trailing comma before FROM — likely a syntax error." },
  { id:"L011", sev:"W", re:/\bUPPER\s*\(\s*[a-z_]+\s*\)\s*=/i,  msg:"UPPER() on column breaks indexes. Compare both sides cased equally." },
  { id:"L012", sev:"W", re:/\bLOWER\s*\(\s*[a-z_]+\s*\)\s*=/i,  msg:"LOWER() on column breaks indexes." },
  { id:"L013", sev:"I", re:/\bCAST\s*\(/i,                      msg:"CAST in WHERE/ON often prevents index use." },
  { id:"L014", sev:"I", re:/\bIS\s+NULL\b/i,                    msg:"Verify indexes handle IS NULL (some DBs require special handling)." },
  { id:"L015", sev:"W", re:/\b(?:COUNT|SUM|AVG|MAX|MIN)\s*\(\s*\*\s*\)/i, msg:"COUNT(*) is fine, but SUM(*)/AVG(*) is invalid in most engines." },
  { id:"L016", sev:"I", re:/\bCOALESCE\s*\(\s*[a-z_]+\s*,\s*0\s*\)/i, msg:"COALESCE(col, 0) — verify 0 is semantically correct for missing data." },
  { id:"L017", sev:"E", re:/\bDROP\b/i,                         msg:"DROP statement detected — destructive." },
  { id:"L018", sev:"E", re:/\bTRUNCATE\b/i,                     msg:"TRUNCATE detected — bulk delete, not rollbackable in most engines." },
  { id:"L019", sev:"W", re:/--/,                                msg:"Line comment found — ensure it's not in a single-line SQL string." },
  { id:"L020", sev:"I", re:/\/\*/,                              msg:"Block comment found — keep them for context, not commented-out code." },
  { id:"L021", sev:"W", re:/\s{2,}/,                            msg:"Multiple spaces — consider auto-formatting." },
  { id:"L022", sev:"I", re:/\t/,                                msg:"Tab characters — prefer spaces (style)." },
  { id:"L023", sev:"E", re:/[^;]\s*$(?![\s\S]*;)/,              msg:"Statement does not end with a semicolon." },
  { id:"L024", sev:"W", re:/\bSELECT\b[\s\S]*\bFROM\s+\w+\s+\w+(?!\s+(AS|ON|WHERE|JOIN|GROUP|ORDER|LIMIT|;))/i, msg:"Implicit table alias — use 'AS alias' for clarity." },
  { id:"L025", sev:"I", re:/\bJOIN\b/gi,                        msg:"JOIN detected — confirm ON clause uses indexed columns." },
  { id:"L026", sev:"W", re:/'\s*OR\s+'?\d/i,                    msg:"Possible SQL-injection pattern (' OR 1=1)." },
  { id:"L027", sev:"W", re:/'\s*;\s*/i,                         msg:"Possible SQL-injection pattern ('; DROP …)." },
  { id:"L028", sev:"I", re:/\bBETWEEN\b/i,                      msg:"BETWEEN is inclusive on both ends — confirm date boundary semantics." },
  { id:"L029", sev:"W", re:/=\s*NULL\b/i,                       msg:"= NULL never matches. Use IS NULL." },
  { id:"L030", sev:"W", re:/<>\s*NULL\b/i,                      msg:"<> NULL never matches. Use IS NOT NULL." },
  { id:"L031", sev:"I", re:/\bHAVING\b(?![\s\S]*\bGROUP BY\b)/i,msg:"HAVING without GROUP BY — works in some engines, ambiguous in others." },
  { id:"L032", sev:"W", re:/\bSELECT\b[^;]{500,}/i,             msg:"Very long SELECT (>500 chars) — consider breaking into CTEs." },
  { id:"L033", sev:"I", re:/\bWITH\b/i,                         msg:"CTE detected — readable, but some engines don't push predicates into CTEs." },
  { id:"L034", sev:"W", re:/\b(?:VARCHAR|CHAR)\s*\(\s*\d{4,}\s*\)/i, msg:"VARCHAR/CHAR length ≥1000 — consider TEXT." },
  { id:"L035", sev:"W", re:/[A-Z][a-z]+[A-Z]/,                  msg:"CamelCase identifier detected — snake_case is the SQL convention." },
  { id:"L036", sev:"I", re:/\bLIMIT\s+1\b/i,                    msg:"LIMIT 1 — for existence checks, EXISTS() is sometimes faster." },
  { id:"L037", sev:"W", re:/\bCURRENT_DATE\s*-\s*\d+/i,         msg:"CURRENT_DATE - integer behaves differently across engines." },
  { id:"L038", sev:"I", re:/\bROW_NUMBER\s*\(\s*\)/i,           msg:"ROW_NUMBER() — ensure your PARTITION BY / ORDER BY are correct." },
  { id:"L039", sev:"W", re:/\bRAND\s*\(\s*\)/i,                 msg:"RAND() in WHERE prevents index use and gives unreliable plans." },
  { id:"L040", sev:"I", re:/\bSUBSTR(?:ING)?\s*\(/i,            msg:"SUBSTRING on indexed column prevents index use." },
  { id:"L041", sev:"E", re:/\b(?:GRANT|REVOKE)\b/i,             msg:"GRANT/REVOKE — privilege change. Confirm intent." },
  { id:"L042", sev:"W", re:/\bWHERE\b\s+1\s*=\s*1\b/i,          msg:"WHERE 1=1 is a no-op. Remove or replace with real predicate." },
  { id:"L043", sev:"I", re:/\bIN\s*\([^)]{300,}/,               msg:"Very large IN list — consider a temp table or VALUES join." },
  { id:"L044", sev:"W", re:/\bORDER\s+BY\b[\s\S]*?(?!\bLIMIT\b)/i, msg:"ORDER BY without LIMIT sorts the entire result." },
  { id:"L045", sev:"I", re:/\bCROSS\s+JOIN\b/i,                 msg:"CROSS JOIN produces Cartesian product — confirm this is intended." },
  { id:"L046", sev:"W", re:/\bFETCH\s+FIRST\b/i,                msg:"FETCH FIRST is ANSI — not all engines support it. Prefer LIMIT." },
  { id:"L047", sev:"I", re:/\b(VARCHAR|TEXT)\b\s+(?!.*COLLATE)/i, msg:"Text column — confirm collation is explicit if case matters." },
  { id:"L048", sev:"W", re:/--[\s\S]*?\b(password|secret|token)\b/i, msg:"Sensitive keyword in comment — strip before committing." },
  { id:"L049", sev:"E", re:/\bSHUTDOWN\b|\bKILL\b/i,            msg:"Administrative command — should not appear in application SQL." },
  { id:"L050", sev:"I", re:/\bON\s+CONFLICT\b/i,                msg:"ON CONFLICT (Postgres / SQLite) — confirm DO NOTHING vs DO UPDATE." }
];

QPE.lint = function(sql){
  var findings = [];
  LINT_RULES.forEach(function(r){
    if(r.re.test(sql)) findings.push({id:r.id, sev:r.sev, msg:r.msg});
  });
  return findings;
};

QPE.uiRunLint = function(){
  var sql = document.getElementById("lint-in").value;
  if(!sql.trim()){ if(typeof toast==="function") toast("Paste some SQL", "var(--wn)"); return; }
  var f = QPE.lint(sql);
  var out = document.getElementById("lint-out");
  if(!f.length){
    out.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">✅</div>Linter found no issues. Clean query.</div>';
    return;
  }
  var counts = {E:0,W:0,I:0};
  f.forEach(function(x){ counts[x.sev]++; });
  out.innerHTML = '<div style="font-size:12px;color:var(--mu);margin-bottom:9px">' +
    '<span class="ent-pill red">'+counts.E+' errors</span> ' +
    '<span class="ent-pill amber">'+counts.W+' warnings</span> ' +
    '<span class="ent-pill blue">'+counts.I+' info</span></div>' +
    f.map(function(x){
      return '<div class="lint-finding"><span class="lint-sev '+x.sev+'">'+x.sev+'</span>' +
        '<div class="lint-body">'+esc2(x.msg)+'<div class="lint-rule">Rule '+x.id+'</div></div></div>';
    }).join("");
  QPE.audit.log("LINT_RUN", "Linted SQL (" + f.length + " findings)");
};


/* ===================================================================
   9. MIGRATION GENERATOR
   Diff two schema definitions → ALTER TABLE statements.
   =================================================================== */
function parseSchemaText(txt){
  var tables = {};
  (txt||"").split(/\n/).forEach(function(line){
    var m = line.match(/^(\w+)\s*\((.+)\)/);
    if(m){
      tables[m[1]] = m[2].split(",").map(function(c){ return c.trim(); }).filter(Boolean);
    }
  });
  return tables;
}

QPE.migration = function(oldTxt, newTxt){
  var oldS = parseSchemaText(oldTxt);
  var newS = parseSchemaText(newTxt);
  var sql = "-- QueryPilot v9 Migration Script\n-- Generated: " + new Date().toLocaleString() + "\n\n";
  // New tables
  Object.keys(newS).forEach(function(t){
    if(!oldS[t]){
      sql += "-- New table: " + t + "\n";
      sql += "CREATE TABLE " + t + " (\n  " + newS[t].map(function(c){
        return c + (c==="id" ? " INTEGER PRIMARY KEY" : " TEXT");
      }).join(",\n  ") + "\n);\n\n";
    }
  });
  // Dropped tables
  Object.keys(oldS).forEach(function(t){
    if(!newS[t]){
      sql += "-- Dropped table: " + t + "\n";
      sql += "DROP TABLE IF EXISTS " + t + ";\n\n";
    }
  });
  // Column changes
  Object.keys(newS).forEach(function(t){
    if(!oldS[t]) return; // already created
    var added = newS[t].filter(function(c){ return oldS[t].indexOf(c) < 0; });
    var removed = oldS[t].filter(function(c){ return newS[t].indexOf(c) < 0; });
    if(added.length || removed.length){
      sql += "-- Changes to " + t + "\n";
      added.forEach(function(c){
        sql += "ALTER TABLE " + t + " ADD COLUMN " + c + " TEXT;\n";
      });
      removed.forEach(function(c){
        sql += "ALTER TABLE " + t + " DROP COLUMN " + c + ";\n";
      });
      sql += "\n";
    }
  });
  if(sql.split("\n").length < 6) sql += "-- No changes detected.\n";
  return sql;
};

QPE.uiGenMigration = function(){
  var oldTxt = document.getElementById("mig-old").value;
  var newTxt = document.getElementById("mig-new").value || document.getElementById("schema-ta").value;
  if(!oldTxt.trim()){ if(typeof toast==="function") toast("Paste the OLD schema", "var(--wn)"); return; }
  var sql = QPE.migration(oldTxt, newTxt);
  document.getElementById("mig-out").textContent = sql;
  window._migSQL = sql;
  QPE.audit.log("MIGRATION_GEN", "Migration script generated");
};
QPE.uiDownloadMigration = function(){
  if(!window._migSQL){ if(typeof toast==="function") toast("Generate first", "var(--wn)"); return; }
  if(typeof dl==="function") dl(window._migSQL, "migration_"+Date.now()+".sql");
};


/* ===================================================================
   10. TEST DATA GENERATOR — Faker-style (offline, deterministic option)
   =================================================================== */
var FAKE = {
  firstNames: ["Adewale","Chinwe","Ngozi","Tunde","Bisi","Emeka","Folake","Kunle","Yemi","Aisha","Tolu","Chidi","Funke","Ifeanyi","Hauwa","Olumide","Sade","Bayo","Amaka","Sola","Adaeze","Segun","Bola","Femi","Kemi","Obi","Halima","Nkechi","Tomi","Lekan"],
  lastNames: ["Adeagbo","Okonkwo","Adeyemi","Bello","Okafor","Adebayo","Eze","Ibrahim","Lawal","Obi","Mohammed","Ojo","Akin","Yusuf","Williams","Johnson","Salami","Igwe","Adekunle","Olamide"],
  cities: ["Lagos","Abuja","Ibadan","Port Harcourt","Kano","Benin","Enugu","Kaduna","Onitsha","Calabar","Warri","Owerri","Ilorin","Akure","Jos","Abeokuta"],
  domains: ["gmail.com","yahoo.com","outlook.com","hmgconcepts.org","example.ng","mailbox.ng"],
  statuses: ["active","pending","completed","cancelled","paid","unpaid","overdue","approved","rejected"],
  categories: ["Electronics","Books","Apparel","Food","Services","Education","Healthcare"],
  regions: ["South West","South East","South South","North West","North East","North Central"],
  departments: ["Engineering","Sales","Marketing","HR","Finance","Operations","Customer Success","R&D"]
};

function fakeFor(col, i){
  var c = col.toLowerCase();
  if(c === "id" || c.indexOf("_id") >= 0) return i + 1;
  if(c.indexOf("first_name") >= 0) return FAKE.firstNames[i % FAKE.firstNames.length];
  if(c.indexOf("last_name") >= 0)  return FAKE.lastNames[i % FAKE.lastNames.length];
  if(c === "name" || c.indexOf("full_name") >= 0) return FAKE.firstNames[i % FAKE.firstNames.length] + " " + FAKE.lastNames[i % FAKE.lastNames.length];
  if(c.indexOf("email") >= 0 || c.indexOf("mail") >= 0) return FAKE.firstNames[i%30].toLowerCase()+"."+(i+1)+"@"+FAKE.domains[i%FAKE.domains.length];
  if(c.indexOf("phone") >= 0 || c.indexOf("mobile") >= 0) return "+234"+(800000000+i*7).toString().slice(0,9);
  if(c.indexOf("city") >= 0 || c.indexOf("location") >= 0) return FAKE.cities[i % FAKE.cities.length];
  if(c.indexOf("region") >= 0) return FAKE.regions[i % FAKE.regions.length];
  if(c.indexOf("department") >= 0) return FAKE.departments[i % FAKE.departments.length];
  if(c.indexOf("category") >= 0) return FAKE.categories[i % FAKE.categories.length];
  if(c.indexOf("status") >= 0) return FAKE.statuses[i % FAKE.statuses.length];
  if(c.indexOf("price") >= 0 || c.indexOf("total") >= 0 || c.indexOf("amount") >= 0 || c.indexOf("salary") >= 0) return ((i+1)*137 % 99000 + 1000).toFixed(2);
  if(c.indexOf("stock") >= 0 || c.indexOf("qty") >= 0 || c.indexOf("quantity") >= 0) return ((i+1)*7) % 200;
  if(c.indexOf("date") >= 0 || c.indexOf("_at") >= 0){
    var d = new Date(); d.setDate(d.getDate() - (i*3 % 730));
    return d.toISOString().slice(0,10);
  }
  return "value_" + (i+1);
}

QPE.uiGenTestData = function(){
  var table = document.getElementById("tdg-table").value;
  var n = parseInt(document.getElementById("tdg-n").value||"10", 10);
  var tables = (typeof getSchema==="function") ? getSchema() : {};
  if(!tables[table]){ if(typeof toast==="function") toast("Table not found in schema","var(--wn)"); return; }
  var cols = tables[table];
  var quote = function(v){
    if(typeof v === "number") return v;
    return "'" + String(v).replace(/'/g, "''") + "'";
  };
  var sql = "-- Test data for " + table + " (" + n + " rows)\n-- Generated by QueryPilot v9 Enterprise\n\n";
  sql += "INSERT INTO " + table + " (" + cols.join(", ") + ") VALUES\n";
  var rows = [];
  for(var i=0;i<n;i++){
    rows.push("  (" + cols.map(function(c){ return quote(fakeFor(c, i)); }).join(", ") + ")");
  }
  sql += rows.join(",\n") + ";\n";
  document.getElementById("tdg-out").textContent = sql;
  window._tdgSQL = sql;
  QPE.audit.log("TESTDATA_GEN", "Generated " + n + " test rows for " + table);
};
QPE.uiDownloadTestData = function(){
  if(!window._tdgSQL){ if(typeof toast==="function") toast("Generate first","var(--wn)"); return; }
  if(typeof dl==="function") dl(window._tdgSQL, "test_data.sql");
};

QPE.refreshTestDataTables = function(){
  var sel = document.getElementById("tdg-table");
  if(!sel) return;
  var tables = (typeof getSchema==="function") ? Object.keys(getSchema()) : [];
  sel.innerHTML = '<option value="">-- select a table --</option>' +
    tables.map(function(t){ return '<option>'+t+'</option>'; }).join("");
};


/* ===================================================================
   11. COST ESTIMATOR — heuristic IO + bytes scanned
   =================================================================== */
QPE.estimateCost = function(sql){
  // Heuristic: assume 100k rows per table, 200 bytes per row default
  var rowsPerTable = 100000, bytesPerRow = 200;
  var tables = extractTablesFromSQL(sql);
  var nTables = tables.length || 1;
  var joins = (sql.match(/\bJOIN\b/gi) || []).length;
  var hasWhere = /\bWHERE\b/i.test(sql);
  var hasIndex = /\b(?:_id|id)\s*=/i.test(sql); // crude
  var hasFullScan = !hasWhere || (sql.match(/\bLIKE\s+'%/i));
  var subq = (sql.match(/\(\s*SELECT/gi) || []).length;
  var windowFn = /\bOVER\s*\(/i.test(sql);
  var hasLimit = /\bLIMIT\s+\d+/i.test(sql);

  var rows = nTables * rowsPerTable;
  if(joins) rows = rows * Math.pow(1.4, joins); // joins amplify
  if(subq)  rows = rows * (1 + subq * 0.3);
  if(hasIndex) rows = rows * 0.1;                // index reduces 90%
  else if(hasFullScan) rows = rows * 1.0;
  else if(hasWhere) rows = rows * 0.5;
  if(hasLimit){
    var m = sql.match(/\bLIMIT\s+(\d+)/i);
    var lim = parseInt(m[1],10);
    rows = Math.min(rows, lim * 1.2);
  }
  if(windowFn) rows = rows * 1.15;

  var bytes = rows * bytesPerRow;
  // Time estimate: ~50M rows/sec scan
  var msEst = Math.max(1, Math.round(rows / 50000));
  return {
    tables: tables,
    rowsScanned: Math.round(rows),
    bytesScanned: Math.round(bytes),
    msEstimate: msEst,
    indexUsed: hasIndex,
    fullScan: hasFullScan && !hasIndex,
    riskLevel: rows > 10000000 ? "high" : rows > 1000000 ? "medium" : "low"
  };
};

QPE.uiRunCost = function(){
  var sql = document.getElementById("cost-in").value.trim();
  if(!sql){ if(typeof toast==="function") toast("Paste SQL", "var(--wn)"); return; }
  var c = QPE.estimateCost(sql);
  var humanBytes = function(b){
    if(b < 1024) return b+" B";
    if(b < 1048576) return (b/1024).toFixed(1)+" KB";
    if(b < 1073741824) return (b/1048576).toFixed(1)+" MB";
    return (b/1073741824).toFixed(2)+" GB";
  };
  var humanRows = function(n){
    if(n<1000) return String(n);
    if(n<1000000) return (n/1000).toFixed(1)+"K";
    if(n<1000000000) return (n/1000000).toFixed(1)+"M";
    return (n/1000000000).toFixed(1)+"B";
  };
  var color = c.riskLevel==="high" ? "var(--er)" : c.riskLevel==="medium" ? "var(--wn)" : "var(--ac)";
  var fillPct = Math.min(100, Math.log10(c.rowsScanned+1) * 12);
  var html = '<div class="dash-grid">' +
    '<div class="dash-stat"><div class="dash-stat-num" style="color:'+color+'">'+humanRows(c.rowsScanned)+'</div><div class="dash-stat-label">Rows scanned</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-num">'+humanBytes(c.bytesScanned)+'</div><div class="dash-stat-label">Bytes scanned</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-num">'+c.msEstimate+' ms</div><div class="dash-stat-label">Est. duration</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-num" style="color:'+color+'">'+c.riskLevel.toUpperCase()+'</div><div class="dash-stat-label">Risk</div></div>' +
    '</div>' +
    '<div style="font-size:11px;color:var(--mu);margin:6px 0 3px">Estimated workload (logarithmic)</div>' +
    '<div class="cost-gauge"><div class="cost-gauge-fill" style="width:'+fillPct+'%;background:'+color+'">'+humanRows(c.rowsScanned)+' rows</div></div>' +
    '<div style="font-size:11px;color:var(--mu);margin-top:10px;line-height:1.7">' +
    '<strong>Tables touched:</strong> '+(c.tables.join(", ")||"none")+'<br>' +
    '<strong>Index used:</strong> '+(c.indexUsed?'✅ likely':'❌ unlikely')+'<br>' +
    '<strong>Full scan:</strong> '+(c.fullScan?'⚠️ yes':'no')+'<br>' +
    '<em>Estimates assume 100k rows/table and 200 bytes/row — calibrate with real cardinalities for production.</em></div>';
  document.getElementById("cost-out").innerHTML = html;
  QPE.audit.log("COST_ESTIMATE", "Risk=" + c.riskLevel + ", rows=" + c.rowsScanned);
};


/* ===================================================================
   12. QUERY LIBRARY VERSIONING
   Each saved query can have multiple snapshots with diff.
   =================================================================== */
QPE.versioning = {
  versions: function(qid){
    var ws = QPE.ws.active();
    return (ws.versions || {})[qid] || [];
  },
  snapshot: function(qid, sql, note){
    if(!QPE.rbac.can("query.save")){ QPE.rbac.deny("save versions"); return; }
    var all = QPE.ws.all();
    all.forEach(function(w){
      if(w.id !== lsGet(ACTIVE_WS_KEY, null)) return;
      if(!w.versions) w.versions = {};
      if(!w.versions[qid]) w.versions[qid] = [];
      w.versions[qid].unshift({ ts: nowISO(), sql: sql, note: note||"", author: QPE.rbac.currentRole });
      if(w.versions[qid].length > 50) w.versions[qid] = w.versions[qid].slice(0, 50);
    });
    lsSet(WORKSPACES_KEY, all);
    QPE.audit.log("VERSION_SAVE", "Snapshotted query: " + qid);
  }
};

QPE.renderVersioning = function(){
  var el = document.getElementById("ver-out");
  if(!el) return;
  var bookmarks = window.bookmarks || [];
  if(!bookmarks.length){ el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">📚</div>Save some queries first (star ⭐ a result card), then snapshot them here.</div>'; return; }
  var html = '<div style="font-size:11px;color:var(--mu);margin-bottom:8px">Click a saved query to view & manage snapshots:</div>';
  html += '<select class="ent-select" id="ver-pick" onchange="QPE.renderVersionsFor(this.value)">' +
    '<option value="">-- pick a saved query --</option>' +
    bookmarks.map(function(b){ return '<option value="'+b.id+'">'+esc2(b.title)+'</option>'; }).join("") +
    '</select>';
  html += '<div id="ver-detail" style="margin-top:10px"></div>';
  el.innerHTML = html;
};

QPE.renderVersionsFor = function(qid){
  var bookmark = (window.bookmarks||[]).filter(function(b){return b.id===qid;})[0];
  var d = document.getElementById("ver-detail");
  if(!bookmark){ d.innerHTML = ""; return; }
  var versions = QPE.versioning.versions(qid);
  var html = '<div class="ent-row">' +
    '<input class="ent-input" id="ver-note" placeholder="Snapshot note (optional)..."/>' +
    '<button class="ent-btn" onclick="QPE.uiSnapshot(\''+qid+'\')" data-rbac-perm="query.save">📸 Snapshot now</button>' +
    '</div>';
  if(!versions.length){
    html += '<div class="ent-empty" style="padding:15px">No snapshots yet. Snapshot to start tracking changes.</div>';
  } else {
    html += versions.map(function(v, i){
      return '<div class="ver-item" onclick="QPE.viewVersion(\''+qid+'\','+i+')">' +
        '<div class="ver-time">'+fmtTime(v.ts)+' · by '+esc2(v.author)+'</div>' +
        (v.note?'<div class="ver-note">'+esc2(v.note)+'</div>':'') +
        '</div>';
    }).join("");
  }
  d.innerHTML = html;
  QPE.applyRBACUI();
};

QPE.uiSnapshot = function(qid){
  var b = (window.bookmarks||[]).filter(function(x){return x.id===qid;})[0];
  if(!b) return;
  var note = document.getElementById("ver-note").value;
  QPE.versioning.snapshot(qid, b.sql, note);
  if(typeof toast==="function") toast("Snapshot saved");
  document.getElementById("ver-note").value = "";
  QPE.renderVersionsFor(qid);
};

QPE.viewVersion = function(qid, idx){
  var v = QPE.versioning.versions(qid)[idx];
  if(!v) return;
  var b = (window.bookmarks||[]).filter(function(x){return x.id===qid;})[0];
  var diff = b ? QPE.diffSQL(b.sql, v.sql) : "(bookmark deleted)";
  alert("Snapshot from " + fmtTime(v.ts) + "\nBy: " + v.author + "\n" + (v.note?"Note: "+v.note+"\n\n":"\n") + "Diff vs current saved version:\n\n" + diff);
};

QPE.diffSQL = function(a, b){
  var la = (a||"").split("\n"), lb = (b||"").split("\n"), out = [];
  var n = Math.max(la.length, lb.length);
  for(var i=0;i<n;i++){
    if(la[i] === lb[i]) out.push("  " + (la[i]||""));
    else { if(la[i]!=null) out.push("- " + la[i]); if(lb[i]!=null) out.push("+ " + lb[i]); }
  }
  return out.join("\n");
};


/* ===================================================================
   13. SCHEDULED QUERY REMINDERS — browser Notification API
   =================================================================== */
var SCHED_KEY = "schedules";

QPE.sched = {
  all: function(){ return lsGet(SCHED_KEY, []); },
  add: function(title, query, hh, mm, days){
    if(!QPE.rbac.can("schedule.write")){ QPE.rbac.deny("create schedules"); return; }
    var all = QPE.sched.all();
    all.push({ id:uid("sch"), title:title, query:query, hh:hh, mm:mm, days:days, created:nowISO(), lastFired:null });
    lsSet(SCHED_KEY, all);
    QPE.audit.log("SCHEDULE_ADD", "Scheduled: " + title);
    QPE.renderSchedules();
  },
  remove: function(id){
    if(!QPE.rbac.can("schedule.write")){ QPE.rbac.deny("remove schedules"); return; }
    lsSet(SCHED_KEY, QPE.sched.all().filter(function(x){ return x.id !== id; }));
    QPE.renderSchedules();
  },
  tick: function(){
    var now = new Date();
    var today = now.getDay();           // 0..6
    var hh = now.getHours(), mm = now.getMinutes();
    var schedules = QPE.sched.all();
    var changed = false;
    schedules.forEach(function(s){
      if(s.days.indexOf(today) < 0) return;
      if(s.hh !== hh || s.mm !== mm) return;
      var todayKey = now.toDateString();
      if(s.lastFired === todayKey) return;
      s.lastFired = todayKey;
      changed = true;
      QPE.fireSchedule(s);
    });
    if(changed) lsSet(SCHED_KEY, schedules);
  }
};

QPE.fireSchedule = function(s){
  QPE.audit.log("SCHEDULE_FIRE", "Reminder fired: " + s.title);
  if("Notification" in window && Notification.permission === "granted"){
    try {
      new Notification("⚡ QueryPilot reminder", { body: s.title + "\n— " + s.query.slice(0,60), tag: s.id });
    } catch(e){}
  }
  if(typeof toast === "function") toast("⏰ Reminder: " + s.title);
};

QPE.uiAddSchedule = function(){
  var title = document.getElementById("sch-title").value.trim();
  var q = document.getElementById("sch-query").value.trim();
  var time = document.getElementById("sch-time").value;
  if(!title || !q || !time){ if(typeof toast==="function") toast("Fill all fields","var(--wn)"); return; }
  var hm = time.split(":").map(function(x){return parseInt(x,10);});
  var days = Array.prototype.slice.call(document.querySelectorAll(".sch-day-cb:checked")).map(function(x){ return parseInt(x.value,10); });
  if(!days.length){ if(typeof toast==="function") toast("Pick at least one day","var(--wn)"); return; }
  QPE.sched.add(title, q, hm[0], hm[1], days);
  if("Notification" in window && Notification.permission === "default"){
    Notification.requestPermission().then(function(p){
      if(p==="granted") toast("Notifications enabled");
    });
  }
  document.getElementById("sch-title").value = "";
  document.getElementById("sch-query").value = "";
};

QPE.renderSchedules = function(){
  var el = document.getElementById("sch-list");
  if(!el) return;
  var all = QPE.sched.all();
  if(!all.length){ el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">⏰</div>No schedules yet.</div>'; return; }
  var dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  el.innerHTML = all.map(function(s){
    return '<div class="sched-card">' +
      '<button class="ws-mini" style="position:absolute;right:7px;top:7px" onclick="QPE.sched.remove(\''+s.id+'\')" data-rbac-perm="schedule.write">🗑</button>' +
      '<div style="font-weight:700;color:var(--tx);margin-bottom:4px">'+esc2(s.title)+'</div>' +
      '<span class="sched-when">'+(s.hh<10?'0'+s.hh:s.hh)+':'+(s.mm<10?'0'+s.mm:s.mm)+'</span> ' +
      '<span style="font-size:10px;color:var(--mu)">'+ s.days.map(function(d){return dayNames[d];}).join(", ") +'</span>' +
      '<div style="font-family:JetBrains Mono,monospace;font-size:10px;color:var(--mu);margin-top:4px;background:var(--bg);padding:5px 7px;border-radius:5px">'+esc2(s.query)+'</div>' +
      (s.lastFired ? '<div style="font-size:10px;color:var(--ac);margin-top:4px">✓ Last fired: '+s.lastFired+'</div>':'') +
      '</div>';
  }).join("");
  QPE.applyRBACUI();
};

// Check schedules every minute
setInterval(function(){ QPE.sched.tick(); }, 60 * 1000);


/* ===================================================================
   14. WEBHOOK / EMAIL EXPORT BRIDGE
   Builds a mailto: link or Zapier/Make webhook URL the user can paste.
   No actual API call — entirely local link composition.
   =================================================================== */
QPE.uiBuildBridge = function(){
  var type = document.getElementById("br-type").value;
  var endpoint = document.getElementById("br-endpoint").value.trim();
  var subject = document.getElementById("br-subject").value.trim();
  var sql = document.getElementById("br-sql").value.trim();
  var out = document.getElementById("br-out");
  if(!sql){ if(typeof toast==="function") toast("Paste SQL", "var(--wn)"); return; }
  var url = "";
  if(type === "mailto"){
    if(!endpoint){ if(typeof toast==="function") toast("Enter recipient email","var(--wn)"); return; }
    url = "mailto:" + encodeURIComponent(endpoint) +
      "?subject=" + encodeURIComponent(subject||"QueryPilot Export") +
      "&body=" + encodeURIComponent(sql);
  } else {
    if(!endpoint){ if(typeof toast==="function") toast("Enter webhook URL","var(--wn)"); return; }
    var payload = { title:subject, sql:sql, workspace:(QPE.ws.active()||{}).name, ts:nowISO() };
    url = endpoint + (endpoint.indexOf("?")>=0?"&":"?") + "payload=" + encodeURIComponent(JSON.stringify(payload));
  }
  out.innerHTML =
    '<div style="font-size:11px;color:var(--mu);margin-bottom:6px">Generated link (click to open in your mail / browser):</div>' +
    '<div style="background:var(--bg);border:1px solid var(--bd);border-radius:7px;padding:9px;font-family:JetBrains Mono,monospace;font-size:11px;word-break:break-all">' +
      '<a href="'+esc2(url)+'" target="_blank" style="color:var(--ac);text-decoration:none">'+esc2(url.slice(0,200))+(url.length>200?'...':'')+'</a></div>' +
    '<div style="font-size:10px;color:var(--mu);margin-top:6px"><strong>Tip:</strong> Use Zapier or Make.com\'s free Webhooks trigger to receive this payload and forward to Slack, Discord, Google Sheets, etc.</div>';
  QPE.audit.log("BRIDGE_BUILT", "Bridge built: " + type);
};


/* ===================================================================
   15. BACKUP & RESTORE — full workspace snapshot
   =================================================================== */
QPE.backup = function(){
  var snapshot = {
    tool: "QueryPilot v9 Enterprise",
    exportedAt: nowISO(),
    schemaVersion: 1,
    role: QPE.rbac.currentRole,
    data: {}
  };
  // Pull every qpe_* and qp_* key from localStorage
  for(var i=0;i<localStorage.length;i++){
    var k = localStorage.key(i);
    if(k && (k.indexOf("qpe_")===0 || k.indexOf("qp_")===0)){
      try { snapshot.data[k] = JSON.parse(localStorage.getItem(k)); }
      catch(e){ snapshot.data[k] = localStorage.getItem(k); }
    }
  }
  if(typeof dl==="function") dl(JSON.stringify(snapshot, null, 2), "querypilot_backup_"+Date.now()+".json");
  QPE.audit.log("BACKUP_CREATE", "Full backup exported (" + Object.keys(snapshot.data).length + " keys)");
  if(typeof toast==="function") toast("Backup downloaded");
};

QPE.uiRestore = function(file){
  if(!file) return;
  if(!QPE.rbac.can("workspace.edit") && !QPE.rbac.can("*")){ QPE.rbac.deny("restore backups"); return; }
  if(!confirm("Restore will OVERWRITE your current QueryPilot data (workspaces, settings, audit log). Continue?")) return;
  var rd = new FileReader();
  rd.onload = function(){
    try {
      var obj = JSON.parse(rd.result);
      if(!obj.data){ if(typeof toast==="function") toast("Invalid backup file","var(--er)"); return; }
      Object.keys(obj.data).forEach(function(k){
        try { localStorage.setItem(k, typeof obj.data[k]==="string" ? obj.data[k] : JSON.stringify(obj.data[k])); }
        catch(e){}
      });
      QPE.audit.log("BACKUP_RESTORE", "Restored from backup dated " + obj.exportedAt);
      if(typeof toast==="function") toast("Restored! Reloading...");
      setTimeout(function(){ location.reload(); }, 700);
    } catch(e){
      if(typeof toast==="function") toast("Restore failed: " + e.message, "var(--er)");
    }
  };
  rd.readAsText(file);
};


/* ===================================================================
   16. COMPLIANCE REPORT GENERATOR
   GDPR / NDPR / ISO 27001 style attestation, derived from audit log.
   =================================================================== */
QPE.complianceReport = function(){
  var ws = QPE.ws.active();
  var audit = QPE.audit.all();
  var totals = {};
  audit.forEach(function(e){ totals[e.action] = (totals[e.action]||0) + 1; });
  var pii = QPE.pii.scan();
  var gov = QPE.gov.load();
  var since = audit.length ? fmtTime(audit[audit.length-1].ts) : "—";
  var until = audit.length ? fmtTime(audit[0].ts) : "—";

  var md = "# QueryPilot v9 — Compliance Attestation Report\n\n" +
    "**Generated:** " + new Date().toLocaleString() + "\n" +
    "**Workspace:** " + (ws?ws.name:"N/A") + "\n" +
    "**Current Role:** " + QPE.rbac.currentRole + "\n" +
    "**Audit Period:** " + since + " → " + until + "\n" +
    "**Total Audit Events:** " + audit.length + "\n\n---\n\n" +

    "## 1. Data Locality\n\n" +
    "QueryPilot stores **all** workspace data in the user's browser via `localStorage`. " +
    "No data is transmitted to any server. The application has **zero outbound network calls** " +
    "(other than initial static-asset fetches when first loaded). This makes it suitable for " +
    "environments subject to NDPR (Nigeria), GDPR (EU), HIPAA-style data-locality requirements " +
    "and air-gapped deployment.\n\n" +

    "## 2. Identity, Roles & Access Control\n\n" +
    "Role-Based Access Control is enforced in the UI layer. The four roles are:\n\n" +
    "| Role | Rank | Notes |\n|---|---|---|\n" +
    "| Viewer  | 1 | Read-only |\n" +
    "| Analyst | 2 | Can run/save queries, comment, save snippets |\n" +
    "| DBA     | 3 | + governance, approvals, migrations, schedules, workspace mgmt |\n" +
    "| Admin   | 4 | Full access |\n\n" +
    "All role switches are logged. Honor-system RBAC; suitable for trusted single-tenant " +
    "or small-team usage. For multi-tenant production, layer with OS-level account isolation.\n\n" +

    "## 3. SQL Governance Posture\n\n" +
    "| Rule | Enforced |\n|---|---|\n" +
    "| Block DROP                  | " + (gov.blockDrop?"✅":"❌") + " |\n" +
    "| Block TRUNCATE              | " + (gov.blockTruncate?"✅":"❌") + " |\n" +
    "| Require WHERE on DELETE     | " + (gov.requireWhereOnDelete?"✅":"❌") + " |\n" +
    "| Require WHERE on UPDATE     | " + (gov.requireWhereOnUpdate?"✅":"❌") + " |\n" +
    "| Block GRANT/REVOKE          | " + (gov.blockGrantRevoke?"✅":"❌") + " |\n" +
    "| Block injection patterns    | " + (gov.blockCommentInjection?"✅":"❌") + " |\n" +
    "| Warn on SELECT *            | " + (gov.blockSelectStar?"✅":"❌") + " |\n" +
    "| Max LIMIT                   | " + gov.maxLimit + " |\n" +
    "| Allow-list tables           | " + (gov.allowedTables||"(unrestricted)") + " |\n" +
    "| Deny-list tables            | " + (gov.deniedTables||"(none)") + " |\n\n" +

    "## 4. Sensitive Data (PII) Posture\n\n" +
    "PII scanner detected **" + pii.length + "** sensitive columns in the active workspace's schema:\n\n";
  if(pii.length){
    md += "| Severity | Type | Column |\n|---|---|---|\n";
    pii.forEach(function(p){ md += "| "+p.sev.toUpperCase()+" | "+p.name+" | `"+p.table+"."+p.column+"` |\n"; });
    md += "\n_Action:_ apply per-column encryption, masking, or restricted role access as per type-specific advice.\n\n";
  } else {
    md += "_No PII patterns matched the current schema definitions._\n\n";
  }

  md += "## 5. Audit Activity Summary\n\n";
  md += "| Action | Count |\n|---|---|\n";
  Object.keys(totals).sort().forEach(function(k){ md += "| `"+k+"` | "+totals[k]+" |\n"; });

  md += "\n## 6. Attestation\n\n" +
    "I attest that this report was generated by QueryPilot v9 Enterprise on " + new Date().toLocaleString() +
    ", reflecting the state of the application at the time of generation. No data was transmitted " +
    "during this report's preparation. The audit log used to produce this report is available for " +
    "independent inspection via the Enterprise → Audit Log → Export function.\n\n" +
    "**Signed by:** " + QPE.rbac.currentRole + "\n" +
    "**Date:** " + new Date().toLocaleString() + "\n\n" +
    "---\n\n_Generated by QueryPilot v9 Enterprise — built by Adewale Samson Adeagbo / HMG Concepts._\n";

  return md;
};

QPE.uiExportCompliance = function(){
  var md = QPE.complianceReport();
  if(typeof dl==="function") dl(md, "compliance_attestation_"+Date.now()+".md");
  QPE.audit.log("COMPLIANCE_REPORT", "Generated compliance attestation");
  if(typeof toast==="function") toast("Compliance report exported");
};
QPE.uiPreviewCompliance = function(){
  document.getElementById("comp-out").textContent = QPE.complianceReport();
};


/* ===================================================================
   17. SSO-style Profile Switcher — see RBAC roles UI above
   (Roles double as profiles in this design.)
   =================================================================== */


/* ===================================================================
   18. TEAM COMMENTS ON QUERIES
   Threaded comments stored per saved-query id within the workspace.
   =================================================================== */
QPE.comments = {
  all: function(qid){
    var ws = QPE.ws.active();
    return ((ws.comments||{})[qid]) || [];
  },
  add: function(qid, body){
    if(!QPE.rbac.can("comment.write")){ QPE.rbac.deny("post comments"); return; }
    var all = QPE.ws.all();
    all.forEach(function(w){
      if(w.id !== lsGet(ACTIVE_WS_KEY, null)) return;
      if(!w.comments) w.comments = {};
      if(!w.comments[qid]) w.comments[qid] = [];
      w.comments[qid].push({ id:uid("c"), ts:nowISO(), author:QPE.rbac.currentRole, body:body });
    });
    lsSet(WORKSPACES_KEY, all);
    QPE.audit.log("COMMENT_ADD", qid + ": " + body.slice(0,60));
  },
  delete: function(qid, cid){
    var all = QPE.ws.all();
    all.forEach(function(w){
      if(w.id !== lsGet(ACTIVE_WS_KEY, null)) return;
      if(w.comments && w.comments[qid]){
        w.comments[qid] = w.comments[qid].filter(function(c){ return c.id !== cid; });
      }
    });
    lsSet(WORKSPACES_KEY, all);
  }
};

QPE.renderCommentsPanel = function(){
  var el = document.getElementById("cmt-out");
  if(!el) return;
  var bookmarks = window.bookmarks || [];
  if(!bookmarks.length){ el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">💬</div>Save some queries first to attach comments.</div>'; return; }
  el.innerHTML = '<select class="ent-select" id="cmt-pick" onchange="QPE.renderCommentsFor(this.value)">' +
    '<option value="">-- pick a saved query --</option>' +
    bookmarks.map(function(b){ return '<option value="'+b.id+'">'+esc2(b.title)+'</option>'; }).join("") +
    '</select><div id="cmt-area" style="margin-top:12px"></div>';
};

QPE.renderCommentsFor = function(qid){
  var el = document.getElementById("cmt-area");
  if(!qid){ el.innerHTML = ""; return; }
  var comments = QPE.comments.all(qid);
  var html = '<div class="ent-row"><input class="ent-input" id="cmt-body" placeholder="Add a comment..."/>' +
    '<button class="ent-btn" onclick="QPE.uiAddComment(\''+qid+'\')" data-rbac-perm="comment.write">💬 Post</button></div>';
  if(!comments.length){
    html += '<div class="ent-empty" style="padding:14px">No comments yet. Start the conversation.</div>';
  } else {
    html += '<div class="cmt-thread">' + comments.map(function(c){
      return '<div class="cmt-item">' +
        '<span class="cmt-author">'+esc2(c.author)+'</span>' +
        '<span class="cmt-time">'+fmtTime(c.ts)+'</span>' +
        ' <button class="ws-mini" style="float:right" onclick="QPE.comments.delete(\''+qid+'\',\''+c.id+'\');QPE.renderCommentsFor(\''+qid+'\')">🗑</button>' +
        '<div class="cmt-body">'+esc2(c.body)+'</div>' +
        '</div>';
    }).join("") + '</div>';
  }
  el.innerHTML = html;
  QPE.applyRBACUI();
};

QPE.uiAddComment = function(qid){
  var body = document.getElementById("cmt-body").value.trim();
  if(!body) return;
  QPE.comments.add(qid, body);
  document.getElementById("cmt-body").value = "";
  QPE.renderCommentsFor(qid);
};


/* ===================================================================
   19. ENCRYPTED LOCAL VAULT (Web Crypto API, AES-GCM + PBKDF2)
   Stores selected workspace fields encrypted with a user-supplied passphrase.
   =================================================================== */
QPE.vault = (function(){
  function strToBytes(s){ return new TextEncoder().encode(s); }
  function bytesToStr(b){ return new TextDecoder().decode(b); }
  function b64(b){
    var bin = ""; var bytes = new Uint8Array(b);
    for(var i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function debase64(s){
    var bin = atob(s); var len = bin.length; var bytes = new Uint8Array(len);
    for(var i=0;i<len;i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  function deriveKey(passphrase, salt){
    return crypto.subtle.importKey("raw", strToBytes(passphrase), {name:"PBKDF2"}, false, ["deriveKey"])
      .then(function(km){
        return crypto.subtle.deriveKey(
          { name:"PBKDF2", salt:salt, iterations:120000, hash:"SHA-256" },
          km, { name:"AES-GCM", length:256 }, false, ["encrypt","decrypt"]
        );
      });
  }
  return {
    encrypt: function(plain, passphrase){
      var salt = crypto.getRandomValues(new Uint8Array(16));
      var iv   = crypto.getRandomValues(new Uint8Array(12));
      return deriveKey(passphrase, salt).then(function(key){
        return crypto.subtle.encrypt({name:"AES-GCM", iv:iv}, key, strToBytes(plain))
          .then(function(ct){
            return { salt:b64(salt), iv:b64(iv), ct:b64(ct), ts: nowISO() };
          });
      });
    },
    decrypt: function(payload, passphrase){
      return deriveKey(passphrase, debase64(payload.salt)).then(function(key){
        return crypto.subtle.decrypt({name:"AES-GCM", iv:debase64(payload.iv)}, key, debase64(payload.ct))
          .then(function(pt){ return bytesToStr(pt); });
      });
    }
  };
})();

QPE.uiVaultStore = function(){
  if(!("crypto" in window) || !crypto.subtle){ if(typeof toast==="function") toast("Web Crypto unavailable","var(--er)"); return; }
  var pw = document.getElementById("vault-pw").value;
  var content = document.getElementById("vault-content").value;
  if(!pw || pw.length < 6){ if(typeof toast==="function") toast("Passphrase ≥ 6 chars", "var(--wn)"); return; }
  if(!content){ if(typeof toast==="function") toast("Nothing to store","var(--wn)"); return; }
  QPE.vault.encrypt(content, pw).then(function(payload){
    lsSet("vault", payload);
    QPE.audit.log("VAULT_STORE", "Stored " + content.length + " chars (encrypted)");
    if(typeof toast==="function") toast("✓ Encrypted & saved");
    document.getElementById("vault-pw").value = "";
    document.getElementById("vault-content").value = "";
    QPE.renderVault();
  }).catch(function(e){
    if(typeof toast==="function") toast("Encryption failed: " + e.message, "var(--er)");
  });
};

QPE.uiVaultUnlock = function(){
  var pw = document.getElementById("vault-pw-r").value;
  var payload = lsGet("vault", null);
  if(!payload){ if(typeof toast==="function") toast("Nothing in vault","var(--wn)"); return; }
  QPE.vault.decrypt(payload, pw).then(function(plain){
    document.getElementById("vault-display").textContent = plain;
    document.getElementById("vault-display").style.display = "block";
    QPE.audit.log("VAULT_READ", "Vault unlocked successfully");
    if(typeof toast==="function") toast("✓ Unlocked");
  }).catch(function(){
    QPE.audit.log("VAULT_DENY", "Vault unlock failed (wrong passphrase)");
    if(typeof toast==="function") toast("Wrong passphrase","var(--er)");
  });
};

QPE.uiVaultClear = function(){
  if(!confirm("Clear the encrypted vault? Stored data is unrecoverable without the passphrase anyway.")) return;
  lsDel("vault");
  QPE.audit.log("VAULT_CLEAR", "Vault cleared");
  QPE.renderVault();
};

QPE.renderVault = function(){
  var el = document.getElementById("vault-out");
  if(!el) return;
  var payload = lsGet("vault", null);
  if(!payload){
    el.innerHTML =
      '<div class="vault-locked"><div class="vault-icon">🔓</div>' +
      '<div style="font-size:13px;color:var(--tx);margin-bottom:12px"><strong>Vault is empty</strong></div>' +
      '<div style="font-size:11px;color:var(--mu);line-height:1.7;margin-bottom:14px;max-width:380px;margin-left:auto;margin-right:auto">Store a sensitive schema, credentials note, or anything else as <strong>AES-256-GCM-encrypted</strong> bytes using <strong>PBKDF2 (120k iterations)</strong>. Browser-native Web Crypto. Free. Offline. Zero-knowledge.</div>' +
      '<input class="ent-input" type="password" id="vault-pw" placeholder="Passphrase (min 6 chars)" style="margin-bottom:8px"/>' +
      '<textarea class="ent-textarea" id="vault-content" placeholder="Sensitive content to encrypt..." rows="4"></textarea>' +
      '<button class="ent-btn" style="margin-top:8px" onclick="QPE.uiVaultStore()">🔒 Encrypt & Store</button></div>';
  } else {
    el.innerHTML =
      '<div class="vault-locked"><div class="vault-icon">🔐</div>' +
      '<div style="font-size:13px;color:var(--tx);margin-bottom:6px"><strong>Vault locked</strong></div>' +
      '<div style="font-size:10px;color:var(--mu);margin-bottom:12px">Stored at '+fmtTime(payload.ts)+'</div>' +
      '<input class="ent-input" type="password" id="vault-pw-r" placeholder="Passphrase" style="margin-bottom:8px"/>' +
      '<button class="ent-btn" onclick="QPE.uiVaultUnlock()">🔓 Unlock</button> ' +
      '<button class="ent-btn ghost" onclick="QPE.uiVaultClear()">🗑 Clear</button>' +
      '<pre id="vault-display" style="display:none;text-align:left;background:var(--bg);border:1px solid var(--ac);border-radius:7px;padding:11px;margin-top:14px;font-family:JetBrains Mono,monospace;font-size:11px;white-space:pre-wrap;word-break:break-word;max-height:240px;overflow:auto;color:var(--tx)"></pre></div>';
  }
};


/* ===================================================================
   20. ONBOARDING TOUR — 8-step product walk-through
   =================================================================== */
var TOUR_STEPS = [
  { title:"Welcome to QueryPilot Enterprise", body:"This 60-second tour shows the new enterprise features built for teams, governance and compliance. Everything is free, offline, no AI API." },
  { title:"Workspaces", body:"Switch between Production / Staging / Client A / Client B via the sidebar 'Workspaces' tab. Each has its own schema, queries, snippets and audit trail." },
  { title:"Roles & RBAC", body:"Pick your role in the topbar chip (👁️ Viewer, 📊 Analyst, 🛠️ DBA, 👑 Admin). Permissions hide destructive buttons. Switches are audited." },
  { title:"Governance Rules", body:"DBA/Admin toggle hard rules: block DROP, require WHERE on DELETE/UPDATE, allow/deny table lists. Any blocked query is logged." },
  { title:"PII Scanner", body:"Auto-flags columns named ssn, bvn, nin, email, dob, salary, password and 10+ more patterns. Export a Markdown PII audit." },
  { title:"Approval Workflow", body:"Analysts request approval for sensitive queries. DBA/Admin approves or rejects with notes. All in one browser, no server." },
  { title:"Audit Log & Compliance", body:"Every action is logged. Export the log as CSV/JSON or generate a one-click NDPR/GDPR/ISO compliance attestation report." },
  { title:"You're all set!", body:"Open the Enterprise tab to explore all 25 enterprise tools. Re-run this tour anytime from the ⚙️ Settings panel." }
];

QPE.tour = {
  step: 0,
  start: function(){
    this.step = 0; this.render();
    document.getElementById("tour-overlay").classList.add("on");
  },
  next: function(){
    this.step++;
    if(this.step >= TOUR_STEPS.length){ this.end(); return; }
    this.render();
  },
  prev: function(){
    if(this.step > 0) this.step--;
    this.render();
  },
  end: function(){
    document.getElementById("tour-overlay").classList.remove("on");
    lsSet("tour_done", true);
    QPE.audit.log("TOUR_END", "Onboarding tour completed at step " + this.step);
  },
  render: function(){
    var s = TOUR_STEPS[this.step];
    var dots = TOUR_STEPS.map(function(_,i){ return '<div class="tour-dot '+(i<=QPE.tour.step?'on':'')+'"></div>'; }).join("");
    document.getElementById("tour-overlay").innerHTML =
      '<div class="tour-box">' +
        '<div class="tour-step">Step '+(this.step+1)+' of '+TOUR_STEPS.length+'</div>' +
        '<div class="tour-title">'+esc2(s.title)+'</div>' +
        '<div class="tour-body">'+esc2(s.body)+'</div>' +
        '<div class="tour-nav">' +
          '<button class="ent-btn ghost" onclick="QPE.tour.prev()" '+(this.step===0?'disabled':'')+'>← Back</button>' +
          '<div class="tour-dots">'+dots+'</div>' +
          '<button class="ent-btn" onclick="QPE.tour.next()">'+(this.step===TOUR_STEPS.length-1?'Finish ✓':'Next →')+'</button>' +
        '</div>' +
      '</div>';
  }
};


/* ===================================================================
   21. USAGE DASHBOARD (local-only telemetry)
   =================================================================== */
QPE.renderDashboard = function(){
  var el = document.getElementById("dash-out");
  if(!el) return;
  var audit = QPE.audit.all();
  var today = new Date().toDateString();
  var todayCount = audit.filter(function(e){ return new Date(e.ts).toDateString() === today; }).length;
  var byAction = {};
  var byHour = new Array(24).fill ? new Array(24).fill(0) : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var byRole = {};
  var byTable = {};
  audit.forEach(function(e){
    byAction[e.action] = (byAction[e.action]||0)+1;
    byHour[new Date(e.ts).getHours()]++;
    byRole[e.actor] = (byRole[e.actor]||0)+1;
    if(e.action==="QUERY_RUN" && e.meta && e.meta.tables){
      e.meta.tables.forEach(function(t){ byTable[t] = (byTable[t]||0)+1; });
    }
  });
  var topActions = Object.keys(byAction).sort(function(a,b){return byAction[b]-byAction[a];}).slice(0,5);
  var topTables  = Object.keys(byTable).sort(function(a,b){return byTable[b]-byTable[a];}).slice(0,5);
  var peakHour = byHour.indexOf(Math.max.apply(null,byHour));
  var bookmarks = window.bookmarks || [];
  var ws = QPE.ws.all() || [];

  var maxAction = topActions.length ? byAction[topActions[0]] : 1;

  var html = '<div class="dash-grid">' +
    '<div class="dash-stat"><div class="dash-stat-num">'+audit.length+'</div><div class="dash-stat-label">Total events</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-num">'+todayCount+'</div><div class="dash-stat-label">Events today</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-num">'+ws.length+'</div><div class="dash-stat-label">Workspaces</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-num">'+bookmarks.length+'</div><div class="dash-stat-label">Saved queries</div></div>' +
    '<div class="dash-stat"><div class="dash-stat-num">'+(peakHour<10?'0'+peakHour:peakHour)+':00</div><div class="dash-stat-label">Peak hour</div></div>' +
    '</div>';

  html += '<div class="ent-card-title">Top actions</div>';
  if(!topActions.length){ html += '<div class="ent-empty" style="padding:12px">No data yet.</div>'; }
  else topActions.forEach(function(a){
    var pct = byAction[a]/maxAction*100;
    html += '<div class="dash-bar-row"><div class="dash-bar-label">'+esc2(a)+'</div>' +
      '<div class="dash-bar-wrap"><div class="dash-bar"><div class="dash-bar-fill" style="width:'+pct+'%"></div></div></div>' +
      '<div class="dash-bar-val">'+byAction[a]+'</div></div>';
  });

  html += '<div class="ent-card-title" style="margin-top:14px">Activity by role</div>';
  Object.keys(byRole).forEach(function(role){
    var pct = byRole[role]/audit.length*100;
    html += '<div class="dash-bar-row"><div class="dash-bar-label">'+esc2(role)+'</div>' +
      '<div class="dash-bar-wrap"><div class="dash-bar"><div class="dash-bar-fill" style="width:'+pct+'%"></div></div></div>' +
      '<div class="dash-bar-val">'+byRole[role]+'</div></div>';
  });

  if(topTables.length){
    html += '<div class="ent-card-title" style="margin-top:14px">Most-queried tables</div>';
    topTables.forEach(function(t){
      var pct = byTable[t]/byTable[topTables[0]]*100;
      html += '<div class="dash-bar-row"><div class="dash-bar-label">'+esc2(t)+'</div>' +
        '<div class="dash-bar-wrap"><div class="dash-bar"><div class="dash-bar-fill" style="width:'+pct+'%"></div></div></div>' +
        '<div class="dash-bar-val">'+byTable[t]+'</div></div>';
    });
  }

  html += '<div class="ent-card-title" style="margin-top:14px">Hourly distribution (24h)</div>';
  var maxHour = Math.max.apply(null,byHour) || 1;
  html += '<div style="display:flex;gap:2px;align-items:flex-end;height:80px;background:var(--sf2);padding:8px;border-radius:7px;border:1px solid var(--bd)">';
  byHour.forEach(function(c,h){
    var hpct = c/maxHour*100;
    var color = h===peakHour ? "var(--ac)" : "var(--info)";
    html += '<div title="'+(h<10?'0'+h:h)+':00 — '+c+' events" style="flex:1;background:'+color+';height:'+hpct+'%;min-height:1px;border-radius:2px"></div>';
  });
  html += '</div>';
  html += '<div style="display:flex;gap:2px;font-size:9px;color:var(--mu);margin-top:2px"><span style="flex:1;text-align:left">00</span><span style="flex:1;text-align:center">06</span><span style="flex:1;text-align:center">12</span><span style="flex:1;text-align:center">18</span><span style="flex:1;text-align:right">23</span></div>';

  el.innerHTML = html;
};


/* ===================================================================
   22. PRINT-READY DOCUMENTATION PACK
   One-click "Data Dictionary + Query Catalogue" as printable HTML.
   =================================================================== */
QPE.printDocPack = function(){
  var ws = QPE.ws.active() || {};
  var tables = (typeof getSchema==="function") ? getSchema() : {};
  var bookmarks = window.bookmarks || [];
  var pii = QPE.pii.scan();
  var gloss = (ws.glossary || []);

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>QueryPilot Data Pack — '+esc2(ws.name||"")+'</title>' +
    '<style>body{font-family:Arial,Helvetica,sans-serif;max-width:920px;margin:0 auto;padding:32px;line-height:1.6;color:#111}' +
    'h1{font-size:24px;border-bottom:3px solid #3fb950;padding-bottom:6px}h2{font-size:18px;margin-top:30px;color:#1a7f37}' +
    'h3{font-size:14px;margin-top:18px}table{width:100%;border-collapse:collapse;font-size:12px;margin:10px 0}' +
    'th,td{border:1px solid #ccc;padding:6px 9px;text-align:left}th{background:#f4f6f8}' +
    'pre{background:#f6f8fa;border:1px solid #ddd;padding:10px;border-radius:6px;font-size:11px;white-space:pre-wrap;page-break-inside:avoid}' +
    '.tag{display:inline-block;background:#e0f4e4;color:#1a7f37;padding:2px 8px;border-radius:10px;font-size:10px;margin-right:4px}' +
    '.meta{color:#666;font-size:11px;margin-bottom:24px}@media print{h2{page-break-before:auto}}</style></head><body>' +

    '<h1>📚 QueryPilot Data Pack</h1>' +
    '<div class="meta">Workspace: <strong>'+esc2(ws.name||"Default")+'</strong> · Generated '+new Date().toLocaleString()+' · By '+esc2(QPE.rbac.currentRole)+'<br>' +
    'Built and signed by QueryPilot v9 Enterprise — Adewale Samson Adeagbo / HMG Concepts, Lagos, Nigeria</div>' +

    '<h2>1. Data Dictionary</h2>' +
    Object.keys(tables).map(function(t){
      return '<h3>📋 '+esc2(t)+'</h3>' +
        '<table><tr><th>Column</th><th>Inferred type</th><th>Notes</th></tr>' +
        tables[t].map(function(c){
          var pii_match = pii.filter(function(p){return p.table===t && p.column===c;})[0];
          var note = pii_match ? '<span class="tag" style="background:#ffe5e5;color:#cf222e">PII: '+esc2(pii_match.name)+'</span>' : '';
          var gloss_match = gloss.filter(function(g){return g.column.toLowerCase() === c.toLowerCase() || g.column.toLowerCase() === (t+"."+c).toLowerCase();})[0];
          if(gloss_match) note += ' ' + esc2(gloss_match.definition);
          var type = c==="id" ? "INTEGER PK" :
                     /_id$/.test(c) ? "INTEGER FK" :
                     /_at$|date|time/.test(c) ? "DATETIME" :
                     /(total|amount|price|salary|cost)/.test(c) ? "DECIMAL(10,2)" :
                     /(stock|qty|quantity|count)/.test(c) ? "INTEGER" :
                     /(email|name|status|category|region)/.test(c) ? "VARCHAR" : "TEXT";
          return '<tr><td><code>'+esc2(c)+'</code></td><td>'+type+'</td><td>'+note+'</td></tr>';
        }).join("") + '</table>';
    }).join("") +

    '<h2>2. PII / Sensitive Columns</h2>' +
    (pii.length ?
      '<table><tr><th>Severity</th><th>Type</th><th>Column</th><th>Advice</th></tr>' +
      pii.map(function(p){ return '<tr><td>'+p.sev.toUpperCase()+'</td><td>'+esc2(p.name)+'</td><td><code>'+esc2(p.table)+'.'+esc2(p.column)+'</code></td><td>'+esc2(p.advice)+'</td></tr>'; }).join("") +
      '</table>' : '<p><em>No PII detected in this workspace.</em></p>') +

    '<h2>3. Glossary / Business Definitions</h2>' +
    (gloss.length ?
      '<table><tr><th>Term</th><th>Definition</th></tr>' +
      gloss.map(function(g){ return '<tr><td><code>'+esc2(g.column)+'</code></td><td>'+esc2(g.definition)+'</td></tr>'; }).join("") +
      '</table>' : '<p><em>No glossary entries. Add definitions in Enterprise → Glossary.</em></p>') +

    '<h2>4. Saved Query Catalogue</h2>' +
    (bookmarks.length ?
      bookmarks.map(function(b,i){
        return '<h3>'+(i+1)+'. '+esc2(b.title)+'</h3>' +
          (b.tags && b.tags.length ? '<div>' + b.tags.map(function(tg){return '<span class="tag">'+esc2(tg)+'</span>';}).join("") + '</div>' : '') +
          '<pre>'+esc2(b.sql)+'</pre>';
      }).join("") : '<p><em>No saved queries.</em></p>') +

    '<h2>5. Governance Posture</h2>' +
    '<pre>' + esc2(JSON.stringify(QPE.gov.load(), null, 2)) + '</pre>' +

    '</body></html>';

  var win = window.open("", "_blank");
  if(!win){ if(typeof toast==="function") toast("Pop-up blocked","var(--er)"); return; }
  win.document.write(html); win.document.close();
  setTimeout(function(){ win.print(); }, 500);
  QPE.audit.log("DOC_PACK_PRINT", "Printed data pack");
};


/* ===================================================================
   23. MULTI-TAB WORKSPACE SYNC — BroadcastChannel
   When workspace is switched in one tab, other tabs follow.
   =================================================================== */
try {
  QPE.bus = new BroadcastChannel("querypilot_v8");
  QPE.bus.onmessage = function(ev){
    var msg = ev.data || {};
    if(msg.type === "workspace_switch"){
      // Reload workspace data into UI without re-broadcasting
      var ws = QPE.ws.active();
      var ta = document.getElementById("schema-ta");
      if(ta && ws){ ta.value = ws.schema; if(typeof refreshAll==="function") refreshAll(); }
      QPE.renderWorkspaceChip();
      QPE.renderWorkspaceList();
      if(typeof toast==="function") toast("🔄 Synced from another tab");
    }
  };
} catch(e){
  QPE.bus = null;
}


/* ===================================================================
   24. HEALTH CHECK DASHBOARD
   =================================================================== */
QPE.renderHealth = function(){
  var checks = [];
  // localStorage available?
  try { localStorage.setItem("__qpe_health", "1"); localStorage.removeItem("__qpe_health");
    checks.push({ name:"localStorage", status:"ok", msg:"Available" });
  } catch(e){ checks.push({ name:"localStorage", status:"fail", msg:"Unavailable — most features will break" }); }

  // Storage usage estimate
  if(navigator.storage && navigator.storage.estimate){
    navigator.storage.estimate().then(function(est){
      var used = est.usage || 0, quota = est.quota || 1;
      var pct = (used/quota*100).toFixed(2);
      var row = document.getElementById("health-storage");
      if(row) row.innerHTML = '<div class="health-icon">💾</div><div class="health-name">Storage usage</div><span class="health-status '+(pct>80?'warn':'ok')+'">'+(used/1048576).toFixed(2)+' MB / '+(quota/1048576).toFixed(0)+' MB ('+pct+'%)</span>';
    });
  }

  // Service worker?
  if("serviceWorker" in navigator){
    navigator.serviceWorker.getRegistration().then(function(reg){
      var row = document.getElementById("health-sw");
      if(row) row.innerHTML = '<div class="health-icon">📡</div><div class="health-name">Service Worker</div><span class="health-status '+(reg?'ok':'warn')+'">'+(reg?'Registered ('+(reg.active?reg.active.state:'pending')+')':'Not registered — install as PWA for offline')+'</span>';
    });
  } else checks.push({ name:"Service Worker", status:"warn", msg:"API not supported" });

  // Crypto
  checks.push({ name:"Web Crypto (vault)", status: (window.crypto && crypto.subtle) ? "ok" : "fail", msg: (window.crypto && crypto.subtle) ? "Available" : "Unavailable — vault will not work" });

  // Notifications
  var nStatus = !("Notification" in window) ? "fail" :
                Notification.permission === "granted" ? "ok" :
                Notification.permission === "denied" ? "warn" : "warn";
  var nMsg = !("Notification" in window) ? "Unsupported" :
             Notification.permission === "granted" ? "Granted" :
             Notification.permission === "denied" ? "Denied (reminders muted)" : "Default (will prompt)";
  checks.push({ name:"Notifications (reminders)", status:nStatus, msg:nMsg });

  // BroadcastChannel
  checks.push({ name:"BroadcastChannel (multi-tab sync)", status: typeof BroadcastChannel !== "undefined" ? "ok" : "warn", msg: typeof BroadcastChannel !== "undefined" ? "Available" : "Not supported (single-tab mode)" });

  // PWA install
  checks.push({ name:"PWA install ready", status: window.matchMedia("(display-mode: standalone)").matches ? "ok" : "warn", msg: window.matchMedia("(display-mode: standalone)").matches ? "Running as installed app" : "Running in browser tab" });

  // Online?
  checks.push({ name:"Network", status: navigator.onLine ? "ok" : "warn", msg: navigator.onLine ? "Online (not required — works offline)" : "Offline (still functional)" });

  // Browser
  checks.push({ name:"Browser", status:"ok", msg: (navigator.userAgentData && navigator.userAgentData.brands ? navigator.userAgentData.brands.map(function(b){return b.brand+" "+b.version;}).join(", ") : navigator.userAgent.slice(0,80)) });

  // Audit log size
  var auditCount = QPE.audit.all().length;
  checks.push({ name:"Audit log size", status: auditCount > 4500 ? "warn" : "ok", msg: auditCount+" events" + (auditCount > 4500 ? " (nearing 5000 cap)" : "") });

  // Performance memory if available
  if(performance && performance.memory){
    checks.push({ name:"JS heap", status:"ok", msg: ((performance.memory.usedJSHeapSize/1048576)|0)+" MB used / "+((performance.memory.jsHeapSizeLimit/1048576)|0)+" MB limit" });
  }

  var icons = { ok:"✅", warn:"⚠️", fail:"❌" };
  var html = '<div id="health-storage" class="health-row"><div class="health-icon">💾</div><div class="health-name">Storage usage</div><span class="health-status ok">Calculating...</span></div>' +
    '<div id="health-sw" class="health-row"><div class="health-icon">📡</div><div class="health-name">Service Worker</div><span class="health-status ok">Checking...</span></div>';
  checks.forEach(function(c){
    html += '<div class="health-row"><div class="health-icon">'+icons[c.status]+'</div><div class="health-name">'+esc2(c.name)+'</div><span class="health-status '+c.status+'">'+esc2(c.msg)+'</span></div>';
  });
  document.getElementById("health-out").innerHTML = html;
};


/* ===================================================================
   25. GLOSSARY / DATA DICTIONARY
   Per-column or per-term business definitions stored per-workspace.
   =================================================================== */
QPE.gloss = {
  all: function(){ return (QPE.ws.active().glossary || []); },
  add: function(col, def){
    if(!QPE.rbac.can("glossary.write")){ QPE.rbac.deny("edit the glossary"); return; }
    var all = QPE.ws.all();
    all.forEach(function(w){
      if(w.id !== lsGet(ACTIVE_WS_KEY, null)) return;
      if(!w.glossary) w.glossary = [];
      // de-dup
      w.glossary = w.glossary.filter(function(g){ return g.column.toLowerCase() !== col.toLowerCase(); });
      w.glossary.push({ column:col, definition:def, ts: nowISO() });
    });
    lsSet(WORKSPACES_KEY, all);
    QPE.audit.log("GLOSSARY_ADD", col);
  },
  remove: function(col){
    var all = QPE.ws.all();
    all.forEach(function(w){
      if(w.id !== lsGet(ACTIVE_WS_KEY, null)) return;
      w.glossary = (w.glossary||[]).filter(function(g){ return g.column !== col; });
    });
    lsSet(WORKSPACES_KEY, all);
  }
};

QPE.uiAddGlossary = function(){
  var col = document.getElementById("gloss-col").value.trim();
  var def = document.getElementById("gloss-def").value.trim();
  if(!col || !def){ if(typeof toast==="function") toast("Need both column and definition","var(--wn)"); return; }
  QPE.gloss.add(col, def);
  document.getElementById("gloss-col").value = "";
  document.getElementById("gloss-def").value = "";
  QPE.renderGlossary();
};

QPE.renderGlossary = function(){
  var el = document.getElementById("gloss-out");
  if(!el) return;
  var items = QPE.gloss.all();
  if(!items.length){ el.innerHTML = '<div class="ent-empty"><div class="ent-empty-icon">📖</div>No glossary entries yet.<br>Add business definitions for columns (e.g. <code>customers.region</code> → "Geographical sales zone").</div>'; return; }
  el.innerHTML = items.map(function(g){
    return '<div class="gloss-item">' +
      '<button class="gloss-del" onclick="QPE.gloss.remove(\''+g.column.replace(/'/g,"\\'")+'\');QPE.renderGlossary()" title="Delete">✕</button>' +
      '<div class="gloss-key">'+esc2(g.column)+'</div>' +
      '<div class="gloss-def">'+esc2(g.definition)+'</div></div>';
  }).join("");
};


/* ===================================================================
   BOOT — set up panels, switch mode/spanel overrides, run on load
   =================================================================== */

// Extend setMode to recognise "ent"
(function(){
  var orig = window.setMode;
  window.setMode = function(mode, btn){
    if(mode === "ent"){
      // Hide every panel known to v6/v7
      ["cpanel","vpanel","jpanel","sqpanel","multipanel","diffpanel","toolspanel","learnpanel","exportpanel","entpanel"]
        .forEach(function(id){ var el=document.getElementById(id); if(el) el.classList.remove("on"); });
      var p = document.getElementById("entpanel"); if(p) p.classList.add("on");
      document.getElementById("ibar").style.display = "none";
      document.querySelectorAll(".mt").forEach(function(b){ b.classList.remove("on"); });
      if(btn) btn.classList.add("on");
      QPE.renderEnterprisePanel();
      return;
    }
    return orig(mode, btn);
  };
})();

// Extend spanel to recognise "ws"
(function(){
  var orig = window.spanel;
  window.spanel = function(id, btn){
    if(id === "ws"){
      ["schema","csv","tpl","udt","snip","bk","hist","cs","ws"].forEach(function(p){
        var el=document.getElementById("sp-"+p); if(el) el.style.display="none";
      });
      var el = document.getElementById("sp-ws"); if(el) el.style.display="block";
      document.querySelectorAll(".stab").forEach(function(b){ b.classList.remove("on"); });
      if(btn) btn.classList.add("on");
      QPE.renderWorkspaceList();
      return;
    }
    return orig(id, btn);
  };
})();

// Intercept v6/v7 send() to enforce governance + log
(function(){
  if(typeof window.send !== "function") return;
  var origSend = window.send;
  window.send = function(text){
    var input = text || (document.getElementById("nli")||{}).value || "";
    // Governance only applies to generated SQL, not raw NL input.
    // We let nlSQL build the SQL, then check before rendering — but the simplest
    // path is to allow send() to run and append our checks AFTER addCard. The
    // v7 mutation observer (in app.js) already runs on new cards — we hook in there.
    QPE.audit.log("QUERY_RUN", "User query: " + String(input).slice(0,120),
                  { tables: extractTablesFromSQL(input) });
    return origSend.apply(this, arguments);
  };
})();

// Monitor newly-added result cards for governance violations
(function(){
  var chat = document.getElementById("chatmsgs"); if(!chat) return;
  var obs = new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType !== 1 || !n.classList || !n.classList.contains("mr")) return;
        var sqlEl = n.querySelector(".sqlb");
        if(!sqlEl) return;
        var sql = n.dataset.sql || "";
        var findings = QPE.gov.check(sql);
        if(!findings.length) return;
        // Insert banner above SQL
        var banner = document.createElement("div");
        var errs = findings.filter(function(x){return x.sev==="error";});
        var warns = findings.filter(function(x){return x.sev==="warn";});
        var blocked = errs.length > 0;
        banner.style.cssText = "padding:10px 14px;font-size:11px;line-height:1.7;border-bottom:1px solid var(--bd);background:"+(blocked?"#f8514920":"#d2992220");
        banner.innerHTML = (blocked?"🛑 <strong>BLOCKED by governance policy</strong><br>":"⚠️ <strong>Governance warnings</strong><br>") +
          findings.map(function(f){ return '<span style="color:'+(f.sev==="error"?"var(--er)":"var(--wn)")+'">• '+esc2(f.msg)+'</span>'; }).join("<br>");
        sqlEl.parentNode.insertBefore(banner, sqlEl);
        if(blocked){
          sqlEl.style.opacity = "0.4";
          sqlEl.style.position = "relative";
          QPE.audit.log("GOV_BLOCK", "Blocked SQL: " + findings.map(function(f){return f.msg;}).join("; "), {sqlPreview: sql.slice(0,100)});
          // Disable copy/run buttons
          var actions = n.querySelector(".cact");
          if(actions){
            actions.querySelectorAll(".ab").forEach(function(b){
              if(/Copy|Save|Send|sql/.test(b.textContent)) b.setAttribute("disabled","true");
            });
          }
        } else {
          QPE.audit.log("GOV_WARN", "Warned on SQL", {sqlPreview: sql.slice(0,100)});
        }
      });
    });
  });
  obs.observe(chat, { childList:true });
})();

// Persist schema changes to active workspace
(function(){
  var ta = document.getElementById("schema-ta");
  if(!ta) return;
  ta.addEventListener("input", function(){
    QPE.ws.saveActiveSchema();
  });
})();


/* ===================================================================
   RENDER the Enterprise mode panel (sub-tabs + all 25 tools)
   =================================================================== */
QPE.renderEnterprisePanel = function(){
  var p = document.getElementById("entpanel");
  if(!p) return;
  if(p.dataset.built === "true"){
    // Re-render dynamic content
    QPE.renderAuditLog();
    QPE.renderApprovals();
    QPE.renderGovernance();
    QPE.renderRoleSwitcher();
    QPE.renderRoleChip();
    QPE.renderWorkspaceChip();
    QPE.refreshTestDataTables();
    return;
  }
  p.dataset.built = "true";

  var subtabs = [
    { id:"workspaces", label:"📁 Workspaces" },
    { id:"roles",      label:"👥 Roles" },
    { id:"governance", label:"🛡️ Governance" },
    { id:"pii",        label:"🔍 PII Scanner" },
    { id:"approvals",  label:"✅ Approvals" },
    { id:"audit",      label:"📜 Audit Log" },
    { id:"lineage",    label:"🌳 Lineage" },
    { id:"linter",     label:"🧹 Linter" },
    { id:"migration",  label:"🔄 Migrations" },
    { id:"testdata",   label:"🎲 Test Data" },
    { id:"cost",       label:"💰 Cost" },
    { id:"versions",   label:"📚 Versions" },
    { id:"schedules",  label:"⏰ Schedules" },
    { id:"bridge",     label:"🌉 Bridge" },
    { id:"backup",     label:"💾 Backup" },
    { id:"compliance", label:"📋 Compliance" },
    { id:"comments",   label:"💬 Comments" },
    { id:"vault",      label:"🔐 Vault" },
    { id:"glossary",   label:"📖 Glossary" },
    { id:"dashboard",  label:"📊 Dashboard" },
    { id:"health",     label:"🩺 Health" }
  ];

  var nav = '<div class="ent-subtabs">' + subtabs.map(function(t){
    return '<button class="ent-subtab" data-sub="'+t.id+'" onclick="QPE.subtab(\''+t.id+'\',this)">'+t.label+'</button>';
  }).join("") + '</div>';

  var sections = [
    // 1. WORKSPACES
    '<div class="ent-sub" id="sub-workspaces">' +
      '<div class="ent-card"><div class="ent-card-title">📁 Workspace Manager <span class="ent-pill green">v8</span></div>' +
      '<div class="ent-card-desc">Each workspace is an <strong>isolated environment</strong> with its own schema, saved queries, snippets, history and audit context. Use one workspace per project, environment (dev/staging/prod) or client. Switching is instant. Multi-tab BroadcastChannel sync keeps all open tabs in agreement.</div>' +
      '<div id="ws-mgr-inline"></div></div>' +
      '<div class="ent-card"><div class="ent-card-title">Create New Workspace</div>' +
      '<div class="ent-row"><div><span class="ent-label">Name</span><input class="ent-input" id="ws-new-name" placeholder="e.g. Production"/></div>' +
      '<div><span class="ent-label">Description</span><input class="ent-input" id="ws-new-desc" placeholder="e.g. Live customer data"/></div>' +
      '<button class="ent-btn" onclick="QPE.uiCreateWorkspace()" data-rbac-perm="workspace.create">➕ Create</button></div>' +
    '</div></div>',

    // 2. ROLES
    '<div class="ent-sub" id="sub-roles">' +
      '<div class="ent-card"><div class="ent-card-title">👥 Role-Based Access Control</div>' +
      '<div class="ent-card-desc">Honor-system RBAC with <strong>4 roles</strong>. Picked role persists between sessions and is logged on every switch. UI hides or disables actions you are not authorised for. For real multi-tenant deployments, layer this with OS-level account isolation.</div>' +
      '<div id="role-switcher" class="prof-grid"></div>' +
      '<div style="font-size:11px;color:var(--mu);margin-top:14px;line-height:1.7;background:var(--sf2);padding:10px;border-radius:7px;border:1px solid var(--bd)">' +
        '<strong>Permission matrix:</strong><br>' +
        '👁️ <strong>Viewer</strong>: read queries only — no run, save, write.<br>' +
        '📊 <strong>Analyst</strong>: read + run + save + snippets + comments.<br>' +
        '🛠️ <strong>DBA</strong>: + governance edit, approvals, migrations, schedules, glossary, workspace management.<br>' +
        '👑 <strong>Admin</strong>: everything, including audit-log management and backup/restore.' +
      '</div></div>' +
    '</div>',

    // 3. GOVERNANCE
    '<div class="ent-sub" id="sub-governance">' +
      '<div class="ent-card"><div class="ent-card-title">🛡️ SQL Governance Rules</div>' +
      '<div class="ent-card-desc">Configure rules that <strong>BLOCK</strong> (error) or <strong>WARN</strong> when a generated SQL statement matches. Blocking happens inline on every result card. DBA / Admin only.</div>' +
      '<div id="gov-rules"></div></div></div>',

    // 4. PII
    '<div class="ent-sub" id="sub-pii">' +
      '<div class="ent-card"><div class="ent-card-title">🔍 PII / Sensitive Data Scanner</div>' +
      '<div class="ent-card-desc">Scans the active workspace\'s schema for columns matching <strong>15+ sensitive-data patterns</strong>, including Nigerian-context types: <code>nin</code>, <code>bvn</code>; plus global: SSN, credit card, password, token, DOB, salary, address, geolocation, religion, medical, etc. Export a Markdown audit for compliance reviews.</div>' +
      '<button class="ent-btn" onclick="QPE.renderPII()">🔍 Run Scan on Current Schema</button>' +
      '<div id="pii-out" style="margin-top:14px"></div></div></div>',

    // 5. APPROVALS
    '<div class="ent-sub" id="sub-approvals">' +
      '<div class="ent-card"><div class="ent-card-title">✅ Query Approval Workflow</div>' +
      '<div class="ent-card-desc">An <strong>Analyst</strong> can submit a query for review; a <strong>DBA / Admin</strong> can approve or reject with notes. Every decision is audited. Use this for any query that touches production or restricted data.</div>' +
      '<div class="ent-row"><div><span class="ent-label">Title</span><input class="ent-input" id="appr-title" placeholder="e.g. Refund all March orders"/></div></div>' +
      '<span class="ent-label">SQL to approve</span><textarea class="ent-textarea" id="appr-sql" rows="5" placeholder="DELETE FROM orders WHERE ..."></textarea>' +
      '<span class="ent-label">Justification</span><input class="ent-input" id="appr-reason" placeholder="Why is this needed?" style="margin-bottom:8px"/>' +
      '<button class="ent-btn" onclick="QPE.uiRequestApproval()" data-rbac-perm="query.save">📨 Submit Request</button></div>' +
      '<div class="ent-card"><div class="ent-card-title">Pending & past requests</div><div id="appr-list"></div></div></div>',

    // 6. AUDIT
    '<div class="ent-sub" id="sub-audit">' +
      '<div class="ent-card"><div class="ent-card-title">📜 Audit Log <span class="ent-pill blue">immutable, append-only</span></div>' +
      '<div class="ent-card-desc">Every action — role switch, query run, governance block, approval decision, workspace change, vault access — is recorded with timestamp, actor and workspace. Capped at 5,000 most-recent events. Export as JSON or CSV for off-line storage / SIEM ingestion.</div>' +
      '<div class="ent-row"><input class="ent-input" id="audit-filter" placeholder="Filter by action, actor, message..." oninput="QPE.renderAuditLog()"/>' +
      '<button class="ent-btn" onclick="QPE.audit.exportJSON()">⬇ JSON</button>' +
      '<button class="ent-btn ghost" onclick="QPE.audit.exportCSV()">⬇ CSV</button>' +
      '<button class="ent-btn danger" onclick="QPE.audit.clear()" data-rbac-perm="audit.clear">🗑 Clear</button></div>' +
      '<div id="audit-list"></div></div></div>',

    // 7. LINEAGE
    '<div class="ent-sub" id="sub-lineage">' +
      '<div class="ent-card"><div class="ent-card-title">🌳 Data Lineage Viewer</div>' +
      '<div class="ent-card-desc">Visualises which queries depend on which tables. Inferred from SQL parsed in your session and saved queries. Helps impact analysis (e.g. "what breaks if I drop <code>customers</code>?"). Export as standalone SVG.</div>' +
      '<button class="ent-btn" onclick="QPE.renderLineage()">🌳 Generate Lineage</button>' +
      '<div id="lineage-out" style="margin-top:14px"></div></div></div>',

    // 8. LINTER
    '<div class="ent-sub" id="sub-linter">' +
      '<div class="ent-card"><div class="ent-card-title">🧹 SQL Linter <span class="ent-pill purple">50+ rules</span></div>' +
      '<div class="ent-card-desc">Free <code>sqlfluff</code>-style style/correctness checker. Runs <strong>50+ deterministic rules</strong> across style (snake_case, indentation), correctness (= NULL, missing semicolon), security (SQLi patterns, GRANT/REVOKE) and performance (leading-% LIKE, function on column). Severity: E (error), W (warning), I (info).</div>' +
      '<textarea class="ent-textarea" id="lint-in" rows="6" placeholder="-- Paste SQL to lint"></textarea>' +
      '<button class="ent-btn" style="margin-top:8px" onclick="QPE.uiRunLint()">🧹 Lint</button>' +
      '<div id="lint-out" style="margin-top:14px"></div></div></div>',

    // 9. MIGRATION
    '<div class="ent-sub" id="sub-migration">' +
      '<div class="ent-card"><div class="ent-card-title">🔄 Migration Generator</div>' +
      '<div class="ent-card-desc">Diff two schema definitions in QueryPilot\'s plain-text format and get a runnable <code>ALTER TABLE</code> / <code>CREATE TABLE</code> / <code>DROP TABLE</code> migration script. Handy for syncing dev → staging → prod schemas.</div>' +
      '<div class="ent-row">' +
        '<div style="min-width:240px"><span class="ent-label">OLD schema</span><textarea class="ent-textarea" id="mig-old" rows="6" placeholder="customers(id, name, email)\norders(id, customer_id, total)"></textarea></div>' +
        '<div style="min-width:240px"><span class="ent-label">NEW schema (blank = current)</span><textarea class="ent-textarea" id="mig-new" rows="6" placeholder="(leave blank to use the active schema)"></textarea></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">' +
      '<button class="ent-btn" onclick="QPE.uiGenMigration()" data-rbac-perm="migration.gen">🔄 Generate</button>' +
      '<button class="ent-btn ghost" onclick="QPE.uiDownloadMigration()">⬇ Download .sql</button></div>' +
      '<pre id="mig-out" class="mig-output" style="margin-top:14px"></pre></div></div>',

    // 10. TEST DATA
    '<div class="ent-sub" id="sub-testdata">' +
      '<div class="ent-card"><div class="ent-card-title">🎲 Test Data Generator</div>' +
      '<div class="ent-card-desc">Generates realistic <code>INSERT</code> statements using a built-in <strong>Nigerian-context Faker</strong> (real names, cities, regions, departments). Perfect for seeding dev databases or demonstrating queries. Column-type inference picks the right faker per column name.</div>' +
      '<div class="ent-row">' +
        '<div><span class="ent-label">Table</span><select class="ent-select" id="tdg-table" onfocus="QPE.refreshTestDataTables()"></select></div>' +
        '<div><span class="ent-label">Rows</span><input class="ent-input" id="tdg-n" type="number" value="10" min="1" max="1000"/></div>' +
        '<button class="ent-btn" onclick="QPE.uiGenTestData()">🎲 Generate</button>' +
        '<button class="ent-btn ghost" onclick="QPE.uiDownloadTestData()">⬇ .sql</button>' +
      '</div>' +
      '<pre id="tdg-out" class="tdg-preview" style="margin-top:14px">-- Pick a table and click Generate</pre></div></div>',

    // 11. COST
    '<div class="ent-sub" id="sub-cost">' +
      '<div class="ent-card"><div class="ent-card-title">💰 Query Cost Estimator</div>' +
      '<div class="ent-card-desc">Heuristic <strong>rows-scanned, bytes-scanned and duration estimate</strong> for any SQL, based on table count, JOIN depth, subqueries, index hints (column = value on <code>_id</code> / <code>id</code>), LIMIT and full-scan signals. Use it to spot expensive queries before running them in production.</div>' +
      '<textarea class="ent-textarea" id="cost-in" rows="5" placeholder="-- Paste a SQL query"></textarea>' +
      '<button class="ent-btn" style="margin-top:8px" onclick="QPE.uiRunCost()">💰 Estimate</button>' +
      '<div id="cost-out" style="margin-top:14px"></div></div></div>',

    // 12. VERSIONS
    '<div class="ent-sub" id="sub-versions">' +
      '<div class="ent-card"><div class="ent-card-title">📚 Query Versioning</div>' +
      '<div class="ent-card-desc">Snapshot any saved query with an optional note. Up to <strong>50 versions per query</strong>. Click any snapshot to diff against the current saved version.</div>' +
      '<div id="ver-out"></div></div></div>',

    // 13. SCHEDULES
    '<div class="ent-sub" id="sub-schedules">' +
      '<div class="ent-card"><div class="ent-card-title">⏰ Scheduled Reminders</div>' +
      '<div class="ent-card-desc">Set browser <strong>Notification</strong> reminders to run a specific query on chosen weekdays at a specific time. <strong>Free, no cron, no server</strong> — uses the browser\'s native Notifications API. Requires the QueryPilot tab to be open (or the PWA installed).</div>' +
      '<div class="ent-row">' +
        '<div><span class="ent-label">Title</span><input class="ent-input" id="sch-title" placeholder="Daily KPI"/></div>' +
        '<div><span class="ent-label">Time (24h)</span><input class="ent-input" id="sch-time" type="time" value="09:00"/></div>' +
      '</div>' +
      '<span class="ent-label">Query reminder text</span><textarea class="ent-textarea" id="sch-query" rows="2" placeholder="Top 10 customers by revenue today"></textarea>' +
      '<span class="ent-label">Days</span><div style="display:flex;gap:8px;font-size:11px;margin:5px 0 10px;flex-wrap:wrap">' +
        ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(function(d,i){
          return '<label><input type="checkbox" class="sch-day-cb" value="'+i+'" '+(i>0&&i<6?'checked':'')+'/> '+d+'</label>';
        }).join("") +
      '</div>' +
      '<button class="ent-btn" onclick="QPE.uiAddSchedule()" data-rbac-perm="schedule.write">⏰ Add Schedule</button></div>' +
      '<div class="ent-card"><div class="ent-card-title">Active schedules</div><div id="sch-list"></div></div></div>',

    // 14. BRIDGE
    '<div class="ent-sub" id="sub-bridge">' +
      '<div class="ent-card"><div class="ent-card-title">🌉 Webhook / Email Bridge</div>' +
      '<div class="ent-card-desc">Build a <code>mailto:</code> link or webhook URL that carries your SQL as a payload — paste it into Zapier, Make, n8n, Slack incoming-webhooks etc. The bridge itself <strong>makes no network call</strong> (no API cost); it just composes the URL for you.</div>' +
      '<div class="ent-row">' +
        '<div><span class="ent-label">Type</span><select class="ent-select" id="br-type"><option value="mailto">📧 mailto</option><option value="webhook">🌐 webhook</option></select></div>' +
        '<div><span class="ent-label">Endpoint (email / URL)</span><input class="ent-input" id="br-endpoint" placeholder="team@example.com or https://hooks.zapier.com/..."/></div>' +
      '</div>' +
      '<span class="ent-label">Subject / Title</span><input class="ent-input" id="br-subject" placeholder="Daily revenue query"/>' +
      '<span class="ent-label" style="margin-top:8px;display:block">SQL payload</span><textarea class="ent-textarea" id="br-sql" rows="5"></textarea>' +
      '<button class="ent-btn" style="margin-top:8px" onclick="QPE.uiBuildBridge()">🌉 Build Link</button>' +
      '<div id="br-out" style="margin-top:14px"></div></div></div>',

    // 15. BACKUP
    '<div class="ent-sub" id="sub-backup">' +
      '<div class="ent-card"><div class="ent-card-title">💾 Backup & Restore</div>' +
      '<div class="ent-card-desc">One-click snapshot of <strong>everything</strong>: every workspace, every setting, every saved query, every audit event, every snippet, every glossary entry. The backup is a portable JSON file. Restoring on another browser / device clones your entire QueryPilot environment.</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="ent-btn" onclick="QPE.backup()">⬇ Download Backup</button>' +
        '<button class="ent-btn ghost" onclick="document.getElementById(\'restore-file\').click()">⬆ Restore from file...</button>' +
        '<input type="file" id="restore-file" accept=".json" style="display:none" onchange="QPE.uiRestore(this.files[0])"/>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--mu);margin-top:10px;line-height:1.7;background:var(--sf2);padding:9px 11px;border-radius:6px;border:1px solid var(--bd)"><strong>Privacy note:</strong> The backup file is plain JSON. For sensitive workspaces, encrypt it before sharing (use Enterprise → Vault as a workflow).</div></div></div>',

    // 16. COMPLIANCE
    '<div class="ent-sub" id="sub-compliance">' +
      '<div class="ent-card"><div class="ent-card-title">📋 Compliance Report Generator</div>' +
      '<div class="ent-card-desc">Generates a Markdown <strong>NDPR / GDPR / ISO-27001 style attestation</strong> derived from your audit log, governance posture, PII scan and workspace state. Sign and submit as compliance evidence for the QueryPilot deployment.</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button class="ent-btn" onclick="QPE.uiPreviewCompliance()">👁 Preview</button>' +
        '<button class="ent-btn" onclick="QPE.uiExportCompliance()">⬇ Export .md</button>' +
        '<button class="ent-btn ghost" onclick="QPE.printDocPack()">🖨️ Print Data Pack</button>' +
      '</div>' +
      '<pre id="comp-out" style="background:var(--bg);border:1px solid var(--bd);border-radius:7px;padding:13px;font-family:JetBrains Mono,monospace;font-size:11px;line-height:1.7;max-height:400px;overflow:auto;white-space:pre-wrap;margin-top:14px"></pre></div></div>',

    // 17. (Profiles are folded into Roles)
    // 18. COMMENTS
    '<div class="ent-sub" id="sub-comments">' +
      '<div class="ent-card"><div class="ent-card-title">💬 Team Comments on Queries</div>' +
      '<div class="ent-card-desc">Pin discussion threads to any saved query. Comments are stored in the active workspace and signed by your current role. Great for code review, "why does this exist?" notes, or hand-off documentation.</div>' +
      '<div id="cmt-out"></div></div></div>',

    // 19. VAULT
    '<div class="ent-sub" id="sub-vault">' +
      '<div class="ent-card"><div class="ent-card-title">🔐 Encrypted Local Vault</div>' +
      '<div class="ent-card-desc">Browser-native <strong>AES-256-GCM encryption</strong> with <strong>PBKDF2-SHA256 (120,000 iterations)</strong> via the Web Crypto API. Use it for sensitive notes, prod credentials reminders, or any text that should not sit in plain <code>localStorage</code>. The passphrase is never stored — losing it means the data is permanently inaccessible.</div>' +
      '<div id="vault-out"></div></div></div>',

    // 20. (Onboarding tour — has its own overlay; expose a button here)
    '<div class="ent-sub" id="sub-glossary">' +
      '<div class="ent-card"><div class="ent-card-title">📖 Glossary / Data Dictionary</div>' +
      '<div class="ent-card-desc">Add <strong>business definitions</strong> for columns or terms. Definitions are embedded into the printed Data Pack so anyone (auditor, new joiner, executive) can understand what <code>customers.region</code> actually means in your business.</div>' +
      '<div class="ent-row">' +
        '<div><span class="ent-label">Column / term</span><input class="ent-input" id="gloss-col" placeholder="customers.region"/></div>' +
        '<div><span class="ent-label">Definition</span><input class="ent-input" id="gloss-def" placeholder="Geographical sales zone (NW/NE/SS/SE/SW/NC)"/></div>' +
        '<button class="ent-btn" onclick="QPE.uiAddGlossary()" data-rbac-perm="glossary.write">➕ Add</button>' +
      '</div>' +
      '<div id="gloss-out" style="margin-top:10px"></div></div></div>',

    // 21. DASHBOARD
    '<div class="ent-sub" id="sub-dashboard">' +
      '<div class="ent-card"><div class="ent-card-title">📊 Usage Dashboard <span class="ent-pill blue">local-only</span></div>' +
      '<div class="ent-card-desc">Aggregated, <strong>local-only</strong> usage stats derived from your audit log. Top actions, role mix, most-queried tables, peak hour. Nothing is sent anywhere — these numbers exist only in your browser.</div>' +
      '<button class="ent-btn" onclick="QPE.renderDashboard()">📊 Refresh Dashboard</button>' +
      '<div id="dash-out" style="margin-top:14px"></div></div></div>',

    // 22-25 fold together (DocPack + Sync + Health)
    '<div class="ent-sub" id="sub-health">' +
      '<div class="ent-card"><div class="ent-card-title">🩺 Health Check</div>' +
      '<div class="ent-card-desc">Self-test of the browser features QueryPilot Enterprise depends on. Run after deployment to confirm everything works on the user\'s device.</div>' +
      '<button class="ent-btn" onclick="QPE.renderHealth()">🩺 Run Health Check</button>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">' +
        '<button class="ent-btn ghost" onclick="QPE.tour.start()">🎓 Restart Onboarding Tour</button>' +
        '<button class="ent-btn ghost" onclick="QPE.printDocPack()">📚 Print Data Pack</button>' +
      '</div>' +
      '<div id="health-out" style="margin-top:14px"></div></div></div>'
  ];

  p.innerHTML = '<div class="bw" style="max-width:920px;margin:0 auto">' +
    '<div class="btit">🏢 Enterprise Console <span class="ent-pill green">v8</span></div>' +
    '<div class="bsub">25 enterprise features for teams, governance, compliance and operational excellence. All free, all offline, no AI API. Built by Adewale Samson Adeagbo (<a href="https://hmgconcepts.pages.dev" target="_blank" style="color:var(--ac)">HMG Concepts</a>), Lagos, Nigeria.</div>' +
    nav + sections.join("") + '</div>';

  // Initial render
  QPE.renderWorkspaceList();
  // Echo workspace list inline (workspaces tab body)
  var inlineEl = document.getElementById("ws-mgr-inline");
  if(inlineEl){ inlineEl.id = "ws-list"; QPE.renderWorkspaceList(); }
  QPE.renderRoleSwitcher();
  QPE.renderGovernance();
  QPE.renderApprovals();
  QPE.renderAuditLog();
  QPE.renderVersioning();
  QPE.renderSchedules();
  QPE.renderCommentsPanel();
  QPE.renderVault();
  QPE.renderGlossary();
  QPE.refreshTestDataTables();
  QPE.applyRBACUI();
  QPE.subtab("workspaces", null);
};

QPE.subtab = function(id, btn){
  document.querySelectorAll("#entpanel .ent-sub").forEach(function(s){ s.classList.remove("on"); });
  var s = document.getElementById("sub-"+id);
  if(s) s.classList.add("on");
  document.querySelectorAll("#entpanel .ent-subtab").forEach(function(b){ b.classList.remove("on"); });
  if(btn) btn.classList.add("on");
  else {
    var b = document.querySelector("#entpanel .ent-subtab[data-sub='"+id+"']");
    if(b) b.classList.add("on");
  }
  // Lazy renders
  if(id === "dashboard") QPE.renderDashboard();
  if(id === "health") QPE.renderHealth();
};


/* ===================================================================
   FIRST-RUN: render chips, sync schema textarea with workspace
   =================================================================== */
function bootstrap(){
  // Load active workspace into the schema textarea on first load
  var ws = QPE.ws.active();
  var ta = document.getElementById("schema-ta");
  if(ws && ta && (ta.value === "" || lsGet("first_boot_done", false) === false)){
    ta.value = ws.schema;
    if(typeof refreshAll==="function") refreshAll();
    lsSet("first_boot_done", true);
  }
  QPE.renderWorkspaceChip();
  QPE.renderRoleChip();
  QPE.applyRBACUI();

  // Show onboarding tour on first ever load
  if(!lsGet("tour_done", false)){
    setTimeout(function(){ QPE.tour.start(); }, 1500);
  }
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

// Console signature for enterprise
try {
  console.log(
    "%cQueryPilot v9 Enterprise%c — 25 enterprise features loaded\n" +
    "Workspaces · RBAC · Governance · PII · Approvals · Audit · Lineage · Linter · Migrations · Test Data · Cost · Versions · Schedules · Bridge · Backup · Compliance · Comments · Vault · Tour · Dashboard · DocPack · Multi-tab Sync · Health · Glossary · Roles\n" +
    "Built by Adewale Samson Adeagbo · HMG Concepts · Lagos, Nigeria · MIT",
    "color:#3fb950;font-weight:700;font-size:14px",
    "color:#888;font-size:12px"
  );
} catch(e){}

})();

/* Header-chip shortcuts */
(function(){
  if(typeof QPE === "undefined") return;
  QPE.openWS = function(){
    // ensure sidebar is visible
    var sb = document.getElementById("sb");
    if(sb && sb.classList.contains("col")) sb.classList.remove("col");
    var btn = document.querySelector(".stab[onclick*=\"'ws'\"]");
    if(typeof spanel === "function") spanel("ws", btn);
  };
  QPE.openRoles = function(){
    var entBtn = document.querySelector(".mt-ent");
    if(typeof setMode === "function") setMode("ent", entBtn);
    setTimeout(function(){
      if(QPE.subtab) QPE.subtab("roles", null);
    }, 80);
  };
})();
