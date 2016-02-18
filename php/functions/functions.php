<?php 
include "setup.php";
session_start();
//date_default_timezone_set("Europe/Lisbon");
date_default_timezone_set("America/Sao_Paulo");

function saveLog($session, $type, $record)
{
	$sql = "INSERT INTO `log` (`session`, `type`, `record`)
			VALUES ('$session','$type', '$record');";
	$result = mysql_query($sql);

	mysql_close();
}

function saveAnswer($answer)
{		
	$answer = str_replace ('\"','"', $answer);
	$convert = json_decode($answer);
	var_dump($convert);

	$sql = "INSERT INTO `answer` (`id_user`, `id_question`, `date`, `log`, `choice`)
			VALUES ($convert->idUser, 
					$convert->idQuestion, 
					'$convert->date " . date("H:i:s") . "', 
					'" . date("Y-m-d H:i:s") . "', 
					'$convert->choice');";
	$result = mysql_query($sql);
	
	mysql_close();
}

function deleteAnswer($answer)
{	
	$answer = str_replace ('\"','"', $answer);
	$convert = json_decode($answer);
	var_dump($convert);

	$sql = "DELETE FROM `answer`
			WHERE `id` = $convert->idAnswer;";
	$result = mysql_query($sql);

	if(!$result)
	{
		die (mysql_error());
	}

	mysql_close();
}

function saveQuestion($question)
{	
	$question = str_replace ('\"','"', $question);
	$convert = json_decode($question);
	var_dump($convert);

	$sql = "INSERT INTO `question` (`id_user`, `id_question_type`, `id_icon`, `title`, `query`, `visible`)
			VALUES ($convert->user, 
					$convert->idQuestionType, 
					$convert->icon, 
					'$convert->title', 
					'$convert->query', 
					$convert->visible)";
	$result = mysql_query($sql); 
	
	if($result)
	{		
		$id_question = mysql_insert_id();

		//Save options
		$sql = "INSERT INTO `option` (`id_question`, `description`) VALUES";
		foreach ($convert->options as $value) 
		{
			$sql .= " ($id_question, '$value'),";
		}
		$sql = rtrim($sql, ",") . ";";
		$result = mysql_query($sql);

		//Save edits, views and graphics. 
		$graphic = getDefaultGraphic($convert->idQuestionType);			

		$sql = "INSERT INTO `question_manage` (`id_question`, `id_user`, `id_graphic`, `edit`, `view`) 
				VALUES ($id_question, $convert->userManager, $graphic, 1, 1),";

		foreach ($convert->edits as $userEdit) 
		{
			$valueView = 0;
			foreach ($convert->views as $userView) 
			{
				if($userView->id == $userEdit->id)
				{
					$valueView = $userView->value;
				}
			}
			$sql .= " ($id_question, $userEdit->id, $graphic, $userEdit->value, $valueView),";
		}
		$sql = rtrim($sql, ",") . ";";
		$result = mysql_query($sql);
	} 
	else
	{
		die (mysql_error());
	}

	mysql_close();
}

function updateQuestion($question)
{	
	$question = str_replace ('\"','"', $question);
	$convert = json_decode($question);
	var_dump($convert);

	$sql = "UPDATE `question`
			SET `id_question_type` = $convert->idQuestionType, 
				`id_icon` = $convert->icon, 
				`title` = '$convert->title', 
				`query` = '$convert->query', 
				`visible` = $convert->visible
			WHERE `id` = $convert->id";
	$result = mysql_query($sql); 
	
	//Delete all options
	$sql = "DELETE FROM `option`
			WHERE `id_question` = $convert->id;";
	$result = mysql_query($sql);

	if($result)
	{
		//Update (reinsert) options
		$sql = "INSERT INTO `option` (`id_question`, `description`) VALUES";
		
		foreach ($convert->options as $value) {
			$sql .= " ($convert->id, '$value'),";
		}
		$sql = rtrim($sql, ",") . ";";
		$result = mysql_query($sql);

		//Update edits and views.
		foreach ($convert->edits as $user) 
		{
			$sql = "UPDATE `question_manage`
					SET `edit` = $user->value
					WHERE `id_question` = $convert->id
					AND `id_user` = $user->id;";
			$result = mysql_query($sql);
		}

		foreach ($convert->views as $user) 
		{
			$sql = "UPDATE `question_manage`
					SET `view` = $user->value
					WHERE `id_question` = $convert->id
					AND `id_user` = $user->id;";
			$result = mysql_query($sql);
		}		
	}
	else
	{
		die (mysql_error());
	}
	mysql_close();	
}

function deleteQuestion($idQuestion)
{
	$sql = "UPDATE `question`
		SET `enable` = false,	
		`date_enable` = '" . date("Y-m-d H:i:s") . "'
		WHERE `id` = $idQuestion";
	$result = mysql_query($sql);

	if(!$result)
	{
		die (mysql_error());
	}

	mysql_close();
}

function updateGraphic($idQuestion, $idUser, $idGraphic)
{
	$sql = "UPDATE `question_manage`
			SET `id_graphic` = $idGraphic
			WHERE `id_question` = $idQuestion
			AND `id_user` = $idUser;";
	$result = mysql_query($sql);

	if(!$result)
	{
		die (mysql_error());
	}

	mysql_close();
}

function updateMinimize($idQuestion, $idUser, $idGraphic, $minimize)
{
	$sql = "UPDATE `question_manage`
			SET `minimize` = $minimize
			WHERE `id_question` = $idQuestion
			AND `id_graphic` = $idGraphic
			AND `id_user` = $idUser;";
	$result = mysql_query($sql);

	if(!$result)
	{
		die (mysql_error());
	}

	mysql_close();
}

function getDefaultGraphic($idQuestionType)
{
	$graphic = 1;
	switch($idQuestionType)
	{
		case 1: //multipla-escolha
		case 2: //caixas-de-selecao 
			$graphic = 2; //line
		break;

		case 3: //escolha-de-uma-lista
			$graphic = 1; //bar
		break;

		case 4: //escala
			$graphic = 7; //scatterplot-for-scale
		break;

		case 5: //numeral
		case 6: //duplo-numeral
			$graphic = 4; //gauge
		break;

		case 7: //texto
			$graphic = 8; //texto
		break;
	}

	return $graphic;
}

function getQuestionsBy($type, $userManager, $userDependent, $onlyVisible, $onlyEdit, $onlyView)
{
	$questions = new ArrayObject(); 

	$sql = "SELECT `q`.`id`, `q`.`id_user`, `q`.`title`, `q`.`query`, `q`.`visible`,
				   `qt`.`id` AS `id_question_type`, 
				   `qt`.`type` AS `question_type`, 
				   `i`.`id` AS `id_icon`,
				   `i`.`image` AS `icon`,
				   `qm`.`id_graphic`,
				   `qm`.`minimize`
			FROM `question` AS `q`
			INNER JOIN `question_type` AS `qt`			
			ON `q`.`id_question_type` = `qt`.`id`
			INNER JOIN `icon` AS `i`
			ON `q`.`id_icon` = `i`.`id`		
			INNER JOIN `question_manage` AS `qm`	
			ON `q`.`id` = `qm`.`id_question`
			WHERE `q`.`enable` = true
			AND `qm`.`id_user` = $userManager
			AND `q`.`id_user` = $userDependent";

	if($onlyVisible == "true")
	{
		$sql .= " AND `q`.`visible` = true";
	}
	
	if($onlyEdit == "true")
	{
		$sql .= " AND `qm`.`edit` = true";
	}

	if($onlyView == "true")
	{
		$sql .= " AND `qm`.`view` = true";
	}
	
	$result = mysql_query($sql); 

	while($consulta = mysql_fetch_array($result))  
	{
		$question = new stdClass();
		$question->id = $consulta['id'];
		$question->id_user = $consulta['id_user'];
		$question->id_question_type = $consulta['id_question_type'];
		$question->question_type = $consulta['question_type'];
		$question->id_icon = $consulta['id_icon'];
		$question->icon = $consulta['icon'];
		$question->title = $consulta['title'];
		$question->query = $consulta['query'];		
		$question->visible = $consulta['visible'];
		$question->id_graphic = $consulta['id_graphic'];
		$question->minimize = $consulta['minimize'];
		$questions->append($question);
	}

	foreach($questions as $question) 
	{//Options
		$options = new ArrayObject(); 

		$sql = "SELECT * FROM `option`
				WHERE `id_question` = $question->id";	
		$result = mysql_query($sql);
		
		while($consulta = mysql_fetch_array($result))  
		{
			$option = new stdClass();
			$option->id = $consulta['id'];
			$option->id_question = $consulta['id_question'];
			$option->description = $consulta['description'];
			$options->append($option);		
		}
		$question->options = $options;
	}

	foreach($questions as $question) 
	{//Answers
		$answers = new ArrayObject(); 

		$sql = "SELECT * FROM `answer`
				WHERE `id_question` = $question->id
				ORDER BY `date`";	
		$result = mysql_query($sql);
		
		while($consulta = mysql_fetch_array($result))  
		{			
			$answer = new stdClass();
			$answer->id = $consulta['id'];
			$answer->id_question = $consulta['id_question'];
			$answer->date = date_format(date_create($consulta['date']), "d-m-Y H:i:s");
			$answer->choice = $consulta['choice'];
			$answers->append($answer);		
		}
		$question->answers = $answers;
	}

	foreach($questions as $question) 
	{//Edit and View
		$edits = new ArrayObject(); 
		$views = new ArrayObject(); 

		$sql = "SELECT * FROM `question_manage`
				WHERE `id_question` = $question->id";	
		$result = mysql_query($sql);
		
		while($consulta = mysql_fetch_array($result))  
		{
			if($consulta['edit'] == 1)
			{
				$edit = new stdClass();
				$edit->id = $consulta['id'];
				$edit->id_user = $consulta['id_user'];
				$edits->append($edit);
			}
			
			if($consulta['view'] == 1)
			{
				$view = new stdClass();
				$view->id = $consulta['id'];
				$view->id_user = $consulta['id_user'];
				$views->append($view);				
			}					
		}		
		$question->edits = $edits;
		$question->views = $views;
	}

	foreach($questions as $question) 
	{//Graphics
		$graphics = new ArrayObject(); 

		$sql = "SELECT `g`.`id`, `g`.`description`, `g`.`image` 
				FROM `graphic` AS `g`
				INNER JOIN `graphic_manage` AS `gm`
				ON `g`.`id` = `gm`.`id_graphic`
				WHERE `gm`.`id_question_type` = $question->id_question_type";	
		$result = mysql_query($sql);
		
		while($consulta = mysql_fetch_array($result))  
		{
			$graphic = new stdClass();
			$graphic->id = $consulta['id'];
			$graphic->description = $consulta['description'];			
			$graphic->image = $consulta['image'];
			$graphics->append($graphic);		
		}
		$question->graphics = $graphics;
	}

	mysql_free_result($result);
	mysql_close();	
	
	echo json_encode($questions);
}

function getAllMessages($sender, $patient, $receiver)
{
	$messages = new ArrayObject();

	$sql = "UPDATE `report` AS `r`
			SET `r`.`visible` = true
			WHERE `r`.`id_sender` = $receiver
			AND `r`.`id_patient` = $patient
			AND `r`.`id_receiver` = $sender";
	$result = mysql_query($sql); 

	$sql = "SELECT *
			FROM (
				SELECT `r`.`id`, `r`.`message`, `r`.`date`, `r`.`visible`,
					   `u`.`name`, `u`.`photo`
						FROM `report` AS `r`
						INNER JOIN `user` AS `u`
						ON `u`.`id` = `r`.`id_sender`
						WHERE `u`.`enable` = true
						AND `r`.`id_sender` = $sender
						AND `r`.`id_patient` = $patient
						AND `r`.`id_receiver` = $receiver
				UNION
				SELECT `r`.`id`, `r`.`message`, `r`.`date`, `r`.`visible`,
					   `u`.`name`, `u`.`photo`
						FROM `report` AS `r`
						INNER JOIN `user` AS `u`
						ON `u`.`id` = `r`.`id_sender`
						WHERE `u`.`enable` = true
						AND `r`.`id_sender` = $receiver
						AND `r`.`id_patient` = $patient
						AND `r`.`id_receiver` = $sender
			) AS m
			ORDER BY `date`";
	$result = mysql_query($sql);

	while($consulta = mysql_fetch_array($result))  
	{
		$msg = new stdClass();
		$msg->id = $consulta['id'];
		$msg->name = $consulta['name'];
		$msg->photo = $consulta['photo'];
		$msg->message = $consulta['message'];
		$msg->date = date_format(date_create($consulta['date']), "d-m-Y H:i:s");
		$msg->visible = $consulta['visible'];
		$messages->append($msg);
	}	
	mysql_free_result($result);

	mysql_close();		
	echo json_encode($messages);
}

function saveReport($report)
{		
	$report = str_replace ('\"','"', $report);
	$convert = json_decode($report);
	var_dump($convert);

	$sql = "INSERT INTO `report` (`id_sender`, `id_patient`, `id_receiver`, `message`, `date`, `visible`)
			VALUES ($convert->sender, 
					$convert->patient, 
					$convert->receiver, 
					'$convert->message', 
					'" . date("Y-m-d H:i:s") . "', 
					0)";
	$result = mysql_query($sql);

	if(!$result)
	{
		die (mysql_error());
	}

	mysql_close();
}

function getUsersReports($user, $type, $patient)
{
	switch ($type) 
	{
		case "admin":
			getUsersReportsForAdmin($user, $patient);
			break;

		case "tutor":
			getUsersReportsForTutor($user, $patient);
			break;
	}
}

function getUsersReportsForAdmin($manager, $patient)
{
	$usersManagers = new ArrayObject(); 

	$sql = "SELECT DISTINCT	`u`.`id` AS `id_dependent`, 
					`u`.`name`, 
					`u`.`photo`, 
					`ut`.`title`, 
					`ut`.`type`
			FROM `user` AS `u`
			INNER JOIN `user_type` AS `ut`			
			ON `u`.`id_user_type` = `ut`.`id`
			INNER JOIN `user_manage` AS `um`
			ON `u`.`id` = `um`.`id_dependent`
			WHERE `u`.`enable` = true
			AND `um`.`id_manager` = $manager
			AND `um`.`id_dependent` IN
				(SELECT DISTINCT `um`.`id_manager`
				FROM `user_manage` AS `um`
			    WHERE `um`.`id_dependent` = $patient);";
	$result = mysql_query($sql); 

	while($consulta = mysql_fetch_array($result))  
	{
		$user = new stdClass();
		$user->id = $consulta['id_dependent'];
		$user->name = $consulta['name'];
		$user->photo = $consulta['photo'];
		$user->title = $consulta['title'];
		$user->type = $consulta['type'];

		$sqlNotification = "SELECT COUNT(*) AS `count`
					FROM `report` AS `r`
					INNER JOIN `user` AS `u`
					ON `u`.`id` = `r`.`id_sender`
					WHERE `u`.`enable` = true
					AND `r`.`id_sender` = $user->id
					AND `r`.`id_patient` = $patient
					AND `r`.`id_receiver` = $manager
					AND `r`.`visible` = false";

		$resultNotification = mysql_query($sqlNotification);
		$consultaNotification = mysql_fetch_array($resultNotification);
		$user->notification = $consultaNotification["count"];

		$usersManagers->append($user);
	}
	mysql_free_result($result);
	
	mysql_close();		
	echo json_encode($usersManagers);
}

function getUsersReportsForTutor($dependent, $patient)
{
	$usersManagers = new ArrayObject(); 

	$sql = "SELECT DISTINCT	`u`.`id` AS `id_manager`, 
					`u`.`name`, 
					`u`.`photo`, 
					`ut`.`title`, 
					`ut`.`type`
			FROM `user` AS `u`
			INNER JOIN `user_type` AS `ut`			
			ON `u`.`id_user_type` = `ut`.`id`
			INNER JOIN `user_manage` AS `um`
			ON `u`.`id` = `um`.`id_manager`
			WHERE `u`.`enable` = true
			AND `um`.`id_manager` != $dependent
			AND `um`.`id_dependent` = $patient
			OR `um`.`id_manager` = 
				(SELECT DISTINCT `um`.`id_manager`
				FROM `user_manage` AS `um`
			    WHERE `um`.`id_dependent` = $dependent);";
	$result = mysql_query($sql);

	while($consulta = mysql_fetch_array($result))  
	{
		$user = new stdClass();
		$user->id = $consulta['id_manager'];
		$user->name = $consulta['name'];
		$user->photo = $consulta['photo'];
		$user->title = $consulta['title'];
		$user->type = $consulta['type'];

		$sqlNotification = "SELECT COUNT(*) AS `count`
					FROM `report` AS `r`
					INNER JOIN `user` AS `u`
					ON `u`.`id` = `r`.`id_sender`
					WHERE `u`.`enable` = true
					AND `r`.`id_sender` = $user->id
					AND `r`.`id_patient` = $patient
					AND `r`.`id_receiver` = $dependent
					AND `r`.`visible` = false";

		$resultNotification = mysql_query($sqlNotification);
		$consultaNotification = mysql_fetch_array($resultNotification);
		$user->notification = $consultaNotification["count"];

		$usersManagers->append($user);
	}
	mysql_free_result($result);
	
	mysql_close();		
	echo json_encode($usersManagers);
}

function getNotifications($user)
{
	$notifications = new ArrayObject(); 

	$sql = "SELECT `r`.`id_patient`, COUNT(*) AS `count`
			FROM `report` AS `r`
			INNER JOIN `user` AS `u`
			ON `u`.`id` = `r`.`id_sender`
			WHERE `u`.`enable` = true
			AND `r`.`id_receiver` = $user
			AND `r`.`visible` = false
            GROUP BY `r`.`id_patient`";
	$result = mysql_query($sql);

	while($consulta = mysql_fetch_array($result))  
	{
		$notification = new stdClass();
		$notification->id_patient = $consulta['id_patient'];
		$notification->count = $consulta['count'];	
		$notifications->append($notification);
	}
	
	mysql_close();		
	echo json_encode($notifications);
}

function getAllUsers($user, $type)
{
	$usersManagers = new ArrayObject(); 

	$sql = "SELECT `u`.`id`, `u`.`login`, `u`.`password`, `u`.`name`, `u`.`photo`, 
					`ut`.`title`, `ut`.`type`
			FROM `user` AS `u`
			INNER JOIN `user_type` AS `ut`
			ON `u`.`id_user_type` = `ut`.`id`
			WHERE `u`.`enable` = true
			ORDER BY `ut`.`type`;";
	$result = mysql_query($sql); 

	while($consulta = mysql_fetch_array($result))  
	{
		$user = new stdClass();
		$user->id = $consulta['id'];
		$user->login = $consulta['login'];
		$user->password = $consulta['password'];
		$user->name = $consulta['name'];
		$user->photo = $consulta['photo'];
		$user->title = $consulta['title'];
		$user->type = $consulta['type'];

		$usersDependents = new ArrayObject(); 

		$sql = "SELECT `u`.`id` AS `id_dependent`, `u`.`name`, `u`.`photo`, 
					   `ut`.`title`, `ut`.`type`
				FROM `user` AS `u`
				INNER JOIN `user_type` AS `ut`
				ON `u`.`id_user_type` = `ut`.`id`
				INNER JOIN `user_manage` AS `um`
				ON `u`.`id` = `um`.`id_dependent`
				WHERE `u`.`enable` = true
				AND `um`.`id_manager` = " . $consulta['id'] . ";";
		$resultDep = mysql_query($sql); 

		while($consultaDep = mysql_fetch_array($resultDep))  
		{
			$userDep = new stdClass();
			$userDep->id = $consultaDep['id_dependent'];
			$userDep->name = $consultaDep['name'];
			$userDep->photo = $consultaDep['photo'];
			$userDep->title = $consultaDep['title'];
			$userDep->type = $consultaDep['type'];		
			$usersDependents->append($userDep);
		}

		$user->usersDependents = $usersDependents;
		$usersManagers->append($user);
	}
	mysql_free_result($result);
	
	mysql_close();		
	echo json_encode($usersManagers);
}

function saveUser($user)
{	
	$user = str_replace ('\"','"', $user);
	$convert = json_decode($user);
	var_dump($convert);

	$sql = "SELECT *
			FROM `user_type`
			WHERE `type` = '$convert->type' 
			AND `title` = '$convert->title'
			LIMIT 1";
	$result = mysql_query($sql);

	$consulta = mysql_fetch_array($result);
	if($consulta)
	{
		if($convert->login == "" || $convert->password == "")
		{
			$sql = "INSERT INTO `user` (`id_user_type`, `name`, `photo`)
					VALUES (" . $consulta['id'] . ",
							'$convert->name', 
							'$convert->photo')";
		}
		else
		{
			$sql = "INSERT INTO `user` (`id_user_type`, `login`, `password`, `name`, `photo`)
					VALUES (" . $consulta['id'] . ",
							'$convert->login', 
							'$convert->password', 
							'$convert->name', 
							'$convert->photo')";
		}
		
		$result = mysql_query($sql);		
		$idUser = mysql_insert_id();
		echo $sql;

		foreach ($convert->userDep as $ud) 
		{
			$sql = "INSERT INTO `user_manage` (`id_manager`, `id_dependent`)
					VALUES ($idUser,
							$ud)";
			$result = mysql_query($sql);
		}
	}
	else
	{
		$sql  = "INSERT INTO `user_type` (`type`, `title`)
				VALUES ('$convert->type',
						'$convert->title')";
		$result = mysql_query($sql); 
		
		if($result)
		{
			$id_type = mysql_insert_id();
			$sql = "INSERT INTO `user` (`id_user_type`, `login`, `password`, `name`, `photo`)
					VALUES ($id_type,
							'$convert->login', 
							'$convert->password', 
							'$convert->name', 
							'$convert->photo')";
			$result = mysql_query($sql);
			$idUser = mysql_insert_id();
			
			foreach ($convert->userDep as $ud) 
			{
				$sql = "INSERT INTO `user_manage` (`id_manager`, `id_dependent`)
						VALUES ($idUser,
								$ud)";
				$result = mysql_query($sql);
			}
		}
		else
		{
			die (mysql_error());	
		}
	}

	mysql_close();
}

function updateUser($user)
{	
	$user = str_replace ('\"','"', $user);
	$convert = json_decode($user);
	var_dump($convert);

	$sql = "SELECT *
			FROM `user_type`
			WHERE `type` = '$convert->type' 
			AND `title` = '$convert->title'
			LIMIT 1";
	$result = mysql_query($sql);

	$consulta = mysql_fetch_array($result);
	if($consulta)
	{
		$sql = "UPDATE `user` 
				SET `id_user_type` = " . $consulta['id'] . ",
					`login` = '$convert->login', 
					`password` = '$convert->password', 
					`name` = '$convert->name', 
					`photo` = '$convert->photo'
				WHERE `id` = $convert->id";
		$result = mysql_query($sql);

		$sql = "DELETE FROM `user_manage`
				WHERE `id_manager` = $convert->id";
		$result = mysql_query($sql);

		foreach ($convert->userDep as $ud) 
		{
			$sql = "INSERT INTO `user_manage` (`id_manager`, `id_dependent`)
					VALUES ($convert->id,
							$ud)";
			$result = mysql_query($sql);
		}
	}
	else
	{
		$sql  = "INSERT INTO `user_type` (`type`, `title`)
				VALUES ('$convert->type',
						'$convert->title')";
		$result = mysql_query($sql); 
		
		if($result)
		{
			$id_type = mysql_insert_id();
			$sql = "UPDATE `user` 
					SET `id_user_type` = $id_type,
						`login` = '$convert->login', 
						`password` = '$convert->password', 
						`name` = '$convert->name', 
						`photo` = '$convert->photo'
					WHERE `id` = $convert->id";
			$result = mysql_query($sql); 
		}
		else
		{
			die (mysql_error());	
		}
	}

	mysql_close();
}


function deleteUser($idUser)
{	
	$sql = "UPDATE `user`
			SET `enable` = false,	
			`date_enable` = '" . date("Y-m-d H:i:s") . "'
			WHERE `id` = $idUser";
	$result = mysql_query($sql);

	if(!$result)
	{
		die (mysql_error());
	}

	mysql_close();
}

function getUsersDependents($manager, $type)
{
	switch ($type) 
	{
		case "admin":
			getUsersDependentsForAdmin($manager);
			break;

		case "tutor":
			getUsersDependentsForTutor($manager);
			break;
	}
}

function getUsersDependentsForAdmin($manager)
{
	$usersDependents = new ArrayObject(); 

	$sql = "SELECT `u`.`id` AS `id_dependent`, `u`.`name`, `u`.`photo`, 
				   `ut`.`title`, `ut`.`type`
			FROM `user` AS `u`
			INNER JOIN `user_type` AS `ut`
			ON `u`.`id_user_type` = `ut`.`id`
			INNER JOIN `user_manage` AS `um`
			ON `u`.`id` = `um`.`id_dependent`
			WHERE `u`.`enable` = true
			AND `um`.`id_manager` = $manager";
	$result = mysql_query($sql); 

	while($consulta = mysql_fetch_array($result))  
	{
		$user = new stdClass();
		$user->id = $consulta['id_dependent'];
		$user->name = $consulta['name'];
		$user->photo = $consulta['photo'];
		$user->title = $consulta['title'];
		$user->type = $consulta['type'];		
		$usersDependents->append($user);
	}
	mysql_free_result($result);

	foreach($usersDependents as $userDep)
	{
		$usersSecondDependents = new ArrayObject();
		$sql = "SELECT `u`.`id` AS `id_dependent`, `u`.`name`, `u`.`photo`, 
				`ut`.`title`, `ut`.`type`
			FROM `user` AS `u`
			INNER JOIN `user_type` AS `ut`
			ON `u`.`id_user_type` = `ut`.`id`
			INNER JOIN `user_manage` AS `um`
			ON `u`.`id` = `um`.`id_dependent`
			WHERE `u`.`enable` = true
			AND `um`.`id_manager` = $userDep->id";
		$result = mysql_query($sql);

		while($consulta = mysql_fetch_array($result))  
		{
			$user = new stdClass();
			$user->id = $consulta['id_dependent'];
			$user->name = $consulta['name'];
			$user->photo = $consulta['photo'];
			$user->title = $consulta['title'];
			$user->type = $consulta['type'];
			$usersSecondDependents->append($user);
		}
		$userDep->usersDependents = $usersSecondDependents;
		mysql_free_result($result);
	}

	mysql_close();		
	echo json_encode($usersDependents);
}

function getUsersDependentsForTutor($manager)
{
	$usersDependents = new ArrayObject();

	$sql = "SELECT DISTINCT	`u`.`id` AS `id_dependent`, 
					`u`.`name`, 
					`u`.`photo`, 
					`ut`.`title`, 
					`ut`.`type`
			FROM `user` AS `u`
			INNER JOIN `user_type` AS `ut`			
            ON `u`.`id_user_type` = `ut`.`id`
			INNER JOIN `user_manage` AS `um`
            ON `u`.`id` = `um`.`id_dependent`
			WHERE `u`.`enable` = true
            AND `um`.`id_manager` = $manager;";
	$result = mysql_query($sql);

	while($consulta = mysql_fetch_array($result))  
	{
		$user = new stdClass();
		$user->id = $consulta['id_dependent'];
		$user->name = $consulta['name'];
		$user->photo = $consulta['photo'];
		$user->title = $consulta['title'];
		$user->type = $consulta['type'];

		$sqlEdit = "SELECT COUNT(`qm`.`id_user`) AS `edit`
					FROM `question_manage` AS `qm`
					INNER JOIN `question` AS `q`
					ON `qm`.`id_question` = `q`.`id`
					WHERE `q`.`enable` = true
					AND `qm`.`edit` = true
					AND `qm`.`id_user` = $manager
					AND `q`.`id_user` = " . $consulta['id_dependent'] . ";";

		$resultEdit = mysql_query($sqlEdit);
		$consultaEdit = mysql_fetch_array($resultEdit);
		$user->edit = $consultaEdit["edit"];

		$sqlView = "SELECT COUNT(`qm`.`id_user`) AS `view`
					FROM `question_manage` AS `qm`
					INNER JOIN `question` AS `q`
					ON `qm`.`id_question` = `q`.`id`
					WHERE `q`.`enable` = true
					AND `qm`.`view` = true
					AND `qm`.`id_user` = $manager
					AND `q`.`id_user` = " . $consulta['id_dependent'] . ";";

		$resultView = mysql_query($sqlView);
		$consultaView = mysql_fetch_array($resultView);
		$user->view = $consultaView["view"];
			
		$usersDependents->append($user);
	}
	mysql_free_result($result);
	mysql_close();		
	
	echo json_encode($usersDependents);
}

function login($login, $password, $direct)
{		
	if($direct == "false")
	{
		$password = descrypt($password);
	}

	$sql = "SELECT `u`.`id`, `u`.`login`, `u`.`name`, `u`.`photo`, `ut`.`type`, `ut`.`title`
			FROM `user` AS `u`
			INNER JOIN `user_type` AS `ut`
			ON `u`.`id_user_type` = `ut`.`id`
			WHERE `u`.`enable` = true
			AND `u`.`login` = '$login'
			AND `u`.`password` = '$password'";
	$result = mysql_query($sql);	

	$user = new stdClass();

	$consulta = mysql_fetch_array($result);
	if($consulta)
	{
		$user->id = $consulta['id'];
		$user->login = $consulta['login'];
		$user->name = $consulta['name'];
		$user->photo = $consulta['photo'];
		$user->type = $consulta['type'];
		$user->title = $consulta['title'];		

		$_SESSION['user_id'] = $user->id;
		$_SESSION['login'] = $login;
		$_SESSION['password'] = $password;

		echo json_encode($user);
	}
	else
	{
		echo json_encode("senha errada");
	}

	mysql_free_result($result); 
	mysql_close();
}

function getAllQuestionType()
{
	$types = new ArrayObject(); 
	$sql = "SELECT * FROM `question_type`";
	$result = mysql_query($sql);

	while($consulta = mysql_fetch_array($result))  
	{
		$type = new stdClass();
		$type->id = $consulta['id'];
		$type->type = $consulta['type'];
		$type->description = $consulta['description'];	
		$types->append($type);
	}

	mysql_free_result($result); 
	mysql_close();	

	echo json_encode($types);
}

function getAllIcon()
{
	$icons = new ArrayObject(); 
	$sql = "SELECT * FROM `icon` ORDER BY `id` DESC";
	$result = mysql_query($sql);

	while($consulta = mysql_fetch_array($result))  
	{
		$icon = new stdClass();
		$icon->id = $consulta['id'];
		$icon->description = $consulta['description'];
		$icon->image = $consulta['image'];
		$icons->append($icon);
	}

	mysql_free_result($result); 
	mysql_close();	

	echo json_encode($icons);
}

?>