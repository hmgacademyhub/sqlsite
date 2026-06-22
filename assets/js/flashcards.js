document.addEventListener('DOMContentLoaded',()=>{
 const C=ClassDesk; const cards=[
  ['SQL Basics','What does SELECT do?','It defines the columns or expressions returned by a query. SELECT * returns all columns but is discouraged in production.'],
  ['SQL Basics','WHERE vs HAVING?','WHERE filters rows before grouping. HAVING filters groups after GROUP BY and can use aggregates.'],
  ['SQL Basics','Why pair LIMIT with ORDER BY?','Without ORDER BY, database row order is not guaranteed. LIMIT without ORDER BY returns an arbitrary slice.'],
  ['JOINs','INNER JOIN vs LEFT JOIN?','INNER JOIN returns matching rows in both tables. LEFT JOIN keeps every left-table row and fills missing right-table matches with NULL.'],
  ['JOINs','What is a CROSS JOIN risk?','It returns every combination of rows from both tables and can explode row counts quickly.'],
  ['Aggregation','COUNT(*) vs COUNT(column)?','COUNT(*) counts rows. COUNT(column) counts only non-NULL values in that column.'],
  ['Window Functions','GROUP BY vs window function?','GROUP BY collapses rows into groups. Window functions calculate over related rows while preserving row-level output.'],
  ['Window Functions','What does PARTITION BY do?','It divides rows into groups for a window function so rank, lag, sum, etc. restart per partition.'],
  ['Data Quality','What is a uniqueness test?','A check that a column or combination of columns has no duplicates, useful for primary keys and grain validation.'],
  ['Data Quality','What is accepted-values testing?','A test that a column contains only allowed categories, such as status in Active, Completed or Dropped.'],
  ['Governance','What is PII?','Personally identifiable information: data that can identify a person, such as email, phone, BVN-like IDs, address or full name.'],
  ['Governance','Why keep an audit log?','It records who did what and when, supporting accountability, compliance and incident review.'],
  ['Analytics Engineering','What is a dbt model?','A SQL SELECT file that materializes a trusted transformation layer such as staging, intermediate, fact or dimension.'],
  ['Analytics Engineering','What is lineage?','A map of dependencies showing which tables, models and columns feed downstream outputs.'],
  ['Performance','Why avoid leading wildcard LIKE?','LIKE %term usually cannot use a normal index efficiently and may scan many rows.'],
  ['Performance','What is an index suggestion?','A recommendation to index columns often used in JOIN, WHERE or ORDER BY clauses.'],
  ['Interview','What is wrong-answer diagnosis?','A practice feedback method that tells the exact row/column/value difference instead of only saying incorrect.'],
  ['Security','Why block DELETE without WHERE?','It can remove every row in a table. Governance tools flag or block it to prevent accidental data loss.']
 ].map((c,i)=>({id:'fc'+i,deck:c[0],front:c[1],back:c[2]}));
 const state=C.state.flashcards||(C.state.flashcards={}); let deck='All', current=null, showing=false;
 function info(card){return state[card.id]||{box:0,due:0,seen:0};}
 function dueCards(){const now=Date.now();return cards.filter(c=>(deck==='All'||c.deck===deck) && info(c).due<=now);}
 function allDecks(){return ['All',...new Set(cards.map(c=>c.deck))];}
 function pick(){const due=dueCards(); current=(due[0]||cards.filter(c=>deck==='All'||c.deck===deck)[0]); showing=false; renderCard();}
 function renderDecks(){document.getElementById('deckList').innerHTML=allDecks().map(d=>`<div class="schema-item ${d===deck?'active':''}" data-deck="${C.esc(d)}"><strong>${C.esc(d)}</strong><p class="muted">${cards.filter(c=>d==='All'||c.deck===d).length} cards</p></div>`).join(''); C.qsa('[data-deck]').forEach(el=>el.onclick=()=>{deck=el.dataset.deck;pick();renderDecks();});}
 function renderCard(){ if(!current){document.getElementById('cardFront').textContent='No cards.';return;} document.getElementById('cardMeta').textContent=current.deck; document.getElementById('cardFront').textContent=current.front; document.getElementById('cardBack').textContent=current.back; document.getElementById('cardBack').style.display=showing?'block':'none'; updateStats();}
 function rate(level){if(!current)return; const i=info(current); i.seen++; if(level==='again'){i.box=0;i.due=Date.now()+5*60*1000;} if(level==='good'){i.box=Math.min(5,i.box+1);i.due=Date.now()+[0,1,3,7,14,30][i.box]*86400000;} if(level==='easy'){i.box=Math.min(5,i.box+2);i.due=Date.now()+[0,3,7,14,30,60][i.box]*86400000;} state[current.id]=i; C.save(); pick();}
 function updateStats(){const due=dueCards().length, seen=cards.filter(c=>info(c).seen).length, mastered=cards.filter(c=>info(c).box>=4).length; document.getElementById('deckStats').textContent=`${due} due`; document.getElementById('reviewStats').innerHTML=`<p><b>${due}</b> due now</p><p><b>${seen}</b> seen</p><p><b>${mastered}</b> mastered</p><div class="progress"><span style="width:${Math.round(mastered/cards.length*100)}%"></span></div>`;}
 document.getElementById('showAnswer').onclick=()=>{showing=true;renderCard();}; document.getElementById('againBtn').onclick=()=>rate('again'); document.getElementById('goodBtn').onclick=()=>rate('good'); document.getElementById('easyBtn').onclick=()=>rate('easy'); document.getElementById('resetCards').onclick=()=>{if(confirm('Reset flashcard progress?')){C.state.flashcards={}; C.save(); location.reload();}};
 renderDecks(); pick();
});
