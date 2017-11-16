<?php

if (DB_LOCAL==1) 	{
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', 'TsunamI');
}
else {
    define('DB_HOST', '');
    define('DB_USER', 'root');
    define('DB_PASS', 'root');
}

?>