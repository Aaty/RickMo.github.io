<?php

    $prototype = file_get_contents("/home/jangosto/projects/pwa/api/ampPrototype.html_old");

    $matches = array();

    preg_match_all('/(https:\/\/e00-elmundo\.uecdn\.es[^"|\']+)["|,|.|\']/i', $prototype, $matches);

    foreach ($matches[1] as $url) {
        $pathToSave = "";
        $urlToRequest = "";
        if (strpos($url, "/assets/multimedia/") !== false) {
            $pathToSave = "/home/jangosto/projects/pwa/api/contents/images/";
            $urlToRequest = "https://franciscosantamaria.me/pwa/juan/api/contents/images/";
        } elseif (strpos($url, "/assets/amp/") !== false) {
            $pathToSave = "/home/jangosto/projects/pwa/img/";
            $urlToRequest = "https://franciscosantamaria.me/pwa/juan/img/";
        } elseif (strpos($url, "/fonts/") !== false) {
            $pathToSave = "/home/jangosto/projects/pwa/fonts/";
            $urlToRequest = "https://franciscosantamaria.me/pwa/juan/fonts/";
        }

        $urlArray = explode("/", $url);
        $filename = end($urlArray);

        file_put_contents($pathToSave.$filename, getFile($url));
        $prototype = str_replace($url, $urlToRequest.$filename, $prototype);
    }

    file_put_contents("/home/jangosto/projects/pwa/api/ampPrototype.html", $prototype);


    function getFile($url)
    {
        $ch = curl_init();
        $timeout = 5;
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        $data = curl_exec($ch);
        curl_close($ch);
        return $data;
    }
