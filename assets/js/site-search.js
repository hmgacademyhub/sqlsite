const SQLV6_SEARCH_INDEX = [
  ['Home','index.html','SQL v6 gateway for ClassDesk, QueryFlow v3, QueryPilot v9, HMG ecosystem and deployment.','home gateway overview'],
  ['Workbench','workbench.html','SQL editor, CSV upload, visual builder, schema explorer, audit, charts, snippets, project export.','sql ide csv chart report'],
  ['QueryFlow v3 Lab','queryflow.html','No-code SQL, plain English parser, pivot, profiler, insights, charts, saved history and share tokens.','queryflow pivot profiler insights'],
  ['QueryPilot v9 Console','querypilot-v9.html','Full QueryPilot app with 11 SQL modes, enterprise console and 118-lesson Learning Hub.','querypilot enterprise learning hub'],
  ['Practice Arena','practice-arena.html','Interview-style SQL challenges, timed mocks, wrong-answer diagnostics, skill radar, badges and local leaderboard.','practice interview diagnostic leaderboard'],
  ['Analytics Engineering Lab','analytics-engineering.html','dbt-inspired SQL model planner, YAML tests, docs, lineage, semantic metrics and project skeleton export.','dbt tests lineage analytics engineering'],
  ['Portfolio Lab','portfolio-lab.html','Dataset catalog, case-study generator, reproducibility checklist and portfolio brief export.','portfolio dataset kaggle reproducibility'],
  ['Flashcards','flashcards.html','Spaced repetition SQL flashcards for clauses, joins, windows, data quality, governance and analytics engineering.','flashcards spaced repetition study'],
  ['Enterprise Suite','enterprise-suite.html','RBAC, audit, governance, PII scanner, approvals, lineage, linter, migrations, vault and compliance.','rbac audit pii compliance governance'],
  ['Academy','academy.html','Guided SQL certification lessons, hints, result validation, progress and badges.','academy lessons certification'],
  ['Notebook','notebook.html','Markdown, SQL and chart notebook for reproducible analysis stories and HTML reports.','notebook markdown sql chart'],
  ['Diagnostics','diagnostics.html','SQL linting, error explainer, dialect translator, data quality, security review and diff.','diagnostics lint security diff'],
  ['Dashboard','dashboard.html','Executive KPIs and pinned visual analysis dashboard.','dashboard kpi pins'],
  ['Builder Profile','persona.html','Adewale Samson Adeagbo profile: AI-Augmented Solutions Developer, Data Scientist and STEM Educator.','adewale cssadewale founder persona'],
  ['HMG Ecosystem','ecosystem.html','HMG Concepts, HMG Academy, HMG Technologies, HMG Media and HMG Gospel.','hmg concepts academy technologies media gospel'],
  ['About','about.html','About SQL v6 and feature explanations.','about features hmg'],
  ['Enterprise Reference','ENTERPRISE.md','Complete QueryPilot enterprise feature reference.','enterprise reference rbac audit'],
  ['Learning Hub Reference','LEARNING_HUB.md','Data Science Learning Hub reference: 9 modules and 118 lessons.','data science curriculum learning'],
  ['Author Reference','AUTHOR.md','Detailed builder story and HMG Concepts background.','author adewale story'],
  ['Deployment Guide','DEPLOYMENT.md','Cloudflare Pages, Netlify, Vercel and GitHub Pages deployment instructions.','deploy cloudflare netlify vercel github']
];
(function(){
  const input=document.getElementById('siteSearch'), out=document.getElementById('searchResults'), stats=document.getElementById('searchStats');
  if(!input||!out) return;
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function render(q=''){
    const words=q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let rows=SQLV6_SEARCH_INDEX.map(x=>({x,score: words.reduce((a,w)=>a+(x.join(' ').toLowerCase().includes(w)?1:0),0)}));
    if(words.length) rows=rows.filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.x[0].localeCompare(b.x[0]));
    else rows=rows.slice(0,12).map(x=>({x,score:0}));
    stats.textContent=`${rows.length} result${rows.length===1?'':'s'}${words.length?' for “'+q+'”':''}`;
    out.innerHTML=rows.map(({x})=>`<article class="card"><h3>${esc(x[0])}</h3><p class="muted">${esc(x[2])}</p><p><span class="pill">${esc(x[3])}</span></p><a class="btn-small" href="${esc(x[1])}">Open →</a></article>`).join('') || '<div class="empty">No match. Try another keyword.</div>';
  }
  input.addEventListener('input',()=>render(input.value)); render('');
})();
