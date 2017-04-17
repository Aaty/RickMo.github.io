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
    //var jsonUrl = getJsonUrl(currentUrl);
    //var jsonData = getContent(jsonUrl);
    //var arrayData = JSON.parse(jsonData);

    //document.querySelector('[data-ue-u="title"]').innerHTML = "Noticias de " + arrayData.titulo + " | EL MUNDO";
    //if (arrayData.type != "portada") {
        //document.querySelector('[data-ue-u="only-portada"]').remove();
    //}
    //document.querySelector([data-ue-u="title"]).innerHTML = "Noticias de " + arrayData.titulo + " | EL MUNDO";
    //document.querySelector([data-ue-u="title"]).innerHTML = "Noticias de " + arrayData.titulo + " | EL MUNDO";
    
    if (ampUrl.length > 0) {
        fetch(ampUrl).then(function (response) {
            return response.text().then(function (data) {
                updatePage(data);
            });
        });
    }
}

transformContent();
