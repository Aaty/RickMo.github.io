<?php
    ini_set("allow_url_fopen", true);

    $siteRootUrl = "/";
    $siteRootPath = "/home/jangosto/projects/elmundo/pwa/";
    $originDomain = "http://www.elmundo.es/";

    $sections = array("index", "economia", "espana", "deportes");

    foreach ($sections as $section) {
        $coverUrl = $originDomain.$section.".html";
        $entireCoverHtml = getFile($originDomain.$section."_mobile.html");
        $entireCoverHtml = str_replace($originDomain, "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("http://e00-marca.uecdn.es/", "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("http://e00-elmundo.uecdn.es/", "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("http://estaticos.elmundo.es/", "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("assets/v7/css/", "css/", $entireCoverHtml);
        $entireCoverHtml = str_replace("assets/v7/js/", "js/", $entireCoverHtml);

        $matches = array();
        preg_match('/<main[^>]+>(.*)<\/main>/s', $entireCoverHtml, $matches);
        $coverHtml = $matches[0];

        $autocoverJson = getFile("http://www.elmundo.es/json/".$section.".json");

        $autocoverArray = json_decode($autocoverJson);
        foreach ($autocoverArray->cts as $contentType) {
            $contentUrl = $contentType->url;
            
            if (urlExists(str_replace(".html", ".json", $contentUrl))) {
                $contentData = getFile(str_replace(".html", ".json", $contentUrl));
                $dataArray = json_decode($contentData);

                $htmlContent = generateHtmlContent($dataArray);
                
                file_put_contents("./contents/html/".$dataArray->id.".html", $htmlContent);
            }
        }

        if (!file_exists($siteRootPath.str_replace($originDomain, "", dirname($coverUrl)))) {
            mkdir($siteRootPath.str_replace($originDomain, "", dirname($coverUrl)), 0755, true);
        }
        file_put_contents($siteRootPath.str_replace($originDomain, "", $coverUrl), $entireCoverHtml);
        file_put_contents("./contents/html/".$section.".html", $coverHtml);
    }


function urlExists ($url)
{
    stream_context_set_default(
        array(
            'http' => array(
                'method' => 'HEAD'
            )
        )
    );
    $headers = @get_headers($url);
    $status = substr($headers[0], 9, 3);
    if ($status >= 200 && $status < 400 ) {
        return true;
    } else {
        return false;
    }
}

function generateHtmlContent($data)
{
    global $siteRootUrl, $siteRootPath, $originDomain;

    $entireContent = getFile(str_replace(".html", "_mobile.html", $data->url));

    if (isset($data->multimedia) && count($data->multimedia) > 0) {
        foreach ($data->multimedia as $multimediaItem) {
            if (isset($multimediaItem->position) && $multimediaItem->position != '') {
                if ($multimediaItem->type == 'image') {
                    $imageExtension = pathinfo($multimediaItem->url)['extension'];
                    $imageFile = getFile(str_replace("http://e00-marca.uecdn.es/", "http://estaticos.elmundo.es/",$multimediaItem->url));
                    file_put_contents('./contents/html/images/'.$multimediaItem->id.'.'.$imageExtension, $imageFile);
                    $entireContent = str_replace($multimediaItem->url, $siteRootUrl."api/contents/html/images/".$multimediaItem->id.'.'.$imageExtension, $entireContent);
                }
            }
        }
    }

    $entireContent = str_replace($originDomain, "/", $entireContent);
    $entireContent = str_replace("http://e00-marca.uecdn.es/", "/", $entireContent);
    $entireContent = str_replace("http://e00-elmundo.uecdn.es/", "/", $entireContent);
    $entireContent = str_replace("http://estaticos.elmundo.es/", "/", $entireContent);
    $entireContent = str_replace("assets/v7/css/", "css/", $entireContent);
    $entireContent = str_replace("assets/v7/js/", "js/", $entireContent);
    if (!file_exists($siteRootPath.str_replace($originDomain, "", dirname($data->url)))) {
        mkdir($siteRootPath.str_replace($originDomain, "", dirname($data->url)), 0755, true);
    }
    file_put_contents($siteRootPath.str_replace($originDomain, "", $data->url), $entireContent);

    $matches = array();
    preg_match('/<main[^>]+>(.*)<\/main>/s', $entireContent, $matches);
    $content = $matches[0];

    return $content;
}


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
