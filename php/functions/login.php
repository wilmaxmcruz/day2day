<?php

include 'config.php';
include 'functions.php';

login($_POST['login'], $_POST['password'], $_POST['direct']);

?>