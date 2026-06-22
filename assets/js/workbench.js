document.addEventListener('DOMContentLoaded', async () => {
  const C=SQLWorkflow; let engine=await SQLWorkflowSQLEngine.create(); let lastResult=null, lastSQL='';
  const ed=C.qs('#sqlEditor'), status=C.qs('#engineStatus'); status.textContent='Engine: '+(engine.real?'SQLite WASM':'offline fallback');
  
  async function profileTable(tableName) {
    try {
      const start = performance.now();
      let totalRows = 0;
      let columns = [];
      let rows = [];
      
      if (engine.real) {
        const rc = engine.exec(`SELECT COUNT(*) FROM ${tableName}`);
        totalRows = rc.values[0][0];
        
        const colsQuery = engine.schema().find(t => t.name === tableName);
        columns = colsQuery ? colsQuery.columns : [];
        
        const profileColumns = ['Column Name', 'Inferred Type', 'Null Count', 'Distinct Values', 'Min Value', 'Max Value'];
        const profileRows = [];
        
        for (const col of columns) {
          const nc = engine.exec(`SELECT COUNT(*) FROM ${tableName} WHERE ${col} IS NULL OR ${col} = ''`);
          const nulls = nc.values[0][0];
          
          const dc = engine.exec(`SELECT COUNT(DISTINCT ${col}) FROM ${tableName}`);
          const distinct = dc.values[0][0];
          
          let minVal = 'N/A', maxVal = 'N/A';
          try {
            const minc = engine.exec(`SELECT MIN(${col}), MAX(${col}) FROM ${tableName}`);
            minVal = minc.values[0][0] ?? 'NULL';
            maxVal = minc.values[0][1] ?? 'NULL';
          } catch(e) {}
          
          let type = 'TEXT';
          try {
            const tc = engine.exec(`SELECT COUNT(*) FROM ${tableName} WHERE typeof(${col}) = 'integer' OR typeof(${col}) = 'real'`);
            if (tc.values[0][0] > 0) type = 'NUMERIC';
          } catch(e) {}
          
          profileRows.push([col, type, nulls, distinct, minVal, maxVal]);
        }
        
        const profileResult = {
          columns: profileColumns,
          values: profileRows
        };
        
        const dur = Math.round(performance.now() - start);
        C.qs('#results').innerHTML = `
          <div class="notice ok" style="margin-bottom:1rem">
            <h3>📊 Data Profile for Table: <strong>${C.esc(tableName)}</strong></h3>
            <p>Total Records: <strong>${totalRows}</strong> | Profiling duration: <strong>${dur} ms</strong></p>
            <p class="muted">This profile analyzes null values, distinct keys, type heuristics, and numeric distributions across your columns.</p>
          </div>
          ${C.renderTable(profileResult)}
        `;
        C.qs('#rowCount').textContent = columns.length + ' profiled cols';
        C.qsa('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab==='resultsTab'));
        C.qsa('.tabs').forEach(t=>t.classList.toggle('active',t.id==='resultsTab'));
      } else {
        const tbl = engine.db.tables[tableName];
        if (tbl) {
          totalRows = tbl.rows.length;
          columns = tbl.columns;
          
          const profileColumns = ['Column Name', 'Inferred Type', 'Null Count', 'Distinct Values', 'Min Value', 'Max Value'];
          const profileRows = [];
          
          columns.forEach((col, colIdx) => {
            const vals = tbl.rows.map(r => r[colIdx]);
            const nulls = vals.filter(v => v === null || v === undefined || v === '').length;
            const distinct = new Set(vals.filter(v => v !== null && v !== undefined && v !== '')).size;
            
            const numericVals = vals.map(Number).filter(v => !isNaN(v));
            let type = numericVals.length > totalRows * 0.5 ? 'NUMERIC' : 'TEXT';
            let minVal = numericVals.length ? Math.min(...numericVals) : (vals.length ? vals.sort()[0] : 'N/A');
            let maxVal = numericVals.length ? Math.max(...numericVals) : (vals.length ? vals.sort().reverse()[0] : 'N/A');
            
            profileRows.push([col, type, nulls, distinct, minVal, maxVal]);
          });
          
          const profileResult = {
            columns: profileColumns,
            values: profileRows
          };
          
          const dur = Math.round(performance.now() - start);
          C.qs('#results').innerHTML = `
            <div class="notice ok" style="margin-bottom:1rem">
              <h3>📊 Data Profile for Table (Fallback Mode): <strong>${C.esc(tableName)}</strong></h3>
              <p>Total Records: <strong>${totalRows}</strong> | Profiling duration: <strong>${dur} ms</strong></p>
              <p class="muted">Profiling raw JS cache datasets in sandbox fallback environment.</p>
            </div>
            ${C.renderTable(profileResult)}
          `;
          C.qs('#rowCount').textContent = columns.length + ' profiled cols';
          C.qsa('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab==='resultsTab'));
          C.qsa('.tabs').forEach(t=>t.classList.toggle('active',t.id==='resultsTab'));
        }
      }
    } catch(e) {
      C.toast('Profiling failed: ' + e.message);
    }
  }


  function refreshSchema(){
    const schema=engine.schema();
    C.qs('#schemaList').innerHTML=schema.map(t=>`
      <div class="schema-item" style="margin-bottom:.5rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${C.esc(t.name)}</strong>
          <button class="btn-small" data-profile="${C.esc(t.name)}" style="padding:.2rem .4rem;font-size:.7rem;margin:0;">📊 Profile</button>
        </div>
        <code style="display:block;margin-top:.25rem;font-size:.75rem;">${t.columns.map(C.esc).join(', ')}</code>
      </div>
    `).join('');
    
    C.qsa('[data-profile]').forEach(btn => {
      btn.onclick = (ev) => {
        ev.stopPropagation();
        profileTable(btn.dataset.profile);
      };
    });
    
    C.qs('#builderTable').innerHTML=schema.map(t=>`<option>${C.esc(t.name)}</option>`).join('');
    C.qs('#erMap').innerHTML=HMG_DATA.relationships.map(r=>`<div class="schema-item">${C.esc(r[0])}<br><span class="muted">↳ ${C.esc(r[1])}</span></div>`).join('');
  }

  function addAudit(sql,dur,ok,msg){ C.state.audit.unshift({time:new Date().toLocaleString(),sql,duration:dur,status:ok?'OK':'ERROR',message:msg||''}); C.state.audit=C.state.audit.slice(0,80); C.save(); renderAudit(); }
  function renderAudit(){ const r={columns:['Time','Status','Duration','SQL','Message'],values:C.state.audit.map(a=>[a.time,a.status,a.duration+' ms',a.sql,a.message])}; C.qs('#auditOut').innerHTML=C.renderTable(r); }
  function renderSnippets(){ C.qs('#snippetList').innerHTML=(C.state.snippets||[]).map((s,i)=>`<div class="schema-item"><button class="btn-small" data-snip="${i}">Use</button> <strong>${C.esc(s.title)}</strong><code>${C.esc(s.sql).slice(0,120)}</code></div>`).join('')||'<div class="empty">No snippets saved.</div>'; C.qsa('[data-snip]').forEach(b=>b.onclick=()=>{ed.value=C.state.snippets[b.dataset.snip].sql;}); }
  function showResult(res){ lastResult=res; C.qs('#results').innerHTML=C.renderTable(res); C.qs('#rowCount').textContent=(res.values?.length||0)+' rows'; }
  async function run(){ const sql=ed.value; const start=performance.now(); try{ const res=engine.exec(sql); const dur=Math.round(performance.now()-start); showResult(res); lastSQL=sql; addAudit(sql,dur,true,''); C.toast('Query executed in '+dur+' ms'); }catch(e){ const dur=Math.round(performance.now()-start); C.qs('#results').innerHTML=`<div class="notice bad"><strong>Error:</strong> ${C.esc(e.message)}<br>${C.esc(C.explainError(e.message))}</div>`; addAudit(sql,dur,false,e.message); } }
  function lint(){ const a=C.analyzeSQL(ed.value); const html=`<strong>${a.grade} risk · score ${a.score}/100</strong><ul>${a.findings.map(f=>`<li><b>${f.level.toUpperCase()}:</b> ${C.esc(f.msg)}<br><span class="muted">Fix: ${C.esc(f.fix)}</span></li>`).join('')||'<li>No major issue detected.</li>'}</ul>`; C.qs('#governanceOut').innerHTML=html; C.qs('#explainOut').innerHTML=html; }
  C.qs('#runBtn').onclick=run; C.qs('#formatBtn').onclick=()=>{ed.value=C.formatSQL(ed.value)}; C.qs('#lintBtn').onclick=lint;
  C.qs('#explainBtn').onclick=()=>{ try{ const plan=engine.explain(ed.value); C.qs('#explainOut').innerHTML=C.renderTable(plan)+'<div class="notice" style="margin-top:.7rem">'+C.analyzeSQL(ed.value).findings.map(f=>`<p><b>${f.level}:</b> ${C.esc(f.msg)} ${C.esc(f.fix)}</p>`).join('')+'</div>'; C.qsa('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab==='explainTab')); C.qsa('.tabs').forEach(t=>t.classList.toggle('active',t.id==='explainTab')); }catch(e){C.qs('#explainOut').innerHTML='<div class="notice bad">'+C.esc(e.message)+'</div>';} };
  C.qs('#pilotBtn').onclick=()=>{ const sql=C.generateSQLFromPrompt(C.qs('#pilotPrompt').value); ed.value=sql; C.qs('#pilotOut').innerHTML=`Generated deterministic SQL:<pre class="code"><code>${C.esc(sql)}</code></pre>`; };
  C.qs('#pilotExplain').onclick=()=>{ C.qs('#pilotOut').innerHTML='<strong>How Pilot works:</strong><p class="muted">It checks keywords such as top, active, revenue, margin, course and department, then applies vetted templates from assets/js/data.js. This is transparent, free and auditable.</p>'; };
  C.qs('#builderBtn').onclick=()=>{ const t=C.qs('#builderTable').value, cols=C.qs('#builderCols').value||'*', w=C.qs('#builderWhere').value, g=C.qs('#builderGroup').value, o=C.qs('#builderOrder').value; ed.value=`SELECT ${cols}\nFROM ${t}${w?'\nWHERE '+w:''}${g?'\nGROUP BY '+g:''}${o?'\nORDER BY '+o:''};`; };
  C.qs('#csvBtn').onclick=()=> lastResult ? C.download('sql-workflow-results.csv',C.toCSV(lastResult),'text/csv') : C.toast('Run a query first.');
  C.qs('#reportBtn').onclick=()=>{ const html=`<!doctype html><title>SQL Workflow For Data Analyst/Data Scientist SQL Report</title><style>body{font-family:Arial;padding:2rem}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:.5rem}pre{background:#111;color:#eee;padding:1rem}</style><h1>SQL Workflow For Data Analyst/Data Scientist SQL Report</h1><p>${new Date().toLocaleString()}</p><pre>${C.esc(lastSQL||ed.value)}</pre>${C.renderTable(lastResult)}`; C.download('sql-workflow-report.html',html,'text/html'); };
  C.qs('#chartBtn').onclick=()=>C.drawChart(C.qs('#chartCanvas'), lastResult, C.qs('#chartType').value);
  C.qs('#pinBtn').onclick=()=>{ if(!lastResult) return C.toast('Run a query first.'); C.state.pins.unshift({title:(lastSQL||'SQL result').split('\n')[0].slice(0,60), type:C.qs('#chartType').value, result:lastResult, sql:lastSQL, time:new Date().toLocaleString()}); C.save(); C.toast('Pinned to dashboard.'); };
  C.qs('#saveSnippetBtn').onclick=()=>{ const title=prompt('Snippet title','SQL snippet'); if(!title) return; C.state.snippets.unshift({title,sql:ed.value,time:new Date().toISOString()}); C.save(); renderSnippets(); };
  C.qs('#exportProjectBtn').onclick=C.exportProject; C.qs('#importProjectInput').onchange=e=>e.target.files[0]&&C.importProject(e.target.files[0]).catch(err=>C.toast('Import failed: '+err.message));
  C.qs('#loadPackBtn').onclick=async()=>{ engine=await SQLWorkflowSQLEngine.create(); refreshSchema(); status.textContent='Engine: '+(engine.real?'SQLite WASM sample reloaded':'offline fallback reloaded'); C.toast('Sample data pack loaded.'); };
  C.qs('#csvInput').onchange=async e=>{ for(const f of e.target.files){ const parsed=C.parseCSV(await f.text()); engine.addTable(f.name.replace(/\.csv$/i,''), parsed.columns, parsed.rows); } refreshSchema(); C.toast('CSV table(s) imported.'); };
  C.qsa('[data-tab]').forEach(b=>b.onclick=()=>{ C.qsa('[data-tab]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); C.qsa('.tabs').forEach(t=>t.classList.toggle('active',t.id===b.dataset.tab)); });
  document.addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){ e.preventDefault(); run(); } });
  refreshSchema(); renderAudit(); renderSnippets(); lint();
});
