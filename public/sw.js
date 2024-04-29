 
/*
const assets = [
  "/",
  "/assets/fonts/",
  "/assets/css/",
  "/assets/images/",
]
*/

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("devkerakoll").then((cache) => {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
self.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log(`beforeinstallprompt event was fired.`);
 // installPrompt('show');
  if (typeof document !== 'undefined') { document.getElementById("pwaPromptPopup").style.display='block'; }
});

if (typeof document !== 'undefined') {
  const myElement = document.getElementById("pwaInstall");
  myElement.addEventListener('click', async () => {
   // installPrompt('hide');
   // installLoader('show');
    if (typeof document !== 'undefined') { 
      document.getElementById("pwaPromptPopup").style.display='none'; 
      document.getElementById("pwaLoader").style.display='block'; 
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    deferredPrompt = null;
  });
}




self.addEventListener('appinstalled', () => {
  //installPrompt('hide');
  // installLoader('hide');
  if (typeof document !== 'undefined') { 
    document.getElementById("pwaPromptPopup").style.display='none'; 
    document.getElementById("pwaLoader").style.display='none'; 
  }
  deferredPrompt = null;
  console.log('PWA was installed');
});