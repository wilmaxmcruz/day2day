<?php 
	session_start(); 
	include './php/functions/setup.php';

	echo "<script type='text/javascript'>";	
	echo "console.log('Versão Atual do PHP: " . phpversion() . "');";
	echo "console.log('Versão Atual do Day2Day: 4.2.0 - 09/12/2015');";
	echo "</script>";	
?>

<?php get_header(); ?>

<div class="container" id="content">
	<?php			
		if (isset($_SESSION['user_id'], $_SESSION['login'], $_SESSION['password'])) 
		{
			echo "<script type='text/javascript'>";
			echo "login('" . $_SESSION['login'] . "', '" . encrypt($_SESSION['password']) . "', 'false');";
			echo "</script>";		
		}
		else
		{
			get_login();
		}
	?>
</div>

<?php get_footer(); ?>

<?php 
	echo "<script type='text/javascript'>";	
	echo "_idSession = '" . session_id() . "';";
	echo "</script>";	
?>