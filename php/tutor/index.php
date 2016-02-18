<?php ?>
<div class="section">
	<div id="calendar" class="calendar left" >

	</div>	

	<ul id="users" class="users-tutor left">
		
	</ul>
</div>

<!-- JavaScript -->
<script type="text/javascript" >
	saveScreenOpen("Index");
	getUsersDependents();

	_timer = setInterval(function() 
	{
		getNotifications();
	}, 5000);//30000);
	
	$("#calendar").datepicker(
	{ 
		dateFormat: "yy-mm-dd"
	});

	if(_dateSelected != null)
	{
		$('#calendar').datepicker('setDate', _dateSelected);
	}

	if(!$("#user-current").hasClass("hidden"))		
		$("#user-current").addClass("hidden");
</script>
