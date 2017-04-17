<?php
    $contentId = $_GET['id'];

    /*$urlArray = explode('/', $url);
    $fileNameArray = explode('.', $urlArray[count($urlArray) - 1]);
    $contentId = $fileNameArray[0];*/
   
    $response = '';

    if (file_exists('./contents/'.$contentId.'.json')) {
        $data = file_get_contents('./contents/'.$contentId.'.json');
        $dataArray = json_decode($data);

        $response = file_get_contents('./ampPrototype.html');

        $primaryImageUrl = '';
        $primaryImageCaption = '';

        foreach ($dataArray->data->multimedia->items as $multimediaItem) {
            if ($multimediaItem->resource->type == 'imagefile') {
                $imageData = file_get_contents($multimediaItem->resource->url);
                file_put_contents('./contents/images/'.$multimediaItem->resource->id.'.'.$multimediaItem->resource->extension, $imageData);
                if (isset($multimediaItem->resource->position) && $multimediaItem->resource->position == 'Principal') {
                    $primaryImageUrl = "https://franciscosantamaria.me/pwa/juan/api/contents/images/".$multimediaItem->resource->id.'.'.$multimediaItem->resource->extension;
                    $primaryImageCaption = "Image Caption...";
                }
            }
        }

        $response = str_replace(
            array('[[[---PRETITLE---]]]', '[[[---TITLE---]]]', '[[[---PRIMARY_IMAGE_URL---]]]', '[[[---PRIMARY_IMAGE_CAPTION---]]]', '[[[---AUTHOR_NAME---]]]', '[[[---AUTHOR_PLACE---]]]', '[[[---UPDATED_DATE---]]]', '[[[---CONTENT_PART_1---]]]', '[[[---CONTENT_PART_2---]]]'),
            array($dataArray->data->cintillo, $dataArray->data->titulo, $primaryImageUrl, $primaryImageCaption, 'La Firma', 'Firma Place', $dataArray->data->updatedat, '', $dataArray->data->texto),
            $response
        );
    }

    echo $response;
