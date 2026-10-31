/* Service worker ALRODIS : l'application s'ouvre même sans réseau. Changez la version pour forcer une mise à jour. */
var CACHE='alrodis-horaire-v1';
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','favicon.svg'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.hostname.indexOf('firebaseio.com')>-1||u.hostname.indexOf('firebasedatabase.app')>-1||u.pathname.indexOf('/.lp')>-1)return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put('index.html',cp);});return res;}).catch(function(){return caches.match('index.html').then(function(m){return m||caches.match('./');});}));
    return;}
  e.respondWith(caches.match(r).then(function(m){
    var net=fetch(r).then(function(res){if(res&&(res.status===200||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});}return res;}).catch(function(){return m;});
    return m||net;}));
});
