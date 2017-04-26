var assets_cache_name = "v1_static";
var content_cache_name = 'v1_dynamic';
var user_cache_name = 'v1_user';

var primary_cover_css = "/css/core-portada-elmundo-mobile.css";
var primary_new_css = "/css/core-noticia-elmundo-mobile.css";

var siteDomain = "https://jangosto.github.io";

// ... regex for portadillas
var autocoverPattern =  new RegExp("^"+siteDomain+"\/([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?([a-z0-9\-]+.html)?$", "i");
// ... regex for news
var newPattern = new RegExp("^"+siteDomain+"\/([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?[0-9]{4}\/[0-1][0-9]\/[0-3][0-9]\/[0-9a-f]{24}.html$", "i");
// ... regex for hydratation contents
var newContentPattern = new RegExp("^"+siteDomain+"\/api\/contents\/html\/[^\/]+.html$", "i");

var static_assets = Array(
    "/shell.html",
    "/css/core-portada-elmundo-mobile.css",
    "/js/jquery.2.1.4.js",
    "/js/mobile.min.js",
    "/js/hydratator.js",
    "/js/v0.js",
/*    "/js/v0/amp-iframe-0.1.js",
    "/js/v0/amp-analytics-0.1.js",
    "/js/v0/amp-sidebar-0.1.js",
    "/js/v0/amp-list-0.1.js",
    "/js/v0/amp-mustache-0.1.js",
    "/js/v0/amp-fit-text-0.1.js",
    "/js/v0/amp-ad-0.1.js",*/
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
    var currentUrl = remove_query_string(event.request.url);

    if (newContentPattern.test(currentUrl)) {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                if (response) {
                    return response;
                }

                if (event.request.method = "GET") {
                    return caches.open(content_cache_name).then(function(cache) {
                        return cache.add(event.request).then(function() {
                            clean_cache(content_cache_name);
                            return fetch(event.request);
                        });
                    });
                } else {
                    return fetch(event.request);
                }
            })
        );
    } else if (autocoverPattern.test(currentUrl) || newPattern.test(currentUrl)) {
        shellRequest = new Request(siteDomain+"/shell.html");
        event.respondWith(
            caches.match(shellRequest).then(function(response) {
                if (response) {
                    return createResponse(response, currentUrl);
                }
                return caches.open(assets_cache_name).then(function(cache) {
                    cache.add(shellRequest).then(function() {
                        return fetch(shellRequest).then(function(response) {
                            return createResponse(response, currentUrl);
                        });
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
                    return caches.open(assets_cache_name).then(function(cache) {
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
    var data = event.data;
    switch (data.type) {
        case "cacheAddUrlRequest":
            var request = new Request(data.url);
            caches.match(request, {"cacheName": user_cache_name}).then(function(response) {
                if (response) {
                    event.ports[0].postMessage({"alreadyCached": true});
                } else {
                    return caches.open(user_cache_name).then(function(cache) {
                        cache.add(request).then(function() {
                            event.ports[0].postMessage({"alreadyCached": false});
                        });
                    });
                }
            });
            break;
        case "isUrlCachedRequest":
            var request = new Request(data.url);
            caches.match(request/*, {"cacheName": user_cache_name}*/).then(function(response) {
                if (response) {
                    event.ports[0].postMessage({"cached": true});
                } else {
                    event.ports[0].postMessage({"cached": false});
                }
            });
            break;
    }
});




var clean_cache = function (cache_name) {
    var max_num_cached_contents = 5;
    var cleanable_url_pattern = new RegExp("^"+siteDomain+"\/api\/contents\/html\/[0-9a-f]{24}.html$", "i");

    caches.open(cache_name).then(function(cache) {
        cache.keys().then(function(keys) {
            var counter = 0;
            for (var i=keys.length-1; i>=0; i--) {
                if (cleanable_url_pattern.test(keys[i].url)) {
                    if (counter < max_num_cached_contents) {
                        counter++;
                    } else {
                        cache.delete(keys[i]);
                    }
                } 
            }
        })
    });
}

var remove_query_string = function (url) {
    urlArray = url.split('?');

    return urlArray[0];
}

var createResponse = function (content, url) {
    var result = "";
    if (newPattern.test(currentUrl)) {
        result = content.replace('[[[---PRIMARY_CSS---]]]', primary_new_css);
    } else if (autocoverPattern.test(currentUrl)) {
        result = content.replace('[[[---PRIMARY_CSS---]]]', primary_cover_css);
    }

    return result;
}
