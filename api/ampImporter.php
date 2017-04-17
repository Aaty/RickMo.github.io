<?php
    ini_set("allow_url_fopen", true);

    $siteRootUrl = "https://jangosto.github.io/";
    $coverHtml = '<div id="container cover">';

    $autocoverJson = file_get_contents("http://www.elmundo.es/json/index.json");

    $autocoverArray = json_decode($autocoverJson);

    foreach ($autocoverArray->cts as $contentType) {
        $contentUrl = $contentType->url;
        
        if (urlExists(str_replace(".html", ".json", $contentUrl))) {
            $contentData = getFile(str_replace(".html", ".json", $contentUrl));
            $dataArray = json_decode($contentData);

            $coverHtml .= '<article class="newsItem">';
            $ampContent = generateAmpContent($dataArray);
            
            $coverHtml .= '<button class="read-later" id="read-later-'.$dataArray->id.'">Leer Más Tarde</button></article>';

            file_put_contents("./contents/".$dataArray->id.".html", $ampContent);
        }
    }

    $coverHtml .= '</div>';

    file_put_contents("./contents/index.html", $coverHtml);


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

function generateAmpContent($data)
{
    global $siteRootUrl, $coverHtml;

    $content = file_get_contents("./ampPrototype.html");

    if (isset($data->cintillo)) {
        $content = str_replace('[[[---PRETITLE---]]]', $data->cintillo, $content);
        $coverHtml .= '<h2 class="kicker">'.$data->cintillo.'</h2>';
    }
    if (isset($data->titulo)) {
        $content = str_replace('[[[---TITLE---]]]', $data->titulo, $content);
        $coverHtml .= '<h1 class="headline"><a class="new-url" href="'.str_replace('http://www.elmundo.es/', $siteRootUrl, $data->url).'">'.$data->titulo.'</a></h1>';
    }
    if (isset($data->multimedia) && count($data->multimedia) > 0) {
        foreach ($data->multimedia as $multimediaItem) {
            if (isset($multimediaItem->position) && $multimediaItem->position != '') {
                if ($multimediaItem->type == 'image') {
                    $imageExtension = pathinfo($multimediaItem->url)['extension'];
                    $imageFile = getFile(str_replace("http://e00-marca.uecdn.es/", "http://estaticos.elmundo.es/",$multimediaItem->url));
                    file_put_contents('./contents/images/'.$multimediaItem->id.'.'.$imageExtension, $imageFile);
                    $content = str_replace('[[[---PRIMARY_IMAGE_URL---]]]', $siteRootUrl.'api/contents/images/'.$multimediaItem->id.'.'.$imageExtension, $content);
                    $content = str_replace('[[[---PRIMARY_IMAGE_HEIGHT---]]]', $multimediaItem->height, $content);
                    $content = str_replace('[[[---PRIMARY_IMAGE_WIDTH---]]]', $multimediaItem->width, $content);

                    $coverImageWidth = "200";
                    $coverHtml .= '<figure class="multimedia-item main" itemprop="image">';
                    $coverHtml .= '<amp-img class="image" layout="responsive" src="'.$siteRootUrl.'api/contents/images/'.$multimediaItem->id.'.'.$imageExtension.'" height="'.$coverImageWidth*$multimediaItem->height/$multimediaItem->width.'" width="'.$coverImageWidth.'">';
                    $coverHtml .= '</figure>';
                }
                if ($multimediaItem->type == 'video') {
                    $content = str_replace('[[[---PRIMARY_IMAGE_URL---]]]', "https://v.uecdn.es/p/108/thumbnail/entry_id/".$multimediaItem->id."/width/600/", $content);
                    $content = str_replace('[[[---PRIMARY_IMAGE_HEIGHT---]]]', '', $content);
                    $content = str_replace('[[[---PRIMARY_IMAGE_WIDTH---]]]', '100%', $content);
                }
                if (isset($multimediaItem->titulo)) {
                    $content = str_replace('[[[---PRIMARY_IMAGE_CAPTION---]]]', $multimediaItem->titulo, $content);
                }
            }
        }
    }
    if (isset($data->firmas[0])) {
        if (isset($data->firmas[0]->name)) {
            $content = str_replace('[[[---AUTHOR_NAME---]]]', $data->firmas[0]->name, $content);
        }
        if (isset($data->firmas[0]->location)) {
            $content = str_replace('[[[---AUTHOR_PLACE---]]]', $data->firmas[0]->location, $content);
        }
    }
    $content = str_replace('[[[---UPDATED_DATE---]]]', $data->publishedAt, $content);
    if (isset($data->texto)) {
        $matches = array();
        preg_match('/<img[^>]+src="([^>"]+)"[^>]*>/i', $data->texto, $matches);
        $content = str_replace('[[[---CONTENT_PART_2---]]]', $data->texto, $content);
    }

    $content = str_replace("[[[---URL---]]]", "[[[...URL...]]]", $content);
    $content = preg_replace("/\[\[\[\-\-\-[^\-\]]+\-\-\-\]\]\]/i", "", $content);
    $content = str_replace("[[[...URL...]]]", "[[[---URL---]]]",  $content);

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
