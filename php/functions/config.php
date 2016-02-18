<?php

header('Content-Type: text/html; charset=utf-8');

//localhost
$infos_conn = array("server" => "localhost", "user" => "root", "password" => "", "dbname" => "dbday2day");

$conn = mysql_connect($infos_conn["server"], $infos_conn["user"], $infos_conn["password"]);
mysql_select_db($infos_conn["dbname"], $conn);

mysql_query("SET NAMES 'utf8'");
mysql_query('SET character_set_connection=utf8');
mysql_query('SET character_set_client=utf8');
mysql_query('SET character_set_results=utf8');

?>
