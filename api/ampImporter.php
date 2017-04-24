<?php
    ini_set("allow_url_fopen", true);

    $siteRootUrl = "/";
    $siteRootPath = "/home/jangosto/projects/elmundo/pwa/";
    $originDomain = "http://www.elmundo.es/";

    $sections = array("index", "economia", "espana", "deportes");

    foreach ($sections as $section) {
        $coverUrl = $originDomain.$section.".html";
        $entireCoverHtml = getFile($originDomain.$section."_mobile.html");

        $entireCoverHtml = extract_images($entireCoverHtml);

        $entireCoverHtml = str_replace($originDomain, "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("http://e00-marca.uecdn.es/", "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("http://e00-elmundo.uecdn.es/", "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("http://estaticos.elmundo.es/", "/", $entireCoverHtml);
        $entireCoverHtml = str_replace("assets/v7/css/", "css/", $entireCoverHtml);
        $entireCoverHtml = str_replace("assets/v7/js/", "js/", $entireCoverHtml);

        $coverHtml = extract_main_content($entireCoverHtml);

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

    $entireContent = extract_images($entireContent);

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

    $content = extract_main_content($entireContent);

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

function extract_images($content)
{
    global $siteRootPath;

    $matches = array();
    preg_match_all('/<img[^>]+src="[^"]+"[^>\/]+[\/]?>/i', $content, $matches);
    foreach ($matches[0] as $match) {
        $urls = array();
        preg_match_all('/src="([^"]+)"/i', $match, $urls);
        foreach ($urls[1] as $imageUrl) {
            $image = getFile($imageUrl);
            $imageInfo = parse_url($imageUrl);
            if (!file_exists($siteRootPath.dirname($imageInfo['path']))) {
                mkdir($siteRootPath.dirname($imageInfo['path']), 0755, true);
            }
            file_put_contents($siteRootPath.$imageInfo['path'], $image);
            $content = str_replace($imageUrl, $imageInfo['path'], $content);
        }
    }
    $result = $content;

    return $result;
}

function extract_main_content($content)
{
    $matches = array();
    preg_match('/<main[^>]+>(.*)<\/main>/s', $content, $matches);
    $result = $matches[0];

    return $result;
}
