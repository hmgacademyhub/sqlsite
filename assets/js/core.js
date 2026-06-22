/* SQL Workflow For Data Analyst/Data Scientist shared core: navigation, storage, diagnostics, exports, utilities */
window.SQLWorkflow = (() => {
  const KEY = 'sql_workflow_state_v1';
  const defaults = {theme:'dark', snippets:[], pins:[], audit:[], notebook:null, academy:{completed:{}, badges:[], streak:0,last:''}, settings:{}};
  const clone = x => JSON.parse(JSON.stringify(x));
  const state = Object.assign(clone(defaults), JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('classdesk_state_v1') || '{}'));
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function qs(s, r=document){ return r.querySelector(s); }
  function qsa(s, r=document){ return Array.from(r.querySelectorAll(s)); }
  function esc(s=''){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'') || 'table'; }
  function toast(msg){ let t=qs('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);} t.innerHTML=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),4200); }
  function download(filename, content, type='text/plain'){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
  function csvEscape(v){ v=v==null?'':String(v); return /[",\n]/.test(v)?`"${v.replace(/"/g,'""')}"`:v; }
  function toCSV(result){ if(!result||!result.columns) return ''; return [result.columns.join(','), ...result.values.map(r=>r.map(csvEscape).join(','))].join('\n'); }
  function renderTable(result){ if(!result || !result.columns || !result.columns.length) return '<div class="empty">Statement executed. No tabular rows returned.</div>'; return `<table><thead><tr>${result.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${result.values.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`; }
  function parseCSV(text){ const lines=text.trim().split(/\r?\n/).filter(Boolean); if(!lines.length) return {columns:[], rows:[]}; const split=line=>{ const out=[]; let cur='',q=false; for(let i=0;i<line.length;i++){const ch=line[i]; if(ch==='"'){ if(q&&line[i+1]==='"'){cur+='"';i++;} else q=!q;} else if(ch===','&&!q){out.push(cur);cur='';} else cur+=ch;} out.push(cur); return out.map(x=>x.trim());}; const columns=split(lines[0]).map(slug); const rows=lines.slice(1).map(split); return {columns, rows}; }
  function markdown(md=''){ let html=esc(md); html=html.replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>'); html=html.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>'); html=html.replace(/^- (.*)$/gm,'<li>$1</li>').replace(/(<li>.*<\/li>)/gs,'<ul>$1</ul>'); return html.replace(/\n/g,'<br>'); }
  function formatSQL(sql=''){ const kws=['SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','ON','GROUP BY','ORDER BY','HAVING','LIMIT','UNION','VALUES','INSERT INTO','CREATE TABLE','DELETE FROM','UPDATE','SET']; let out=' '+sql.replace(/\s+/g,' ').trim(); kws.sort((a,b)=>b.length-a.length).forEach(k=>{ out=out.replace(new RegExp('\\s+'+k.replace(/ /g,'\\s+')+'\\s+','ig'), '\n'+k+' '); }); out=out.replace(/,\s*/g,',\n       ').replace(/^\n/,'').trim(); return out.endsWith(';')?out:out+';'; }
  function translate(sql='', target='sqlite'){
    let s=sql;
    if(target==='sqlite' || target==='postgres' || target==='mysql' || target==='duckdb' || target==='bigquery' || target==='snowflake'){
      s=s.replace(/SELECT\s+TOP\s+(\d+)\s+/i,'SELECT ');
      const top=(sql.match(/SELECT\s+TOP\s+(\d+)/i)||[])[1];
      if(top && !/LIMIT\s+\d+/i.test(s)) s=s.replace(/;?\s*$/, ` LIMIT ${top};`);
      
      if(target==='postgres' || target==='snowflake' || target==='bigquery') {
        s=s.replace(/GETDATE\(\)/ig, 'CURRENT_DATE()');
        s=s.replace(/DATE\('now'\)/ig, 'CURRENT_DATE()');
      } else if(target==='duckdb') {
        s=s.replace(/GETDATE\(\)/ig, 'today()');
        s=s.replace(/DATE\('now'\)/ig, 'current_date');
      } else {
        s=s.replace(/GETDATE\(\)/ig, "DATE('now')");
      }
      
      if(target==='postgres' || target==='snowflake' || target==='bigquery' || target==='duckdb') {
        s=s.replace(/IFNULL\(/ig, 'COALESCE(');
        s=s.replace(/ISNULL\(/ig, 'COALESCE(');
      } else {
        s=s.replace(/ISNULL\(/ig, 'IFNULL(');
      }
    }
    if(target==='sqlserver'){
      const lim=(s.match(/LIMIT\s+(\d+)/i)||[])[1];
      if(lim){
        s=s.replace(/SELECT/i,`SELECT TOP ${lim}`).replace(/\s+LIMIT\s+\d+/i,'');
      }
      s=s.replace(/DATE\('now'\)/ig,'GETDATE()').replace(/IFNULL\(/ig,'ISNULL(');
    }
    return formatSQL(s);
  }
  function analyzeSQL(sql=''){ const txt=sql.trim(); const low=txt.toLowerCase(); let score=10, findings=[]; const add=(level,msg,fix)=>{ findings.push({level,msg,fix}); score += level==='bad'?25:level==='warn'?12:4; };
    if(!txt) add('bad','Empty SQL input.','Write a SELECT, INSERT, UPDATE, DELETE or DDL statement.');
    if(/select\s+\*/i.test(txt)) add('warn','SELECT * can leak columns and slow production reports.','Select only required columns.');
    if(/delete\s+from\s+\w+\s*;?$/i.test(txt) || /update\s+\w+\s+set[\s\S]+;?$/i.test(txt) && !/\bwhere\b/i.test(txt)) add('bad','Destructive statement appears to be missing WHERE.','Add WHERE, run in transaction, and backup first.');
    if(/like\s+['"]%/i.test(txt)) add('warn','Leading wildcard LIKE usually prevents index usage.','Use full-text search, prefix search, or indexed normalized fields where possible.');
    if((low.match(/\bjoin\b/g)||[]).length>3) add('warn','Many JOINs increase complexity and duplicate-row risk.','Validate join keys and cardinality; consider CTEs.');
    if(/\b(avg|sum|count|min|max)\s*\(/i.test(txt) && /select/i.test(txt) && !/group\s+by/i.test(txt) && /,/.test(txt.split(/from/i)[0]||'')) add('warn','Aggregate mixed with non-aggregate columns but no GROUP BY detected.','Add GROUP BY for every non-aggregated selected column.');
    if(!/limit\s+\d+/i.test(txt) && /select/i.test(txt)) add('info','No LIMIT clause detected.','During exploration, add LIMIT to protect browser memory.');
    if(/\bor\s+1\s*=\s*1\b/i.test(txt)) add('bad','Potential SQL injection/testing pattern detected.','Never concatenate untrusted input; use parameters in server systems.');
    if(/explain|query plan/i.test(txt)) add('info','Profiler statement detected.','Use the Workbench Explain action for a readable plan.');
    score=Math.min(100,score); const grade=score<30?'Low':score<60?'Medium':'High'; return {score, grade, findings}; }
  function explainError(err=''){ const e=String(err).toLowerCase(); const rules=[[/no such table|doesn't exist|relation .* does not exist/,'The referenced table does not exist. Check spelling, load the dataset, or create the table first.'],[/no such column|unknown column|column .* does not exist/,'A column name is invalid for the selected table. Open Schema Explorer and verify column names/aliases.'],[/syntax error|near .* syntax/,'SQL syntax is malformed near the reported token. Check commas, quotes, parentheses and keyword order.'],[/ambiguous column/,'Two joined tables have a column with the same name. Prefix it with the table alias, e.g. learners.id.'],[/constraint|unique|foreign key/,'A data integrity constraint was violated. Check duplicate keys, required values and referenced parent rows.'],[/datatype|type mismatch/,'The value type does not match the column type. Convert or clean values before inserting/comparing.']]; const hit=rules.find(([r])=>r.test(e)); return hit?hit[1]:'No exact rule matched. Check statement order, object names, permissions, semicolons and whether the dataset is loaded.'; }
  function diff(a,b){ const A=a.split(/\r?\n/), B=b.split(/\r?\n/), n=Math.max(A.length,B.length); let html='<div class="table-wrap"><table><thead><tr><th>Original</th><th>Changed</th></tr></thead><tbody>'; for(let i=0;i<n;i++){ const same=A[i]===B[i]; html+=`<tr><td class="diff-line ${same?'':'del'}">${esc(A[i]||'')}</td><td class="diff-line ${same?'':'add'}">${esc(B[i]||'')}</td></tr>`; } return html+'</tbody></table></div>'; }
  function generateSQLFromPrompt(prompt=''){ const p=prompt.toLowerCase(); const exact=(HMG_DATA.patterns||[]).find(x=>x.match.every(m=>p.includes(m))); if(exact) return exact.sql; let table='learners'; if(p.includes('sale')||p.includes('revenue')||p.includes('profit')) table='sales'; if(p.includes('course')) table='courses'; if(p.includes('department')) table=p.includes('revenue')?'sales':'learners'; let sql='SELECT * FROM '+table; if(p.includes('active')) sql += " WHERE status = 'Active'"; if(p.includes('top')) sql += table==='sales'?' ORDER BY revenue DESC':' ORDER BY score DESC'; const lim=(p.match(/\b(\d+)\b/)||[])[1]; if(lim) sql += ' LIMIT '+lim; return sql+';'; }
  function drawChart(canvas, result, type='bar'){ const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height; ctx.clearRect(0,0,W,H); ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--panel2'); ctx.fillRect(0,0,W,H); if(!result||!result.values||!result.values.length){ctx.fillStyle='#94a3b8';ctx.fillText('No chartable data',20,30);return;} const labels=result.values.map(r=>String(r[0])); const nums=result.values.map(r=>Number(r.find((v,i)=>i>0 && !isNaN(Number(v))) ?? r[1])||0); const max=Math.max(...nums,1); ctx.font='13px sans-serif'; ctx.fillStyle='#94a3b8'; if(type==='pie'){ let total=nums.reduce((a,b)=>a+b,0)||1, start=-Math.PI/2; nums.forEach((v,i)=>{ const ang=v/total*Math.PI*2; ctx.beginPath(); ctx.moveTo(W/2,H/2); ctx.arc(W/2,H/2,Math.min(W,H)/3,start,start+ang); ctx.fillStyle=['#6366f1','#22c55e','#f59e0b','#38bdf8','#ef4444','#8b5cf6'][i%6]; ctx.fill(); start+=ang; }); labels.slice(0,6).forEach((l,i)=>{ctx.fillStyle=['#6366f1','#22c55e','#f59e0b','#38bdf8','#ef4444','#8b5cf6'][i%6]; ctx.fillRect(20,20+i*22,12,12); ctx.fillStyle='#94a3b8'; ctx.fillText(l,38,31+i*22);}); return; } const pad=45, bw=(W-pad*2)/nums.length*.7; ctx.strokeStyle='#334155'; ctx.beginPath(); ctx.moveTo(pad,20); ctx.lineTo(pad,H-pad); ctx.lineTo(W-20,H-pad); ctx.stroke(); if(type==='line'){ ctx.strokeStyle='#38bdf8'; ctx.lineWidth=3; ctx.beginPath(); nums.forEach((v,i)=>{const x=pad+i*((W-pad*2)/(Math.max(nums.length-1,1))), y=H-pad-(v/max)*(H-75); i?ctx.lineTo(x,y):ctx.moveTo(x,y);}); ctx.stroke(); } else { nums.forEach((v,i)=>{const x=pad+i*((W-pad*2)/nums.length)+10, h=(v/max)*(H-75); ctx.fillStyle=['#6366f1','#22c55e','#f59e0b','#38bdf8'][i%4]; ctx.fillRect(x,H-pad-h,bw,h);}); } labels.forEach((l,i)=>{ const x=pad+i*((W-pad*2)/nums.length)+4; ctx.save(); ctx.translate(x,H-12); ctx.rotate(-.35); ctx.fillStyle='#94a3b8'; ctx.fillText(l.slice(0,12),0,0); ctx.restore(); }); }
  function exportProject(){ const data=JSON.stringify({app:HMG_DATA.version, exportedAt:new Date().toISOString(), state}, null, 2); download('sql-workflow-project.hmg.json', data, 'application/json'); }
  function importProject(file){ return file.text().then(text=>{ const obj=JSON.parse(text); if(!obj.state) throw new Error('Invalid project file'); Object.assign(state, defaults, obj.state); save(); toast('Project imported. Reloading…'); setTimeout(()=>location.reload(),800); }); }
  function setupNav(){
    document.body.classList.toggle('light', state.theme==='light');
    const nav=qs('[data-nav]');
    if(nav){
      const cur=location.pathname.split('/').pop()||'index.html';
      const groups = [
        {
          name: 'Workspace IDE',
          pages: [
            ['Workbench', 'workbench.html'],
            ['QueryFlow Builder', 'queryflow.html'],
            ['QueryPilot Hub', 'querypilot-v9.html'],
            ['SQL Notebook', 'notebook.html']
          ]
        },
        {
          name: 'Modeling & Engineering',
          pages: [
            ['Analytics Engineering', 'analytics-engineering.html'],
            ['Portfolio Lab', 'portfolio-lab.html'],
            ['Executive Dashboard', 'dashboard.html']
          ]
        },
        {
          name: 'Learning & Practice',
          pages: [
            ['Academy Hub', 'academy.html'],
            ['Practice Arena', 'practice-arena.html'],
            ['Spaced Flashcards', 'flashcards.html']
          ]
        },
        {
          name: 'Audit & Governance',
          pages: [
            ['SQL Diagnostics', 'diagnostics.html'],
            ['Enterprise Suite', 'enterprise-suite.html']
          ]
        },
        {
          name: 'Ecosystem & Info',
          pages: [
            ['Global Search', 'search.html'],
            ['HMG Ecosystem', 'ecosystem.html'],
            ['Builder Profile', 'persona.html'],
            ['About Platform', 'about.html']
          ]
        }
      ];

      let navHtml = `<a class="logo" href="index.html"><span class="logo-badge">💎</span><span>SQL Workflow<small>Data Analyst/Data Scientist</small></span></a>`;
      navHtml += `<button class="btn-small hamb" id="hamb">☰</button>`;
      navHtml += `<div class="nav-links" id="navLinks">`;
      navHtml += `<a class="${cur==='index.html'?'active':''}" href="index.html">Home</a>`;
      
      groups.forEach(g => {
        const anyActive = g.pages.some(p => cur === p[1]);
        navHtml += `
          <div class="nav-dropdown ${anyActive ? 'active' : ''}">
            <button class="nav-dropdown-trigger">${g.name} <small>▼</small></button>
            <div class="nav-dropdown-content">
              ${g.pages.map(p => `<a class="${cur===p[1]?'active':''}" href="${p[1]}">${p[0]}</a>`).join('')}
            </div>
          </div>
        `;
      });
      
      navHtml += `</div>`;
      navHtml += `<div class="nav-actions"><button class="btn-small" id="themeBtn" title="Toggle theme">🌓</button></div>`;
      
      nav.innerHTML = navHtml;
      
      qs('#themeBtn').onclick=()=>{
        state.theme=state.theme==='light'?'dark':'light';
        save();
        document.body.classList.toggle('light',state.theme==='light');
      };
      qs('#hamb')?.addEventListener('click',()=>qs('#navLinks').classList.toggle('open'));
    }

    const foot=qs('[data-footer]');
    if(foot){
      foot.innerHTML=`<div class="footer-grid">
        <div>
          <div class="logo">
            <span class="logo-badge">💎</span>
            <span>SQL Workflow<small>Free browser-native data intelligence</small></span>
          </div>
          <p class="muted">Designed for HMG Academy Hub. No paid AI API required. Static deployment ready.</p>
        </div>
        <div>
          <strong>Workflow Platform</strong>
          <a href="index.html">Home Dashboard</a>
          <a href="search.html">Search Tool</a>
          <a href="enterprise-suite.html">Enterprise Suite</a>
          <a href="about.html">About & Features</a>
        </div>
        <div>
          <strong>HMG Ecosystem</strong>
          <a href="persona.html">Adewale Samson Adeagbo</a>
          <a href="ecosystem.html">Ecosystem Page</a>
          <a href="https://hmgconcepts.pages.dev">HMG Concepts</a>
          <a href="https://hmgtechnologies.pages.dev">HMG Technologies</a>
          <a href="https://hmgacademy.pages.dev">HMG Academy</a>
          <a href="https://hmgmedia.pages.dev">HMG Media</a>
          <a href="https://hmggospel.pages.dev">HMG Gospel</a>
        </div>
      </div>`;
    }
    if('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
  document.addEventListener('DOMContentLoaded', setupNav);
  return {state, save, qs,qsa,esc,slug,toast,download,toCSV,renderTable,parseCSV,markdown,formatSQL,translate,analyzeSQL,explainError,diff,generateSQLFromPrompt,drawChart,exportProject,importProject};
})();
