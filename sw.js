const CACHE = 'sql-v5-hmg-2026-06-22';
const ASSETS = [
  './', './index.html', './workbench.html', './queryflow.html', './querypilot-v9.html', './enterprise-suite.html', './academy.html', './notebook.html', './diagnostics.html', './dashboard.html', './search.html', './persona.html', './ecosystem.html', './about.html', './404.html',
  './robots.txt', './sitemap.xml', './humans.txt', './README.md', './FEATURES.md', './DEPLOYMENT.md', './ENTERPRISE.md', './LEARNING_HUB.md', './AUTHOR.md', './RECHECK_AND_V4_AUDIT.md', './QUERYFLOW_AUDIT.md',
  './assets/css/styles.css', './assets/icons/icon.svg', './assets/js/data.js', './assets/js/queryflow-data.js', './assets/js/core.js', './assets/js/sql-engine.js', './assets/js/workbench.js', './assets/js/queryflow.js', './assets/js/academy.js', './assets/js/notebook.js', './assets/js/diagnostics.js', './assets/js/dashboard.js', './assets/js/site-search.js',
  './qp_assets/app.js', './qp_assets/enterprise.js', './qp_assets/curriculum.js', './qp_assets/curriculum_part2.js', './qp_assets/curriculum_part3.js', './qp_assets/curriculum_part4.js', './qp_assets/learn.js', './qp_assets/styles.css', './qp_assets/enterprise.css', './qp_assets/learn.css'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
    const clone = resp.clone(); caches.open(CACHE).then(c=>c.put(e.request, clone)).catch(()=>{}); return resp;
  }).catch(()=>caches.match('./index.html'))));
});
