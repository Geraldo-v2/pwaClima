const CACHE_NAME = "version-1";
const urlsToCache = [ 'index.html', 'offline.html' ];

const self = this;

// Install SW
let deferredPrompt; // Allows to show the install prompt
const installButton = document.getElementById("btn-instalar");

window.addEventListener("beforeinstallprompt", e => {
  console.log("beforeinstallprompt fired");
  deferredPrompt = e;
  installButton.addEventListener("click", installApp);
});

function installApp() {
    deferredPrompt.prompt();
  
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === "accepted") {
        console.log("PWA setup accepted");
      } else {
        console.log("PWA setup rejected");
      }
      deferredPrompt = null;
    });
  }

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// Activate the SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});