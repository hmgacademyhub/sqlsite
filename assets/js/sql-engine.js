/* SQL engine wrapper: sql.js when available, deterministic fallback otherwise */
window.SQLWorkflowSQLEngine = (() => {
  class FallbackDB {
    constructor(){ this.tables = JSON.parse(JSON.stringify(HMG_DATA.tables)); }
    getSchema(){ return Object.entries(this.tables).map(([name,t])=>({name, columns:t.columns})); }
    loadSample(){ this.tables = JSON.parse(JSON.stringify(HMG_DATA.tables)); }
    addTable(name, columns, rows){ this.tables[SQLWorkflow.slug(name)] = {columns, rows}; }
    exec(sql){ sql=sql.trim().replace(/;$/,''); if(!sql) return {columns:[], values:[]}; const low=sql.toLowerCase(); if(low.startsWith('select')) return this.select(sql); if(low.startsWith('explain')) return {columns:['detail'], values:[[this.explain(sql.replace(/^explain\s+(query\s+plan\s+)?/i,''))]]}; return {columns:['message'], values:[['Fallback engine supports SELECT and EXPLAIN. Online sql.js supports full SQLite.']]}; }
    explain(sql){ const a=SQLWorkflow.analyzeSQL(sql); return `${a.grade} complexity (${a.score}/100). ${a.findings.map(f=>f.msg).join(' ') || 'No major warnings.'}`; }
    select(sql){
      let m=sql.match(/^select\s+([\s\S]+?)\s+from\s+([a-zA-Z_][\w]*)(?:\s+(?:as\s+)?(\w+))?([\s\S]*)$/i); if(!m) throw new Error('Fallback parser: expected SELECT ... FROM table');
      let [, colPart, tableName, alias, rest]=m;
      if(alias && /^(where|join|group|order|limit|having)$/i.test(alias)){ rest=' '+alias+rest; alias=null; }
      let base=this.tables[tableName]; if(!base) throw new Error('no such table: '+tableName);
      let rows=base.rows.map(r=>Object.fromEntries(base.columns.map((c,i)=>[c,r[i]]).concat(base.columns.map((c,i)=>[`${alias||tableName}.${c}`,r[i]]))));
      // Simple JOIN ... ON a=b; supports multiple joins
      let joinRe=/\s+join\s+([a-zA-Z_]\w*)(?:\s+(?:as\s+)?(\w+))?\s+on\s+([^\s]+)\s*=\s*([^\s]+)([\s\S]*)/i;
      while(joinRe.test(rest)){
        const jm=rest.match(joinRe); const jt=this.tables[jm[1]], ja=jm[2]||jm[1]; if(!jt) throw new Error('no such table: '+jm[1]); const left=jm[3], right=jm[4]; const next=[];
        rows.forEach(row=>jt.rows.forEach(rr=>{ const obj={...row}; jt.columns.forEach((c,i)=>{obj[c]=rr[i]; obj[`${ja}.${c}`]=rr[i]; obj[`${jm[1]}.${c}`]=rr[i];}); if(String(obj[left]??obj[left.split('.').pop()])===String(obj[right]??obj[right.split('.').pop()])) next.push(obj); })); rows=next; rest=jm[5];
      }
      const where=(rest.match(/\swhere\s+([\s\S]+?)(?=\sgroup\s+by|\sorder\s+by|\slimit|$)/i)||[])[1]; if(where) rows=rows.filter(r=>this.evalWhere(r,where));
      const group=(rest.match(/\sgroup\s+by\s+([\s\S]+?)(?=\sorder\s+by|\slimit|$)/i)||[])[1];
      let result;
      if(group){ const keys=group.split(',').map(s=>s.trim()); const map=new Map(); rows.forEach(r=>{const k=keys.map(x=>r[x]??r[x.split('.').pop()]).join('¦'); if(!map.has(k)) map.set(k,[]); map.get(k).push(r);}); result=Array.from(map.values()).map(g=>this.projectGroup(g,colPart)); }
      else result=rows.map(r=>this.project(r,colPart));
      const order=(rest.match(/\sorder\s+by\s+([\s\S]+?)(?=\slimit|$)/i)||[])[1]; if(order){ const [oc,dir]=order.trim().split(/\s+/); result.sort((a,b)=>{ const av=a[oc]??a[oc.split('.').pop()], bv=b[oc]??b[oc.split('.').pop()]; return (Number(av)||av)>(Number(bv)||bv)?(String(dir).toLowerCase()==='desc'?-1:1):(String(dir).toLowerCase()==='desc'?1:-1); }); }
      const lim=(rest.match(/\slimit\s+(\d+)/i)||[])[1]; if(lim) result=result.slice(0,Number(lim));
      const columns=result.length?Object.keys(result[0]):this.deriveColumns(colPart); return {columns, values:result.map(o=>columns.map(c=>o[c]))};
    }
    splitExprs(part){ const out=[]; let cur='', depth=0, q=null; for(const ch of part){ if(q){cur+=ch; if(ch===q) q=null; continue;} if(ch==='"'||ch==="'"){q=ch;cur+=ch;continue;} if(ch==='(') depth++; if(ch===')') depth=Math.max(0,depth-1); if(ch===','&&depth===0){out.push(cur.trim());cur='';} else cur+=ch; } if(cur.trim()) out.push(cur.trim()); return out; }
    deriveColumns(part){ return part.trim()==='*'?[]:this.splitExprs(part).map(x=>(x.match(/\s+as\s+(\w+)$/i)||x.match(/([\w.]+)$/)||[])[1]||x.trim()); }
    getVal(row, token){ token=token.trim().replace(/^['"]|['"]$/g,'').replace(/^\((.*)\)$/,'$1'); if(!isNaN(Number(token))) return Number(token); return row[token]??row[token.split('.').pop()]??token; }
    evalWhere(row, w){ return w.split(/\s+and\s+/i).every(cond=>{ const m=cond.match(/(.+?)\s*(=|>=|<=|>|<|like)\s*(.+)/i); if(!m) return true; let a=this.getVal(row,m[1]), b=this.getVal(row,m[3]); switch(m[2].toLowerCase()){case '=':return String(a)===String(b);case '>':return Number(a)>Number(b);case '<':return Number(a)<Number(b);case '>=':return Number(a)>=Number(b);case '<=':return Number(a)<=Number(b);case 'like': return new RegExp('^'+String(b).replace(/%/g,'.*').replace(/_/g,'.')+'$','i').test(String(a));} }); }
    project(row, part){ if(part.trim()==='*') return {...row}; const out={}; this.splitExprs(part).forEach(expr=>{ const alias=(expr.match(/\s+as\s+([\w_]+)$/i)||[])[1]; const clean=expr.replace(/\s+as\s+[\w_]+$/i,'').trim(); out[alias||clean.split('.').pop()]=this.evalExpr(row, clean); }); return out; }
    projectGroup(group, part){ const out={}; this.splitExprs(part).forEach(expr=>{ const alias=(expr.match(/\s+as\s+([\w_]+)$/i)||[])[1]; const clean=expr.replace(/\s+as\s+[\w_]+$/i,'').trim(); out[alias||clean.split('.').pop()]=this.evalAgg(group, clean); }); return out; }
    evalExpr(row,e){ e=e.trim(); if(/round\s*\(/i.test(e)) return this.evalAgg([row],e); if(/[+\-*/()]/.test(e) && /^[\w.\s()+\-*/0-9]+$/.test(e)){ const safe=e.replace(/\b[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)?\b/g, tok=>Number(this.getVal(row,tok))||0); try{return Function('"use strict";return ('+safe+')')();}catch(_){/* fall through */} } return this.getVal(row,e); }
    evalAgg(g,e){ let m=e.match(/round\s*\((.+),\s*(\d+)\s*\)/i); if(m){ const v=this.evalAgg(g,m[1]); return Number(Number(v).toFixed(Number(m[2]))); } m=e.match(/count\s*\(\s*\*\s*\)/i); if(m) return g.length; m=e.match(/avg\s*\(([^)]+)\)/i); if(m) return g.reduce((a,r)=>a+Number(this.getVal(r,m[1])),0)/g.length; m=e.match(/sum\s*\(([^)]+)\)/i); if(m){ const inner=m[1]; return g.reduce((a,r)=>a+Number(this.evalExpr(r,inner)),0);} return this.evalExpr(g[0],e); }
  }
  function loadAllTablesIntoSqlJs(db){
    Object.entries(HMG_DATA.tables).forEach(([name,t])=>{
      const table=SQLWorkflow.slug(name);
      db.run(`DROP TABLE IF EXISTS ${table}`);
      db.run(`CREATE TABLE ${table} (${t.columns.map(c=>SQLWorkflow.slug(c)+' TEXT').join(',')})`);
      const stmt=db.prepare(`INSERT INTO ${table} VALUES (${t.columns.map(()=>'?').join(',')})`);
      (t.rows||[]).forEach(r=>stmt.run(r));
      stmt.free();
    });
  }
  async function create(){
    if(window.initSqlJs){
      try{ const SQL=await initSqlJs({locateFile:f=>`https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}`}); const db=new SQL.Database(); loadAllTablesIntoSqlJs(db); return new Engine(db, true); } catch(e){ console.warn('sql.js failed, using fallback',e); }
    }
    return new Engine(new FallbackDB(), false);
  }
  class Engine {
    constructor(db, real){ this.db=db; this.real=real; }
    loadSample(){ if(this.real){ this.db.close?.(); } }
    exec(sql){ if(this.real){ const res=this.db.exec(sql); return res[0] ? {columns:res[0].columns, values:res[0].values} : {columns:[], values:[]}; } return this.db.exec(sql); }
    explain(sql){ if(this.real){ const res=this.db.exec('EXPLAIN QUERY PLAN '+sql.replace(/;\s*$/,'')); return res[0]?{columns:res[0].columns,values:res[0].values}:{columns:['detail'],values:[['No plan returned']]}; } return this.db.exec('EXPLAIN '+sql); }
    schema(){ if(this.real){ const names=this.db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"); const out=[]; (names[0]?.values||[]).forEach(([name])=>{ const info=this.db.exec(`PRAGMA table_info(${name})`); out.push({name, columns:(info[0]?.values||[]).map(r=>r[1])}); }); return out; } return this.db.getSchema(); }
    addTable(name, columns, rows){ if(this.real){ const safe=SQLWorkflow.slug(name); this.db.run(`DROP TABLE IF EXISTS ${safe}`); this.db.run(`CREATE TABLE ${safe} (${columns.map(c=>SQLWorkflow.slug(c)+' TEXT').join(',')})`); const stmt=this.db.prepare(`INSERT INTO ${safe} VALUES (${columns.map(()=>'?').join(',')})`); rows.forEach(r=>stmt.run(r)); stmt.free(); } else this.db.addTable(name, columns, rows); }
  }
  return {create};
})();
