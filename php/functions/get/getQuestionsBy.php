<?php

include '../config.php';
include '../functions.php';

getQuestionsBy($_POST['type'], $_POST['userManager'], $_POST['userDependent'], $_POST['onlyVisible'], $_POST['onlyEdit'], $_POST['onlyView']);

?>