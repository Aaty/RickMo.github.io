var assets_cache_name = "v1_static";
var content_cache_name = 'v1_dynamic';

var siteDomain = "https://jangosto.github.io";

var static_assets = Array(
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
            return cache.addAll(static_assets);
        })
    );
});

self.addEventListener('activate', function(event) {

    console.log("El service worker está activo...");

});

self.addEventListener('fetch', function(event)
{
    console.log("REQUEST: ", event.request.url);
    // ... regex for portadillas
    var autocoverPattern =  new RegExp("^"+siteDomain+"\/([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?$", "i");
    // ... regex for news
    var newPattern = new RegExp("^"+siteDomain+"\/([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?[0-9]{4}\/[0-1][0-9]\/[0-3][0-9]\/[0-9a-f]{24}.html$", "i");

    if (autocoverPattern.test(event.request.url) || newPattern.test(event.request.url)) {
        shellRequest = new Request(siteDomain+"/shell.html");
        event.respondWith(
            caches.match(shellRequest).then(function(response) {
                if (response) {
                    return response;
                }
                return caches.open(static_assets).then(function(cache) {
                    cache.add(shellRequest).then(function() {
                        return fetch(shellRequest);
                    });
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                }

                if (event.request.method = "GET") {
                    return caches.open(content_cache_name).then(function(cache) {
                        return cache.add(event.request).then(function() {
                            return fetch(event.request);
                        });
                    });
                } else {
                    return fetch(event.request);
                }
            })
        );
    }
});

self.addEventListener("message", function(event) {
    console.log(event);
});
