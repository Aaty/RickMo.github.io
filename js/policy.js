function getUePrivacyCookie(c) {
    var b = document.cookie,
        a = b.indexOf(" " + c + "="); - 1 == a && (a = b.indexOf(c + "=")); - 1 == a ? b = !1 : (a = b.indexOf("=", a) + 1, c = b.indexOf(";", a), -1 == c && (c = b.length), b = unescape(b.substring(a, c)));
    return b
}

function setUePrivacyCookie(c, b) {
    var a = new Date;
    a.setTime(a.getTime() + 31536E9);
    a = "; expires=" + a.toGMTString();
    document.cookie = "ue_privacyPolicy = " + b + " " + a + "; path=/; domain=" + c + ";";
    (a = document.getElementById("privacyPolicyLayerN")) && a.parentNode.removeChild(a)
}

function parseUri(c) {
    var b = parseUri.options;
    c = b.parser[b.strictMode ? "strict" : "loose"].exec(c);
    for (var a = {}, d = 14; d--;) a[b.key[d]] = c[d] || "";
    a[b.q.name] = {};
    a[b.key[12]].replace(b.q.parser, function(c, d, e) {
        d && (a[b.q.name][d] = e)
    });
    return a
}
parseUri.options = {
    strictMode: !1,
    key: "source protocol authority userInfo user password host port relative path directory file query anchor".split(" "),
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};

function showPrivacyCookieLayer(c) {
    var b = "#privacyPolicyLayerN{background-color: rgb(85, 85, 85);display:block;text-align:center;font-size: " + (null != navigator.userAgent.match(/iPhone/i) || null != navigator.userAgent.match(/Android/i) || null != navigator.userAgent.match(/iPad/i) ? "11px" : "10px") + ";padding: 0.5em; } ",
        b = b + '.policy{color:#fff;} .policy:after{content:"Uso de Cookies: Utilizamos \\"cookies\\" propias y de terceros para elaborar informaci\u00f3n estad\u00edstica y mostrarle publicidad personalizada a trav\u00e9s del an\u00e1lisis de su navegaci\u00f3n. Si contin\u00faa navegando acepta su uso.";margin-right:5px;} ',
        b = b + ".privacyA{color:#25adda !important;} ";
    c = document.getElementsByTagName("body")[0];
    var a = navigator.userAgent.toLowerCase();
    if (/msie/.test(a) && !/opera/.test(a)) {
        var a = document.getElementsByTagName("head")[0],
            d = document.createElement("style");
        d.type = "text/css";
        d.styleSheet ? d.styleSheet.cssText = b : d.appendChild(document.createTextNode(b));
        a.appendChild(d);
        b = createHtml(' <span id="privacyPolicyLayerN"><span class="policy"></span><a rel="nofollow" href="http://cookies.unidadeditorial.es" class="privacyA"> M\u00e1s informaci\u00f3n y cambio de configuraci\u00f3n</a></span>')
    } else b =
        createHtml('<style type="text/css">#privacyPolicyLayerN{clear:both;background-color: rgb(85, 85, 85);display:block;text-align:center;font-size: 10px;padding: 0.5em;width:100% !important;position: fixed;bottom: 0;z-index: 10; }.policy{color:#fff;} .policy:after{content:"Uso de Cookies: Utilizamos \\"cookies\\" propias y de terceros para elaborar informaci\u00f3n estad\u00edstica y mostrarle publicidad personalizada a trav\u00e9s del an\u00e1lisis de su navegaci\u00f3n. Si contin\u00faa navegando acepta su uso.";margin-right:5px;} .privacyA{color:#25adda !important;} } </style> <span id="privacyPolicyLayerN"><span class="policy"></span><a rel="nofollow" href="http://cookies.unidadeditorial.es" class="privacyA"> M\u00e1s informaci\u00f3n y cambio de configuraci\u00f3n</a></span>');
    c.insertBefore(b, c.firstChild)
}

function createHtml(c) {
    var b = document.createDocumentFragment(),
        a = document.createElement("div");
    for (a.innerHTML = c; a.firstChild;) b.appendChild(a.firstChild);
    return b
}

function checkPrivacyPolicy() {
    if (!window.opener) {
        var c = parseUri(document.location).authority.split("."),
            c = c[c.length - 2] + "." + c[c.length - 1],
            b = Array(c);
        Array.prototype.inArray = function(a) {
            for (var b = 0; b < this.length; b++)
                if (this[b] === a) return !0;
            return !1
        };
        var a = getUePrivacyCookie("ue_privacyPolicy");
        a ? "" != document.referrer ? 0 == a && (parseUri.options.strictMode = !0, a = parseUri(document.referrer).authority.split("."), b.inArray(a[a.length - 2] + "." + a[a.length - 1]) ? setUePrivacyCookie(c, 1) : showPrivacyCookieLayer(c)) :
            1 != a && showPrivacyCookieLayer(c) : (setUePrivacyCookie(c, 0), showPrivacyCookieLayer(c))
    }
}
checkPrivacyPolicy()