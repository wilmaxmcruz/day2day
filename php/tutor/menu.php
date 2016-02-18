<?php ?>
<div class="section content">		
	<div id="menu">

	</div>
	<div id="questions" class="questions">

	</div>
</div>

<!-- JavaScript -->
<script type="text/javascript" >
	saveScreenOpen("Menu");
	var userDependent = <?php echo json_encode($_POST['userDependent']) ?>;
	$("#user-current").removeClass("hidden");

	getUserCurrentById(userDependent);
	
	$("#user-current > a > img").attr({ src: _userCurrent.photo, alt: _userCurrent.name });
	$("#user-current > a > span").html(_userCurrent.name);
	
	getQuestionsBy(_loginCurrent.type, _loginCurrent.id, _userCurrent.id, true);
</script>