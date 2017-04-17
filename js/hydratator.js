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
        fetch(ampUrl).then(function (response) {
            return response.text().then(function (data) {
                updatePage(data);
            });
        });
    }
}

transformContent();
