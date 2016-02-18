<?php ?>
<div class="section">		
	<ul id="users" class="users-admin">
		
	</ul>
	<div class="button question-all-user right">
		<a href="javascript:void(0)">Criar a mesma pergunta para todos os pacientes</a>
	</div>
</div>

<!-- JavaScript -->
<script type="text/javascript" >
	saveScreenOpen("Index");
	getUsersDependents();

	_timer = setInterval(function() 
	{
		getNotifications();
	}, 5000);//30000);

	if(!$("#user-current").hasClass("hidden"))		
		$("#user-current").addClass("hidden");
</script>
