<?php
ini_set("display_errors", "off");
header("Access-Control-Allow-Origin: *");
header('Content-type: text/javascript; charset=UTF-8');

include 'get_table.php';

// include "info.php";
// die("test");

$req = $_SERVER['REQUEST_URI'];
// echo 'called: ' . $req . PHP_EOL;
$req = explode("/", $req); // splits the request string
// print_r($req);

$db = $req[2]; 
$table = $req[3];
if ( strlen($db) == 0 || !is_string($db) ) {
    onError("Error: No database name provided.");
}
else if ( strlen($table) == 0 || !is_string($table) ) {
    onError("Error: No database name provided.");
}
else {
    $data = getTable($db, $table);
    $data['req'] = $req;
    echo json_encode($data);
}

exit();
?>