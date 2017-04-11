var assets_cache_name = "v1_static";

var siteDomain = "hhtps://jangosto.github.io";

var static_assets = array(
    "https://jangosto.github.io/shell.html",
    "https://jangosto.github.io/css/core-portada-elmundo-mobile.css",
    "https://jangosto.github.io/js/jquery.2.1.4.js",
    "https://jangosto.github.io/js/mobile.min.js",
    "https://jangosto.github.io/js/hydratator.js",
    "https://securepubads.g.doubleclick.net/gpt/pubads_impl_113.js",
    "https://static.chartbeat.com/js/chartbeat_mab.js"
);

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(assets_cache_name).then(function(cache) {
console.log("Caching static files");
            return cache.addAll(static_assets).then(function() {
                self.skipWaiting();
            });
        });
    );
});

self.addEventListener('activate', function(event) {});

self.addEventListener('fetch', function(event) {
    var autocoverPattern = "";
});
