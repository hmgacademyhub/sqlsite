/* =====================================================================
   QueryPilot v9 — app.js
   Original v6 logic preserved verbatim, with v7/v8/v9 modules added in
   separate files (enterprise.js, curriculum*.js, learn.js).
   No frameworks, no external libs, ES5-compatible.
   ===================================================================== */


function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function ts(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
function toast(msg,col){var t=document.getElementById("toast");t.innerHTML=msg;t.style.borderColor=col||"var(--ac)";t.style.color=col||"var(--ac)";t.style.display="block";clearTimeout(window._tt);window._tt=setTimeout(function(){t.style.display="none"},2600)}
function flash(id){var el=document.getElementById(id);if(el){el.style.display="block";setTimeout(function(){el.style.display="none"},2000)}}
function dl(txt,name){var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"text/plain"}));a.download=name;a.click()}

function getSchema(){
  var raw=document.getElementById("schema-ta").value,t={};
  raw.split("\n").map(function(s){return s.trim()}).filter(Boolean).forEach(function(line){
    var m=line.match(/^(\w+)\s*\((.+)\)/)||line.match(/^(\w+)\s*:\s*(.+)/)||line.match(/^(\w+)\s+(.+)/);
    if(!m)return;
    var tb=m[1].toLowerCase();
    var cols=m[2].replace(/[()]/g,"").split(/,\s*/).map(function(c){return c.trim().split(/\s+/)[0].toLowerCase()}).filter(Boolean);
    t[tb]=cols;
  });return t;
}
function clike(cols){var kws=Array.prototype.slice.call(arguments,1);for(var i=0;i<kws.length;i++)for(var j=0;j<cols.length;j++)if(cols[j].indexOf(kws[i])>=0)return cols[j];return null}
function bestTbl(tables,hint){var ns=Object.keys(tables);if(!ns.length)return null;var h=hint.toLowerCase();for(var i=0;i<ns.length;i++)if(h.indexOf(ns[i])>=0)return ns[i];for(var i=0;i<ns.length;i++)if(h.indexOf(ns[i].replace(/s$/,""))>=0)return ns[i];return ns[0]}
function colType(col){
  if(col==="id"||col.endsWith("_id"))return"id/int";
  if(["total","price","salary","amount","cost","revenue","score","earnings"].indexOf(col)>=0)return"decimal";
  if(["stock","quantity","qty","count","age","year","month"].indexOf(col)>=0)return"integer";
  if(col.endsWith("_at")||col.endsWith("_date")||["created_at","updated_at","hire_date","due_date","date"].indexOf(col)>=0)return"datetime";
  if(col==="email")return"email";
  if(["status","active","state","enabled","type","category","region","department"].indexOf(col)>=0)return"varchar";
  return"text";
}
function saveSchema(){try{localStorage.setItem("qp_schema",document.getElementById("schema-ta").value);toast("Schema saved!")}catch(e){toast("Storage unavailable","var(--er)")}}
function loadSchema(){try{var s=localStorage.getItem("qp_schema");if(s){document.getElementById("schema-ta").value=s;refreshAll();toast("Schema loaded!")}else toast("No saved schema","var(--wn)")}catch(e){toast("Storage unavailable","var(--er)")}}
function clearSchema(){if(confirm("Clear the current schema?")){document.getElementById("schema-ta").value="";refreshAll();toast("Schema cleared")}}
function onDC(){document.getElementById("sd").textContent=document.getElementById("dialect").value.split(" ")[0]}

var KW=["SELECT","FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","FULL OUTER JOIN","CROSS JOIN","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","AND","OR","NOT","IN","BETWEEN","LIKE","IS NULL","IS NOT NULL","ON","AS","DISTINCT","COUNT","SUM","AVG","MAX","MIN","INTERVAL","CURRENT_DATE","CURRENT_TIMESTAMP","DATE","MONTH","YEAR","COALESCE","NULLIF","CASE","WHEN","THEN","ELSE","END","EXISTS","WITH","UNION","UNION ALL","INTERSECT","EXCEPT","RANK","ROW_NUMBER","OVER","PARTITION BY","CREATE TABLE","PRIMARY KEY","NOT NULL","DEFAULT","AUTOINCREMENT"];
function fmt(sql){var s=sql.replace(/\s+/g," ").trim();["FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","FULL OUTER JOIN","CROSS JOIN","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","VALUES","SET","UNION ALL","UNION"].forEach(function(k){s=s.replace(new RegExp("\\b"+k+"\\b","gi"),"\n"+k)});s=s.replace(/\b(AND|OR)\b/gi,"\n  $1");return s.trim()}
function hl(sql){var s=esc(sql);s=s.replace(new RegExp("\\b("+KW.join("|")+")\\b","g"),'<span class="kw">$1</span>');s=s.replace(/'([^']*)'/g,'<span class="str">\'$1\'</span>');s=s.replace(/\b(\d+(?:\.\d+)?)\b/g,'<span class="nm">$1</span>');s=s.replace(/(--[^\n]*)/g,'<span class="cm">$1</span>');return s}
function vld(sql){
  var errs=[],warns=[],s=sql.trim().toUpperCase();
  if(!s)return{errs:errs,warns:warns,ok:true};
  if(!/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|WITH|ALTER)/.test(s))errs.push("Query must start with SELECT, INSERT, UPDATE, DELETE, CREATE, WITH or ALTER");
  var op=(sql.match(/\(/g)||[]).length,cl=(sql.match(/\)/g)||[]).length;
  if(op!==cl)errs.push("Unbalanced parentheses: "+op+" opening vs "+cl+" closing");
  if(/^DELETE FROM \w+\s*;?\s*$/.test(sql.trim()))errs.push("DANGER: DELETE without WHERE will erase ALL rows in this table!");
  if(s.indexOf("SELECT")>=0&&s.indexOf("FROM")<0&&s.indexOf("INTO")<0)errs.push("SELECT statement is missing a FROM clause");
  if(s.indexOf("UPDATE")>=0&&s.indexOf("WHERE")<0)warns.push("UPDATE without WHERE will modify ALL rows in the table");
  if(s.indexOf("GROUP BY")>=0&&!s.match(/COUNT|SUM|AVG|MAX|MIN/))warns.push("GROUP BY without an aggregate function (COUNT, SUM, AVG...) — is this intended?");
  if(s.indexOf("HAVING")>=0&&s.indexOf("GROUP BY")<0)warns.push("HAVING clause usually requires a GROUP BY clause");
  if(!sql.trim().endsWith(";"))warns.push("Best practice: end your SQL statement with a semicolon (;)");
  if(s.indexOf("SELECT *")>=0)warns.push("SELECT * returns all columns — specify column names for better performance in production");
  return{errs:errs,warns:warns,ok:errs.length===0}
}
function vHTML(v){if(!v.errs.length&&!v.warns.length)return'<span class="vok">&#10003; No issues — query looks valid.</span>';return v.errs.map(function(x){return'<span class="ver">&#10007; '+esc(x)+"</span>"}).join("")+v.warns.map(function(x){return'<span class="vwn">&#9888; '+esc(x)+"</span>"}).join("")}

function deepExplain(sql){
  var parts=[];
  var sm=sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
  if(sm){var sc=sm[1].trim(),sd="Returns ";
    if(sc==="*")sd+="all columns from the table. Consider naming columns explicitly in production for better performance.";
    else if(/COUNT\(\*\)/i.test(sc))sd+="a count of total matching rows as a single number.";
    else if(/SUM\(/i.test(sc))sd+="the total (sum) of a numeric column.";
    else if(/AVG\(/i.test(sc))sd+="the average value of a numeric column.";
    else if(/MAX\(/i.test(sc))sd+="the highest value found in a column.";
    else if(/MIN\(/i.test(sc))sd+="the lowest value found in a column.";
    else if(/DISTINCT/i.test(sc))sd+="only unique, non-duplicate values. Each value appears once.";
    else if(/RANK\(\)/i.test(sc))sd+="a rank number per row using a window function. All rows are preserved unlike GROUP BY.";
    else sd+='the columns: <span class="ex-code">'+esc(sc)+"</span>.";
    parts.push({b:"bg-sel",l:"SELECT",t:sd});
  }
  var fm=sql.match(/FROM\s+(\w+)/i);
  if(fm)parts.push({b:"bg-sel",l:"FROM",t:'Reads data from the table <span class="ex-code">'+esc(fm[1])+"</span>. This is the source of all rows before any filtering."});
  var jm=sql.match(/(INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL OUTER JOIN|CROSS JOIN)\s+(\w+)(?:\s+ON\s+(.+?))?(?=\nWHERE|\nGROUP|\nORDER|\nLIMIT|\nHAVING|;|$)/i);
  if(jm){var jd={"INNER JOIN":"Returns only rows that have a match in BOTH tables. Rows with no match in either table are excluded.","LEFT JOIN":"Returns ALL rows from the left table. Where no match exists in the right table, right-side columns show NULL.","RIGHT JOIN":"Returns ALL rows from the right table. Where no match exists in the left table, left-side columns show NULL.","FULL OUTER JOIN":"Returns ALL rows from BOTH tables. NULLs appear where there is no match on either side.","CROSS JOIN":"Returns EVERY possible combination of rows from both tables. Can produce very large results."};parts.push({b:"bg-jo",l:jm[1],t:(jd[jm[1].toUpperCase()]||"")+" Combined with table <span class=\"ex-code\">"+esc(jm[2])+"</span>"+(jm[3]?' on <span class="ex-code">'+esc(jm[3].trim())+"</span>.":" (CROSS JOIN, no ON clause).")});}
  var wm=sql.match(/WHERE\s+([\s\S]+?)(?=\nGROUP|\nORDER|\nLIMIT|\nHAVING|;|$)/i);
  if(wm)parts.push({b:"bg-wh",l:"WHERE",t:'Filters rows before grouping. Only rows where <span class="ex-code">'+esc(wm[1].trim().replace(/\n\s*/g," "))+"</span> is TRUE are included."});
  var gm=sql.match(/GROUP BY\s+([\s\S]+?)(?=\nORDER|\nLIMIT|\nHAVING|;|$)/i);
  if(gm)parts.push({b:"bg-gr",l:"GROUP BY",t:'Groups all rows with the same value in <span class="ex-code">'+esc(gm[1].trim())+"</span> into one group. Each group produces one output row, combined with an aggregate function like COUNT or SUM."});
  var hm=sql.match(/HAVING\s+([\s\S]+?)(?=\nORDER|\nLIMIT|;|$)/i);
  if(hm)parts.push({b:"bg-gr",l:"HAVING",t:'Filters groups after aggregation. Only groups where <span class="ex-code">'+esc(hm[1].trim())+"</span> is TRUE are kept. Unlike WHERE which filters rows, HAVING filters the grouped result."});
  var om=sql.match(/ORDER BY\s+([\s\S]+?)(?=\nLIMIT|;|$)/i);
  if(om)parts.push({b:"bg-or",l:"ORDER BY",t:'Sorts the result by <span class="ex-code">'+esc(om[1].trim())+"</span>. DESC = highest to lowest. ASC = lowest to highest. Without ORDER BY, row order is never guaranteed."});
  var lm=sql.match(/LIMIT\s+(\d+)/i);
  if(lm)parts.push({b:"bg-li",l:"LIMIT",t:"Returns at most <span class=\"ex-code\">"+lm[1]+"</span> rows. Always combine LIMIT with ORDER BY so you know exactly which rows are returned."});
  var offm=sql.match(/OFFSET\s+(\d+)/i);
  if(offm)parts.push({b:"bg-li",l:"OFFSET",t:"Skips the first <span class=\"ex-code\">"+offm[1]+"</span> rows. Used with LIMIT for pagination. Page 3 with 10 rows per page = LIMIT 10 OFFSET 20."});
  if(!parts.length)return'<div style="color:var(--mu);padding:12px">No clause-level explanation available for this query type.</div>';
  return parts.map(function(p){return'<div class="ex-sec"><span class="ex-badge '+p.b+'">'+p.l+'</span><div class="ex-text">'+p.t+"</div></div>"}).join("");
}

function genMock(sql,tables){
  var sm=sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);if(!sm)return null;
  var sp=sm[1].trim(),cols=[];
  if(sp==="*"){var fm=sql.match(/FROM\s+(\w+)/i);var tb=fm?fm[1].toLowerCase():null;cols=tb&&tables[tb]?tables[tb]:["id","name","value"];}
  else{cols=sp.split(",").map(function(c){var a=c.trim().match(/AS\s+(\w+)$/i);if(a)return a[1];var p=c.trim().split(/[\s.()+*]+/);return p[p.length-1].replace(/[()]/g,"")||c.trim()});}
  var S={id:[1,2,3,4,5],name:["Alice Johnson","Bob Smith","Carol White","Dave Brown","Eve Davis"],
    email:["alice@co.com","bob@co.com","carol@co.com","dave@co.com","eve@co.com"],
    total:[1250.00,890.50,3400.00,220.75,5100.00],revenue:[45000,32000,78000,12000,95000],
    status:["active","pending","active","completed","active"],region:["North","South","East","West","North"],
    category:["Electronics","Clothing","Food","Books","Electronics"],price:[29.99,149.99,9.99,24.99,399.99],
    stock:[150,8,300,45,12],salary:[55000,72000,48000,91000,63000],
    department:["Sales","Engineering","HR","Finance","Marketing"],count:[42,17,89,6,231],
    total_count:[42,17,89,6,231],total_revenue:[125000,87000,340000,42000,195000],
    avg_salary:[62500,74000,51000,88000,59000],customer_id:[101,102,103,104,105],
    created_at:["2024-01-15","2024-02-20","2024-03-10","2024-04-05","2024-05-22"],
    due_date:["2024-06-01","2024-07-15","2024-08-20","2024-09-10","2024-10-05"],
    amount:[500,1200,350,2100,780],hire_date:["2022-01-10","2021-06-15","2023-03-01","2020-11-20","2024-01-08"],
    occurrences:[3,2,4,2,3],rank_position:[1,2,3,4,5],percentage:[35.2,24.1,22.8,10.5,7.4]};
  var n=sql.match(/LIMIT\s+(\d+)/i);var mx=n?Math.min(parseInt(n[1]),5):5;var rows=[];
  for(var i=0;i<mx;i++){var row={};cols.forEach(function(c){var k=c.toLowerCase().replace(/[^a-z_]/g,"");var f=S[k];if(!f){for(var sk in S){if(k.indexOf(sk)>=0||sk.indexOf(k)>=0){f=S[sk];break}}}row[c]=f?f[i]:"--"});rows.push(row);}
  return{cols:cols,rows:rows};
}
function mockHTML(sql,tables){
  var d=genMock(sql,tables);
  if(!d||!d.cols.length)return'<div style="color:var(--mu);padding:14px;font-size:12px">Preview not available for this query type.</div>';
  var h='<div class="mock-wrap"><table><tr>'+d.cols.map(function(c){return"<th>"+esc(c)+"</th>"}).join("")+"</tr>";
  d.rows.forEach(function(r){h+="<tr>"+d.cols.map(function(c){return"<td>"+esc(String(r[c]))+"</td>"}).join("")+"</tr>"});
  return h+"</table></div>"+'<div class="mock-note">&#9432; Sample data only &mdash; illustrates column layout, not real values.</div>';
}

function nlSQL(input){
  var q=input.toLowerCase(),tables=getSchema();
  var tbl=bestTbl(tables,q)||"your_table",cols=tables[tbl]||[];
  var isCount=/\b(how many|count|number of|total count)\b/.test(q);
  var isSum=/\b(sum|total revenue|total sales|total amount|total spending|earnings)\b/.test(q)&&!isCount;
  var isTot=/\btotal\b/.test(q)&&!isCount&&!isSum;
  var isAvg=/\b(average|avg|mean)\b/.test(q);
  var isMax=/\b(highest|maximum|max|most expensive|largest|biggest)\b/.test(q);
  var isMin=/\b(lowest|minimum|min|least expensive|cheapest|smallest)\b/.test(q);
  var isDel=/\b(delete|remove)\b/.test(q);
  var isUpd=/\b(update|change|modify)\b/.test(q);
  var isIns=/\b(insert|add new|new record|create record)\b/.test(q);
  var isDist=/\b(unique|distinct|different)\b/.test(q)&&!/duplicate/.test(q);
  var isDup=/\b(duplicate|duplicates|find duplicate)\b/.test(q);
  var isNull=/\b(missing|null|empty|without \w+)\b/.test(q);
  var isRank=/\b(rank|ranking|ranked)\b/.test(q);
  var isPct=/\b(percent|percentage|proportion)\b/.test(q);
  var isCTE=/\bwith\s+\w|\bcte\b|common table/.test(q);
  var lim=null;
  var tm=q.match(/\btop\s+(\d+)\b/)||q.match(/\bfirst\s+(\d+)\b/)||q.match(/\blimit\s+(\d+)\b/)||q.match(/\blast\s+(\d+)\b/);
  if(tm)lim=parseInt(tm[1]);
  var grp=null;
  var gm=q.match(/\b(?:by|per|for each|grouped by|group by|each)\s+(\w+)/);
  if(gm){var gc=gm[1];if(["the","a","an","all"].indexOf(gc)<0)grp=clike(cols,gc)||gc;}
  var orc=null,ord="DESC";
  var om=q.match(/\b(?:order(?:ed)? by|sort(?:ed)? by|ranked by)\s+(\w+)/);
  if(om)orc=clike(cols,om[1])||om[1];
  if(/\b(asc|ascending|oldest first|lowest first|cheapest first)\b/.test(q))ord="ASC";
  var mc=clike(cols,"total","amount","revenue","sales","price","cost","value","qty","quantity","score","salary","earnings")||(cols.length>1?cols[1]:"amount");
  var nc=clike(cols,"name","title","label","product","customer","user","employee","category","region","type","department")||cols[0]||"name";
  var dc=clike(cols,"date","created","updated","timestamp","time","ordered","hired","hire_date","due_date")||null;
  var sc=clike(cols,"status","active","state","enabled","flag");
  var stc=clike(cols,"stock","inventory","quantity","qty");
  var ec=clike(cols,"email","mail");
  var ic=clike(cols,"id")||cols[0]||"id";
  var cds=[];
  if(/last\s+7\s+days?/.test(q)&&dc)cds.push(dc+" >= CURRENT_DATE - INTERVAL '7 days'");
  else if(/last\s+14\s+days?/.test(q)&&dc)cds.push(dc+" >= CURRENT_DATE - INTERVAL '14 days'");
  else if(/last\s+30\s+days?/.test(q)&&dc)cds.push(dc+" >= CURRENT_DATE - INTERVAL '30 days'");
  else if(/last\s+60\s+days?/.test(q)&&dc)cds.push(dc+" >= CURRENT_DATE - INTERVAL '60 days'");
  else if(/last\s+90\s+days?/.test(q)&&dc)cds.push(dc+" >= CURRENT_DATE - INTERVAL '90 days'");
  else if(/this\s+month/.test(q)&&dc)cds.push("MONTH("+dc+") = MONTH(CURRENT_DATE) AND YEAR("+dc+") = YEAR(CURRENT_DATE)");
  else if(/last\s+month/.test(q)&&dc)cds.push("MONTH("+dc+") = MONTH(CURRENT_DATE) - 1 AND YEAR("+dc+") = YEAR(CURRENT_DATE)");
  else if(/this\s+year|current\s+year/.test(q)&&dc)cds.push("YEAR("+dc+") = YEAR(CURRENT_DATE)");
  else if(/last\s+year/.test(q)&&dc)cds.push("YEAR("+dc+") = YEAR(CURRENT_DATE) - 1");
  else if(/\btoday\b/.test(q)&&dc)cds.push("DATE("+dc+") = CURRENT_DATE");
  else if(/yesterday/.test(q)&&dc)cds.push("DATE("+dc+") = CURRENT_DATE - INTERVAL '1 day'");
  else if(/this\s+week/.test(q)&&dc)cds.push(dc+" >= DATE_TRUNC('week', CURRENT_DATE)");
  else if(/last\s+quarter/.test(q)&&dc)cds.push(dc+" >= DATE_TRUNC('quarter', CURRENT_DATE) - INTERVAL '3 months'");
  if(/\bactive\b/.test(q)&&sc)cds.push(sc+"='active'");
  if(/\binactive\b/.test(q)&&sc)cds.push(sc+"='inactive'");
  if(/\bpending\b/.test(q)&&sc)cds.push(sc+"='pending'");
  if(/\bcomplete/.test(q)&&sc)cds.push(sc+"='completed'");
  if(/\bcancell?ed/.test(q)&&sc)cds.push(sc+"='cancelled'");
  if(/\bpaid\b/.test(q)&&sc)cds.push(sc+"='paid'");
  if(/\bunpaid\b/.test(q)&&sc)cds.push(sc+"='unpaid'");
  if(/\boverdue\b/.test(q)&&dc)cds.push(dc+" < CURRENT_DATE AND "+(sc||"status")+"!='paid'");
  var lstock=q.match(/low\s+stock|below\s+(\d+)|under\s+(\d+)|less than\s+(\d+)/);
  if(lstock&&stc){var ln=lstock[1]||lstock[2]||lstock[3]||"20";cds.push(stc+" < "+ln);}
  var gt=q.match(/(?:greater than|more than|above|over|exceeds?)\s+(\d+(?:\.\d+)?)/);
  var lt=q.match(/(?:less than|under|below|fewer than)\s+(\d+(?:\.\d+)?)/);
  var bt=q.match(/between\s+(\d+)\s+and\s+(\d+)/);
  if(gt)cds.push(mc+" > "+gt[1]);if(lt&&!lstock)cds.push(mc+" < "+lt[1]);if(bt)cds.push(mc+" BETWEEN "+bt[1]+" AND "+bt[2]);
  var likem=q.match(/(?:name|email|title|product|customer)\s+(?:contains?|like|starts?\s+with|ends?\s+with)\s+['"]?(\w+)['"]?/);
  if(likem){var lv=likem[1];if(/starts?/.test(q))cds.push(nc+" LIKE '"+lv+"%'");else if(/ends?/.test(q))cds.push(nc+" LIKE '%"+lv+"'");else cds.push(nc+" LIKE '%"+lv+"%'");}
  if(isNull&&ec)cds.push(ec+" IS NULL");
  var eqm=q.match(/where\s+(\w+)\s*(?:is|=|equals?)\s+['"]?(\w+)['"]?/);
  if(eqm){var eqc=clike(cols,eqm[1])||eqm[1];cds.push(eqc+"='"+eqm[2]+"'")}
  if(isDup&&(ec||nc)){var dc2=ec||nc;return{sql:"SELECT "+dc2+", COUNT(*) AS occurrences\nFROM "+tbl+"\nGROUP BY "+dc2+"\nHAVING COUNT(*) > 1\nORDER BY occurrences DESC;"};}
  if(isRank&&mc)return{sql:"SELECT "+nc+", "+mc+",\n  RANK() OVER (ORDER BY "+mc+" DESC) AS rank_position\nFROM "+tbl+(cds.length?"\nWHERE "+cds.join("\n  AND "):"")+(lim?"\nLIMIT "+lim:"")+";"}
  if(isPct&&grp&&mc)return{sql:"SELECT "+grp+",\n  SUM("+mc+") AS group_total,\n  ROUND(100.0 * SUM("+mc+") / (SELECT SUM("+mc+") FROM "+tbl+"), 2) AS percentage\nFROM "+tbl+(cds.length?"\nWHERE "+cds.join("\n  AND "):"")+"\nGROUP BY "+grp+"\nORDER BY group_total DESC;"}
  if(isCTE&&grp&&(isSum||isTot))return{sql:"WITH "+tbl+"_totals AS (\n  SELECT "+grp+", SUM("+mc+") AS total_"+mc+"\n  FROM "+tbl+(cds.length?"\n  WHERE "+cds.join("\n    AND "):"")+"\n  GROUP BY "+grp+"\n)\nSELECT *\nFROM "+tbl+"_totals\nORDER BY total_"+mc+" DESC"+(lim?"\nLIMIT "+lim:"")+";"}
  var sel="*",al="";
  if(isCount){sel=grp?grp+", COUNT(*) AS count":"COUNT(*) AS total_count";al="count";}
  else if(isSum||isTot){sel=grp?grp+", SUM("+mc+") AS total_"+mc:"SUM("+mc+") AS total_"+mc;al="total_"+mc;}
  else if(isAvg){sel=grp?grp+", AVG("+mc+") AS avg_"+mc:"AVG("+mc+") AS avg_"+mc;al="avg_"+mc;}
  else if(isMax){sel=nc+", MAX("+mc+") AS max_"+mc;al="max_"+mc;}
  else if(isMin){sel=nc+", MIN("+mc+") AS min_"+mc;al="min_"+mc;}
  else if(isDist){sel="DISTINCT "+nc;}
  else if(cols.length){sel=cols.slice(0,7).join(", ");}
  if(!orc&&al){orc=al;ord=/bottom|worst|lowest|least|cheapest/.test(q)?"ASC":"DESC";}
  if(!orc&&dc&&/recent|latest|newest/.test(q)){orc=dc;ord="DESC";}
  if(!orc&&(isMax||isMin)){orc=mc;ord=isMin?"ASC":"DESC";}
  if(isDel)return{sql:fmt("DELETE FROM "+tbl+(cds.length?"\nWHERE "+cds.join("\n  AND "):"\nWHERE <condition>")+";")};
  if(isIns){var vc=cols.filter(function(c){return c!=="id"}).slice(0,6);return{sql:"INSERT INTO "+tbl+" ("+vc.join(", ")+")\nVALUES ("+vc.map(function(){return"?"}).join(", ")+");"};}
  if(isUpd)return{sql:fmt("UPDATE "+tbl+"\nSET "+mc+" = ?"+(cds.length?"\nWHERE "+cds.join("\n  AND "):"\nWHERE "+ic+" = ?")+";")};
  var sql="SELECT "+sel+"\nFROM "+tbl;
  if(cds.length)sql+="\nWHERE "+cds.join("\n  AND ");
  if(grp)sql+="\nGROUP BY "+grp;
  if(orc)sql+="\nORDER BY "+orc+" "+ord;
  if(lim)sql+="\nLIMIT "+lim;
  return{sql:fmt(sql+";")};
}

var hist=[],bookmarks=[],qCount=0,sessionStart=Date.now();
function updStats(){qCount++;document.getElementById("sq2").textContent=qCount;document.getElementById("st").textContent=Object.keys(getSchema()).length;document.getElementById("sbk").textContent=bookmarks.length;document.getElementById("hcount").textContent="("+hist.length+")";}
window.send=function(txt){
  var inp=document.getElementById("nli");var q=(txt||inp.value).trim();if(!q)return;
  inp.value="";inp.style.height="auto";
  var es=document.getElementById("es");if(es)es.remove();
  setMode("chat",null);addUser(q);
  var r=nlSQL(q),v=vld(r.sql),id="m"+Date.now();
  addCard(id,r.sql,v,q);
  hist.unshift({id:id,title:q.length>46?q.slice(0,43)+"...":q,time:ts()});
  if(hist.length>30)hist.pop();
  renderHist();updStats();
};
function addUser(txt){var c=document.getElementById("chatmsgs"),d=document.createElement("div");d.className="mr u";d.innerHTML='<div class="ub">'+esc(txt)+'<div class="mtime">'+ts()+"</div></div>";c.appendChild(d);c.scrollTop=99999;}
function addCard(id,sql,v,q){
  var tables=getSchema();var c=document.getElementById("chatmsgs"),d=document.createElement("div");
  d.className="mr b";d.dataset.id=id;d.dataset.sql=sql;d.dataset.q=q||"";
  var exHtml=deepExplain(sql);var previewHtml=mockHTML(sql,tables);
  d.innerHTML='<div class="card">'+
    '<div class="ctabs">'+
      '<button class="ctab on" onclick="swTab(\''+id+'\',\'sql\',this)">SQL</button>'+
      '<button class="ctab" onclick="swTab(\''+id+'\',\'ex\',this)">&#128218; Explain</button>'+
      '<button class="ctab" onclick="swTab(\''+id+'\',\'vl\',this)">&#10003; Validate '+(v.errs.length?"&#9888;":"")+'</button>'+
      '<button class="ctab" onclick="swTab(\''+id+'\',\'mock\',this)">&#128200; Preview</button>'+
      '<span class="ctime">'+ts()+"</span>"+
    '</div>'+
    '<div id="'+id+'-sql" class="sqlb">'+hl(sql)+"</div>"+
    '<div id="'+id+'-edt" style="display:none"><textarea class="edta" id="'+id+'-ta">'+esc(sql)+"</textarea></div>"+
    '<div id="'+id+'-ex" class="expb" style="display:none">'+exHtml+"</div>"+
    '<div id="'+id+'-vl" class="vldb" style="display:none">'+vHTML(v)+"</div>"+
    '<div id="'+id+'-mock" style="display:none">'+previewHtml+"</div>"+
    '<div class="cact">'+
      '<button class="ab p" onclick="cpCard(\''+id+'\')">&#8998; Copy</button>'+
      '<button class="ab" id="'+id+'-eb" onclick="togEdit(\''+id+'\')">&#9998; Edit</button>'+
      '<button class="ab" onclick="dlCard(\''+id+'\')">&#8595; .sql</button>'+
      '<button class="ab" onclick="saveCard(\''+id+'\')">&#11088; Save</button>'+
      '<button class="ab" onclick="togWrap(\''+id+'\')">&#8644; Wrap</button>'+
      '<button class="ab" onclick="refine(\''+id+'\')">&#8634; Refine</button>'+
      '<span id="'+id+'-cp" class="cpd">&#10003; Copied!</span>'+
    '</div></div>';
  c.appendChild(d);c.scrollTop=99999;
}
window.swTab=function(id,tab,btn){["sql","edt","ex","vl","mock"].forEach(function(t){var el=document.getElementById(id+"-"+t);if(el)el.style.display="none"});btn.closest(".ctabs").querySelectorAll(".ctab").forEach(function(b){b.classList.remove("on")});btn.classList.add("on");if(tab==="sql"){var isEd=document.getElementById(id+"-edt").style.display!=="none";document.getElementById(id+(isEd?"-edt":"-sql")).style.display="block";}else document.getElementById(id+"-"+tab).style.display="block";};
window.togWrap=function(id){var el=document.getElementById(id+"-sql");if(el)el.classList.toggle("nw");};
window.togEdit=function(id){var ed=document.getElementById(id+"-edt"),sq=document.getElementById(id+"-sql"),ta=document.getElementById(id+"-ta"),btn=document.getElementById(id+"-eb");if(ed.style.display==="none"){ed.style.display="block";sq.style.display="none";btn.textContent="Done";}else{var row=ed.closest("[data-id]");row.dataset.sql=ta.value;ed.style.display="none";sq.style.display="block";sq.innerHTML=hl(ta.value);btn.textContent="&#9998; Edit";document.getElementById(id+"-vl").innerHTML=vHTML(vld(ta.value));toast("SQL updated");}};
window.cpCard=function(id){var row=document.querySelector("[data-id='"+id+"']");if(!row)return;navigator.clipboard.writeText(row.dataset.sql).catch(function(){});flash(id+"-cp");toast("SQL copied!");};
window.dlCard=function(id){var row=document.querySelector("[data-id='"+id+"']");if(!row)return;var q=(row.dataset.q||"query").replace(/\W+/g,"_").toLowerCase().slice(0,30);dl(row.dataset.sql,q+".sql");toast("Downloaded!");};
window.saveCard=function(id){
  var row=document.querySelector("[data-id='"+id+"']");if(!row)return;
  var tagStr=prompt("Add tags (comma-separated, optional):\nExample: sales, monthly, production","") || "";
  var tags=tagStr.split(",").map(function(t){return t.trim()}).filter(Boolean);
  bookmarks.unshift({id:"bk"+Date.now(),title:(row.dataset.q||"Saved Query").slice(0,50),sql:row.dataset.sql,time:ts(),tags:tags});
  renderBK();updStats();toast("&#11088; Saved"+(tags.length?" with tags: "+tags.join(", "):"!")+"");
};
window.refine=function(id){var row=document.querySelector("[data-id='"+id+"']");document.getElementById("nli").value="Refine: "+(row?row.dataset.q||"":"")+" -- ";document.getElementById("nli").focus();setMode("chat",null);};

function renderHist(filter){var el=document.getElementById("histlist");var items=filter?hist.filter(function(h){return h.title.toLowerCase().indexOf(filter.toLowerCase())>=0}):hist;document.getElementById("hcount").textContent="("+hist.length+")";if(!items.length){el.innerHTML='<div style="color:var(--mu);font-size:12px;text-align:center;margin-top:15px">'+(filter?"No match":"No queries yet")+"</div>";return;}el.innerHTML=items.map(function(h){return'<div class="hi" onclick="goHist(\''+h.id+'\')">'+'<div class="ht">'+esc(h.title)+'</div><div class="hti">'+h.time+'</div><button class="hdel" onclick="delHist(event,\''+h.id+'\')">&#10005;</button></div>'}).join("");}
window.searchHist=function(v){renderHist(v);};
window.goHist=function(id){setMode("chat",null);var el=document.querySelector("[data-id='"+id+"']");if(el)el.scrollIntoView({behavior:"smooth",block:"center"});};
window.delHist=function(ev,id){ev.stopPropagation();hist=hist.filter(function(h){return h.id!==id});renderHist();};
window.clearHist=function(){if(confirm("Clear all history?")){hist=[];renderHist();toast("History cleared");}};

var TAG_COLORS=["#3fb950","#58a6ff","#f69d50","#bc8cff","#f85149","#d29922"];
function tagColor(tag){var h=0;for(var i=0;i<tag.length;i++)h=(h*31+tag.charCodeAt(i))%TAG_COLORS.length;return TAG_COLORS[h];}
function renderBK(filter){
  var el=document.getElementById("bklist");
  var items=filter?bookmarks.filter(function(b){return b.title.toLowerCase().indexOf(filter.toLowerCase())>=0||(b.tags&&b.tags.some(function(t){return t.toLowerCase().indexOf(filter.toLowerCase())>=0}))}):bookmarks;
  if(!items.length){el.innerHTML='<div style="color:var(--mu);font-size:12px;text-align:center;margin-top:20px">No saved queries.<br>Use &#11088; on any result.</div>';return;}
  el.innerHTML=items.map(function(b){
    var tagsHtml=b.tags&&b.tags.length?'<div class="bkt">'+b.tags.map(function(t){return'<span class="tp" style="background:'+tagColor(t)+'20;color:'+tagColor(t)+'">'+esc(t)+'</span>'}).join("")+"</div>":"";
    return'<div class="bk" onclick="loadBK(\''+b.id+'\')">'+'<div class="bkn">'+esc(b.title)+'</div><div class="bks">'+esc(b.sql.split("\n")[0])+'</div>'+tagsHtml+'<button class="bkdel" onclick="delBK(event,\''+b.id+'\')">&#10005;</button></div>';
  }).join("");
}
window.searchBK=function(v){renderBK(v);};
window.loadBK=function(id){var bk=bookmarks.find(function(b){return b.id===id});if(!bk)return;setMode("chat",null);var es=document.getElementById("es");if(es)es.remove();var v=vld(bk.sql),mid="m"+Date.now();addCard(mid,bk.sql,v,bk.title);hist.unshift({id:mid,title:"[Loaded] "+bk.title,time:ts()});renderHist();updStats();toast("Loaded from saved");};
window.delBK=function(ev,id){ev.stopPropagation();bookmarks=bookmarks.filter(function(b){return b.id!==id});renderBK();updStats();toast("Removed");};

window.toggleSearch=function(){var bar=document.getElementById("search-bar");bar.classList.toggle("on");if(bar.classList.contains("on"))document.getElementById("search-inp").focus();else{document.getElementById("search-inp").value="";document.getElementById("search-count").textContent="";}};
window.searchResults=function(term){
  document.querySelectorAll(".sqlb").forEach(function(el){var orig=el.dataset.orightml||el.innerHTML;el.dataset.orightml=orig;if(!term){el.innerHTML=orig;return;}var escaped=term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");el.innerHTML=orig.replace(new RegExp("("+escaped+")","gi"),'<span class="highlight-match">$1</span>');});
  var found=document.querySelectorAll(".highlight-match").length;
  document.getElementById("search-count").textContent=found?" "+found+" match"+(found!==1?"es":""):"No matches";
};

function inferType(vals){var n=vals.filter(function(v){return v&&!isNaN(v.replace(/[$,%]/g,""))}).length;var d=vals.filter(function(v){return v&&/^\d{4}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}/.test(v)}).length;if(d/vals.length>.5)return"date";if(n/vals.length>.5)return"number";return"text";}
window.onDrop=function(ev){ev.preventDefault();document.getElementById("dz").classList.remove("ov");var f=ev.dataTransfer.files[0];if(f&&f.name.endsWith(".csv"))onCSV(f);};
window.onCSV=function(file){if(!file)return;var r=new FileReader();r.onload=function(ev){var lines=ev.target.result.split("\n").filter(function(l){return l.trim()});if(lines.length<2)return;var headers=lines[0].split(",").map(function(h){return h.trim().replace(/"/g,"").toLowerCase().replace(/[\s-]+/g,"_")});var rows=lines.slice(1,Math.min(21,lines.length)).map(function(l){return l.split(",").map(function(c){return c.trim().replace(/"/g,"")})});var types=headers.map(function(_,i){return inferType(rows.map(function(r){return r[i]||""}))});var tname=file.name.replace(/\.csv$/i,"").toLowerCase().replace(/[\s-]+/g,"_");var line=tname+"("+headers.join(", ")+")";var ta=document.getElementById("schema-ta");ta.value=(ta.value.trim()?ta.value.trim()+"\n":"")+line;document.getElementById("csvr").innerHTML='<div class="dt"><div class="dn">&#10003; '+esc(tname)+'</div><div class="dc">'+headers.map(function(h,i){return esc(h)+'<span class="ct t'+types[i].charAt(0)+'">'+types[i]+"</span>"}).join(" ")+'</div><div style="margin-top:7px;font-size:11px;color:var(--mu)">'+rows.length+" rows analysed.</div></div>";refreshAll();toast("Schema detected from: "+file.name);};r.readAsText(file);};

var vFs=[],vCs=[];
function refreshVQB(){var tables=getSchema(),names=Object.keys(tables),sel=document.getElementById("vt"),cur=sel.value;sel.innerHTML='<option value="">-- select a table --</option>'+names.map(function(n){return"<option"+(n===cur?" selected":"")+">"+n+"</option>"}).join("");var spTbl=document.getElementById("sp-tbl");if(spTbl){spTbl.innerHTML='<option value="">-- select --</option>'+names.map(function(n){return"<option>"+n+"</option>"}).join("");}vTblChange();}
window.vTblChange=function(){var tables=getSchema(),t=document.getElementById("vt").value,cols=tables[t]||[];if(!t||!cols.length){document.getElementById("vcols").innerHTML='<div style="color:var(--mu);font-size:12px">Select a table first</div>';document.getElementById("vprev").innerHTML='<span style="color:var(--mu)">-- Select a table --</span>';return;}vCs=cols.slice();document.getElementById("vcols").innerHTML=cols.map(function(c){var ct=colType(c);return'<div class="cc on" onclick="togVC(\''+c+'\',this)">'+c+'<span class="cc-type">'+ct+"</span></div>"}).join("");document.getElementById("vagc").innerHTML=cols.map(function(c){return"<option>"+c+"</option>"}).join("");["vgb","vob"].forEach(function(id){document.getElementById(id).innerHTML='<option value="">None</option>'+cols.map(function(c){return"<option>"+c+"</option>"}).join("");});vFs=[];document.getElementById("vfilters").innerHTML="";vUpdate();};
window.togVC=function(c,el){if(vCs.indexOf(c)>=0){if(vCs.length===1)return;vCs=vCs.filter(function(x){return x!==c});el.classList.remove("on");}else{vCs.push(c);el.classList.add("on");}vUpdate();};
window.addVF=function(){var tables=getSchema(),t=document.getElementById("vt").value,cols=tables[t]||["column"];vFs.push({col:cols[0],op:"=",val:""});renderVF();};
function renderVF(){var tables=getSchema(),t=document.getElementById("vt").value,cols=tables[t]||[];document.getElementById("vfilters").innerHTML=vFs.map(function(f,i){return'<div class="frow"><select class="fsl2" style="flex:1;min-width:85px" onchange="vfc('+i+',\'col\',this.value)">'+cols.map(function(c){return"<option"+(c===f.col?" selected":"")+">"+c+"</option>"}).join("")+'</select><select class="fsl2" style="max-width:110px" onchange="vfc('+i+',\'op\',this.value)">'+["=","!=",">","<",">=","<=","LIKE","NOT LIKE","IN","IS NULL","IS NOT NULL"].map(function(o){return"<option"+(o===f.op?" selected":"")+">"+o+"</option>"}).join("")+"</select>"+(['IS NULL','IS NOT NULL'].indexOf(f.op)>=0?'<div style="flex:1"></div>':'<input class="fin" style="flex:1;min-width:65px" value="'+esc(f.val)+'" placeholder="value" oninput="vfc('+i+',\'val\',this.value)"/>')+'<button class="rmb" onclick="rmVF('+i+')">&#10005;</button></div>';}).join("");vUpdate();}
window.vfc=function(i,k,v){vFs[i][k]=v;renderVF();};window.rmVF=function(i){vFs.splice(i,1);renderVF();};
window.vUpdate=function(){var t=document.getElementById("vt").value;if(!t){document.getElementById("vprev").innerHTML='<span style="color:var(--mu)">-- Select a table --</span>';return;}var agg=document.getElementById("vagg").value,ac=document.getElementById("vagc").value,gb=document.getElementById("vgb").value,ob=document.getElementById("vob").value,dir=document.getElementById("vdir").value,lim=document.getElementById("vlim").value,off=document.getElementById("voff").value,hav=document.getElementById("vhav").value.trim();document.getElementById("aggcw").style.display=(agg&&agg!=="COUNT(*)")?"flex":"none";var sel;if(agg==="COUNT(*)")sel=gb?gb+", COUNT(*) AS count":"COUNT(*) AS total_count";else if(agg==="COUNT(DISTINCT")sel=gb?gb+", COUNT(DISTINCT "+ac+") AS unique_"+ac:"COUNT(DISTINCT "+ac+") AS unique_"+ac;else if(agg)sel=gb?gb+", "+agg+"("+ac+") AS "+agg.toLowerCase()+"_"+ac:agg+"("+ac+") AS "+agg.toLowerCase()+"_"+ac;else sel=vCs.length?vCs.join(", "):"*";var sql="SELECT "+sel+"\nFROM "+t;var cds=vFs.filter(function(f){return f.col}).map(function(f){if(["IS NULL","IS NOT NULL"].indexOf(f.op)>=0)return f.col+" "+f.op;if(f.op==="IN"||f.op==="NOT LIKE")return f.col+" "+f.op+" ("+f.val+")";var v=f.val&&!isNaN(f.val)?f.val:"'"+f.val+"'";return f.col+" "+f.op+" "+v;});if(cds.length)sql+="\nWHERE "+cds.join("\n  AND ");if(gb)sql+="\nGROUP BY "+gb;if(hav)sql+="\nHAVING "+hav;if(ob)sql+="\nORDER BY "+ob+" "+dir;if(lim)sql+="\nLIMIT "+lim;if(off)sql+="\nOFFSET "+off;sql+=";";window._vsql=sql;document.getElementById("vprev").innerHTML=hl(sql);};
window.vCopy=function(){if(!window._vsql)return;navigator.clipboard.writeText(window._vsql).catch(function(){});flash("vcc");toast("Copied!");};
window.vToChat=function(){if(!window._vsql)return;var es=document.getElementById("es");if(es)es.remove();setMode("chat",null);var id="m"+Date.now(),v=vld(window._vsql);addCard(id,window._vsql,v,"[Visual Builder]");hist.unshift({id:id,title:"[Visual Builder]",time:ts()});renderHist();updStats();};
window.vDL=function(){if(window._vsql){dl(window._vsql,"visual_query.sql");toast("Downloaded!");}};
window.vSave=function(){if(!window._vsql)return;bookmarks.unshift({id:"bk"+Date.now(),title:"[Visual] "+document.getElementById("vt").value,sql:window._vsql,time:ts(),tags:[]});renderBK();updStats();toast("Saved!");};
window.vReset=function(){vFs=[];vCs=[];["vt","vagg","vlim","voff","vhav"].forEach(function(id){var el=document.getElementById(id);if(el)el.value="";});document.getElementById("vcols").innerHTML='<div style="color:var(--mu);font-size:12px">Select a table first</div>';document.getElementById("vfilters").innerHTML="";document.getElementById("vprev").innerHTML='<span style="color:var(--mu)">-- Select a table above --</span>';window._vsql="";toast("Reset");};

var jCols=[];
function refreshJoin(){var tables=getSchema(),names=Object.keys(tables);["jt1","jt2"].forEach(function(id){var sel=document.getElementById(id),cur=sel.value;sel.innerHTML='<option value="">-- select --</option>'+names.map(function(n){return"<option"+(n===cur?" selected":"")+">"+n+"</option>"}).join("");});jUpdate();}
window.jUpdate=function(){var tables=getSchema(),t1=document.getElementById("jt1").value,t2=document.getElementById("jt2").value,jt=document.getElementById("jtype").value,c1=tables[t1]||[],c2=tables[t2]||[];var s1=document.getElementById("jon1"),s2=document.getElementById("jon2");var isCross=jt==="CROSS JOIN";document.getElementById("jon-card").style.display=isCross?"none":"block";s1.innerHTML='<option value="">--</option>'+c1.map(function(c){return"<option>"+c+"</option>"}).join("");s2.innerHTML='<option value="">--</option>'+c2.map(function(c){return"<option>"+c+"</option>"}).join("");if(t1&&t2){var m=c1.filter(function(c){return c2.indexOf(c)>=0})[0];if(m){s1.value=m;s2.value=m;}}document.getElementById("jdiag").innerHTML='<div class="jbox'+(t1?" lit":"")+'" ><div class="jbn">'+esc(t1||"Table A")+'</div><div class="jbc">'+esc(c1.slice(0,4).join(", ")||"--")+'</div></div><div class="jcon"><div class="jline"></div><div class="jbadge">'+esc(jt.split(" ")[0])+'</div><div class="jline"></div></div><div class="jbox'+(t2?" lit":"")+'" ><div class="jbn">'+esc(t2||"Table B")+'</div><div class="jbc">'+esc(c2.slice(0,4).join(", ")||"--")+"</div></div>";var all=c1.map(function(c){return{c:c,t:t1}}).concat(c2.map(function(c){return{c:c,t:t2}}));if(t1&&t2)jCols=all.map(function(x){return x.t+"."+x.c;});document.getElementById("jcols").innerHTML=all.length?all.map(function(x){var k=x.t+"."+x.c;return'<span class="pill'+(jCols.indexOf(k)>=0?" on":"")+'" onclick="togJC(\''+k+'\',this)"><em style="color:var(--mu);font-style:normal">'+esc(x.t)+".</em><strong>"+esc(x.c)+"</strong></span>"}).join(""):'<div style="color:var(--mu);font-size:12px">Pick tables first</div>';buildJSQL();};
window.togJC=function(k,el){if(jCols.indexOf(k)>=0){if(jCols.length===1)return;jCols=jCols.filter(function(c){return c!==k});el.classList.remove("on");}else{jCols.push(k);el.classList.add("on");}buildJSQL();};
function buildJSQL(){var t1=document.getElementById("jt1").value,t2=document.getElementById("jt2").value,jt=document.getElementById("jtype").value,on1=document.getElementById("jon1").value,on2=document.getElementById("jon2").value,wh=document.getElementById("jwhere").value.trim(),ord=document.getElementById("jorder").value.trim(),lim=document.getElementById("jlim").value;var isCross=jt==="CROSS JOIN";if(!t1||!t2||((!on1||!on2)&&!isCross)){document.getElementById("jprev").innerHTML='<span style="color:var(--mu)">-- Select tables'+(isCross?"":" and ON columns")+" --</span>";window._jsql="";return;}var sel=jCols.length?jCols.join(", "):t1+".*, "+t2+".*";var sql="SELECT "+sel+"\nFROM "+t1+"\n"+jt+" "+t2+(isCross?"":" ON "+t1+"."+on1+" = "+t2+"."+on2);if(wh)sql+="\nWHERE "+wh;if(ord)sql+="\nORDER BY "+ord;if(lim)sql+="\nLIMIT "+lim;sql+=";";window._jsql=sql;document.getElementById("jprev").innerHTML=hl(sql);}
window.jCopy=function(){if(!window._jsql)return;navigator.clipboard.writeText(window._jsql).catch(function(){});flash("jcc");toast("Copied!");};
window.jToChat=function(){if(!window._jsql)return;var es=document.getElementById("es");if(es)es.remove();setMode("chat",null);var id="m"+Date.now(),v=vld(window._jsql);addCard(id,window._jsql,v,"[JOIN Builder]");hist.unshift({id:id,title:"[JOIN Builder]",time:ts()});renderHist();updStats();};
window.jDL=function(){if(window._jsql){dl(window._jsql,"join_query.sql");toast("Downloaded!");}};
window.jSave=function(){if(!window._jsql)return;var t1=document.getElementById("jt1").value,t2=document.getElementById("jt2").value;bookmarks.unshift({id:"bk"+Date.now(),title:"[JOIN] "+t1+"+"+t2,sql:window._jsql,time:ts(),tags:[]});renderBK();updStats();toast("Saved!");};

window.sqUpdate=function(){var inner=document.getElementById("sq-inner").value.trim(),alias=document.getElementById("sq-alias").value.trim()||"inner_q",sel=document.getElementById("sq-sel").value.trim()||"*",wh=document.getElementById("sq-where").value.trim(),ord=document.getElementById("sq-order").value.trim(),lim=document.getElementById("sq-lim").value;if(!inner){document.getElementById("sqprev").innerHTML='<span style="color:var(--mu)">-- Fill inner query above --</span>';window._sqsql="";return;}var ind=inner.split("\n").map(function(l){return"  "+l;}).join("\n");var sql="SELECT "+sel+"\nFROM (\n"+ind+"\n) AS "+alias;if(wh)sql+="\nWHERE "+wh;if(ord)sql+="\nORDER BY "+ord;if(lim)sql+="\nLIMIT "+lim;sql+=";";window._sqsql=sql;document.getElementById("sqprev").innerHTML=hl(sql);};
window.sqCopy=function(){if(!window._sqsql)return;navigator.clipboard.writeText(window._sqsql).catch(function(){});flash("sqcc");toast("Copied!");};
window.sqToChat=function(){if(!window._sqsql)return;var es=document.getElementById("es");if(es)es.remove();setMode("chat",null);var id="m"+Date.now(),v=vld(window._sqsql);addCard(id,window._sqsql,v,"[Subquery Builder]");hist.unshift({id:id,title:"[Subquery]",time:ts()});renderHist();updStats();};
window.sqDL=function(){if(window._sqsql){dl(window._sqsql,"subquery.sql");toast("Downloaded!");}};
window.sqSave=function(){if(!window._sqsql)return;bookmarks.unshift({id:"bk"+Date.now(),title:"[Subquery] "+document.getElementById("sq-alias").value,sql:window._sqsql,time:ts(),tags:[]});renderBK();updStats();toast("Saved!");};

window.runDiff=function(){var a=document.getElementById("diff-a").value.trim(),b=document.getElementById("diff-b").value.trim();if(!a||!b){document.getElementById("diff-out").innerHTML='<span style="color:var(--mu)">-- Paste two queries above --</span>';document.getElementById("diff-sum").textContent="Fill in both queries.";return;}var la=a.split("\n"),lb=b.split("\n"),out="",add=0,rem=0,same=0,mx=Math.max(la.length,lb.length);for(var i=0;i<mx;i++){var lineA=la[i]!==undefined?la[i]:"",lineB=lb[i]!==undefined?lb[i]:"";if(lineA===lineB){out+="<span>"+esc(lineA)+"</span>\n";same++;}else{if(lineA){out+='<span class="dr">- '+esc(lineA)+"</span>\n";rem++;}if(lineB){out+='<span class="da">+ '+esc(lineB)+"</span>\n";add++;}}}document.getElementById("diff-out").innerHTML=out.trim()||'<span style="color:var(--ac)">Queries are identical.</span>';var pct=Math.round((1-(same/mx))*100);document.getElementById("diff-sum").innerHTML="<strong>Lines added:</strong> "+add+" &nbsp; <strong>Removed:</strong> "+rem+" &nbsp; <strong>Unchanged:</strong> "+same+"<br><strong>Change rate:</strong> "+pct+"% of lines differ."+(add===0&&rem===0?' <span style="color:var(--ac)">&#10003; Queries are identical.</span>':"");};

window.runFmt=function(){var inp=document.getElementById("fmt-in").value.trim();if(!inp){toast("Paste SQL first","var(--wn)");return;}var result=fmt(inp);document.getElementById("fmt-out").innerHTML=hl(result);window._fmtSQL=result;toast("SQL formatted!");};
window.copyFmt=function(){if(window._fmtSQL){navigator.clipboard.writeText(window._fmtSQL).catch(function(){});toast("Copied!");}};
window.fmtToChat=function(){if(!window._fmtSQL)return;var es=document.getElementById("es");if(es)es.remove();setMode("chat",null);var id="m"+Date.now(),v=vld(window._fmtSQL);addCard(id,window._fmtSQL,v,"[Formatter]");hist.unshift({id:id,title:"[Formatter]",time:ts()});renderHist();updStats();};

window.explainErr=function(){
  var inp=document.getElementById("err-in").value.trim().toLowerCase();
  if(!inp){toast("Paste an error message first","var(--wn)");return;}
  var out=document.getElementById("err-out");
  var explanations=[
    {p:/syntax.*error|you have an error.*sql syntax/,r:"<strong>Syntax Error:</strong> There is a typo or invalid keyword in your SQL. Common causes include: a missing comma between column names, a misspelled keyword (e.g. SEELCT instead of SELECT), an unclosed parenthesis, or using a reserved word as a column name without quoting it. Check the line number in the error message for the exact location."},
    {p:/column.*does not exist|unknown column|invalid.*column|invalid identifier/,r:"<strong>Unknown Column:</strong> A column name in your query does not exist in the table. Check for: typos in column names, using a column from the wrong table without a table prefix, or referencing a computed alias in a WHERE clause (use HAVING instead). Verify column names against your schema."},
    {p:/table.*does not exist|unknown table|no such table|object.*not found/,r:"<strong>Unknown Table:</strong> The table name in your query does not exist. Check for: typos in the table name, a missing schema prefix (e.g. you may need public.orders instead of just orders in PostgreSQL), or the table may not have been created yet in this database."},
    {p:/duplicate.*key|unique.*constraint|integrity constraint.*unique/,r:"<strong>Duplicate Key Error:</strong> You are trying to INSERT or UPDATE a record with a value that already exists in a UNIQUE or PRIMARY KEY column. Solution: check if the record already exists before inserting, use INSERT ... ON DUPLICATE KEY UPDATE (MySQL) or INSERT ... ON CONFLICT (PostgreSQL), or update the existing record instead."},
    {p:/division by zero|divide.*zero/,r:"<strong>Division by Zero:</strong> Your query divides by a value that is zero. Use NULLIF to prevent this: change your_column / divisor to your_column / NULLIF(divisor, 0). This returns NULL instead of an error when the divisor is zero."},
    {p:/data.*truncat|value.*too long|string.*too long/,r:"<strong>Data Too Long:</strong> A value you are trying to insert is larger than the column's defined maximum size. Either trim the value before inserting, or increase the column's maximum length (e.g. change VARCHAR(50) to VARCHAR(255)) using an ALTER TABLE statement."},
    {p:/access denied|permission denied|privilege/,r:"<strong>Permission Denied:</strong> Your database user account does not have permission to perform this operation on this table. Contact your database administrator and ask them to GRANT the required privileges (SELECT, INSERT, UPDATE, or DELETE) on the relevant table to your user."},
    {p:/connection.*refused|could not connect|connection.*failed/,r:"<strong>Connection Error:</strong> The application cannot reach the database server. Check that: the database service is running, the host name and port number are correct in your connection settings, your username and password are valid, and no firewall is blocking the connection port."},
    {p:/null.*constraint|not null.*violation|null value.*column/,r:"<strong>NOT NULL Violation:</strong> You are trying to insert or update a row with a NULL (empty) value in a column that requires a value. Check which column is causing the error and make sure you provide a non-null value for it in your INSERT or UPDATE statement."},
    {p:/foreign key.*constraint|referential integrity/,r:"<strong>Foreign Key Constraint Error:</strong> You are trying to insert a value that does not exist in the referenced parent table, or trying to delete a parent row that is still referenced by child rows. Ensure the referenced record exists before inserting, or delete child records before deleting parent records."},
    {p:/timeout|timed out|query.*cancelled/,r:"<strong>Query Timeout:</strong> The query took too long to run and was cancelled. To fix this: add a WHERE clause to reduce the number of rows scanned, add a database index on the columns used in WHERE and JOIN conditions, or break the query into smaller pieces. Use EXPLAIN to analyse the query execution plan."},
    {p:/ambiguous.*column|column.*ambiguous/,r:"<strong>Ambiguous Column Name:</strong> A column name you used exists in more than one of the tables being joined. Prefix the column name with the table name or alias to make it unambiguous. For example, write orders.id instead of just id."},
    {p:/group by.*aggregate|not.*group by|non-aggregate/,r:"<strong>GROUP BY Error:</strong> When using GROUP BY, every column in the SELECT list must either appear in the GROUP BY clause or be wrapped in an aggregate function (COUNT, SUM, AVG, MAX, or MIN). Add the column to GROUP BY or apply an aggregate function to it."},
    {p:/subquery.*more than one row|more than one.*returned/,r:"<strong>Subquery Returns Multiple Rows:</strong> A subquery used with = is returning more than one row, but = can only compare to a single value. Fix this by: using IN instead of =, adding LIMIT 1 to the subquery, or using MAX() / MIN() to reduce the subquery to one value."},
  ];
  var found=false;
  for(var i=0;i<explanations.length;i++){if(explanations[i].p.test(inp)){out.innerHTML=explanations[i].r;found=true;break;}}
  if(!found)out.innerHTML="<strong>Error Analysis:</strong> This error message pattern was not specifically recognised. General advice: check all table and column names for typos, verify all parentheses are balanced, confirm your SELECT columns are valid for the queried table, and search for the error code in your database documentation. Error code detected: "+(inp.match(/\d{4,}/)||["none"])[0]+".";
  out.style.display="block";
};

window.estimateCplx=function(){
  var inp=document.getElementById("cplx-in").value.trim();
  if(!inp){toast("Paste a SQL query first","var(--wn)");return;}
  var s=inp.toUpperCase();
  var score=0,details=[];
  var joins=(s.match(/\bJOIN\b/g)||[]).length;
  var subs=(s.match(/\bSELECT\b/g)||[]).length-1;
  var aggs=(s.match(/\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/g)||[]).length;
  var hasGroup=s.indexOf("GROUP BY")>=0;
  var hasOrder=s.indexOf("ORDER BY")>=0;
  var hasWindow=s.indexOf("OVER (")>=0||s.indexOf("OVER(")>=0;
  var hasUnion=(s.match(/\bUNION\b/g)||[]).length;
  var hasLike=(s.match(/\bLIKE\b/g)||[]).length;
  var hasDistinct=s.indexOf("DISTINCT")>=0;
  if(joins>0){score+=joins*15;details.push("&#128279; "+joins+" JOIN"+(joins>1?"s ("+joins+" table combinations)":"")+": each JOIN multiplies row comparisons. Performance risk: "+(joins<=2?"moderate":"high")+".");}
  if(subs>0){score+=subs*20;details.push("&#8853; "+subs+" subquer"+(subs>1?"ies":"y")+": subqueries may run once per outer row. Consider using JOINs or CTEs for better performance.");}
  if(aggs>0){score+=aggs*5;details.push("&#8721; "+aggs+" aggregate function"+(aggs>1?"s":"")+": requires scanning all matching rows.");}
  if(hasGroup){score+=10;details.push("&#128202; GROUP BY: sorts and groups all matching rows before returning results.");}
  if(hasOrder){score+=5;details.push("&#8595; ORDER BY: sorts the full result set.");}
  if(hasWindow){score+=25;details.push("&#128200; Window function OVER(): computationally expensive. Ensure the PARTITION BY column is indexed.");}
  if(hasUnion>0){score+=hasUnion*10;details.push("&#8942; UNION: runs "+hasUnion+" separate quer"+(hasUnion>1?"ies":"y")+" and merges results.");}
  if(hasLike>0){score+=hasLike*8;details.push("&#128269; "+hasLike+" LIKE pattern"+(hasLike>1?"s":"")+": LIKE with a leading % cannot use indexes and must scan all rows.");}
  if(hasDistinct){score+=10;details.push("&#10003; DISTINCT: requires deduplication of the full result set.");}
  if(score===0){score=5;details.push("&#128196; Simple query: reads rows with minimal computation. Very efficient.");}
  var label,color,pct;
  if(score<=20){label="&#128994; Simple &mdash; Very Low Risk";color="var(--ac)";pct=20;}
  else if(score<=40){label="&#128992; Moderate &mdash; Safe for most databases";color="var(--nm)";pct=40;}
  else if(score<=65){label="&#128308; Complex &mdash; Test on sample data before running";color="var(--wn)";pct=65;}
  else{label="&#11035; Heavy &mdash; Optimise before running on production";color="var(--er)";pct=Math.min(score,100);}
  var box=document.getElementById("cplx-out");box.style.display="block";
  document.getElementById("cplx-label").innerHTML=label+" (Score: "+score+")";
  document.getElementById("cplx-label").style.color=color;
  var bar=document.getElementById("cplx-bar");bar.style.width=pct+"%";bar.style.background=color;
  document.getElementById("cplx-detail").innerHTML="<strong>Analysis breakdown:</strong><br>"+details.join("<br>")+
    "<br><br><strong>Optimisation tip:</strong> "+(score>65?"Add a WHERE clause to reduce scanned rows. Ensure JOIN and WHERE columns have indexes. Consider splitting into a CTE for readability. Use EXPLAIN to analyse the execution plan.":score>40?"Verify indexes exist on JOIN and WHERE columns. Test with EXPLAIN ANALYZE before running on a large production table.":"This query is well-structured and should perform efficiently on most databases.");
};

window.genDiagram=function(){
  var tables=getSchema();var names=Object.keys(tables);
  if(!names.length){toast("Add schema first","var(--wn)");return;}
  var lines=["DATABASE SCHEMA DIAGRAM","==========================================",""];
  names.forEach(function(t){
    lines.push("  +-------------------------------------+");
    lines.push("  |  TABLE: "+t.toUpperCase().padEnd(27)+"|");
    lines.push("  +-------------------------------------+");
    tables[t].forEach(function(c){var ct=colType(c);var sym=ct==="id/int"?"[PK] ":c.endsWith("_id")?"[FK] ":ct==="datetime"?"[DT] ":"     ";lines.push("  | "+sym+c.padEnd(20)+" "+ct.padEnd(9)+"|");});
    lines.push("  +-------------------------------------+");lines.push("");
  });
  var rels=[];
  names.forEach(function(t){tables[t].forEach(function(c){if(c.endsWith("_id")){var ref=c.replace("_id","");if(tables[ref])rels.push(t+"."+c+" -----> "+ref+".id");}});});
  if(rels.length){lines.push("RELATIONSHIPS","------------------------------------------");rels.forEach(function(r){lines.push("  "+r);});lines.push("");}
  lines.push("KEY:  [PK] Primary/ID   [FK] Foreign Key   [DT] Date/Time");
  var out=document.getElementById("diagram-out");out.textContent=lines.join("\n");out.style.display="block";toast("Diagram generated!");
};

window.genSP=function(){
  var t=document.getElementById("sp-tbl").value,type=document.getElementById("sp-type").value;
  if(!t){toast("Select a table first","var(--wn)");return;}
  var dialect=document.getElementById("dialect").value;
  var tables=getSchema();var cols=tables[t]||[];
  var idCol=clike(cols,"id")||cols[0]||"id";
  var valCols=cols.filter(function(c){return c!=="id";});
  var isPG=dialect.indexOf("PostgreSQL")>=0,isMSSQL=dialect.indexOf("SQL Server")>=0,isOracle=dialect.indexOf("Oracle")>=0;
  var sql="";
  if(isPG){
    sql="CREATE OR REPLACE FUNCTION fn_"+t+"_"+type+"(p_id INTEGER DEFAULT NULL)\nRETURNS TABLE("+cols.map(function(c){return c+" TEXT"}).join(", ")+")\nLANGUAGE plpgsql AS $$\nBEGIN\n  RETURN QUERY\n  SELECT "+cols.join(", ")+" FROM "+t+(type==="getbyid"?" WHERE "+idCol+" = p_id":"")+"\n  ORDER BY "+idCol+";\nEND;\n$$;\n\n-- Usage: SELECT * FROM fn_"+t+"_"+type+"("+(type==="select"?"":"1")+");";
  } else if(isMSSQL){
    sql="CREATE OR ALTER PROCEDURE [dbo].[usp_"+t+"_"+type+"]\n  @"+idCol+" INT = NULL\nAS\nBEGIN\n  SET NOCOUNT ON;\n  "+({select:"SELECT * FROM "+t+";",getbyid:"SELECT * FROM "+t+" WHERE "+idCol+" = @"+idCol+";",insert:"INSERT INTO "+t+" ("+valCols.join(", ")+")\n  VALUES ("+valCols.map(function(c){return"@"+c;}).join(", ")+");",update:"UPDATE "+t+" SET "+valCols.slice(0,3).map(function(c){return c+" = @"+c;}).join(", ")+" WHERE "+idCol+" = @"+idCol+";",delete:"DELETE FROM "+t+" WHERE "+idCol+" = @"+idCol+";"}[type])+"\nEND;\nGO\n\n-- Usage: EXEC usp_"+t+"_"+type+(type==="select"?"":"  @"+idCol+" = 1")+";";
  } else if(isOracle){
    sql="CREATE OR REPLACE PROCEDURE sp_"+t+"_"+type+"\n  (p_"+idCol+" IN NUMBER DEFAULT NULL)\nAS\nBEGIN\n  -- "+type+" operation on "+t+"\n  NULL; -- Replace with your logic\nEND sp_"+t+"_"+type+";\n/\n\n-- Usage: EXEC sp_"+t+"_"+type+";";
  } else {
    var bodies={select:"  SELECT * FROM "+t+";",getbyid:"  SELECT * FROM "+t+" WHERE "+idCol+" = p_id;",insert:"  INSERT INTO "+t+" ("+valCols.join(", ")+")\n  VALUES ("+valCols.map(function(c){return"p_"+c;}).join(", ")+");",update:"  UPDATE "+t+" SET "+valCols.slice(0,3).map(function(c){return c+" = p_"+c;}).join(", ")+" WHERE "+idCol+" = p_id;",delete:"  DELETE FROM "+t+" WHERE "+idCol+" = p_id;"};
    var params={select:"",getbyid:"IN p_id INT",insert:valCols.map(function(c){return"IN p_"+c+" VARCHAR(255)";}).join(", "),update:"IN p_id INT, "+valCols.slice(0,3).map(function(c){return"IN p_"+c+" VARCHAR(255)";}).join(", "),delete:"IN p_id INT"};
    sql="DELIMITER //\n\nCREATE PROCEDURE sp_"+t+"_"+type+"("+params[type]+")\nBEGIN\n"+bodies[type]+"\nEND //\n\nDELIMITER ;\n\n-- Usage: CALL sp_"+t+"_"+type+"("+(type==="select"?"":type==="getbyid"?"1":valCols.slice(0,3).map(function(){return"'value'";}).join(", "))+");";
  }
  document.getElementById("sp-out").innerHTML=hl(sql);window._spSQL=sql;
};
window.copySP=function(){if(window._spSQL){navigator.clipboard.writeText(window._spSQL).catch(function(){});toast("Copied!");}};

window.buildIN=function(){
  var col=document.getElementById("in-col").value.trim()||"column_name";
  var type=document.getElementById("in-type").value;
  var raw=document.getElementById("in-vals").value;
  var vals=raw.split(/[\n,]+/).map(function(v){return v.trim();}).filter(Boolean);
  if(!vals.length){document.getElementById("in-out").innerHTML='<span style="color:var(--mu)">-- Paste values above --</span>';return;}
  var formatted=vals.map(function(v){return type==="text"?"'"+v.replace(/'/g,"''")+"'":v;}).join(", ");
  var sql=col+" IN ("+formatted+")";
  document.getElementById("in-out").innerHTML=hl(sql);window._inSQL=sql;
};
window.copyIN=function(){if(window._inSQL){navigator.clipboard.writeText(window._inSQL).catch(function(){});toast("IN clause copied!");}};

var LESSONS=[
  {tag:"tb",label:"Beginner",title:"1. SELECT &mdash; Retrieve Columns",body:"SELECT specifies which columns to return from a table. You list column names after SELECT separated by commas. SELECT * returns all columns but is slower in production because it transfers unnecessary data. Always name the columns you actually need.",sql:"SELECT name, email, status\nFROM customers;",desc:"Returns name, email and status columns from every row in the customers table. The semicolon ends the statement.",tryq:"Show all customers"},
  {tag:"tb",label:"Beginner",title:"2. WHERE &mdash; Filter Rows",body:"WHERE filters which rows appear in results. Only rows where the condition is TRUE are included. Supports many operators: = (equals), != (not equal), > < >= <= (comparisons), LIKE (text pattern), IN (match a list), BETWEEN (range), IS NULL (missing value). You can combine conditions with AND and OR.",sql:"SELECT name, status\nFROM customers\nWHERE status = 'active';",desc:"Returns only the rows where status equals 'active'. Text values must be enclosed in single quotes.",tryq:"Show active customers"},
  {tag:"tb",label:"Beginner",title:"3. ORDER BY &mdash; Sort Results",body:"ORDER BY sorts the result rows. DESC sorts from highest to lowest (descending) and is used for most recent, top, or largest. ASC sorts from lowest to highest (ascending). Without ORDER BY, the order of rows returned by a database is never guaranteed and can change between runs.",sql:"SELECT name, salary\nFROM employees\nORDER BY salary DESC;",desc:"Returns all employees sorted from the highest salary to the lowest. The top-paid employee appears first.",tryq:"Average salary grouped by department"},
  {tag:"tb",label:"Beginner",title:"4. LIMIT &mdash; Cap the Row Count",body:"LIMIT restricts the maximum number of rows returned. This is essential for large tables and for implementing pagination. Always combine LIMIT with ORDER BY, otherwise you do not know which rows you will get because row order without ORDER BY is random.",sql:"SELECT name, total\nFROM orders\nORDER BY total DESC\nLIMIT 10;",desc:"Returns the 10 orders with the highest total value. Add OFFSET 10 to get rows 11-20 (page 2).",tryq:"Top 10 customers by total revenue"},
  {tag:"tb",label:"Beginner",title:"5. COUNT &mdash; Count Rows",body:"COUNT(*) counts how many rows match your WHERE condition and always returns a single number. It is the standard way to answer how-many questions. COUNT(column) counts only non-NULL values in that specific column. AS renames the output column.",sql:"SELECT COUNT(*) AS total_pending\nFROM orders\nWHERE status = 'pending';",desc:"Counts all rows in orders where status is pending. The result column is named total_pending using the AS keyword.",tryq:"Count orders grouped by status"},
  {tag:"tb",label:"Beginner",title:"6. SUM, AVG, MAX, MIN &mdash; Aggregates",body:"Aggregate functions collapse many rows into a single calculated value. SUM adds up all values in a numeric column. AVG divides the total by the count. MAX finds the highest value. MIN finds the lowest. They are often combined with GROUP BY.",sql:"SELECT\n  SUM(total) AS total_revenue,\n  AVG(total) AS avg_order,\n  MAX(total) AS largest_order,\n  MIN(total) AS smallest_order\nFROM orders;",desc:"Returns four calculated values from all rows in the orders table as a single result row.",tryq:"Monthly sales totals for this year"},
  {tag:"ti",label:"Intermediate",title:"7. GROUP BY &mdash; Group Rows",body:"GROUP BY collapses rows that share the same value in a column into a single group. You get one output row per group. Always paired with an aggregate function like COUNT, SUM or AVG. Without the aggregate, GROUP BY is similar to DISTINCT.",sql:"SELECT department,\n  COUNT(*) AS headcount,\n  AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;",desc:"Returns one row per department showing how many employees are in it and what their average salary is.",tryq:"Average salary grouped by department"},
  {tag:"ti",label:"Intermediate",title:"8. HAVING &mdash; Filter Groups",body:"HAVING filters groups after GROUP BY has run. It is the equivalent of WHERE but applied to grouped results. WHERE filters individual rows before grouping. HAVING filters the final groups after aggregation. You can use aggregate functions in HAVING conditions.",sql:"SELECT category, COUNT(*) AS total\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 5;",desc:"Returns only the product categories that contain more than 5 products. Categories with 5 or fewer are excluded.",tryq:"Count orders grouped by status"},
  {tag:"ti",label:"Intermediate",title:"9. INNER JOIN &mdash; Match Both Tables",body:"INNER JOIN connects two tables by matching rows based on a shared column value defined in the ON clause. Only rows that have a matching row in BOTH tables are returned. Rows that have no match in either table are excluded entirely from the result.",sql:"SELECT c.name, o.total, o.status\nFROM customers c\nINNER JOIN orders o\n  ON c.id = o.customer_id;",desc:"Combines customer names with their orders. Customers who have never placed an order are excluded because they have no matching row in orders.",tryq:"Top 10 customers by total revenue"},
  {tag:"ti",label:"Intermediate",title:"10. LEFT JOIN &mdash; All Left Rows",body:"LEFT JOIN returns ALL rows from the left table plus any matching rows from the right table. When no matching row exists in the right table, the right-side columns show NULL. Use this when you want all records from one table regardless of whether they have related records in another.",sql:"SELECT c.name,\n  COUNT(o.id) AS order_count\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.name;",desc:"Returns every customer including those with no orders. Customers with no orders show order_count = 0 because COUNT(o.id) counts only non-NULL values.",tryq:"Top 10 customers by total revenue"},
  {tag:"ti",label:"Intermediate",title:"11. LIKE &mdash; Pattern Matching",body:"LIKE matches text patterns in string columns. The percent sign % matches any sequence of characters including zero characters. The underscore _ matches exactly one character. Case sensitivity depends on your database and its collation settings.",sql:"SELECT name, email\nFROM customers\nWHERE email LIKE '%@gmail.com';",desc:"Returns all customers with a Gmail address. The % at the start matches any characters before @gmail.com. Use LIKE 'word%' to match values starting with a word.",tryq:"Show customers with missing email"},
  {tag:"ti",label:"Intermediate",title:"12. IN and BETWEEN",body:"IN matches a column against a list of values, which is equivalent to multiple OR conditions but much more concise. BETWEEN matches values within a numeric or date range and is inclusive on both ends, meaning both boundary values are included.",sql:"SELECT name, status, total\nFROM orders\nWHERE status IN ('pending', 'active')\n  AND total BETWEEN 100 AND 500;",desc:"Returns orders that are either pending or active AND have a total value from 100 to 500 inclusive.",tryq:"Orders placed in the last 7 days"},
  {tag:"ta",label:"Advanced",title:"13. Subqueries &mdash; Query Inside a Query",body:"A subquery is a SELECT statement nested inside another query. The inner query runs first and its result is used by the outer query. Subqueries can appear in the FROM clause as an inline view, in the WHERE clause for filtering, or in the SELECT clause for computed columns.",sql:"SELECT name, total_spent\nFROM (\n  SELECT customer_id,\n    SUM(total) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n) AS cust_totals\nWHERE total_spent > 1000\nORDER BY total_spent DESC;",desc:"The inner query totals each customer's orders. The outer query then filters for customers who spent more than 1000. The inner result is named cust_totals using AS.",tryq:"Top 10 customers by total revenue"},
  {tag:"ta",label:"Advanced",title:"14. CTEs (WITH clause) &mdash; Named Subqueries",body:"A CTE gives a readable name to a subquery using the WITH keyword before the main SELECT. It can be referenced like a regular table in the main query. Multiple CTEs can be chained in a single WITH block. CTEs make complex queries much easier to read and maintain than deeply nested subqueries.",sql:"WITH top_customers AS (\n  SELECT customer_id,\n    SUM(total) AS lifetime_value\n  FROM orders\n  GROUP BY customer_id\n  HAVING SUM(total) > 5000\n)\nSELECT c.name, t.lifetime_value\nFROM customers c\nJOIN top_customers t ON c.id = t.customer_id\nORDER BY t.lifetime_value DESC;",desc:"The CTE top_customers identifies high-value customers. The main query joins back to customers to get their names. Much more readable than a nested subquery.",tryq:"Top 10 customers by total revenue"},
  {tag:"ta",label:"Advanced",title:"15. CASE WHEN &mdash; Conditional Logic",body:"CASE WHEN adds if-then-else logic directly inside a SELECT statement to create computed columns whose values depend on conditions. Each WHEN condition is evaluated in order and the first one that is TRUE is used. ELSE is the default value if no WHEN matches.",sql:"SELECT name, total,\n  CASE\n    WHEN total >= 1000 THEN 'High Value'\n    WHEN total >= 500  THEN 'Medium Value'\n    ELSE 'Low Value'\n  END AS tier\nFROM orders\nORDER BY total DESC;",desc:"Classifies each order row into a value tier based on its total amount. The tier column is computed for every row.",tryq:"Monthly sales totals for this year"},
  {tag:"ta",label:"Advanced",title:"16. RANK() &mdash; Window Functions",body:"Window functions compute a value for each row based on a set of related rows without collapsing them like GROUP BY does. RANK() assigns a position number. PARTITION BY restarts the rank within each group. ROW_NUMBER() gives unique sequential numbers. All original rows are preserved in the output.",sql:"SELECT name, salary, department,\n  RANK() OVER (\n    PARTITION BY department\n    ORDER BY salary DESC\n  ) AS salary_rank\nFROM employees;",desc:"Ranks each employee by salary within their department. The top earner in each department gets rank 1. All employee rows are preserved unlike GROUP BY which would collapse them.",tryq:"Rank employees by salary"},
  {tag:"ta",label:"Advanced",title:"17. NULL Handling &mdash; IS NULL and COALESCE",body:"NULL means missing or unknown data. You cannot use = NULL because NULL is not equal to anything, not even itself. Always use IS NULL or IS NOT NULL to check for missing values. COALESCE(a, b, c) returns the first non-NULL argument in the list. NULLIF(a, b) returns NULL when a equals b, useful to prevent division by zero.",sql:"SELECT\n  name,\n  COALESCE(email, 'No email on file') AS contact\nFROM customers\nWHERE email IS NULL;",desc:"Finds customers missing an email address. COALESCE replaces the NULL email with a readable placeholder string instead of showing NULL in the output.",tryq:"Show customers with missing email"}
];
function initLearn(){var el=document.getElementById("learn-content");el.innerHTML=LESSONS.map(function(l){return'<div class="lc" onclick="togLesson(this)"><div class="lt"><span>'+l.title+'</span><span style="font-size:11px;color:var(--mu)">&#9660;</span></div><div class="lb2"><span class="ltag '+l.tag+'">'+l.label+'</span><div style="margin-top:8px;font-size:12px;color:var(--mu);line-height:1.7">'+esc(l.body)+'</div><div class="lsql">'+hl(l.sql)+'</div><div style="font-size:12px;color:var(--mu);line-height:1.7;margin-bottom:8px">'+esc(l.desc)+'</div><button class="ltry" onclick="tryLesson(event,\''+esc(l.tryq)+'\')">&#9654; Try: '+esc(l.tryq)+'</button></div></div>';}).join("");}
window.togLesson=function(el){el.classList.toggle("open");};
window.tryLesson=function(ev,q){ev.stopPropagation();send(q);setMode("chat",null);toast("Running: "+q);};

var TPLS=[
  {cat:"Sales",label:"Top 10 by revenue",q:"Show me the top 10 customers by total revenue"},
  {cat:"Sales",label:"Monthly sales trend",q:"Show monthly sales totals for this year"},
  {cat:"Sales",label:"Orders last 7 days",q:"List all orders placed in the last 7 days"},
  {cat:"Sales",label:"Pending orders",q:"Show all orders with status pending"},
  {cat:"Sales",label:"Revenue this month",q:"Total revenue this month"},
  {cat:"Sales",label:"Cancelled orders",q:"Show all cancelled orders"},
  {cat:"Inventory",label:"Low stock products",q:"Show products with stock below 20"},
  {cat:"Inventory",label:"Products by category",q:"Count products grouped by category"},
  {cat:"Inventory",label:"Most expensive items",q:"Show top 10 most expensive products"},
  {cat:"Inventory",label:"Cheapest products",q:"Show 10 cheapest products"},
  {cat:"HR",label:"Active employees",q:"List all active employees"},
  {cat:"HR",label:"Avg salary by dept",q:"Show average salary grouped by department"},
  {cat:"HR",label:"New hires this year",q:"Show all employees hired this year"},
  {cat:"HR",label:"Rank employees",q:"Rank employees by salary"},
  {cat:"Finance",label:"Expenses this month",q:"Sum of all expenses this month"},
  {cat:"Finance",label:"Unpaid invoices",q:"Show all invoices with status unpaid"},
  {cat:"Finance",label:"Overdue invoices",q:"Show overdue invoices"},
  {cat:"Finance",label:"Revenue 1000-5000",q:"Show orders with total between 1000 and 5000"},
  {cat:"Advanced",label:"Duplicate emails",q:"Find duplicate emails in customers"},
  {cat:"Advanced",label:"Missing email",q:"Show customers with missing email"},
  {cat:"Advanced",label:"Name contains Smith",q:"Find customers whose name contains Smith"},
  {cat:"Advanced",label:"Percentage by category",q:"Show percentage of total revenue by category"},
  {cat:"Advanced",label:"Active orders 30 days",q:"Show active orders placed in the last 30 days"},
  {cat:"General",label:"Distinct categories",q:"Show distinct categories from products"},
  {cat:"General",label:"Latest 50 records",q:"Show the latest 50 records ordered by date"},
  {cat:"General",label:"Row count",q:"How many rows are in the orders table"},
  {cat:"General",label:"Last quarter",q:"Show all records from last quarter"}
];
function initTpl(){var cats=["All"].concat(TPLS.map(function(t){return t.cat;}).filter(function(v,i,a){return a.indexOf(v)===i;}));document.getElementById("catbar").innerHTML=cats.map(function(c){return'<button class="cb'+(c==="All"?" on":"")+'" onclick="fTpl(\''+c+'\',this)">'+c+"</button>";}).join("");renderTpl("All","");}
window.fTpl=function(cat,btn){document.querySelectorAll(".cb").forEach(function(b){b.classList.remove("on");});btn.classList.add("on");renderTpl(cat,"");};
window.searchTpl=function(v){renderTpl("All",v);};
function renderTpl(cat,search){var list=cat==="All"?TPLS:TPLS.filter(function(t){return t.cat===cat;});if(search)list=list.filter(function(t){return t.label.toLowerCase().indexOf(search.toLowerCase())>=0||t.q.toLowerCase().indexOf(search.toLowerCase())>=0;});document.getElementById("tpllist").innerHTML=list.length?list.map(function(t){return'<div class="tc" onclick="send(\''+t.q.replace(/'/g,"\\'")+'\')"><div class="tl">'+esc(t.label)+'</div><div class="ts2">'+esc(t.cat)+' &middot; click to run</div></div>';}).join(""):'<div style="color:var(--mu);font-size:12px;text-align:center;padding:14px">No templates found</div>';}

function initCS(){var data=[{t:"Basic Queries",r:[{c:"SELECT col1, col2 FROM t;",d:"Specific columns"},{c:"SELECT * FROM t;",d:"All columns"},{c:"SELECT DISTINCT col FROM t;",d:"Unique values"},{c:"SELECT col FROM t LIMIT 10;",d:"Max 10 rows"}]},{t:"Filtering (WHERE)",r:[{c:"WHERE col = 'value'",d:"Exact match"},{c:"WHERE col != 'value'",d:"Not equal"},{c:"WHERE col > 100",d:"Greater than"},{c:"WHERE col BETWEEN 10 AND 50",d:"Range inclusive"},{c:"WHERE col LIKE '%text%'",d:"Contains text"},{c:"WHERE col IN ('a','b','c')",d:"Match list"},{c:"WHERE col IS NULL",d:"Missing value"},{c:"WHERE col IS NOT NULL",d:"Has a value"}]},{t:"Sorting & Pagination",r:[{c:"ORDER BY col DESC",d:"Highest first"},{c:"ORDER BY col ASC",d:"Lowest first"},{c:"LIMIT 10 OFFSET 20",d:"Rows 21-30"}]},{t:"Aggregates",r:[{c:"COUNT(*)",d:"Count all rows"},{c:"COUNT(DISTINCT col)",d:"Count unique"},{c:"SUM(col)",d:"Add up numbers"},{c:"AVG(col)",d:"Calculate average"},{c:"MAX(col)",d:"Highest value"},{c:"MIN(col)",d:"Lowest value"}]},{t:"Grouping",r:[{c:"GROUP BY col",d:"One row per value"},{c:"HAVING COUNT(*) > 5",d:"Filter groups"}]},{t:"JOINs",r:[{c:"INNER JOIN t2 ON t1.id=t2.fk",d:"Matching rows only"},{c:"LEFT JOIN t2 ON t1.id=t2.fk",d:"All left + matches"},{c:"RIGHT JOIN t2 ON t1.id=t2.fk",d:"All right + matches"},{c:"FULL OUTER JOIN t2 ON ...",d:"All rows both sides"}]},{t:"Advanced",r:[{c:"WITH cte AS (SELECT...) SELECT...",d:"Named subquery"},{c:"FROM (SELECT...) AS s",d:"Inline subquery"},{c:"CASE WHEN x THEN y ELSE z END",d:"Conditional"},{c:"RANK() OVER (ORDER BY col)",d:"Rank rows"},{c:"COALESCE(col,'default')",d:"Replace NULL"},{c:"UNION ALL",d:"Combine results"}]}];document.getElementById("cs-content").innerHTML=data.map(function(s){return'<div class="cs-sec"><div class="cs-tit">'+s.t+"</div>"+s.r.map(function(r){return'<div class="cs-row"><span class="cs-cmd">'+esc(r.c)+'</span><span class="cs-desc">'+esc(r.d)+"</span></div>";}).join("")+"</div>";}).join("");}

var _ddl="";
function exportAllSQL(){if(!bookmarks.length){toast("No saved queries","var(--wn)");return;}var out="-- QueryPilot v9 Export\n-- Generated: "+new Date().toLocaleString()+"\n-- Dialect: "+document.getElementById("dialect").value+"\n-- Queries: "+bookmarks.length+"\n\n";out+=bookmarks.map(function(b,i){return"-- "+(i+1)+". "+b.title+(b.tags&&b.tags.length?" [Tags: "+b.tags.join(", ")+"]":"")+"\n"+b.sql;}).join("\n\n");dl(out,"querypilot_export.sql");toast("Exported "+bookmarks.length+" queries as .sql");}
function exportMarkdown(){if(!bookmarks.length){toast("No saved queries","var(--wn)");return;}var out="# QueryPilot Query Library\n\n**Generated:** "+new Date().toLocaleString()+"\n**Dialect:** "+document.getElementById("dialect").value+"\n**Total Queries:** "+bookmarks.length+"\n\n---\n\n";bookmarks.forEach(function(b,i){out+="## "+(i+1)+". "+b.title+"\n\n"+(b.tags&&b.tags.length?"**Tags:** "+b.tags.join(", ")+"\n\n":"")+"\`\`\`sql\n"+b.sql+"\n\`\`\`\n\n_Saved: "+b.time+"_\n\n---\n\n";});dl(out,"querypilot_queries.md");toast("Exported as Markdown!");}
function exportJSON(){if(!bookmarks.length){toast("No saved queries","var(--wn)");return;}var obj={tool:"QueryPilot v9",exported:new Date().toISOString(),dialect:document.getElementById("dialect").value,total:bookmarks.length,queries:bookmarks.map(function(b){return{title:b.title,sql:b.sql,tags:b.tags||[],saved:b.time};})};dl(JSON.stringify(obj,null,2),"querypilot_queries.json");toast("Exported as JSON!");}
function exportCSV(){if(!bookmarks.length){toast("No saved queries","var(--wn)");return;}var rows=["title,tags,first_line,saved_time"];bookmarks.forEach(function(b){rows.push('"'+b.title.replace(/"/g,'""')+'","'+(b.tags||[]).join("; ")+'","'+b.sql.split("\n")[0].replace(/"/g,'""')+'","'+b.time+'"');});dl(rows.join("\n"),"querypilot_queries.csv");toast("Exported as CSV!");}
function printLibrary(){if(!bookmarks.length){toast("No saved queries to print","var(--wn)");return;}var win=window.open("","_blank");var html='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>QueryPilot Query Library</title><style>body{font-family:Arial,sans-serif;padding:24px;max-width:900px;margin:0 auto}h1{font-size:20px;margin-bottom:4px}.meta{color:#666;font-size:12px;margin-bottom:24px}.qb{margin-bottom:28px;page-break-inside:avoid;border:1px solid #ddd;border-radius:6px;overflow:hidden}.qh{background:#f5f5f5;padding:10px 14px;font-size:14px;font-weight:700}.qt{display:inline-block;padding:1px 7px;border-radius:10px;font-size:10px;margin-left:6px;background:#e0f0e9;color:#1a7f37}pre{padding:12px 14px;background:#fff;font-family:monospace;font-size:12px;white-space:pre-wrap;word-break:break-word;margin:0;border-top:1px solid #ddd}</style></head><body>';html+='<h1>QueryPilot Query Library</h1><p class="meta">Generated: '+new Date().toLocaleString()+' &bull; '+bookmarks.length+' queries &bull; Dialect: '+document.getElementById("dialect").value+'</p>';bookmarks.forEach(function(b,i){html+='<div class="qb"><div class="qh">'+(i+1)+'. '+b.title+(b.tags&&b.tags.length?b.tags.map(function(t){return'<span class="qt">'+t+"</span>";}).join(""):"")+'</div><pre>'+b.sql+'</pre></div>';});html+="</body></html>";win.document.write(html);win.document.close();win.print();}
function genDDL(){var tables=getSchema();if(!Object.keys(tables).length){toast("No schema defined","var(--wn)");return;}var ddl="-- QueryPilot v9 DDL\n-- "+new Date().toLocaleString()+"\n\n";Object.keys(tables).forEach(function(t){ddl+="CREATE TABLE IF NOT EXISTS "+t+" (\n";var lines=tables[t].map(function(c){var ct=colType(c);var type=ct==="id/int"?"INTEGER PRIMARY KEY AUTOINCREMENT":ct==="decimal"?"DECIMAL(10,2)":ct==="integer"?"INTEGER":ct==="datetime"?"DATETIME":ct==="email"?"VARCHAR(255)":ct==="varchar"?"VARCHAR(100)":"TEXT";return"  "+c+" "+type;});ddl+=lines.join(",\n")+"\n);\n\n";});document.getElementById("ddl-preview").textContent=ddl.trim();document.getElementById("ddl-preview").style.display="block";_ddl=ddl;toast("DDL generated!");}
function copyDDL(){if(_ddl){navigator.clipboard.writeText(_ddl).catch(function(){});toast("Copied!");}}
function dlDDL(){if(_ddl){dl(_ddl,"schema_ddl.sql");toast("Downloaded!");}}
function updateSummary(){var mins=Math.floor((Date.now()-sessionStart)/60000);var el=document.getElementById("session-summary");if(!el)return;el.textContent="Total queries run: "+qCount+"\nSession duration: "+mins+" min\nTables in schema: "+Object.keys(getSchema()).length+"\nSaved queries: "+bookmarks.length+"\nQuery history entries: "+hist.length+"\nSQL dialect: "+document.getElementById("dialect").value+"\nReport generated: "+new Date().toLocaleString();}

var themes=["dark","light","hc"],themeIdx=0;
window.cycleTheme=function(){themeIdx=(themeIdx+1)%3;document.body.className=themeIdx===1?"light":themeIdx===2?"hc":"";document.getElementById("tbtn").textContent=themeIdx===0?"&#127769;":themeIdx===1?"&#9728;":"&#9650;";toast("Theme: "+(themeIdx===0?"Dark":themeIdx===1?"Light":"High Contrast"));};

window.setMode=function(mode,btn){["cpanel","vpanel","jpanel","sqpanel","diffpanel","toolspanel","learnpanel","exportpanel"].forEach(function(id){document.getElementById(id).classList.remove("on");});var map={chat:"cpanel",vqb:"vpanel",join:"jpanel",sq:"sqpanel",diff:"diffpanel",tools:"toolspanel",learn:"learnpanel",export:"exportpanel"};document.getElementById(map[mode]).classList.add("on");document.getElementById("ibar").style.display=mode==="chat"?"block":"none";document.querySelectorAll(".mt").forEach(function(b){b.classList.remove("on");});if(btn)btn.classList.add("on");else{var labels={chat:"Ask",vqb:"Visual",join:"JOIN",sq:"Subquery",diff:"Compare",tools:"Tools",learn:"Learn",export:"Export"};document.querySelectorAll(".mt").forEach(function(b){if(b.textContent.indexOf(labels[mode])>=0)b.classList.add("on");});}if(mode==="vqb")refreshVQB();if(mode==="join")refreshJoin();if(mode==="export")updateSummary();document.getElementById("st").textContent=Object.keys(getSchema()).length;};
window.spanel=function(id,btn){["schema","csv","tpl","bk","hist","cs"].forEach(function(p){var el=document.getElementById("sp-"+p);if(el)el.style.display="none";});document.getElementById("sp-"+id).style.display="block";document.querySelectorAll(".stab").forEach(function(b){b.classList.remove("on");});btn.classList.add("on");};
window.toggleSB=function(){document.getElementById("sb").classList.toggle("col");};
window.hk=function(ev){if(ev.key==="Enter"&&!ev.shiftKey){ev.preventDefault();send();}if(ev.key==="Escape"){ev.target.value="";ev.target.style.height="auto";}if((ev.ctrlKey||ev.metaKey)&&ev.key==="f"){ev.preventDefault();toggleSearch();}};
window.ar=function(el){el.style.height="auto";el.style.height=Math.min(el.scrollHeight,110)+"px";};
function refreshAll(){refreshVQB();refreshJoin();document.getElementById("st").textContent=Object.keys(getSchema()).length;}
setInterval(function(){var m=Math.floor((Date.now()-sessionStart)/60000);document.getElementById("ss").textContent=m+"m";},60000);
document.getElementById("schema-ta").addEventListener("input",refreshAll);
document.getElementById("dialect").addEventListener("change",onDC);
document.addEventListener("keydown",function(ev){if((ev.ctrlKey||ev.metaKey)&&ev.key==="f"&&document.activeElement.id!=="nli"){ev.preventDefault();toggleSearch();}});
initTpl();initLearn();initCS();


/* =====================================================================
   v7 — Enhancements (appended; preserves all v6 behaviour)
   ===================================================================== */

/* ---------- 1. Override setMode + spanel to include new panels ------- */
(function(){
  var origSet = window.setMode;
  window.setMode = function(mode, btn){
    // Hide everything including v7 multipanel
    ["cpanel","vpanel","jpanel","sqpanel","multipanel","diffpanel","toolspanel","learnpanel","exportpanel"]
      .forEach(function(id){ var el=document.getElementById(id); if(el) el.classList.remove("on"); });
    var map = {chat:"cpanel",vqb:"vpanel",join:"jpanel",sq:"sqpanel",multi:"multipanel",
               diff:"diffpanel",tools:"toolspanel",learn:"learnpanel","export":"exportpanel"};
    var pid = map[mode] || "cpanel";
    var pel = document.getElementById(pid);
    if(pel) pel.classList.add("on");
    document.getElementById("ibar").style.display = mode==="chat" ? "block" : "none";
    document.querySelectorAll(".mt").forEach(function(b){ b.classList.remove("on"); });
    if(btn) btn.classList.add("on");
    if(mode==="vqb") refreshVQB();
    if(mode==="join") refreshJoin();
    if(mode==="multi") refreshMT();
    if(mode==="export") updateSummary();
    document.getElementById("st").textContent = Object.keys(getSchema()).length;
  };
})();

(function(){
  window.spanel = function(id, btn){
    ["schema","csv","tpl","udt","snip","bk","hist","cs"].forEach(function(p){
      var el=document.getElementById("sp-"+p); if(el) el.style.display="none";
    });
    var el=document.getElementById("sp-"+id); if(el) el.style.display="block";
    document.querySelectorAll(".stab").forEach(function(b){ b.classList.remove("on"); });
    if(btn) btn.classList.add("on");
    if(id==="udt") renderUDT();
    if(id==="snip") renderSnips();
  };
})();

/* ---------- 2. Solarized theme (4th theme) -------------------------- */
(function(){
  var labels = ["Dark","Light","High Contrast","Solarized"];
  var cls = ["","light","hc","sol"];
  var icons = ["&#127769;","&#9728;","&#9650;","&#9784;"];
  var idx = 0;
  try { idx = parseInt(localStorage.getItem("qp_theme")||"0",10) || 0; } catch(e){}
  function apply(){
    document.body.className = (document.body.className.replace(/\b(light|hc|sol|fs-\w+)\b/g,"").trim()+" "+cls[idx]).trim();
    // Reapply font-size class
    try { var fs = localStorage.getItem("qp_fs")||"md"; document.body.classList.add("fs-"+fs); } catch(e){}
    var btn = document.getElementById("tbtn");
    if(btn) btn.innerHTML = icons[idx];
  }
  window.cycleTheme = function(){
    idx = (idx+1) % 4;
    try { localStorage.setItem("qp_theme", idx); } catch(e){}
    apply();
    toast("Theme: " + labels[idx]);
  };
  apply();
})();

/* ---------- 3. Font-size + settings store --------------------------- */
var QP_SETTINGS = (function(){
  var defaults = { fs:"md", autofmt:true, autohist:true, mock:true, hints:true, wrap:true, defaultDialect:"Standard SQL" };
  var s;
  try { s = JSON.parse(localStorage.getItem("qp_settings")||"null") || {}; } catch(e){ s = {}; }
  for(var k in defaults) if(!(k in s)) s[k] = defaults[k];
  return s;
})();
function saveSettings(){ try{ localStorage.setItem("qp_settings", JSON.stringify(QP_SETTINGS)); }catch(e){} }
window.setFontSize = function(v){
  ["fs-sm","fs-md","fs-lg","fs-xl"].forEach(function(c){ document.body.classList.remove(c); });
  document.body.classList.add("fs-"+v);
  QP_SETTINGS.fs = v; try{ localStorage.setItem("qp_fs", v); }catch(e){}
  saveSettings();
};
window.setDefaultDialect = function(v){
  QP_SETTINGS.defaultDialect = v;
  document.getElementById("dialect").value = v; onDC();
  saveSettings(); toast("Default dialect: "+v);
};
window.toggleSet = function(key, btn){
  QP_SETTINGS[key] = !QP_SETTINGS[key];
  btn.classList.toggle("on", QP_SETTINGS[key]);
  btn.setAttribute("aria-pressed", QP_SETTINGS[key]);
  saveSettings();
};
window.resetSettings = function(){
  try{ localStorage.removeItem("qp_settings"); localStorage.removeItem("qp_fs"); }catch(e){}
  toast("Reset — reload to apply"); setTimeout(function(){ location.reload(); }, 700);
};
window.openSettings = function(){
  var m = document.getElementById("set-mod");
  document.getElementById("set-fs").value = QP_SETTINGS.fs;
  document.getElementById("set-dialect").value = QP_SETTINGS.defaultDialect;
  ["autofmt","autohist","mock","hints","wrap"].forEach(function(k){
    var b = document.getElementById("set-"+k);
    if(b){ b.classList.toggle("on", QP_SETTINGS[k]); b.setAttribute("aria-pressed", QP_SETTINGS[k]); }
  });
  m.style.display = "flex";
};
window.closeSettings = function(){ document.getElementById("set-mod").style.display = "none"; };

/* Apply persisted settings on load */
(function(){
  document.body.classList.add("fs-"+QP_SETTINGS.fs);
  if(QP_SETTINGS.defaultDialect){
    var d = document.getElementById("dialect");
    if(d){ d.value = QP_SETTINGS.defaultDialect; onDC(); }
  }
})();

/* ---------- 4. Shortcuts overlay ------------------------------------ */
window.openShortcuts = function(){ document.getElementById("sc-mod").style.display = "flex"; };
window.closeShortcuts = function(){ document.getElementById("sc-mod").style.display = "none"; };

/* Global keyboard shortcuts (Ctrl+B, Ctrl+,, Ctrl+Shift+T, ?, Ctrl+S, Ctrl+E) */
document.addEventListener("keydown", function(ev){
  var tgt = document.activeElement;
  var inField = tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA");
  if(ev.key === "Escape"){
    closeShortcuts(); closeSettings();
    document.getElementById("mod").classList.remove("on");
  }
  if((ev.ctrlKey || ev.metaKey) && ev.key === "b"){ ev.preventDefault(); toggleSB(); }
  if((ev.ctrlKey || ev.metaKey) && ev.key === ","){ ev.preventDefault(); openSettings(); }
  if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && (ev.key === "T" || ev.key === "t")){ ev.preventDefault(); cycleTheme(); }
  if((ev.ctrlKey || ev.metaKey) && !ev.shiftKey && (ev.key === "s") && !inField){ ev.preventDefault(); saveSchema(); }
  if((ev.ctrlKey || ev.metaKey) && !ev.shiftKey && (ev.key === "e") && !inField){ ev.preventDefault(); exportAllSQL(); }
  if(ev.key === "?" && !inField){ ev.preventDefault(); openShortcuts(); }
});

/* ---------- 5. User-defined templates (UDT) ------------------------- */
var UDT = [];
try { UDT = JSON.parse(localStorage.getItem("qp_udt")||"[]") || []; } catch(e){ UDT = []; }
function saveUDT(){ try{ localStorage.setItem("qp_udt", JSON.stringify(UDT)); }catch(e){} }
window.addUDT = function(){
  var name = document.getElementById("udt-name").value.trim();
  var q = document.getElementById("udt-q").value.trim();
  if(!name || !q){ toast("Enter both name and query", "var(--wn)"); return; }
  UDT.unshift({ id:"u"+Date.now(), name:name, q:q });
  saveUDT(); renderUDT();
  document.getElementById("udt-name").value=""; document.getElementById("udt-q").value="";
  toast("Template added");
};
window.delUDT = function(ev, id){ ev.stopPropagation(); UDT = UDT.filter(function(u){ return u.id !== id; }); saveUDT(); renderUDT(); };
window.runUDT = function(q){ send(q); };
function renderUDT(){
  var el = document.getElementById("udt-list"); if(!el) return;
  if(!UDT.length){ el.innerHTML = '<div style="color:var(--mu);font-size:12px;text-align:center;padding:18px">No saved templates yet.<br>Type a name and a query above to add one.</div>'; return; }
  el.innerHTML = UDT.map(function(u){
    return '<div class="udt-card" onclick="runUDT(\''+u.q.replace(/'/g,"\\'")+'\')">'+
      '<div class="udt-name">'+esc(u.name)+'</div>'+
      '<div class="udt-q">'+esc(u.q)+'</div>'+
      '<button class="udt-del" onclick="delUDT(event,\''+u.id+'\')" title="Delete">&#10005;</button></div>';
  }).join("");
}

/* ---------- 6. Snippet library -------------------------------------- */
var SNIPS = [];
try { SNIPS = JSON.parse(localStorage.getItem("qp_snips")||"[]") || []; } catch(e){ SNIPS = []; }
function saveSnips(){ try{ localStorage.setItem("qp_snips", JSON.stringify(SNIPS)); }catch(e){} }
window.addSnip = function(){
  var name = document.getElementById("snip-name").value.trim();
  var body = document.getElementById("snip-body").value.trim();
  if(!name || !body){ toast("Enter both name and SQL fragment", "var(--wn)"); return; }
  SNIPS.unshift({ id:"s"+Date.now(), name:name, body:body });
  saveSnips(); renderSnips();
  document.getElementById("snip-name").value=""; document.getElementById("snip-body").value="";
  toast("Snippet saved");
};
window.delSnip = function(id){ SNIPS = SNIPS.filter(function(s){ return s.id !== id; }); saveSnips(); renderSnips(); };
window.copySnip = function(id){
  var s = SNIPS.filter(function(x){ return x.id === id; })[0]; if(!s) return;
  try { navigator.clipboard.writeText(s.body); toast("Snippet copied"); }
  catch(e){ toast("Copy failed", "var(--er)"); }
};
window.sendSnip = function(id){
  var s = SNIPS.filter(function(x){ return x.id === id; })[0]; if(!s) return;
  setMode("chat", null);
  var es = document.getElementById("es"); if(es) es.remove();
  var mid="m"+Date.now(), v=vld(s.body);
  addCard(mid, s.body, v, "[Snippet] "+s.name);
  hist.unshift({id:mid, title:"[Snippet] "+s.name, time:ts()});
  renderHist(); updStats();
};
function renderSnips(){
  var el = document.getElementById("snip-list"); if(!el) return;
  if(!SNIPS.length){ el.innerHTML = '<div style="color:var(--mu);font-size:12px;text-align:center;padding:18px">No snippets yet.<br>Add reusable SQL fragments above.</div>'; return; }
  el.innerHTML = SNIPS.map(function(s){
    return '<div class="snip-card">'+
      '<div class="snip-name">'+esc(s.name)+'</div>'+
      '<div class="snip-body">'+esc(s.body)+'</div>'+
      '<div class="snip-actions">'+
        '<button class="snip-mini" onclick="copySnip(\''+s.id+'\')" title="Copy">&#128203;</button>'+
        '<button class="snip-mini" onclick="sendSnip(\''+s.id+'\')" title="Send to chat">&#10148;</button>'+
        '<button class="snip-mini" onclick="delSnip(\''+s.id+'\')" title="Delete">&#10005;</button>'+
      '</div></div>';
  }).join("");
}

/* ---------- 7. Multi-table JOIN builder ----------------------------- */
var MT_ROWS = []; // [{table,type,onLeft,onRight}]
window.refreshMT = function(){
  var tables = getSchema(), names = Object.keys(tables);
  var base = document.getElementById("mt-base");
  if(!base) return;
  var cur = base.value;
  base.innerHTML = '<option value="">-- select a base table --</option>' +
    names.map(function(n){ return '<option'+(n===cur?' selected':'')+'>'+n+'</option>'; }).join("");
  renderMT();
};
window.addMTRow = function(){
  MT_ROWS.push({ table:"", type:"INNER JOIN", onLeft:"", onRight:"" });
  renderMT();
};
window.removeMTRow = function(i){ MT_ROWS.splice(i,1); renderMT(); };
window.mtCh = function(i, k, v){ MT_ROWS[i][k] = v; renderMT(); };

function autoOn(left, right, tables){
  var lcols = tables[left]||[], rcols = tables[right]||[];
  // exact column match
  for(var i=0;i<lcols.length;i++) if(rcols.indexOf(lcols[i])>=0 && lcols[i]!=="id") return [lcols[i], lcols[i]];
  // {right}_id <- right.id
  if(lcols.indexOf(right.replace(/s$/,"")+"_id") >= 0 && rcols.indexOf("id") >= 0) return [right.replace(/s$/,"")+"_id","id"];
  if(rcols.indexOf(left.replace(/s$/,"")+"_id") >= 0 && lcols.indexOf("id") >= 0) return ["id", left.replace(/s$/,"")+"_id"];
  return ["",""];
}

window.renderMT = function(){
  var tables = getSchema();
  var names = Object.keys(tables);
  var base = document.getElementById("mt-base").value;
  var listEl = document.getElementById("mt-list");
  // Render each row
  listEl.innerHTML = MT_ROWS.length ? MT_ROWS.map(function(r,i){
    var prevTable = i===0 ? base : MT_ROWS[i-1].table;
    if(r.table && prevTable && (!r.onLeft || !r.onRight)){
      var a = autoOn(prevTable, r.table, tables);
      if(!r.onLeft) r.onLeft = a[0]; if(!r.onRight) r.onRight = a[1];
    }
    var lcols = (tables[prevTable]||[]), rcols = (tables[r.table]||[]);
    return '<div class="mt-row">'+
      '<select class="fsl2" style="min-width:140px;flex:1" onchange="mtCh('+i+',\'type\',this.value)">'+
        ["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN","CROSS JOIN"].map(function(t){
          return '<option'+(t===r.type?' selected':'')+'>'+t+'</option>';
        }).join("")+
      '</select>'+
      '<select class="fsl2" style="min-width:120px;flex:1" onchange="mtCh('+i+',\'table\',this.value);mtCh('+i+',\'onLeft\',\'\');mtCh('+i+',\'onRight\',\'\')">'+
        '<option value="">-- table --</option>'+
        names.map(function(n){ return '<option'+(n===r.table?' selected':'')+'>'+n+'</option>'; }).join("")+
      '</select>'+
      (r.type==="CROSS JOIN" ? '' :
        '<span style="font-size:11px;color:var(--mu)">ON</span>'+
        '<select class="fsl2" style="min-width:90px;flex:1" onchange="mtCh('+i+',\'onLeft\',this.value)">'+
          '<option value="">-- col --</option>'+
          lcols.map(function(c){ return '<option'+(c===r.onLeft?' selected':'')+'>'+c+'</option>'; }).join("")+
        '</select>'+
        '<span style="font-size:11px;color:var(--mu)">=</span>'+
        '<select class="fsl2" style="min-width:90px;flex:1" onchange="mtCh('+i+',\'onRight\',this.value)">'+
          '<option value="">-- col --</option>'+
          rcols.map(function(c){ return '<option'+(c===r.onRight?' selected':'')+'>'+c+'</option>'; }).join("")+
        '</select>'
      )+
      '<button class="rmb" onclick="removeMTRow('+i+')" title="Remove">&#10005;</button>'+
      '</div>';
  }).join("") : '<div style="color:var(--mu);font-size:12px;padding:6px">No joined tables yet — click Add Joined Table.</div>';

  // Build SQL
  var prev = document.getElementById("mt-prev");
  if(!base || !MT_ROWS.length){
    prev.innerHTML = '<span style="color:var(--mu)">-- Pick a base table and add at least one joined table --</span>';
    window._mtsql = "";
    return;
  }
  var allTables = [base].concat(MT_ROWS.map(function(r){ return r.table; }));
  var valid = MT_ROWS.every(function(r){ return r.table && (r.type==="CROSS JOIN" || (r.onLeft && r.onRight)); });
  if(!valid){
    prev.innerHTML = '<span style="color:var(--mu)">-- Complete every joined table\'s ON columns --</span>';
    window._mtsql = ""; return;
  }
  var sel = allTables.map(function(t){ return t+".*"; }).join(", ");
  var sql = "SELECT "+sel+"\nFROM "+base;
  MT_ROWS.forEach(function(r,i){
    var leftTable = i===0 ? base : MT_ROWS[i-1].table;
    if(r.type === "CROSS JOIN"){
      sql += "\n"+r.type+" "+r.table;
    } else {
      sql += "\n"+r.type+" "+r.table+" ON "+leftTable+"."+r.onLeft+" = "+r.table+"."+r.onRight;
    }
  });
  var wh = document.getElementById("mt-where").value.trim();
  var ord = document.getElementById("mt-order").value.trim();
  var lim = document.getElementById("mt-limit").value;
  if(wh) sql += "\nWHERE "+wh;
  if(ord) sql += "\nORDER BY "+ord;
  if(lim) sql += "\nLIMIT "+lim;
  sql += ";";
  window._mtsql = sql;
  prev.innerHTML = hl(sql);
};

window.sendMT = function(){
  if(!window._mtsql){ toast("Complete the JOIN first","var(--wn)"); return; }
  setMode("chat", null);
  var es = document.getElementById("es"); if(es) es.remove();
  var id="m"+Date.now(), v=vld(window._mtsql);
  addCard(id, window._mtsql, v, "[Multi-JOIN]");
  hist.unshift({id:id, title:"[Multi-JOIN]", time:ts()});
  renderHist(); updStats();
};
window.copyMT = function(){
  if(!window._mtsql) return;
  try { navigator.clipboard.writeText(window._mtsql); flash("mt-flash"); } catch(e){}
};

/* ---------- 8. Schema import/export + Share by URL ------------------ */
window.exportSchema = function(){
  var tables = getSchema(); if(!Object.keys(tables).length){ toast("No schema","var(--wn)"); return; }
  var obj = { tool:"QueryPilot v9", exported:new Date().toISOString(),
              dialect: document.getElementById("dialect").value,
              schema: document.getElementById("schema-ta").value, tables:tables };
  dl(JSON.stringify(obj,null,2), "querypilot_schema.json");
  toast("Schema exported");
};
window.importSchema = function(file){
  if(!file) return;
  var rd = new FileReader();
  rd.onload = function(){
    var txt = rd.result, name = (file.name||"").toLowerCase();
    if(name.endsWith(".json")){
      try {
        var o = JSON.parse(txt);
        var s = (typeof o.schema === "string") ? o.schema :
                (o.tables ? Object.keys(o.tables).map(function(t){ return t+"("+o.tables[t].join(", ")+")"; }).join("\n") : "");
        if(s){ document.getElementById("schema-ta").value = s; refreshAll(); toast("Schema imported"); }
        else toast("Invalid schema file","var(--er)");
      } catch(e){ toast("JSON parse error","var(--er)"); }
    } else {
      // Treat as .sql with CREATE TABLE statements
      var lines = [];
      var re = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"\[]?(\w+)[`"\]]?\s*\(([\s\S]*?)\);/gi;
      var m;
      while((m = re.exec(txt))){
        var tbl = m[1];
        var body = m[2];
        // Extract first identifier from each comma-separated line (ignore CONSTRAINT/PRIMARY/etc.)
        var cols = body.split(/,(?![^\(]*\))/).map(function(x){
          return x.trim().replace(/^[`"\[]?(\w+)[`"\]]?\s.*/, "$1");
        }).filter(function(c){
          return c && !/^(PRIMARY|FOREIGN|UNIQUE|CONSTRAINT|KEY|INDEX|CHECK)$/i.test(c);
        });
        if(cols.length) lines.push(tbl+"("+cols.join(", ")+")");
      }
      if(!lines.length){ toast("No CREATE TABLE found","var(--er)"); return; }
      document.getElementById("schema-ta").value = lines.join("\n");
      refreshAll(); toast("Imported "+lines.length+" tables");
    }
  };
  rd.readAsText(file);
};

window.shareByURL = function(){
  try {
    var payload = { s: document.getElementById("schema-ta").value, d: document.getElementById("dialect").value };
    var enc = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    var url = location.origin + location.pathname + "#qp=" + enc;
    navigator.clipboard.writeText(url).then(function(){ toast("Shareable URL copied!"); },
      function(){ prompt("Copy this URL:", url); });
  } catch(e){ toast("Share failed","var(--er)"); }
};
(function loadShared(){
  try {
    var h = location.hash || "";
    var m = h.match(/qp=([A-Za-z0-9+/=]+)/);
    if(!m) return;
    var obj = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
    if(obj.s){ document.getElementById("schema-ta").value = obj.s; }
    if(obj.d){ document.getElementById("dialect").value = obj.d; onDC(); }
    refreshAll(); toast("Loaded shared schema");
  } catch(e){}
})();

/* ---------- 9. History export + clear ------------------------------- */
window.exportHistorySQL = function(){
  if(!hist.length){ toast("History empty","var(--wn)"); return; }
  var out = "-- QueryPilot v9 History Export\n-- " + new Date().toLocaleString() +
            "\n-- Dialect: " + document.getElementById("dialect").value + "\n\n";
  // We don't store SQL in hist (only titles). Pull from rendered cards.
  hist.forEach(function(h, i){
    var card = document.querySelector("[data-id='"+h.id+"']");
    var sql = card && card.dataset.sql ? card.dataset.sql : "-- (SQL not available in current session)";
    out += "-- "+(i+1)+". "+h.title+" ("+h.time+")\n"+sql+"\n\n";
  });
  dl(out, "querypilot_history.sql"); toast("History exported");
};
window.exportHistoryJSON = function(){
  if(!hist.length){ toast("History empty","var(--wn)"); return; }
  var arr = hist.map(function(h){
    var card = document.querySelector("[data-id='"+h.id+"']");
    return { id:h.id, title:h.title, time:h.time, sql: card && card.dataset.sql || "" };
  });
  dl(JSON.stringify({ tool:"QueryPilot v9", exported:new Date().toISOString(), history:arr }, null, 2),
     "querypilot_history.json");
  toast("History exported");
};
window.clearHist = function(){
  if(!confirm("Clear all history entries? Cards in the chat stay.")) return;
  hist.length = 0; renderHist(); updStats(); toast("History cleared");
};

/* ---------- 10. Patch addCard to store SQL on element for export ---- */
(function(){
  var origAddCard = window.addCard || addCard;
  window.addCard = function(id, sql, v, q){
    origAddCard(id, sql, v, q);
    // Annotate card with raw SQL for history export
    var row = document.querySelector("[data-id='"+id+"']");
    if(row) row.dataset.sql = sql;
  };
})();

/* ---------- 11. Template favorites + per-template Markdown ---------- */
var TPL_FAV = {};
try { TPL_FAV = JSON.parse(localStorage.getItem("qp_tpl_fav")||"{}") || {}; } catch(e){ TPL_FAV = {}; }
function saveFav(){ try{ localStorage.setItem("qp_tpl_fav", JSON.stringify(TPL_FAV)); }catch(e){} }
window.toggleFav = function(ev, label){
  ev.stopPropagation();
  TPL_FAV[label] = !TPL_FAV[label]; if(!TPL_FAV[label]) delete TPL_FAV[label];
  saveFav(); renderTpl(window._tplCat||"All", document.getElementById("tplsearch").value);
};
// Override renderTpl to include favorites star + remember category
(function(){
  var origRT = window.renderTpl;
  window.renderTpl = function(cat, search){
    window._tplCat = cat;
    var list = cat==="All" ? TPLS : TPLS.filter(function(t){ return t.cat===cat; });
    if(search) list = list.filter(function(t){ return t.label.toLowerCase().indexOf(search.toLowerCase())>=0 || t.q.toLowerCase().indexOf(search.toLowerCase())>=0; });
    // Sort favorites first
    list = list.slice().sort(function(a,b){ return (TPL_FAV[b.label]?1:0) - (TPL_FAV[a.label]?1:0); });
    var el = document.getElementById("tpllist");
    if(!el) return;
    el.innerHTML = list.length ? list.map(function(t){
      return '<div class="tc" onclick="send(\''+t.q.replace(/'/g,"\\'")+'\')">'+
        '<button class="tc-fav '+(TPL_FAV[t.label]?'on':'')+'" onclick="toggleFav(event,\''+t.label.replace(/'/g,"\\'")+'\')" title="Favorite">&#11088;</button>'+
        '<div class="tl">'+esc(t.label)+'</div>'+
        '<div class="ts2">'+esc(t.cat)+' &middot; click to run</div></div>';
    }).join("") : '<div style="color:var(--mu);font-size:12px;text-align:center;padding:14px">No templates found</div>';
  };
  // Re-render with the new function
  if(typeof initTpl === "function") initTpl();
})();

// Override fTpl to remember category
window.fTpl = function(cat, btn){
  window._tplCat = cat;
  document.querySelectorAll(".cb").forEach(function(b){ b.classList.remove("on"); });
  if(btn) btn.classList.add("on");
  renderTpl(cat, document.getElementById("tplsearch").value || "");
};

window.exportQueryMarkdown = function(id){
  var card = document.querySelector("[data-id='"+id+"']");
  if(!card) return;
  var sql = card.dataset.sql || "", title = card.dataset.q || "Query";
  var md = "# "+title+"\n\n_Generated by QueryPilot v9 — "+new Date().toLocaleString()+"_\n\n```sql\n"+sql+"\n```\n";
  dl(md, "query_"+id+".md"); toast("Markdown exported");
};

/* ---------- 12. v7 NL pattern extensions ---------------------------- */
/* Wrap nlSQL with additional patterns (year-over-year, rolling avg, pivot, cohort) */
(function(){
  var origNL = window.nlSQL || nlSQL;
  window.nlSQL = function(input){
    var q = (input||"").toLowerCase();
    var tables = getSchema(), names = Object.keys(tables);
    if(!names.length) return origNL(input);
    var t = bestTbl(tables, q), cols = tables[t]||[];
    var dateCol = clike(cols,"_at","date","time") || cols[0];
    var numCol  = clike(cols,"total","amount","price","salary","revenue","cost","earnings") || "amount";

    // Year-over-year
    if(/year.over.year|yoy|year on year/.test(q)){
      return "-- Year-over-year change\n"+
        "SELECT EXTRACT(YEAR FROM "+dateCol+") AS yr, SUM("+numCol+") AS total,\n"+
        "  LAG(SUM("+numCol+")) OVER (ORDER BY EXTRACT(YEAR FROM "+dateCol+")) AS prev_yr,\n"+
        "  ROUND(100.0 * (SUM("+numCol+") - LAG(SUM("+numCol+")) OVER (ORDER BY EXTRACT(YEAR FROM "+dateCol+"))) /\n"+
        "        NULLIF(LAG(SUM("+numCol+")) OVER (ORDER BY EXTRACT(YEAR FROM "+dateCol+")), 0), 2) AS yoy_pct\n"+
        "FROM "+t+"\nGROUP BY EXTRACT(YEAR FROM "+dateCol+")\nORDER BY yr;";
    }
    // Rolling average (window function)
    if(/rolling.*\d*.*(day|week|avg|average)|moving average/.test(q)){
      var w = (q.match(/(\d+)/)||[null,7])[1];
      return "-- Rolling "+w+"-day average\n"+
        "SELECT "+dateCol+", "+numCol+",\n"+
        "  AVG("+numCol+") OVER (ORDER BY "+dateCol+" ROWS BETWEEN "+(w-1)+" PRECEDING AND CURRENT ROW) AS rolling_avg\n"+
        "FROM "+t+"\nORDER BY "+dateCol+";";
    }
    // Pivot — emulated with CASE WHEN
    if(/pivot|cross.?tab/.test(q)){
      var pivotDim = clike(cols,"category","status","region","department","type") || cols[1] || "category";
      return "-- Pivot emulation with conditional aggregates\n"+
        "SELECT "+dateCol+",\n"+
        "  SUM(CASE WHEN "+pivotDim+" = 'A' THEN "+numCol+" ELSE 0 END) AS group_a,\n"+
        "  SUM(CASE WHEN "+pivotDim+" = 'B' THEN "+numCol+" ELSE 0 END) AS group_b,\n"+
        "  SUM(CASE WHEN "+pivotDim+" = 'C' THEN "+numCol+" ELSE 0 END) AS group_c\n"+
        "FROM "+t+"\nGROUP BY "+dateCol+"\nORDER BY "+dateCol+";";
    }
    // Cohort (signup month + activity)
    if(/cohort|retention/.test(q)){
      return "-- Cohort analysis skeleton\n"+
        "WITH cohort AS (\n"+
        "  SELECT id, DATE_TRUNC('month', "+dateCol+") AS cohort_month FROM "+t+"\n"+
        ")\n"+
        "SELECT cohort_month, COUNT(*) AS cohort_size\nFROM cohort\nGROUP BY cohort_month\nORDER BY cohort_month;";
    }
    // Median (percentile_cont where supported)
    if(/median/.test(q)){
      return "-- Median using PERCENTILE_CONT (PostgreSQL/Standard SQL)\n"+
        "SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY "+numCol+") AS median_value\nFROM "+t+";";
    }
    // First / latest row per group
    if(/(latest|most recent|first)\s+\w+\s+per\s+\w+/.test(q)){
      var grpCol = clike(cols,"customer_id","user_id","category","department") || cols[1] || "id";
      return "-- Latest row per "+grpCol+"\n"+
        "SELECT * FROM (\n"+
        "  SELECT *, ROW_NUMBER() OVER (PARTITION BY "+grpCol+" ORDER BY "+dateCol+" DESC) AS rn\n"+
        "  FROM "+t+"\n"+
        ") s WHERE rn = 1;";
    }
    // Running total
    if(/running total|cumulative/.test(q)){
      return "-- Running total\n"+
        "SELECT "+dateCol+", "+numCol+",\n"+
        "  SUM("+numCol+") OVER (ORDER BY "+dateCol+") AS running_total\n"+
        "FROM "+t+"\nORDER BY "+dateCol+";";
    }
    // Top N per group
    if(/top \d+ per (each )?\w+/.test(q)){
      var grp2 = clike(cols,"category","department","region") || cols[1] || "category";
      var n = (q.match(/top (\d+)/)||[null,5])[1];
      return "-- Top "+n+" per "+grp2+"\n"+
        "SELECT * FROM (\n"+
        "  SELECT *, RANK() OVER (PARTITION BY "+grp2+" ORDER BY "+numCol+" DESC) AS rk\n"+
        "  FROM "+t+"\n"+
        ") s WHERE rk <= "+n+";";
    }
    // Min/Max date
    if(/(earliest|oldest|newest)/.test(q)){
      var fn = /earliest|oldest/.test(q) ? "MIN" : "MAX";
      return "SELECT "+fn+"("+dateCol+") AS "+(fn==="MIN"?"earliest":"latest")+"_date FROM "+t+";";
    }
    // Standard deviation / variance
    if(/std ?dev|standard deviation|variance/.test(q)){
      var fn2 = /variance/.test(q) ? "VARIANCE" : "STDDEV";
      return "SELECT "+fn2+"("+numCol+") AS "+fn2.toLowerCase()+"_"+numCol+" FROM "+t+";";
    }
    // Distinct count
    if(/distinct count|unique count|how many unique/.test(q)){
      var anyCol = clike(cols,"email","name","customer_id","user_id") || cols[1] || "id";
      return "SELECT COUNT(DISTINCT "+anyCol+") AS unique_"+anyCol+" FROM "+t+";";
    }
    return origNL(input);
  };
})();

/* ---------- 13. Performance tips / index suggester (Tool) ----------- */
function perfHints(sql){
  var tips = [], s = sql.toUpperCase();
  if(/SELECT\s+\*/.test(s)) tips.push({ level:"warn", text:"<strong>Avoid SELECT *</strong> — list only the columns you need. This reduces I/O and lets the optimiser use covering indexes." });
  if((s.match(/LIKE\s+'\%/g)||[]).length) tips.push({ level:"warn", text:"<strong>Leading-% LIKE</strong> (e.g. <code>LIKE '%foo'</code>) cannot use B-tree indexes. Consider trigram or full-text indexes, or anchor the pattern (<code>'foo%'</code>)." });
  if(/DISTINCT/.test(s)) tips.push({ level:"info", text:"<strong>DISTINCT</strong> requires a sort or hash. If you really need uniqueness, ensure the column is indexed; often a <code>GROUP BY</code> with aggregates is clearer." });
  if((s.match(/JOIN/g)||[]).length >= 3) tips.push({ level:"crit", text:"<strong>3+ JOINs</strong> — make sure every ON column is indexed on both sides. Consider materialising a view if this query runs often." });
  if(/ORDER\s+BY/.test(s) && !/LIMIT/.test(s)) tips.push({ level:"info", text:"<strong>ORDER BY without LIMIT</strong> — sorts the entire result set. Add <code>LIMIT</code> if you only need the top rows." });
  if(/WHERE[^=]*\bUPPER\s*\(|\bLOWER\s*\(/.test(s)) tips.push({ level:"warn", text:"<strong>Function on indexed column</strong> in WHERE breaks index usage. Store the column in the desired case, or create a functional index." });
  if(/SUBSTR|SUBSTRING|CAST\s*\(/.test(s)) tips.push({ level:"info", text:"<strong>Casting or substring</strong> on indexed columns prevents index use. Cast the literal instead." });
  if(/IN\s*\([^\)]{200,}/.test(s)) tips.push({ level:"warn", text:"<strong>Very large IN list</strong> — consider a temporary table or a JOIN against a values list." });
  if(/NOT\s+IN/.test(s)) tips.push({ level:"warn", text:"<strong>NOT IN</strong> behaves unexpectedly with NULLs. Prefer <code>NOT EXISTS</code> or <code>LEFT JOIN ... WHERE other.id IS NULL</code>." });
  if(/COUNT\s*\(\s*\*\s*\)/.test(s) && !/WHERE/.test(s)) tips.push({ level:"info", text:"<strong>COUNT(*)</strong> over the whole table can be slow on huge tables. Cache the value or use approximate counts." });
  // Suggested indexes
  var whereCols = [];
  var wm = sql.match(/WHERE\s+([\s\S]+?)(GROUP|ORDER|LIMIT|HAVING|;|$)/i);
  if(wm){
    (wm[1].match(/\b([a-z_][a-z0-9_]*)\s*(=|>|<|>=|<=|LIKE|IN|BETWEEN|IS)/gi)||[])
      .forEach(function(t){ var c=t.split(/\s/)[0]; if(c && c!=="AND" && c!=="OR") whereCols.push(c); });
  }
  var joinCols = [];
  (sql.match(/ON\s+([a-z_.]+)\s*=\s*([a-z_.]+)/gi)||[]).forEach(function(t){
    t.replace(/ON\s+([a-z_.]+)\s*=\s*([a-z_.]+)/i, function(_,a,b){ joinCols.push(a); joinCols.push(b); });
  });
  var unique = function(arr){ var o={}; arr.forEach(function(x){ o[x]=1; }); return Object.keys(o); };
  whereCols = unique(whereCols); joinCols = unique(joinCols);
  if(whereCols.length) tips.push({ level:"info", text:"<strong>Suggested indexes (WHERE)</strong>: " + whereCols.map(function(c){ return "<code>"+esc(c)+"</code>"; }).join(", ") + " — create a B-tree index if these columns aren't already indexed." });
  if(joinCols.length) tips.push({ level:"info", text:"<strong>Suggested indexes (JOIN ON)</strong>: " + joinCols.map(function(c){ return "<code>"+esc(c)+"</code>"; }).join(", ") + " — JOIN columns should always be indexed." });
  if(!tips.length) tips.push({ level:"info", text:"No specific performance concerns detected. Query looks lean." });
  return tips;
}

window.runPerf = function(){
  var sql = document.getElementById("perf-in").value.trim();
  if(!sql){ toast("Paste SQL first","var(--wn)"); return; }
  var tips = perfHints(sql);
  document.getElementById("perf-out").innerHTML =
    tips.map(function(t){ return '<div class="perf-tip '+(t.level==="warn"?"warn":t.level==="crit"?"crit":"")+'">'+t.text+'</div>'; }).join("");
};

/* ---------- 14. SVG ER Diagram (Tool) ------------------------------- */
window.runER = function(){
  var tables = getSchema(), names = Object.keys(tables);
  var el = document.getElementById("er-out");
  if(!names.length){ el.innerHTML = '<div style="color:var(--mu);text-align:center;padding:30px">No schema defined</div>'; return; }
  var W = 240, H_HEAD = 26, H_ROW = 18, GAP_X = 70, GAP_Y = 40;
  var cols = Math.min(names.length, Math.max(1, Math.floor((window.innerWidth-280)/(W+GAP_X)) || 2));
  var positions = {};
  names.forEach(function(n,i){
    var c = i % cols, r = Math.floor(i/cols);
    var maxRowsInCol = Math.max.apply(null, names.filter(function(_,k){ return k%cols === c && Math.floor(k/cols) <= r; })
      .map(function(nn){ return tables[nn].length; }));
    positions[n] = { x: 30 + c*(W+GAP_X), y: 30 + r*(40 + 12*H_ROW + GAP_Y) };
  });
  var totalH = 0, totalW = 30 + cols*(W+GAP_X);
  names.forEach(function(n){ var p=positions[n]; var h = H_HEAD + tables[n].length*H_ROW; totalH = Math.max(totalH, p.y + h + 30); });
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+totalW+' '+totalH+'" preserveAspectRatio="xMidYMin meet">';
  // Relationship lines first (under tables)
  names.forEach(function(n){
    tables[n].forEach(function(c){
      if(/_id$/.test(c)){
        var target = c.replace(/_id$/,"") + "s";
        if(!tables[target]) target = c.replace(/_id$/,"");
        if(tables[target]){
          var a = positions[n], b = positions[target];
          var x1 = a.x + W, y1 = a.y + H_HEAD + (tables[n].indexOf(c)+0.5)*H_ROW;
          var x2 = b.x, y2 = b.y + H_HEAD + (tables[target].indexOf("id")+0.5)*H_ROW;
          var mx = (x1+x2)/2;
          svg += '<path class="er-link" d="M'+x1+' '+y1+' C'+mx+' '+y1+' '+mx+' '+y2+' '+x2+' '+y2+'"/>';
        }
      }
    });
  });
  // Tables
  names.forEach(function(n){
    var p = positions[n], rows = tables[n], h = H_HEAD + rows.length*H_ROW;
    svg += '<rect class="er-table-rect" x="'+p.x+'" y="'+p.y+'" width="'+W+'" height="'+h+'" rx="6"/>';
    svg += '<rect class="er-table-head" x="'+p.x+'" y="'+p.y+'" width="'+W+'" height="'+H_HEAD+'" rx="6"/>';
    svg += '<text class="er-text er-text-head" x="'+(p.x+10)+'" y="'+(p.y+18)+'">'+esc(n.toUpperCase())+'</text>';
    rows.forEach(function(c,i){
      var ry = p.y + H_HEAD + (i+1)*H_ROW - 5;
      var cls = "er-text";
      var prefix = "  ";
      if(c === "id"){ cls += " er-text-pk"; prefix = "PK "; }
      else if(/_id$/.test(c)){ cls += " er-text-fk"; prefix = "FK "; }
      svg += '<text class="'+cls+'" x="'+(p.x+10)+'" y="'+ry+'">'+esc(prefix+c)+'</text>';
    });
  });
  svg += '</svg>';
  el.innerHTML = '<div class="er-wrap">'+svg+'</div>';
};

window.exportER = function(){
  var wrap = document.getElementById("er-out"); var svg = wrap.querySelector("svg");
  if(!svg){ toast("Generate first","var(--wn)"); return; }
  dl('<?xml version="1.0" encoding="UTF-8"?>\n'+svg.outerHTML, "schema_er.svg");
  toast("SVG downloaded");
};

/* ---------- 15. Inject v7 Tool cards into Tools panel --------------- */
(function injectV7Tools(){
  var tp = document.getElementById("toolspanel");
  if(!tp) return;
  var bw = tp.querySelector(".bw"); if(!bw) return;
  // Perf tips card
  var perf = document.createElement("div");
  perf.className = "tool-card";
  perf.innerHTML =
    '<div class="tool-title">&#127939; Performance Tips &amp; Index Suggester</div>'+
    '<div class="tool-desc">Paste any SQL and get a list of <strong>specific performance hints</strong> and <strong>suggested indexes</strong>. Detects SELECT *, leading-% LIKE, NOT IN with NULLs, function-on-column, missing LIMIT with ORDER BY, multi-JOIN warnings and more.</div>'+
    '<textarea id="perf-in" class="edta" style="min-height:90px;color:var(--tx)" placeholder="-- paste SQL here"></textarea>'+
    '<div class="exp-btns"><button class="bb p" onclick="runPerf()">Analyse</button>'+
    '<button class="bb" onclick="document.getElementById(\'perf-in\').value=\'\';document.getElementById(\'perf-out\').innerHTML=\'\'">Clear</button></div>'+
    '<div id="perf-out" style="margin-top:10px"></div>';
  bw.appendChild(perf);

  // ER diagram card
  var er = document.createElement("div");
  er.className = "tool-card";
  er.innerHTML =
    '<div class="tool-title">&#128203; ER Diagram (SVG)</div>'+
    '<div class="tool-desc">Renders a visual entity-relationship diagram of your schema as <strong>scalable SVG</strong>. Foreign keys (columns ending in <code>_id</code>) are auto-linked to the matching table. Download as a standalone SVG to paste into docs.</div>'+
    '<div class="exp-btns"><button class="bb p" onclick="runER()">Generate ER Diagram</button>'+
    '<button class="bb" onclick="exportER()">&#11015; Download SVG</button></div>'+
    '<div id="er-out" style="margin-top:10px"></div>';
  bw.appendChild(er);
})();

/* ---------- 16. Replace card actions with per-card MD export ------- */
/* Add a small "MD" button on result cards via mutation observer */
(function(){
  var obs = new MutationObserver(function(muts){
    muts.forEach(function(m){
      m.addedNodes.forEach(function(n){
        if(n.nodeType !== 1) return;
        if(n.classList && n.classList.contains("card")){
          var cact = n.querySelector(".cact");
          if(cact && !cact.querySelector(".btn-md")){
            var b = document.createElement("button");
            b.className = "ab btn-md";
            b.title = "Export this query as Markdown";
            b.innerHTML = "&#128221; MD";
            b.onclick = function(){ exportQueryMarkdown(n.dataset.id); };
            cact.appendChild(b);
          }
        }
      });
    });
  });
  var chat = document.getElementById("chatmsgs");
  if(chat) obs.observe(chat, { childList:true });
})();

/* ---------- 17. Stronger SQL Validator (2 new checks) --------------- */
(function(){
  var origVld = window.vld || vld;
  window.vld = function(sql){
    var r = origVld(sql);
    var s = sql.toUpperCase();
    // Ambiguous-column heuristic: multiple tables but column without table prefix in SELECT
    if(/JOIN/.test(s)){
      var selPart = (sql.match(/SELECT([\s\S]+?)FROM/i)||["",""])[1];
      if(/\b(id|name|status|created_at|updated_at)\b/i.test(selPart) && !/\./.test(selPart)){
        r.warns = r.warns || [];
        r.warns.push("Possibly ambiguous columns in SELECT with JOINs — prefix with table name (e.g. customers.id).");
      }
    }
    // Missing alias in subquery
    if(/FROM\s*\(\s*SELECT/i.test(sql) && !/\)\s+(AS\s+)?\w+/i.test(sql)){
      r.errs = r.errs || [];
      r.errs.push("Derived table (subquery in FROM) is missing an alias.");
    }
    return r;
  };
})();

/* ---------- 18. Hash-change reload of shared link ------------------- */
window.addEventListener("hashchange", function(){ /* future: load new shared payload */ });

/* ---------- 19. Tap-to-close overlays ------------------------------- */
["sc-mod","set-mod"].forEach(function(id){
  var el = document.getElementById(id);
  if(!el) return;
  el.addEventListener("click", function(ev){
    if(ev.target === el) el.style.display = "none";
  });
});

/* ---------- 20. Reload sidebar render on schema change -------------- */
(function(){
  var ta = document.getElementById("schema-ta");
  if(ta){
    ta.addEventListener("input", function(){ if(typeof refreshMT === "function") refreshMT(); });
  }
})();

/* Boot: ensure UDT / Snip / MT rendered if user navigates immediately */
renderUDT && renderUDT();
renderSnips && renderSnips();
refreshMT && refreshMT();

/* =====================================================================
   v7.1 — About the Builder modal hooks (attribution to creator)
   ===================================================================== */
window.openAbout = function(){
  var m = document.getElementById("about-mod");
  if(m){ m.style.display = "flex"; }
};
window.closeAbout = function(){
  var m = document.getElementById("about-mod");
  if(m){ m.style.display = "none"; }
};
// Tap backdrop to close + Esc handler
(function(){
  var m = document.getElementById("about-mod");
  if(!m) return;
  m.addEventListener("click", function(ev){
    if(ev.target === m) closeAbout();
  });
})();
// Add About to the existing Esc handler indirectly
document.addEventListener("keydown", function(ev){
  if(ev.key === "Escape"){ closeAbout(); }
});

/* Console signature for curious developers */
try {
  console.log(
    "%cQueryPilot v9%c — Built by Adewale Samson Adeagbo (HMG Concepts, Lagos, Nigeria)\n" +
    "Portfolio: https://cssadewale.pages.dev\n" +
    "HMG Concepts: https://hmgconcepts.pages.dev\n" +
    "GitHub: https://github.com/cssadewale\n" +
    "WhatsApp: +234 810 086 6322 — Email: buildingmyictcareer@gmail.com\n" +
    "If this tool helped you, please star the repo or share it with another teacher.",
    "color:#3fb950;font-weight:700;font-size:14px",
    "color:#888;font-size:12px"
  );
} catch(e){}
