var getJsonUrl = function (url) {
    removeQueryString(url);
}

var getContent = function (url) {
    fetch(url).then(function (response) {
        return response.text().then(function (data) {
            return data;
        });
    });
}

var removeQueryString = function (url) {
    var response = url.replace(/(\?)([^=]+=[^&]+)+/g, "");
    return response; 
}

var updatePage = function (data) {
    var container = document.getElementById("content");
    data = data.replace('[[[---URL---]]]', currentUrl);
    container.innerHTML = data;
}

var tranformContent = function () {
    var currentUrl = removeQueryString(window.location.href);
    var urlArray = currentUrl.split("/");
    var fileName = urlArray[urlArray.length-1];

    var ampUrl = "https://jangosto.github.io/api/contents/"+fileName;

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
        updatePage(getContent(ampUrl));
    }
}

tranformContent();
