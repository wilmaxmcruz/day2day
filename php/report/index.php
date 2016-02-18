<?php ?>
<div id="report" class="section report">
	<div class="relationship left">
		<ul id="people" class="people">

		</ul>
	</div>	
	<div class="message right">
		<span class="title">Mensagens</span> 
		<ul id="report-saved" class="report-saved">
			
		</ul>
	</div>
	<div class="script right"> 		
		<span class="title">Fale ou escreva a mensangem</span> 
		<!--<span id="status" class="status right">Status: <span>Aguardando permissão.</span></span>-->
		<textarea id="transcription" class="transcription"></textarea> 
		<!--<button id="mic" class="mic right"></button>-->
		<a id="send" class="send right" href="javascript:void(0)">
			<img src="./images/save.svg" alt="send"> 
			<span>Enviar</span>
		</a>
		<span class="instruction right">Mantenha o botão do microfone pressionado para transcrição.</span>
	</div>
</div>

<!-- JavaScript -->
<script type="text/javascript">	
	saveScreenOpen("Report");
	var userDependent = <?php echo json_encode($_POST['userDependent']) ?>;
	$("#user-current").removeClass("hidden");

	getUserCurrentById(userDependent);
	
	$("#user-current > a > img").attr({ src: _userCurrent.photo, alt: _userCurrent.name });
	$("#user-current > a > span").html(_userCurrent.name);

	getUsersReports();	

	_timer = setInterval(function() 
	{
		if(_messageActive == true)
		{
			var receiver = $("#people > li > a.selected").first().siblings("input[type='hidden']").first().val();
			getAllMessages(receiver);
		}

		if(_reportActive == true)
		{
			getUsersReports();
		}
	}, 5000);//30000);

</script>
