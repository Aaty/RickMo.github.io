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

var tranformContent = function () {
    var currentUrl = window.location.href;
    var jsonUrl = getJsonUrl(currentUrl);
    var jsonData = getContent(jsonUrl);
    var arrayData = JSON.parse(jsonData);

    document.querySelector('[data-ue-u="title"]').innerHTML = "Noticias de " + arrayData.titulo + " | EL MUNDO";
    if (arrayData.type != "portada") {
        document.querySelector('[data-ue-u="only-portada"]').remove();
    }
    //document.querySelector([data-ue-u="title"]).innerHTML = "Noticias de " + arrayData.titulo + " | EL MUNDO";
    //document.querySelector([data-ue-u="title"]).innerHTML = "Noticias de " + arrayData.titulo + " | EL MUNDO";
}

tranformContent();
