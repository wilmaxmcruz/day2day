<?php 

	function get_index()
	{		
		$index = file_get_contents('./index.php');
		echo $index;
	}

	function get_header()
	{		
		$header = file_get_contents('./php/header.php');
		echo $header;
	}

	function get_footer()
	{		
		$footer = file_get_contents('./php/footer.php');
		echo $footer;
	}

	function get_login()
	{		
		$login = file_get_contents('./php/login.php');
		echo $login;
	}

	function encrypt($pass)
	{
		$hash = "";	
		$key = "!@#$%ˆ&*!@#$%ˆ&*()!@#$%ˆ&*!@#$%ˆ&*()!@#$%ˆ&*!@#$%ˆ&*()";
		$arrPass = str_split($pass);
		for($i = 0; $i < strlen($pass); $i++)
		{
			$arrPass[$i] = chr(ord($arrPass[$i]) + 5); 
			$hash .= $arrPass[$i] . $key[$i];
		}		

		return strrev($hash);
	}

	function descrypt($pass)
	{
		$hash = "";
		for($i = 0; $i < strlen($pass); $i++)
		{
			if($i % 2 != 0)
			{
				$p = (string)$pass[$i];
				$p = chr(ord($p) - 5); 
				$hash .= $p;
			}			
		}

		return strrev($hash);
	}
?>