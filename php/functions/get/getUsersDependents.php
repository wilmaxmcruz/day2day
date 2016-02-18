<?php

include '../config.php';
include '../functions.php';

getUsersDependents($_POST['manager'], $_POST['type']);

?>