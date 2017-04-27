<?php
    $nydusServiceUrl = "http://www.elmundo.es/ue-nydus/nydus.php";
    $data = $_GET['url'];

    $response = getFile($nydusServiceUrl."?content=".$data);

    echo $response;


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

?>
