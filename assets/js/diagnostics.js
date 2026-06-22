document.addEventListener('DOMContentLoaded',()=>{
 const C=ClassDesk;
 function findingsHTML(a){ return `<strong>${a.grade} risk · score ${a.score}/100</strong><ul>${a.findings.map(f=>`<li><b>${f.level.toUpperCase()}:</b> ${C.esc(f.msg)}<br><span class="muted">Fix: ${C.esc(f.fix)}</span></li>`).join('')||'<li>No major issue detected.</li>'}</ul>`; }
 C.qs('#runDiag').onclick=()=>{ const a=C.analyzeSQL(C.qs('#diagSql').value); C.qs('#diagOut').innerHTML=findingsHTML(a); };
 C.qs('#explainErr').onclick=()=>{ C.qs('#errOut').innerHTML=C.esc(C.explainError(C.qs('#errText').value)); };
 C.qs('#translateBtn').onclick=()=>{ const out=C.translate(C.qs('#transSql').value,C.qs('#dialect').value); C.qs('#transOut').innerHTML=`<pre class="code"><code>${C.esc(out)}</code></pre>`; };
 C.qs('#secBtn').onclick=()=>{ const a=C.analyzeSQL(C.qs('#secSql').value); const extra=[]; if(/drop\s+table|truncate/i.test(C.qs('#secSql').value)) extra.push({level:'bad',msg:'DROP/TRUNCATE is destructive.',fix:'Require approval and backups.'}); C.qs('#secOut').innerHTML=findingsHTML({grade:a.grade,score:a.score,findings:[...a.findings,...extra]}); };
 C.qs('#diffBtn').onclick=()=>{ C.qs('#diffOut').innerHTML=C.diff(C.qs('#diffA').value,C.qs('#diffB').value); };
 C.qs('#dqBtn').onclick=()=>{ const blocks=Object.entries(HMG_DATA.tables).map(([name,t])=>{ const nulls=t.columns.map((c,i)=>[c,t.rows.filter(r=>r[i]===''||r[i]==null).length]).filter(x=>x[1]); const dup=t.rows.length-new Set(t.rows.map(r=>JSON.stringify(r))).size; return `<div class="schema-item"><strong>${C.esc(name)}</strong><p class="muted">Rows: ${t.rows.length}; Columns: ${t.columns.length}; Duplicate rows: ${dup}; Null fields: ${nulls.length?nulls.map(x=>x.join(':')).join(', '):'none'}</p></div>`; }).join(''); C.qs('#dqOut').innerHTML=blocks; };
 C.qs('#copyDiag').onclick=()=>{ const txt=['Complexity',C.qs('#diagOut').innerText,'Error',C.qs('#errOut').innerText,'Translation',C.qs('#transOut').innerText,'Data Quality',C.qs('#dqOut').innerText,'Security',C.qs('#secOut').innerText].join('\n\n'); navigator.clipboard?.writeText(txt); C.toast('Diagnostic summary copied.'); };
});
