<?php

/**
 * Script that returns the json required to implement the continous navigation
 * technology at Unidad Editorial.
 *
 */

$portal = "elmundo";
$publicRootPath = "/home/jangosto/projects/elmundo/pwa/";
$coreExtension = "_nav_content.html";
$numCommentsFileExtension = "_comentarios_numero.html";
$jsonNavExtension = "_nav.json";
$dfpFileExtension = "_nav-cont.php";
$dfpRootPath = "/mnt/filer/html/produccion/datos/include/dfp/$portal/";
$static_path = "/mnt/filer/html/produccion/datos/portales/es/elmundo/www/includes/editorial/";
$cookieName = "ELMUNDO_pref";


/* GET PARAM (eg: content=economia/2015/06/25/558b0d0a46163ff26e8b45a5
              content=deportes/futbol ) */
$pathContent = (isset($_GET['content'])) ? urldecode($_GET['content']) : null;

if (null == $pathContent) {
    echo json_encode(array("error" => "Parameter not provided."));
    exit();
}


//FETCH JSON FILE
//$portalCookie = isset($_COOKIE[$cookieName]) ? json_decode($_COOKIE[$cookieName], true) : null;

/*if (null == $portalCookie) {
    echo json_encode(array("error" => "Invalid cookie format."));
    exit();
}

$pathSuffix = '';
if (isset($portalCookie['d']) && $portalCookie['d'] == 'm') {
    $pathSuffix = '_mobile';
}*/

$pathSuffix = '';

$file = @file_get_contents("$publicRootPath$pathContent$pathSuffix$jsonNavExtension");

if (false === $file) {
    echo json_encode(array("error" => "Navcontent not found."));
    exit();
}

$data = json_decode($file, true);

//REGENERATE REQUIRED VARIABLES
if (isset($data['global-variables'])) {
    foreach ($data['global-variables'] as $name => $value) {
        $$name = $value;
    }
    unset($data['global-variables']);
}

if (null == $data) {
    echo json_encode(array("error" => "Invalid navcontent."));
    exit();
}

//INCLUDE REGISTRO COOKIE
//ob_start();
//include_once($static_path."registro_cookie.php");
//ob_end_clean();

//EVALUATE CONTENT
ob_start();
$contentError = null;
if ((include "$publicRootPath$pathContent$pathSuffix$coreExtension") === false) {
    $contentError = json_encode(array("error" => "Content not found."));
}
$html = \utf8_encode(ob_get_clean());

if (null != $contentError) {
    echo $contentError;
    exit();
}
$data['content'] = str_replace("http://www.elmundo.es/", "/", $html);


//RETRIEVE NUM COMMENTS
$numCommentsFile = "$publicRootPath$pathContent$numCommentsFileExtension";
if (array_key_exists('numComments', $data) && file_exists($numCommentsFile)) {
    $data['numComments'] = @file_get_contents($numCommentsFile);
} else {
    $data['numComments'] = -1;
}


//EVALUATE ADVERTISING CONTENT ($_dfpSection will be defined in the nav_content.html file)
/*$ctType = $data['global']['ct'];
ob_start();
include "$dfpRootPath$_dfpSection"."/"."$ctType$dfpFileExtension";
include $dfpRootPath."banner$dfpFileExtension";
ob_end_clean();

$data['ad']['customTargeting'] = $dfpData['customTargeting'];*/


//PRINT FILLED JSON
header("Content-type: application/json; charset=UTF-8");
echo json_encode($data, JSON_UNESCAPED_UNICODE);
