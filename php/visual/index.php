<?php ?>
<div class="section gridster">
	<ul id="data" class="graphics">

	</ul>	
</div>

<!-- JavaScript -->
<script type="text/javascript">	
	saveScreenOpen("Visual");
	var userDependent = <?php echo json_encode($_POST['userDependent']) ?>;
	$("#user-current").removeClass("hidden");

	getUserCurrentById(userDependent);
	
	$("#user-current > a > img").attr({ src: _userCurrent.photo, alt: _userCurrent.name });
	$("#user-current > a > span").html(_userCurrent.name);

	getAllQuestionsAndAnswers();
</script>
