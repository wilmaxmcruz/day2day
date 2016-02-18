<?php ?>
<div class="section content">
	<div class="list-manage left">
		<div>
			<span class="label">Responder a pergunta:</span>
			<ul id="edit-by">
			</ul>
		</div>
		<div>			
			<span class="label">Visualizar a resposta:</span>
			<ul id="view-for">
			</ul>
		</div>
	</div>
	
	<div id="manage-question" class="manage-question left">
			
		
	</div>
	
	<ul id="list-questions" class="list-questions hidden left">

	</ul>
</div>

<!-- JavaScript -->
<script type="text/javascript" >
	saveScreenOpen("Manage");
	mountFormQuestion();	
	var userDependent = <?php echo json_encode($_POST['userDependent']) ?>;

	if(userDependent != 0)
	{
		$("#list-questions").removeClass("hidden");
		$("#user-current").removeClass("hidden");

		getUserCurrentById(userDependent);	
		
		$("#user-current > a > img").attr({ src: _userCurrent.photo, alt: _userCurrent.name });
		$("#user-current > a > span").html(_userCurrent.name);
		
		getQuestionsBy(_loginCurrent.type, _loginCurrent.id, _userCurrent.id, false);
	}

	getEditAndViewUsers();
	getAllQuestionType();
	getAllIcon();
</script>


