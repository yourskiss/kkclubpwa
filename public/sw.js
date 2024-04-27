 
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
