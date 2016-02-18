<?php

include '../config.php';
include '../functions.php';

getAllMessages($_POST['sender'], $_POST['patient'], $_POST['receiver']);

?>