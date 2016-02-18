<?php

include '../config.php';
include '../functions.php';

saveLog($_POST['session'], $_POST['type'], $_POST['record']);

?>