<?php ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>day2day</title>
	<link rel="shortcut icon" href="css/images/favicon.ico">
	<link href='https://fonts.googleapis.com/css?family=Roboto:100,300,500,300italic' rel='stylesheet' type='text/css'>
	<link href="css/reset.css" rel="stylesheet" type="text/css" />		
	<link href="css/jquery-ui.css" rel="stylesheet" type="text/css" />
	<link href="css/jquery.gridster.css" rel="stylesheet" type="text/css" />	
	<link href="css/general.css" rel="stylesheet" type="text/css" />

	<link href="css/begin.css" rel="stylesheet" type="text/css" />
	<link href="css/header.css" rel="stylesheet" type="text/css" />	
	<link href="css/content.css" rel="stylesheet" type="text/css" />
	<link href="css/footer.css" rel="stylesheet" type="text/css" />
	<!--[if lt IE 9]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->

	<!-- JavaScript Lib -->	
	<script src="js/lib/jquery-2.1.1.js"></script>
	<script src="js/lib/jquery.gridster.js"></script>
	<script src="js/lib/jquery-ui.js"></script>
	<script src="js/lib/web-speech.js"></script>
	<script src="js/lib/d3.js"></script>
	<script src="js/lib/svg-inline.js"></script>
	<script src="js/lib/special-chars.js"></script>
	<script src="js/lib/jquery-rotate.js"></script>
	<!-- JavaScript Graphic -->
	<script src="js/general.js"></script>
	<script src="js/graphic/bar.js"></script>
	<script src="js/graphic/line.js"></script>
	<script src="js/graphic/line-for-scale.js"></script>
	<script src="js/graphic/double-line-for-scale.js"></script>
	<script src="js/graphic/donut.js"></script>
	<script src="js/graphic/gauge.js"></script>
	<script src="js/graphic/double-gauge.js"></script>
	<script src="js/graphic/scatterplot.js"></script>
	<script src="js/graphic/scatterplot-for-scale.js"></script>
	<script src="js/graphic/double-scatterplot-for-scale.js"></script>
	<script src="js/graphic/calendar.js"></script>
	<!-- JavaScript Other -->
	<script src="js/log.js"></script>
	<script src="js/ajax.js"></script>
	<script src="js/functions.js"></script>	
	<script src="js/clicks.js"></script>
</head>

<body>
<div id="preload">
	<div class="loading">
		<img src="images/begin/preloader-center.gif" alt="preloader">
	</div>
</div>
<div id="band" class="band container">
</div>
<div id="header" class="header container hidden">
	<div class="section">		
		<div class="logo left">
			<a href="javascript:void(0)">
				<img src="images/day2day.svg" alt="Day to Day">
			</a>
		</div>
		<div id="user-current" class="user-current hidden left">
			<a href="javascript:void(0)">
				<img class="user">
				<span><span>
			</a>
		</div>	
		<div id="preload-async" class="">
			<span id="process"></span>
			<img src="images/begin/preloader-small.gif" alt="preloader">
		</div>
		<div id="login-current" class="login-current right">	
			<span class="user-name left"></span> 
			<img class="profile left">
		</div>
		
		<div id="login-current-information" class="login-information hidden">
			<div class="arrow-border"></div>
			<div class="arrow"></div>
			<div class="top">
				<img class="profile left">
				<span class="user-name left"></span> 
				<span class="user-type left"></span> 
			</div>
			<div class="bottom button">				
				<a id="logout" class="logout right" href="javascript:void(0)">Sair</a>
				<a id="manage-users" class="manage-users right" href="javascript:void(0)">Gerenciar</a>
			</div>
		</div>
	</div>
</div>