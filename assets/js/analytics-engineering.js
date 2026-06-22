document.addEventListener('DOMContentLoaded',()=>{
 const C=SQLWorkflow; const tables=Object.keys(HMG_DATA.tables); const state=C.state.analyticsEngineering||(C.state.analyticsEngineering={last:{}});
 function cols(t){return HMG_DATA.tables[t]?.columns||[];} function slug(s){return C.slug(s).replace(/_+/g,'_');}
 function populate(){document.getElementById('aeSource').innerHTML=tables.map(t=>`<option>${C.esc(t)}</option>`).join(''); document.getElementById('aeSource').onchange=defaultName; document.getElementById('aeLayer').onchange=defaultName; defaultName(); renderMetrics();}
 function defaultName(){const src=document.getElementById('aeSource').value, layer=document.getElementById('aeLayer').value; const prefix={staging:'stg',intermediate:'int',mart:'fct',semantic:'sem'}[layer]; document.getElementById('aeModel').value=`${prefix}_${src}`; document.getElementById('aeGrain').value=src.includes('enroll')?'one row per enrollment':src.includes('student')?'one row per student-subject':src.includes('sales')?'one row per sales transaction':'one row per source record';}
 function generate(){const src=document.getElementById('aeSource').value, layer=document.getElementById('aeLayer').value, model=slug(document.getElementById('aeModel').value), grain=document.getElementById('aeGrain').value, c=cols(src); const selectedTests=Array.from(document.querySelectorAll('.aeTest:checked')).map(x=>x.value); let sql=`-- model: ${model}\n-- layer: ${layer}\n-- grain: ${grain}\n\nSELECT\n  ${c.map(x=>x+' AS '+slug(x)).join(',\n  ')}\nFROM ${src};`;
  const first=c[0]||'id', numeric=c.find(x=>/score|fee|sales|total|price|amount|giving|attendance|revenue/i.test(x)); let yaml=`version: 2\n\nmodels:\n  - name: ${model}\n    description: \"${layer} model built from ${src}. Grain: ${grain}.\"\n    columns:\n`; c.forEach((col,i)=>{yaml+=`      - name: ${slug(col)}\n        description: \"${col} from ${src}.\"\n`; if((i===0&&selectedTests.includes('not_null'))||(/id|name|status|date/i.test(col)&&selectedTests.includes('not_null'))) yaml+=`        tests:\n          - not_null\n`; if(i===0&&selectedTests.includes('unique')) yaml+=(yaml.endsWith('tests:\n          - not_null\n')?'          - unique\n':'        tests:\n          - unique\n'); if(selectedTests.includes('accepted_values')&&/status|grade|level|channel|region|department/i.test(col)) yaml+=`        meta:\n          suggested_test: accepted_values\n`; });
  const lineage=`<svg viewBox="0 0 760 170" style="width:100%;max-width:760px"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6"/></marker></defs><rect x="20" y="55" width="190" height="60" rx="14" fill="#172033" stroke="#334155"/><text x="115" y="90" text-anchor="middle" fill="#e5e7eb">source: ${src}</text><line x1="210" y1="85" x2="330" y2="85" stroke="#8b5cf6" stroke-width="3" marker-end="url(#arrow)"/><rect x="330" y="55" width="190" height="60" rx="14" fill="#172033" stroke="#6366f1"/><text x="425" y="90" text-anchor="middle" fill="#e5e7eb">${model}</text><line x1="520" y1="85" x2="640" y2="85" stroke="#8b5cf6" stroke-width="3" marker-end="url(#arrow)"/><rect x="640" y="55" width="100" height="60" rx="14" fill="#172033" stroke="#22c55e"/><text x="690" y="90" text-anchor="middle" fill="#e5e7eb">BI / App</text></svg>`;
  const checklist=`${lineage}<h3>Run checklist</h3><ol><li>Confirm grain: ${C.esc(grain)}.</li><li>Run not-null/unique tests on key columns.</li><li>Document accepted values for categories.</li><li>Review downstream dashboard impact.</li><li>Commit SQL and YAML to version control.</li></ol>`;
  document.getElementById('aeSql').value=sql; document.getElementById('aeYaml').value=yaml; document.getElementById('aeLineage').innerHTML=checklist; state.last={model,sql,yaml,checklist}; C.save(); renderMetrics(src,numeric);}
 function renderMetrics(src=document.getElementById('aeSource')?.value||tables[0], numeric){const c=cols(src), nums=c.filter(x=>/score|fee|sales|total|price|amount|giving|attendance|revenue|cost|quantity/i.test(x)); document.getElementById('metricsOut').innerHTML=(nums.length?nums:[c[0]]).map(m=>`<div class="schema-item"><strong>${C.esc(slug(src+'_'+m))}</strong><p class="muted">Metric idea: SUM/AVG of ${C.esc(m)} from ${C.esc(src)}</p></div>`).join('');}
 document.getElementById('generateAE').onclick=generate;
 
 // Advanced Analytics Pattern Generator
 const patBtn = document.getElementById('generatePatternAE');
 if (patBtn) {
   patBtn.onclick = () => {
     const src = document.getElementById('aeSource').value;
     const pattern = document.getElementById('aePattern').value;
     const colDate = document.getElementById('aePatDate').value;
     const colNum = document.getElementById('aePatNum').value;
     const colId = document.getElementById('aePatId').value;
     
     let sql = "";
     let desc = "";
     let tests = "";
     
     if (pattern === 'yoy') {
       sql = `-- Year-over-Year (YoY) Sales & Revenue Growth\n`;
       sql += `WITH sales_by_period AS (\n`;
       sql += `  SELECT\n`;
       sql += `    ${colDate} AS period_unit,\n`;
       sql += `    SUM(${colNum}) AS periodic_total\n`;
       sql += `  FROM ${src}\n`;
       sql += `  GROUP BY 1\n`;
       sql += `)\n`;
       sql += `SELECT\n`;
       sql += `  period_unit,\n`;
       sql += `  periodic_total,\n`;
       sql += `  LAG(periodic_total, 1) OVER (ORDER BY period_unit) AS prior_period_total,\n`;
       sql += `  periodic_total - LAG(periodic_total, 1) OVER (ORDER BY period_unit) AS net_period_change,\n`;
       sql += `  ROUND(\n`;
       sql += `    (periodic_total - LAG(periodic_total, 1) OVER (ORDER BY period_unit)) * 100.0 / \n`;
       sql += `    (CASE WHEN LAG(periodic_total, 1) OVER (ORDER BY period_unit) = 0 THEN 1 ELSE LAG(periodic_total, 1) OVER (ORDER BY period_unit) END),\n`;
       sql += `    2\n`;
       sql += `  ) AS yoy_growth_pct\n`;
       sql += `FROM sales_by_period\n`;
       sql += `ORDER BY period_unit;`;
       
       desc = `Year-over-Year growth of ${colNum} across periods of ${colDate}.`;
       tests = `not_null, positive_values`;
     } else if (pattern === 'running') {
       sql = `-- Cumulative / Running Total of ${colNum} Over Time\n`;
       sql += `SELECT\n`;
       sql += `  ${colId},\n`;
       sql += `  ${colDate},\n`;
       sql += `  ${colNum},\n`;
       sql += `  SUM(${colNum}) OVER (\n`;
       sql += `    ORDER BY ${colDate}\n`;
       sql += `    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n`;
       sql += `  ) AS cumulative_running_total\n`;
       sql += `FROM ${src}\n`;
       sql += `ORDER BY ${colDate};`;
       
       desc = `Cumulative sum of ${colNum} ordered by ${colDate}.`;
       tests = `not_null`;
     } else if (pattern === 'dedup') {
       sql = `-- Deduplicate records using ROW_NUMBER()\n`;
       sql += `WITH ranked_records AS (\n`;
       sql += `  SELECT\n`;
       sql += `    ${colId},\n`;
       sql += `    ${colDate},\n`;
       sql += `    *,\n`;
       sql += `    ROW_NUMBER() OVER (\n`;
       sql += `      PARTITION BY ${colId} \n`;
       sql += `      ORDER BY ${colDate} DESC\n`;
       sql += `    ) AS row_num\n`;
       sql += `  FROM ${src}\n`;
       sql += `)\n`;
       sql += `SELECT *\n`;
       sql += `FROM ranked_records\n`;
       sql += `WHERE row_num = 1; -- Retains only the most recent version of each key`;
       
       desc = `Deduplicated version of ${src} keeping the latest entry per ${colId}.`;
       tests = `unique, not_null`;
     } else if (pattern === 'moving') {
       sql = `-- Rolling 30-Day Moving Average\n`;
       sql += `WITH daily_totals AS (\n`;
       sql += `  SELECT \n`;
       sql += `    ${colDate} AS date_day,\n`;
       sql += `    SUM(${colNum}) AS daily_sum\n`;
       sql += `  FROM ${src}\n`;
       sql += `  GROUP BY 1\n`;
       sql += `)\n`;
       sql += `SELECT\n`;
       sql += `  date_day,\n`;
       sql += `  daily_sum,\n`;
       sql += `  AVG(daily_sum) OVER (\n`;
       sql += `    ORDER BY date_day\n`;
       sql += `    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW\n`;
       sql += `  ) AS rolling_30_day_avg,\n`;
       sql += `  COUNT(daily_sum) OVER (\n`;
       sql += `    ORDER BY date_day\n`;
       sql += `    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW\n`;
       sql += `  ) AS days_in_window\n`;
       sql += `FROM daily_totals\n`;
       sql += `ORDER BY date_day;`;
       
       desc = `30-period rolling average of ${colNum} ordered by ${colDate}.`;
       tests = `not_null`;
     } else if (pattern === 'cohort') {
       sql = `-- User Cohort Retention Rate Analysis\n`;
       sql += `WITH user_first_activity AS (\n`;
       sql += `  SELECT \n`;
       sql += `    ${colId} AS user_id,\n`;
       sql += `    MIN(${colDate}) AS cohort_month\n`;
       sql += `  FROM ${src}\n`;
       sql += `  GROUP BY 1\n`;
       sql += `),\n`;
       sql += `user_active_months AS (\n`;
       sql += `  SELECT DISTINCT\n`;
       sql += `    ${colId} AS user_id,\n`;
       sql += `    ${colDate} AS activity_month\n`;
       sql += `  FROM ${src}\n`;
       sql += `)\n`;
       sql += `SELECT\n`;
       sql += `  f.cohort_month,\n`;
       sql += `  a.activity_month,\n`;
       sql += `  COUNT(DISTINCT f.user_id) AS active_users,\n`;
       sql += `  ROUND(COUNT(DISTINCT f.user_id) * 100.0 / total_cohort_users.cohort_size, 2) AS retention_pct\n`;
       sql += `FROM user_first_activity f\n`;
       sql += `JOIN user_active_months a ON f.user_id = a.user_id\n`;
       sql += `JOIN (\n`;
       sql += `  SELECT cohort_month, COUNT(DISTINCT user_id) AS cohort_size\n`;
       sql += `  FROM user_first_activity\n`;
       sql += `  GROUP BY 1\n`;
       sql += `) total_cohort_users ON f.cohort_month = total_cohort_users.cohort_month\n`;
       sql += `GROUP BY 1, 2\n`;
       sql += `ORDER BY 1, 2;`;
       
       desc = `Cohort retention rates based on first activity of ${colId} on ${colDate}.`;
       tests = `not_null`;
     }
     
     let yaml = `version: 2\n\nmodels:\n  - name: analytical_${pattern}_${src}\n    description: "${desc}"\n    columns:\n`;
     yaml += `      - name: ${colId}\n        description: "Primary key / partition key."\n        tests:\n          - ${tests}\n`;
     yaml += `      - name: ${colDate}\n        description: "Event date column."\n`;
     yaml += `      - name: ${colNum}\n        description: "Metric being aggregated."\n`;

     document.getElementById('aeSql').value = sql;
     document.getElementById('aeYaml').value = yaml;
     
     const modelName = `analytical_${pattern}_${src}`;
     const lineage=`<svg viewBox="0 0 760 170" style="width:100%;max-width:760px"><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6"/></marker></defs><rect x="20" y="55" width="190" height="60" rx="14" fill="#172033" stroke="#334155"/><text x="115" y="90" text-anchor="middle" fill="#e5e7eb">source: ${src}</text><line x1="210" y1="85" x2="330" y2="85" stroke="#8b5cf6" stroke-width="3" marker-end="url(#arrow)"/><rect x="330" y="55" width="190" height="60" rx="14" fill="#172033" stroke="#6366f1"/><text x="425" y="90" text-anchor="middle" fill="#e5e7eb">${modelName}</text><line x1="520" y1="85" x2="640" y2="85" stroke="#8b5cf6" stroke-width="3" marker-end="url(#arrow)"/><rect x="640" y="55" width="100" height="60" rx="14" fill="#172033" stroke="#22c55e"/><text x="690" y="90" text-anchor="middle" fill="#e5e7eb">BI Dashboard</text></svg>`;
     const checklist=`${lineage}<h3>Run checklist (Analytical Pattern)</h3><ol><li>Verify window partition logic for column: ${C.esc(colId)}.</li><li>Test boundary conditions (e.g. LAG over null rows) in Workbench.</li><li>Export model and save to version control.</li></ol>`;
     
     document.getElementById('aeLineage').innerHTML = checklist;
     state.last = { model: modelName, sql, yaml, checklist };
     C.save();
     C.toast('Advanced metric pattern generated!');
   };
 }

 document.getElementById('exportAE').onclick=()=>{if(!state.last.sql)generate(); const files=`-- ${state.last.model}.sql\n${state.last.sql}\n\n# schema.yml\n${state.last.yaml}`; C.download('sql-v6-analytics-engineering-skeleton.sql',files,'text/plain');}; populate(); generate();
});
