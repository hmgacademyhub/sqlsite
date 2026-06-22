/* =====================================================================
   QueryPilot v9 — Learn Hub UI engine
   Renders modules, lessons, quizzes, projects.
   Tracks progress in localStorage. ES5-compatible.
   ===================================================================== */

(function(){
"use strict";

var HUB = window.HUB = {};

/* ---------- progress storage ---------- */
var PROG_KEY = "qp_hub_progress";
var PROFILE_KEY = "qp_hub_profile";

function loadProg(){
  try { return JSON.parse(localStorage.getItem(PROG_KEY) || "{}"); }
  catch(e){ return {}; }
}
function saveProg(p){
  try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); }
  catch(e){}
}
function loadProfile(){
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}"); }
  catch(e){ return {}; }
}
function saveProfile(p){
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }
  catch(e){}
}

HUB.markDone = function(lessonId){
  var p = loadProg();
  p[lessonId] = { done:true, ts: new Date().toISOString() };
  saveProg(p);
  HUB.updateChip();
};
HUB.markUndone = function(lessonId){
  var p = loadProg();
  delete p[lessonId];
  saveProg(p);
  HUB.updateChip();
};
HUB.isDone = function(lessonId){
  return !!loadProg()[lessonId];
};

HUB.stats = function(){
  var p = loadProg();
  var totalLessons = 0, doneLessons = 0, totalModules = 0, doneModules = 0;
  (window.CURRICULUM || []).forEach(function(m){
    totalModules++;
    var modDone = m.lessons.length, modTotal = m.lessons.length;
    var allDone = true;
    m.lessons.forEach(function(l){
      totalLessons++;
      if(p[l.id]) doneLessons++;
      else allDone = false;
    });
    if(allDone) doneModules++;
  });
  return {
    totalLessons: totalLessons,
    doneLessons: doneLessons,
    pct: totalLessons ? Math.round(doneLessons * 100 / totalLessons) : 0,
    totalModules: totalModules,
    doneModules: doneModules
  };
};

HUB.moduleStats = function(mod){
  var p = loadProg();
  var done = 0;
  mod.lessons.forEach(function(l){ if(p[l.id]) done++; });
  return { done: done, total: mod.lessons.length,
           pct: mod.lessons.length ? Math.round(done*100/mod.lessons.length) : 0 };
};

/* ---------- escape helper ---------- */
function esc3(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ---------- HUB HOME view ---------- */
HUB.renderHome = function(){
  var el = document.getElementById("hubpanel");
  if(!el || !window.CURRICULUM) return;

  var s = HUB.stats();
  var profile = loadProfile();
  var name = profile.name || "";

  var moduleCards = window.CURRICULUM.map(function(mod, i){
    var ms = HUB.moduleStats(mod);
    var levelClass = "hub-level-" + (mod.level||"").toLowerCase().split(" ")[0].split("→")[0].replace(/\s+/g,'');
    return '<div class="hub-module-card" style="--module-color:' + mod.color + '" onclick="HUB.openModule(\'' + mod.id + '\')">' +
      '<span class="hub-module-level ' + levelClass + '">' + esc3(mod.level) + '</span>' +
      '<div class="hub-module-icon">' + mod.icon + '</div>' +
      '<div class="hub-module-num">Module ' + (i+1) + '</div>' +
      '<div class="hub-module-title">' + esc3(mod.title) + '</div>' +
      '<div class="hub-module-desc">' + esc3(mod.summary).substring(0, 130) + '...</div>' +
      '<div class="hub-module-meta">' +
        '<span>📚 ' + mod.lessons.length + ' lessons</span>' +
        '<span>⏱️ ' + mod.weeks + ' week' + (mod.weeks > 1 ? 's' : '') + '</span>' +
      '</div>' +
      '<div class="hub-module-progress">' +
        '<div class="hub-module-progress-bar"><div class="hub-module-progress-fill" style="width:' + ms.pct + '%"></div></div>' +
        '<div class="hub-module-progress-text"><span>' + ms.done + '/' + ms.total + ' lessons</span><span>' + ms.pct + '%</span></div>' +
      '</div>' +
    '</div>';
  }).join("");

  var html =
    '<div class="hub-hero">' +
      '<h1>🎓 Data Science Learning Hub</h1>' +
      '<p>A complete, beginner-friendly curriculum that takes you from absolute zero to deployed-ML expert. ' +
      '<strong>8 modules + Capstone</strong>, ~118 lessons, ~24 weeks at a comfortable pace (or 12 weeks if you sprint). ' +
      'Built around real Nigerian-context examples by <a href="https://cssadewale.pages.dev" target="_blank" style="color:var(--ac)">Adewale Samson Adeagbo</a> (HMG Concepts, Lagos).</p>' +
      '<div class="hub-progress-bar"><div class="hub-progress-fill" style="width:' + s.pct + '%"></div></div>' +
      '<div class="hub-progress-text"><span>Your progress: <strong>' + s.doneLessons + ' of ' + s.totalLessons + ' lessons</strong></span><span><strong>' + s.pct + '%</strong> complete</span></div>' +
      (s.pct >= 80 ? '<button class="hub-action-btn" style="margin-top:14px" onclick="HUB.showCertificate()">🏆 View Your Certificate</button>' : '') +
    '</div>' +

    '<div class="hub-stats">' +
      '<div class="hub-stat"><div class="hub-stat-num">' + s.totalModules + '</div><div class="hub-stat-label">Modules</div></div>' +
      '<div class="hub-stat"><div class="hub-stat-num">' + s.totalLessons + '</div><div class="hub-stat-label">Lessons</div></div>' +
      '<div class="hub-stat"><div class="hub-stat-num">' + s.doneLessons + '</div><div class="hub-stat-label">Completed</div></div>' +
      '<div class="hub-stat"><div class="hub-stat-num">' + s.doneModules + '</div><div class="hub-stat-label">Modules done</div></div>' +
      '<div class="hub-stat"><div class="hub-stat-num">' + s.pct + '%</div><div class="hub-stat-label">Overall</div></div>' +
    '</div>' +

    '<input class="hub-search" placeholder="🔍 Search lessons by title or topic..." oninput="HUB.search(this.value)"/>' +
    '<div id="hub-search-results"></div>' +

    '<h2 style="font-size:16px;color:var(--tx);margin:18px 0 12px">📚 Modules</h2>' +
    '<div class="hub-module-grid">' + moduleCards + '</div>' +

    '<div style="font-size:11px;color:var(--mu);text-align:center;margin:24px 0;padding:16px;background:var(--sf2);border-radius:9px">' +
    '💡 Tip: Click any module to see its lessons. Each lesson takes 7-15 minutes. Mark lessons done to track progress. ' +
    'Earn a printable certificate when you complete 80% of the curriculum.' +
    '</div>';

  el.innerHTML = html;
};

/* ---------- search ---------- */
HUB.search = function(q){
  var out = document.getElementById("hub-search-results");
  if(!out) return;
  q = (q||"").toLowerCase().trim();
  if(!q || q.length < 2){ out.innerHTML = ""; return; }

  var matches = [];
  (window.CURRICULUM || []).forEach(function(mod){
    mod.lessons.forEach(function(l){
      var hay = (l.title + " " + (l.takeaway||"") + " " + (l.learn||[]).join(" ")).toLowerCase();
      if(hay.indexOf(q) >= 0){
        matches.push({ mod: mod, lesson: l });
      }
    });
  });

  if(!matches.length){
    out.innerHTML = '<div style="font-size:12px;color:var(--mu);text-align:center;padding:14px">No matches for "' + esc3(q) + '"</div>';
    return;
  }

  out.innerHTML =
    '<div style="background:var(--sf2);border:1px solid var(--ac);border-radius:9px;padding:11px;margin-bottom:14px">' +
    '<div style="font-size:11px;font-weight:700;color:var(--ac);margin-bottom:8px">' + matches.length + ' matching lessons:</div>' +
    matches.slice(0, 12).map(function(m){
      return '<div class="hub-lesson-row" style="margin-bottom:5px" onclick="HUB.openLesson(\'' + m.mod.id + '\',\'' + m.lesson.id + '\')">' +
        '<div class="hub-lesson-icon">' + m.mod.icon + '</div>' +
        '<div class="hub-lesson-body">' +
          '<div class="hub-lesson-title">' + esc3(m.lesson.title) + '</div>' +
          '<div class="hub-lesson-meta">' + esc3(m.mod.title) + ' · ' + esc3(m.lesson.est || '') + '</div>' +
        '</div></div>';
    }).join("") + '</div>';
};

/* ---------- MODULE detail view ---------- */
HUB.openModule = function(modId){
  var el = document.getElementById("hubpanel");
  var mod = (window.CURRICULUM || []).filter(function(m){ return m.id === modId; })[0];
  if(!el || !mod) return;
  HUB.currentModule = modId;
  var prog = loadProg();

  var lessonRows = mod.lessons.map(function(l, i){
    var done = !!prog[l.id];
    var typeClass = "hub-type-" + (l.type || "concept");
    var typeLabel = (l.type || "concept").toUpperCase();
    return '<div class="hub-lesson-row ' + (done ? 'done' : '') + '" onclick="HUB.openLesson(\'' + mod.id + '\',\'' + l.id + '\')">' +
      '<div class="hub-lesson-icon">' + (done ? '✓' : (i + 1)) + '</div>' +
      '<div class="hub-lesson-body">' +
        '<div class="hub-lesson-title"><span class="hub-lesson-type-badge ' + typeClass + '">' + typeLabel + '</span>' + esc3(l.title) + '</div>' +
        '<div class="hub-lesson-meta">⏱️ ' + esc3(l.est || '') + '</div>' +
      '</div></div>';
  }).join("");

  var ms = HUB.moduleStats(mod);

  el.innerHTML =
    '<button class="hub-back" onclick="HUB.renderHome()">← All modules</button>' +
    '<div class="hub-mod-header" style="--module-color:' + mod.color + '">' +
      '<div class="hub-mod-icon">' + mod.icon + '</div>' +
      '<div class="hub-mod-title">' + esc3(mod.title) + '</div>' +
      '<div class="hub-mod-meta">📚 ' + mod.lessons.length + ' lessons · ⏱️ ' + mod.weeks + ' week' + (mod.weeks>1?'s':'') + ' · 🎯 ' + esc3(mod.level) + ' · ✓ ' + ms.done + ' completed (' + ms.pct + '%)</div>' +
      '<div class="hub-mod-summary">' + esc3(mod.summary) + '</div>' +
      '<div class="hub-mod-prereq"><strong>Prerequisites:</strong> ' + esc3(mod.prereq) + '</div>' +
    '</div>' +
    '<div class="hub-lesson-list">' + lessonRows + '</div>';
};

/* ---------- LESSON content view ---------- */
HUB.openLesson = function(modId, lessonId){
  var el = document.getElementById("hubpanel");
  var mod = (window.CURRICULUM || []).filter(function(m){ return m.id === modId; })[0];
  if(!mod) return;
  var idx = -1;
  for(var i = 0; i < mod.lessons.length; i++){
    if(mod.lessons[i].id === lessonId){ idx = i; break; }
  }
  if(idx < 0) return;
  var lesson = mod.lessons[idx];
  HUB.currentModule = modId;
  HUB.currentLesson = lessonId;

  var prev = idx > 0 ? mod.lessons[idx-1] : null;
  var next = idx < mod.lessons.length-1 ? mod.lessons[idx+1] : null;
  var done = HUB.isDone(lessonId);

  // Render learn content (array of HTML strings)
  var learnHTML = (lesson.learn || []).map(function(item){
    return '<div class="hub-learn-item">' + item + '</div>';
  }).join("");

  // Example block
  var exampleHTML = lesson.example
    ? '<div class="hub-section"><div class="hub-section-title">📖 Worked example</div>' +
      '<div class="hub-example">' + lesson.example + '</div></div>'
    : '';

  // Try It button (sends query to QueryPilot chat)
  var tryHTML = lesson.tryq
    ? '<div class="hub-section"><div class="hub-section-title">⚡ Try it in QueryPilot</div>' +
      '<div class="hub-tryq" onclick="HUB.tryQuery(\'' + esc3(lesson.tryq).replace(/'/g, "\\'") + '\')">' +
      '<div class="hub-tryq-icon">▶️</div>' +
      '<div class="hub-tryq-text"><strong>' + esc3(lesson.tryq) + '</strong>Click to run this in the QueryPilot chat</div>' +
      '</div></div>'
    : '';

  // Quiz block
  var quizHTML = "";
  if(lesson.quiz){
    quizHTML = '<div class="hub-section"><div class="hub-section-title">🧠 Quick check</div>' +
      '<div class="hub-quiz-q">' + lesson.quiz.q + '</div>' +
      '<div class="hub-quiz-options" id="quiz-opts-' + lesson.id + '">' +
      lesson.quiz.a.map(function(opt, i){
        return '<button class="hub-quiz-opt" onclick="HUB.answerQuiz(\'' + lesson.id + '\',' + i + ')" data-correct="' + (opt.c ? 'true' : 'false') + '" data-why="' + esc3(opt.why || '') + '">' + esc3(opt.t) + '</button>';
      }).join("") +
      '</div><div id="quiz-fb-' + lesson.id + '"></div></div>';
  }

  // Exercise block
  var exerciseHTML = "";
  if(lesson.exercise){
    exerciseHTML = '<div class="hub-exercise-card">' +
      '<div class="hub-exercise-title">💪 Exercise</div>' +
      '<div class="hub-exercise-grid">' +
      (lesson.exercise.task ? '<div><strong>Task</strong>' + esc3(lesson.exercise.task) + '</div>' : '') +
      (lesson.exercise.tool ? '<div><strong>Tool</strong>' + esc3(lesson.exercise.tool) + '</div>' : '') +
      (lesson.exercise.steps ? '<div><strong>Steps</strong>' + lesson.exercise.steps + '</div>' : '') +
      (lesson.exercise.checkpoint ? '<div><strong>Checkpoint</strong>' + esc3(lesson.exercise.checkpoint) + '</div>' : '') +
      '</div></div>';
  }

  // Project block
  var projectHTML = "";
  if(lesson.project){
    projectHTML = '<div class="hub-exercise-card" style="border-color:var(--pu);background:linear-gradient(135deg, #bc8cff15, var(--sf))">' +
      '<div class="hub-exercise-title" style="color:var(--pu)">🏆 Project deliverable</div>' +
      '<div class="hub-exercise-grid">' +
      '<div><strong>Deliverable</strong>' + esc3(lesson.project.deliverable || '') + '</div>' +
      '<div><strong>Time</strong>' + esc3(lesson.project.time || '') + '</div>' +
      '<div><strong>Difficulty</strong>' + esc3(lesson.project.difficulty || '') + '</div>' +
      (lesson.project.skills ? '<div style="grid-column:1/-1"><strong>Skills practised</strong>' + lesson.project.skills.join(' · ') + '</div>' : '') +
      '</div></div>';
  }

  // Glossary
  var glossaryHTML = "";
  if(lesson.glossary && lesson.glossary.length){
    glossaryHTML = '<div class="hub-section"><div class="hub-section-title">📖 Glossary</div>' +
      '<div class="hub-glossary">' +
      lesson.glossary.map(function(g){
        return '<div class="hub-glossary-item"><div class="hub-glossary-term">' + esc3(g.term) + '</div><div class="hub-glossary-def">' + esc3(g.def) + '</div></div>';
      }).join("") +
      '</div></div>';
  }

  // Takeaway
  var takeawayHTML = lesson.takeaway
    ? '<div class="hub-takeaway"><strong>Key takeaway</strong>' + esc3(lesson.takeaway) + '</div>'
    : '';

  el.innerHTML =
    '<div class="hub-lesson-page">' +
    '<div class="hub-lesson-nav">' +
      '<a onclick="HUB.renderHome()">🏠 Hub</a>' +
      '<span class="sep">›</span>' +
      '<a onclick="HUB.openModule(\'' + mod.id + '\')">' + mod.icon + ' ' + esc3(mod.title) + '</a>' +
      '<span class="sep">›</span>' +
      '<span>Lesson ' + (idx+1) + ' of ' + mod.lessons.length + '</span>' +
    '</div>' +
    '<div class="hub-lesson-h1">' + esc3(lesson.title) + '</div>' +
    '<div class="hub-lesson-info">' +
      '<span>⏱️ ' + esc3(lesson.est || '') + '</span>' +
      '<span><span class="hub-lesson-type-badge hub-type-' + (lesson.type || 'concept') + '">' + (lesson.type || 'concept').toUpperCase() + '</span></span>' +
      (done ? '<span style="color:var(--ac);font-weight:700">✓ Completed</span>' : '') +
    '</div>' +

    '<div class="hub-section">' +
      '<div class="hub-section-title">📚 Learn</div>' + learnHTML +
    '</div>' +

    exampleHTML +
    tryHTML +
    exerciseHTML +
    projectHTML +
    quizHTML +
    takeawayHTML +
    glossaryHTML +

    '<div class="hub-lesson-actions">' +
      (prev ? '<button class="hub-action-btn ghost" onclick="HUB.openLesson(\'' + mod.id + '\',\'' + prev.id + '\')">← Previous</button>' :
              '<button class="hub-action-btn ghost" disabled>← Previous</button>') +
      (done
        ? '<button class="hub-action-btn ghost" onclick="HUB.toggleDone(\'' + lesson.id + '\')">↺ Mark as not done</button>'
        : '<button class="hub-action-btn" onclick="HUB.toggleDone(\'' + lesson.id + '\')">✓ Mark as done</button>') +
      '<div class="hub-spacer"></div>' +
      (next ? '<button class="hub-action-btn" onclick="HUB.openLesson(\'' + mod.id + '\',\'' + next.id + '\')">Next →</button>' :
              '<button class="hub-action-btn" onclick="HUB.openModule(\'' + mod.id + '\')">Module home →</button>') +
    '</div>' +
    '</div>';

  // Scroll to top
  document.getElementById("hubpanel").scrollTop = 0;
};

/* ---------- toggle done ---------- */
HUB.toggleDone = function(lessonId){
  if(HUB.isDone(lessonId)){
    HUB.markUndone(lessonId);
  } else {
    HUB.markDone(lessonId);
    if(typeof toast === "function") toast("✓ Lesson marked as done!");
  }
  // Re-render current view
  if(HUB.currentLesson) HUB.openLesson(HUB.currentModule, HUB.currentLesson);
};

/* ---------- quiz answer ---------- */
HUB.answerQuiz = function(lessonId, choiceIdx){
  var opts = document.getElementById("quiz-opts-" + lessonId);
  var fb = document.getElementById("quiz-fb-" + lessonId);
  if(!opts || !fb) return;
  var buttons = opts.querySelectorAll(".hub-quiz-opt");
  var chosen = buttons[choiceIdx];
  var isCorrect = chosen.getAttribute("data-correct") === "true";
  var why = chosen.getAttribute("data-why") || "";

  // Color all buttons
  for(var i = 0; i < buttons.length; i++){
    var b = buttons[i];
    if(b.getAttribute("data-correct") === "true") b.classList.add("correct");
    if(i === choiceIdx && !isCorrect) b.classList.add("wrong");
    b.disabled = true;
    b.style.cursor = "default";
  }

  fb.innerHTML = '<div class="hub-quiz-feedback ' + (isCorrect ? 'correct' : 'wrong') + '">' +
    (isCorrect ? '✓ <strong>Correct!</strong> ' : '✗ <strong>Not quite.</strong> ') +
    esc3(why) +
    '</div>';

  if(isCorrect && typeof toast === "function"){
    toast("Correct! Well done.");
  }
};

/* ---------- try query in chat ---------- */
HUB.tryQuery = function(q){
  if(typeof setMode === "function") setMode("chat", null);
  if(typeof send === "function") send(q);
  if(typeof toast === "function") toast("Running: " + q.slice(0, 50));
};

/* ---------- update sidebar chip ---------- */
HUB.updateChip = function(){
  var s = HUB.stats();
  var chip = document.getElementById("hub-chip");
  if(chip) chip.textContent = "🎓 " + s.pct + "%";
};

/* ---------- certificate ---------- */
HUB.showCertificate = function(){
  var s = HUB.stats();
  var profile = loadProfile();

  // Prompt for name if not set
  var name = profile.name;
  if(!name){
    name = prompt("Enter your name for the certificate:");
    if(!name) return;
    profile.name = name;
    profile.completedAt = new Date().toISOString();
    saveProfile(profile);
  }

  var date = new Date(profile.completedAt || Date.now());
  var dateStr = date.toLocaleDateString("en-GB", { year:'numeric', month:'long', day:'numeric' });

  var el = document.getElementById("hubpanel");
  el.innerHTML =
    '<button class="hub-back" onclick="HUB.renderHome()">← Back to Hub</button>' +
    '<div class="hub-cert-wrap" id="cert-printable">' +
      '<div class="hub-cert-title">Certificate of Completion</div>' +
      '<div style="font-size:48px;margin:8px 0">🎓</div>' +
      '<div class="hub-cert-h">Data Science from Zero to Expert</div>' +
      '<div class="hub-cert-presented">This certificate is proudly presented to</div>' +
      '<div class="hub-cert-name">' + esc3(name) + '</div>' +
      '<div class="hub-cert-body">for successfully completing the QueryPilot Data Science Learning Hub curriculum — a comprehensive, beginner-to-expert programme covering data literacy, SQL, statistics, Python, Pandas, visualisation, machine learning, and deployment.</div>' +
      '<div class="hub-cert-stats">' +
        '<div><strong>' + s.doneLessons + '</strong>Lessons completed</div>' +
        '<div><strong>' + s.doneModules + '</strong>Modules mastered</div>' +
        '<div><strong>' + s.pct + '%</strong>Curriculum completion</div>' +
      '</div>' +
      '<div class="hub-cert-body" style="font-style:italic;margin-top:16px">Issued: ' + dateStr + '</div>' +
      '<div class="hub-cert-sig">' +
        '<div>Adewale Samson Adeagbo<br><span style="font-size:10px">Curriculum Author · HMG Concepts, Lagos</span></div>' +
        '<div>QueryPilot v9<br><span style="font-size:10px">Free Offline SQL Assistant</span></div>' +
      '</div>' +
    '</div>' +
    '<div style="text-align:center;margin-top:18px">' +
      '<button class="hub-action-btn" onclick="window.print()">🖨️ Print / Save as PDF</button> ' +
      '<button class="hub-action-btn ghost" onclick="HUB.shareCertificate(\'' + esc3(name) + '\')">📤 Share on LinkedIn</button>' +
    '</div>' +
    '<div style="font-size:12px;color:var(--mu);text-align:center;margin-top:14px;padding:14px;background:var(--sf2);border-radius:9px;max-width:600px;margin-left:auto;margin-right:auto">' +
    '<strong>Note:</strong> This is a learning-completion certificate from a free open-source curriculum, not an accredited qualification. ' +
    'It demonstrates self-directed learning. For accredited Nigerian data-science programmes, see DSN, 3MTT, WorldQuant University, IBM SkillsBuild, Kodecamp.' +
    '</div>';
};

HUB.shareCertificate = function(name){
  var url = "https://querypilot.app";
  var text = encodeURIComponent("I just completed the Data Science from Zero to Expert curriculum on QueryPilot — 118 lessons across 8 modules! Built by Adewale Samson Adeagbo (HMG Concepts, Lagos). Try it free: " + url);
  var liUrl = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url) + "&summary=" + text;
  window.open(liUrl, "_blank");
};

/* ---------- initial boot ---------- */
HUB.init = function(){
  // Wait for curriculum to load
  if(!window.CURRICULUM){
    setTimeout(HUB.init, 100);
    return;
  }
  HUB.updateChip();
};

/* ---------- override setMode to handle 'hub' ---------- */
(function(){
  if(typeof window.setMode !== "function") return;
  var orig = window.setMode;
  window.setMode = function(mode, btn){
    if(mode === "hub"){
      var allPanels = ["cpanel","vpanel","jpanel","sqpanel","multipanel","diffpanel","toolspanel","learnpanel","exportpanel","entpanel","hubpanel"];
      allPanels.forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.classList.remove("on");
      });
      var hp = document.getElementById("hubpanel");
      if(hp) hp.classList.add("on");
      document.getElementById("ibar").style.display = "none";
      document.querySelectorAll(".mt").forEach(function(b){ b.classList.remove("on"); });
      if(btn) btn.classList.add("on");
      HUB.renderHome();
      return;
    }
    return orig(mode, btn);
  };
})();

/* Boot when DOM is ready */
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", HUB.init);
} else {
  HUB.init();
}

/* Console signature */
try {
  console.log(
    "%cQueryPilot v9 Learn Hub%c — Data Science from Zero to Expert\n" +
    "8 modules · ~118 lessons · ~24 weeks\n" +
    "Curriculum by Adewale Samson Adeagbo · HMG Concepts · Lagos, Nigeria",
    "color:#bc8cff;font-weight:700;font-size:14px",
    "color:#888;font-size:12px"
  );
} catch(e){}

})();
