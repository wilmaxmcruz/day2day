/***************************************************************/
/*****************************      ****************************/
/***************************** Ajax ****************************/
/*****************************      ****************************/
/***************************************************************/

function saveLog(type, record) 
{
	$.ajax(
	{
		/*url: 'php/functions/save/saveLog.php', 
		type: 'POST',
		cache: false,
		data: { session: _idSession.toString(), type: type, record: record },
		error: function(e)
		{
			console.log("ERROR!!!");
		}*/
	});
}

function saveAnswer(answer, btnSave) 
{
	loading("show", "Salvando");
	$.ajax(
	{
		url: 'php/functions/save/saveAnswer.php', 
		type: 'POST',
		cache: false,		
		data: { answer: answer },
		success: function () 
		{			
			$("input[type='text']").val("");
			$("textarea").first().val("");
			$(".options > .subitem > a.answer").removeClass("selected");
			if($("span.feedback").css("opacity") == 0)
			{
				$("span.feedback").animate(
				{
					opacity: 1,
					easing: "easeInOutQuart"
				}, 200).delay(100);
			}
			$("span.feedback").delay(2000).animate(
			{
				opacity: 0,
				easing: "easeInOutQuart"
			}, 200);
			
			var lastAnswer = { date: new Date($.now()) };			
			$(btnSave).siblings(".last-save").html(getButtonSave(lastAnswer, true));

			
		},
		complete: function()
		{
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function deleteAnswer(answer) 
{		
	loading("show", "Apagando");
	$.ajax(
	{
		url: 'php/functions/delete/deleteAnswer.php', 
		type: 'POST',
		cache: false,		
		data: { answer: answer },
		complete: function () 
		{			
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function getQuestionsBy(type, userManager, userDependent, onlyVisible) 
{		
	loading("show", "Carregando");
	$.ajax(
	{
		url: 'php/functions/get/getQuestionsBy.php', 
		type: 'POST',
		cache: false,
		data: { 
			type: type, 
			userManager: 
			userManager, 
			userDependent: userDependent, 
			onlyVisible: onlyVisible,			
			onlyEdit: true,
			onlyView: false
		},
		dataType: 'json',
		success: function(data) 
		{
			_listQuestionCurrent.length = 0;
			$.each(data, function(index, value)
			{
				_listQuestionCurrent.push(value);
			}); 

			switch(_loginCurrent.type)
			{
				case "tutor":
					htmlListQuestions(data);
					htmlInfosQuestions(data);
					break;

				case "admin":
					htmlListQuestionsSimple(data);
					break;
			}
		},
		complete: function () 
		{
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});	
}

function getAllMessages(receiver)
{
	if(_messageActive == false)
	{
		loading("show", "Carregando");
	}
	
	$.ajax(
	{
		url: 'php/functions/get/getAllMessages.php', 
		type: 'POST',
		cache: false,
		dataType: 'json',	
		data: { sender: _loginCurrent.id, patient: _userCurrent.id, receiver: receiver },		
		success: function(data) 
		{			
			htmlListMessages(data);
			_messageActive = true;
		},
		complete: function () 
		{
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function getUsersReports() 
{
	if(_reportActive == false)
	{
		loading("show", "Carregando");
	}

	$.ajax(
	{
		url: 'php/functions/get/getUsersReports.php', 
		type: 'POST',
		cache: false,
		dataType: 'json',	
		data: { user: _loginCurrent.id, type: _loginCurrent.type, patient: _userCurrent.id },		
		success: function(data) 
		{
			htmlListUsersReports(data);
			_reportActive = true;
		},
		complete: function () 
		{
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function getNotifications() 
{
	$.ajax(
	{
		url: 'php/functions/get/getNotifications.php', 
		type: 'POST',
		cache: false,
		dataType: 'json',	
		data: { user: _loginCurrent.id },		
		success: function(data) 
		{
			$.each(data, function(index, value) 
			{
				var inputs = $.grep($("#users > li > input[type='hidden']"), function(input, index)
				{
					return $(input).val() == value["id_patient"];
				});
				
				if(inputs.length > 0)
				{
					$(inputs[0]).siblings("a.report").children("span.unread").removeClass("hidden");
				}
			});
		},
		complete: function () 
		{
			//loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function saveReport(report) 
{
	loading("show", "Salvando");
	$.ajax(
	{
		url: 'php/functions/save/saveReport.php', 
		type: 'POST',
		cache: false,		
		data: { report: report },		
		success: function(data) 
		{	
			$("#transcription").val("");
			_messageActive = false;
			getAllMessages(JSON.parse(report).receiver);
		},
		complete: function () 
		{
			loading("hide");	
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function getUsersDependents() 
{
	loading("show", "Carregando");
	$.ajax(
	{
		url: 'php/functions/get/getUsersDependents.php', 
		type: 'POST',
		cache: false,
		dataType: 'json',
		data: { manager: _loginCurrent.id, type: _loginCurrent.type },
		success: function(data) 
		{
			switch (_loginCurrent.type) 
			{
				case "tutor":
					htmlListUsersDependentsTutor(data);
					break;
				
				case "admin":
					htmlListUsersDependentsAdmin(data);
					break;
			}
		},
		complete: function () 
		{			
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});	
}

function getAllQuestionType() 
{				
	$.ajax(
	{
		url: 'php/functions/get/getAllQuestionType.php', 
		type: 'POST',
		cache: false,
		dataType: 'json',
		success: function(data) 
		{			
			var option = "";
			$.each(data, function(index, value) 
			{
				option += "<option value='" + value['id'] + "' ref='" + value['type'] + "'>" + value['description'] + "</option>";
			});
			$("#question-type").html(option);
		},
		complete: function () 
		{			
			//$("#preload").hide();	
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});	
}

function getAllQuestionsAndAnswers() 
{
	loading("show", "Carregando");
	$.ajax(
	{
		url: 'php/functions/get/getQuestionsBy.php', 
		type: 'POST',
		cache: false,
		data: { 
			type: _loginCurrent.type, 
			userManager: _loginCurrent.id, 
			userDependent: _userCurrent.id, 
			onlyVisible: false,
			onlyEdit: false,
			onlyView: true
		},
		dataType: 'json',
		success: function(data) 
		{
			_listQuestionCurrent.length = 0;
			$.each(data, function(index, value)
			{
				_listQuestionCurrent.push(value);
				switch (parseInt(value.id_graphic)) 
				{
					case 1: //Barra
						createBar(value, false);
						break;

					case 2: //Linha
						createLine(value, false);
						break;

					case 3: //Pizza
						createDonut(value, false);
						break;

					case 4: //Indicador
						createGauge(value, false);
						break;

					case 5: //Dispersão
						createScatterplot(value, false);
						break;

					case 6: //Linha para escala
						createLineForScale(value, false);
						break;

					case 7: //Dispersão para escala
						createScatterplotForScale(value, false);
						break;

					case 8: //Texto
						createCalendarForText(value, false);
						break;
				}
				convertSvgToHtml();
			});

			$("ul.graphics > li .minimize").each(function()
			{
				$(this).parent(".question").siblings("svg").css("display", "none");
				$(this).parent(".question").siblings("div.calendar-answers").css("display", "none");
			});

			if($("ul.graphics > li").length > 0)
			{
				/*$(".gridster ul.graphics").gridster(
				{
					widget_base_dimensions: [430, 402],
					widget_margins: [10, 10],
					helper: 'clone',
					draggable: {
						handle: '.move'
					},
					resize: {
						enabled: false,
						max_size: [1, 1],			
						stop: function (e, ui, $widget)
						{

						}
					}
				});*/
			}
			else
			{
				$("ul.graphics").append("<li>Nenhum resposta foi registrada até o momento.</li>");
			}
		},
		complete: function () 
		{
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});	
}

function getAllIcon() 
{				
	$.ajax(
	{
		url: 'php/functions/get/getAllIcon.php', 
		type: 'POST',
		cache: false,
		dataType: 'json',
		success: function(data) 
		{
			var li = "";
			$.each(data, function(index, value) 
			{
				li += "<li>" +
							"<input type='hidden' value='" + value['id'] + "'>" +
							"<img src='" + value['image'] + "' alt='" + value['description'] + "'>" +
						"</li>";
			});
			$("#icon").html(li);
		},
		complete: function () 
		{			
			//$("#preload").hide();	
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});	
}

function saveQuestion(question, all) 
{
	loading("show", "Salvando");
	$.ajax(
	{
		url: 'php/functions/save/saveQuestion.php', 
		type: 'POST',
		cache: false,		
		data: { question: question },		
		success: function(data) 
		{
			if(all == true)
			{
				$(".logo > a").trigger("click");
			}
			else
			{
				clearDataQuestion();
				getQuestionsBy(_loginCurrent.type, _loginCurrent.id, _userCurrent.id, false);
			}			
		},
		complete: function () 
		{
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function updateQuestion(question) 
{		
	loading("show", "Atualizando");
	$.ajax(
	{
		url: 'php/functions/update/updateQuestion.php', 
		type: 'POST',
		cache: false,		
		data: { question: question },		
		success: function(data) 
		{
			clearDataQuestion();
			$("#manage-question > .button > a").removeClass("update").addClass("save").html("Salvar");
			getQuestionsBy(_loginCurrent.type, _loginCurrent.id, _userCurrent.id, false);
		},
		complete: function () 
		{						
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function deleteQuestion(idQuestion) 
{		
	loading("show", "Apagando");
	$.ajax(
	{
		url: 'php/functions/delete/deleteQuestion.php', 
		type: 'POST',
		cache: false,		
		data: { idQuestion: idQuestion },
		success: function(data) 
		{
			clearDataQuestion();
			$("#manage-question > .button > a").removeClass("update").addClass("save").html("Salvar");
			getQuestionsBy(_loginCurrent.type, _loginCurrent.id, _userCurrent.id, false);
		},
		complete: function () 
		{			
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function updateGraphic(idQuestion, idUser, idGraphic) 
{		
	loading("show", "Atualizando");
	$.ajax(
	{
		url: 'php/functions/update/updateGraphic.php', 
		type: 'POST',
		cache: false,		
		data: { idQuestion: idQuestion, idUser: idUser, idGraphic: idGraphic },		
		success: function(data) 
		{
			
		},
		complete: function () 
		{						
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function updateMinimize(idQuestion, idUser, idGraphic, minimize) 
{		
	loading("show", "Atualizando");
	$.ajax(
	{
		url: 'php/functions/update/updateMinimize.php', 
		type: 'POST',
		cache: false,		
		data: { idQuestion: idQuestion, idUser: idUser, idGraphic: idGraphic, minimize: minimize },		
		success: function(data) 
		{
			
		},
		complete: function () 
		{						
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function getAllUsers() 
{
	loading("show", "Carregando");
	$.ajax(
	{
		url: 'php/functions/get/getAllUsers.php', 
		type: 'POST',
		cache: false,
		dataType: 'json',	
		data: { user: _loginCurrent.id, type: _loginCurrent.type },		
		success: function(data) 
		{
			htmlListAllUsers(data);
			htmlListUsersDependentsManage("tutor");
		},
		complete: function () 
		{
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function saveUser(user) 
{		
	loading("show", "Salvando");
	$.ajax(
	{
		url: 'php/functions/save/saveUser.php', 
		type: 'POST',
		cache: false,		
		data: { user: user },		
		success: function(data) 
		{
			$("#manage-users").trigger("click");
		},
		complete: function () 
		{						
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function updateUser(user) 
{
	loading("show", "Atualizando");
	$.ajax(
	{
		url: 'php/functions/update/updateUser.php', 
		type: 'POST',
		cache: false,		
		data: { user: user },		
		success: function(data) 
		{
			user = $.parseJSON(user);
			if(user["id"] == _loginCurrent["id"])
			{
				window.document.location.href = './';
			}			
		},
		complete: function () 
		{						
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function deleteUser(user) 
{		
	loading("show", "Apagando");
	$.ajax(
	{
		url: 'php/functions/delete/deleteUser.php', 
		type: 'POST',
		cache: false,		
		data: { idUser: user },		
		success: function(data) 
		{
			$("#manage-users").trigger("click");
		},
		complete: function () 
		{						
			loading("hide");
		},
		error: function(e)
		{
			console.log("ERROR!!!");
		}
	});
}

function login(login, password, direct) 
{	
	$("#preload").show();
	$.ajax(
	{				
		url: 'php/functions/login.php', 
		type: 'POST',
		cache: false,
		data: { login: login, password: password, direct: direct },
		dataType: 'json',	
		success: function(result) 
		{
			//console.log(result);
			if(result["id"] != null)
			{
				// Usuário logado!
				_timeStamp['systemStart'] = $.now();				
				_loginCurrent = result;
				$("#login-current > img.profile").attr({ src: _loginCurrent.photo, alt: _loginCurrent.name });
				$("#login-current-information > .top > img.profile").attr({ src: _loginCurrent.photo, alt: _loginCurrent.name });
				$("#login-current > span.user-name").html(_loginCurrent.name);
				$("#login-current-information > .top > span.user-name").html(summary(_loginCurrent.name, 20, "..."));
				$("#login-current-information > .top > span.user-type").html(_loginCurrent.title);
				$("#header").toggleClass("hidden");				

				switch (result["type"]) 
				{
					case "tutor":
						$.post(
							"php/tutor/index.php",
							function(data)
							{
								$("#content").html(data);
							}
						);
						break;
					
					case "admin":
						$.post(
							"php/admin/index.php",
							function(data)
							{		
								$("#content").html(data);
							}
						);
						break;
				}				
			}
			else
			{
				$.post(
					"php/login.php",
					function(data)
					{						
						$("#content").html(data);
						$("#login").val(login);
						$("#password").val(password);
						$("#message").html("Login inválido.");	
					}
				);
				
			}
		},
		complete: function (result) 
		{
			$("#preload").hide();
		},
		error: function(r, s, e)
		{
			console.log("ERROR!!!");
			console.log(r.responseText);
		}
	});		
}