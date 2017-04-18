var getJsonUrl = function (url) {
    removeQueryString(url);
}

var removeQueryString = function (url) {
    var response = url.replace(/(\?)([^=]+=[^&]+)+/g, "");
    return response; 
}

var updatePage = function (data) {
    var container = document.getElementById("content");
    container.innerHTML = data;
}

var transformContent = function () {
    var siteDomain = "https://jangosto.github.io";
    // ... regex for portadillas
    var autocoverPattern =  new RegExp("^"+siteDomain+"\/([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?$", "i");
    // ... regex for news
    var newPattern = new RegExp("^"+siteDomain+"\/([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?([a-z0-9\-]+\/)?[0-9]{4}\/[0-1][0-9]\/[0-3][0-9]\/[0-9a-f]{24}.html$", "i");
    var currentUrl = removeQueryString(window.location.href);
    
    var ampUrl = "";
    if (newPattern.test(currentUrl)) {
        var urlArray = currentUrl.split("/");
        var fileName = urlArray[urlArray.length-1];
        ampUrl = "https://jangosto.github.io/api/contents/"+fileName;
    } else if (autocoverPattern.test(currentUrl)) {
        ampUrl = "https://jangosto.github.io/api/contents/index.html";
    }
    
    if (ampUrl.length > 0) {
        fetch(ampUrl).then(function (response) {
            return response.text().then(function (data) {
                updatePage(data);
            });
        });
    }
}

transformContent();

//READ LATER FEATURE IMPLEMENTATION
var sendReadLaterMessage = function (id, url) {
console.log("SENDING MESSAGE: ", id, url);
    var message = '{"data": {"url": "'+url+'", "id": "'+id.replace("read-later-", "")+'"}}';
    return new Promise(function(resolve, reject) {
        navigator.serviceWorker.controller.postMessage(message);
        window.serviceWorker.onMessage = function(e) {
            resolve(e.data);
        };
    });
}

var readLaterButtons = document.getElementsByClassName("read-later");
console.log("BUTTONS: ", readLaterButtons);
readLaterButtons.onload = function () {
console.log("BUTTONS NUMBER: ", readLaterButtons.length);
    if (readLaterButtons.length > 0) {
    console.log("ENTRÓ EN LA GENERACIÓN DE EVENTOS...");
        for (var i = 0; i < readLaterButtons.length; i++) {
            var elementId = readLaterButtons[i].getAttribute("id");
            var newUrl = readLaterButtons[i].parentNode.getElementByClassName("new-url").getAttribute('href');
    console.log("ELEMENT TO CREATE EVENT: ", readLaterButtons[i], elementId, newUrl)
            readLaterButtons[i].onclick = function(elementId, newUrl) {
                sendReadLaterMessage(elementId, newUrl);
            };
        }
    }
}
