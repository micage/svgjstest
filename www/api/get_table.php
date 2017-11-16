<?php
define('DB_LOCAL', 1);
include 'db.php';

function onError($err) {
    $ret = array(
        'Error' => $err,
        'GET' => $_GET,
        'POST' => $_POST,
        'REQUEST' => $_REQUEST,
    );

    return $ret;
}

function getTable($db, $table) {
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, $db);

    // Verbindung überprüfen
    if ($mysqli->connect_error) {
        onError($mysqli->connect_error);
    }
    $mysqli->set_charset("utf8");

    // get rows
    $query = "SELECT * FROM $table";
    if ($result = $mysqli->query($query)) {

        $columns = array();
        while ($info = $result->fetch_field()) {
            array_push($columns, $info->name);
        }
        
        $rows = array();    
        while($row = $result->fetch_row()) {
            array_push($rows, $row);
        }

        $ret = array(
            'columns' => $columns,
            'rows' => $rows,
        );
        return $ret;

        $result->close();
    }
    else {
        return onError($mysqli->error);
    }

    // echo $_GET['callback']. '('. json_encode($data) . ')';

    /* close connection */
    $mysqli->close();
}

?>