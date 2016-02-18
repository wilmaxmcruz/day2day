<?php ?>
<div class="section">
	<div id="manage-user" class="manage-user left">
		<input type="hidden" value="">
		<div class="photo-user left">
			<div class="photo">
				<img src="./images/profile/tutor.svg" alt="photo">
			</div>
			<!--<div class="button right">
				<a href="javascript:void(0)" class="change-photo">Trocar foto</a>
			</div>-->
		</div>

		<div class="data-user right">
			<div class="user-type hidden">
				<span class="label">Perfil</span>
				
				<ul>
					<li class="type selected" data-id="tutor">
						<span class="letter">T</span>
						<span class="identification">Tutor(a)</span>
					</li>
					<li class="type" data-id="admin">
						<span class="letter">A</span>
						<span class="identification">Admin</span>
					</li>
					<li class="type" data-id="user">
						<span class="letter">I</span>
						<span class="identification">Idoso(a)</span>
					</li>
				</ul>

				<div class="clear"></div>
			</div>

			<div class="function-user">
				<span class="label">Profissão</span>				
				<input type="text" value="" maxlength="50">
				<div class="instruction">
					<span class="hidden">Você não pode deixar este campo em branco.</span>
				</div>
			</div>
			
			<div class="name-user">
				<span class="label">Nome</span>				
				<input type="text" value="" maxlength="50">
				<div class="instruction">
					<span class="hidden">Você não pode deixar este campo em branco.</span>
				</div>
			</div>
			<div class="login-user">
				<span class="label">Escolha um nome de usuário</span>				
				<input type="text" value="" maxlength="50">
				<div class="instruction">
					<span class="hidden">Você não pode deixar este campo em branco.</span>
				</div>
			</div>
			<div class="password-user">
				<span class="label">Crie uma senha</span>				
				<input type="text" value="" maxlength="50">
				<div class="instruction">
					<span class="hidden">Você não pode deixar este campo em branco.</span>
				</div>
			</div>

			<div class="users-dependents hidden">
				<span class="label">Dependentes</span>
				
				<ul id="users-dependents">
					
				</ul>

				<div class="clear"></div>
			</div>

			<div class="button right">
				<a href="javascript:void(0)" class="save">Salvar</a>
			</div>		
		</div>
	</div>
	<div class="list-user left hidden">
		<div class="title">Lista de Usuários</div>
		<ul id="list-user">
			
		</ul>
	</div>
</div>

<!-- JavaScript -->
<script type="text/javascript" >
	saveScreenOpen("ManageUsers");
	getAllUsers();
	
	if(!$("#user-current").hasClass("hidden"))		
		$("#user-current").addClass("hidden");
	
</script>
