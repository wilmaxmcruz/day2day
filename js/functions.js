/***************************************************************/
/**************************           **************************/
/************************** Functions **************************/
/**************************           **************************/
/***************************************************************/

function htmlQuestionForGraphics(elem, data)
{
	var popup = "<div class='popup-graphic hidden'>";

	$.each(data['graphics'], function(i, g)
	{		
		var strClass = "";
		if(data['id_graphic'] == g['id'])
		{
			strClass = "class='selected'";
		}

		popup += "<a " + strClass + " href='javascript:void(0)'>" +
					"<input class='idGraphic' type='hidden' value= " + g['id'] + ">" + 
					"<span>" + g['description'] + "</span>" +
					"<img src='" + g['image'] + "' alt='" + g['description'] + "'>" +
				"</a>";
	});
				
	popup += "</div>";
	elem.prepend(popup);

	var visible = "";
	if(data["visible"] == "0")
	{
		visible = " not-visible";
	}

	var minimize = "";
	if(data["minimize"] == "1")
	{
		minimize = " minimize";
	}

	div = 	"<input class='idQuestion' type='hidden' value= " + data['id'] + ">" + 
			"<div class='question" + visible + "'>" + 
				"<img class='icon' src='" + data['icon'] + "' alt='" + lowerCase(data['title']) + "'>" +
				"<span class='query'>" + summary(data['query'], 70, "...") + "</span>" +				
				"<a class='graphic-list right' href='javascript:void(0)'>" + 
					"<img class='' src='./images/setting.svg' alt='Type of graphic'>" +
				"</a>" +
				"<a class='minimize-graphic right" + minimize + "' href='javascript:void(0)'>" + 
					"<img class='' src='./images/minimize.svg' alt='Minimize graphic'>" +
				"</a>" +
			"</div>";

	elem.prepend(div);	
}

function htmlListQuestionsSimple(data)
{ //view admin
	var li = "<li>" + 
				"<input type='hidden' value='0'>" + 
				"<a class='new selected' href='javascript:void(0)'>" +					
					"<img src='./images/menu/new-plus.svg' alt='new question'>" +
					"<span>Criar um pergunta</span>" +
				"</a>" +
			"</li>";

	$.each(data, function(index, value)
	{	
		li += "<li>" + 
				"<input type='hidden' value= " + value['id'] + ">" + 
				"<a class='delete' href='javascript:void(0)'>" +
					"<img src='./images/menu/delete-trash.svg' alt='delete question'>" +
				"</a>" +
				"<a class='update' href='javascript:void(0)'>" +					
					"<img src='" + value['icon'] + "' alt='" + lowerCase(value['title']) + "'>" +
					"<span>" + summary(value['title'], 16, "...") + "</span>" +
				"</a>" +				
			"</li>";
	});	

	$("#list-questions").html(li);	
}

function htmlListQuestions(data)
{//view tutor
	var ul = "<ul>";

	$.each(data, function(index, question) 
	{
		var newTitle = removeAccentAndSpace(lowerCase(question['title']));
		var li = "<li class='menu-" + newTitle + "'>" +
					"<a class='question' href='javascript:void(0)' ref='" + newTitle + "'>" +
						"<img src='" + question['icon'] + "' alt='" + question['title'] + "'>" +
						"<span>" + summary(question['title'], 16, "...")  + "</span>" +
					"</a>" +
				"</li>";
		ul += li;
	});

	ul += "</ul>";
	$("#menu").html(ul);

	$("#menu > ul > li").each(function(i)
	{
		if((i + 1) % 5 == 0)
		{
			$(this).css("marginRight", "0");
		}
	});
}

function htmlInfosQuestions(data)
{
	var ul = "<ul>";
	
	$.each(data, function(index, question) 
	{
		var newTitle = removeAccentAndSpace(lowerCase(question['title']));					
		li = "<li class='hidden item q-" + newTitle + " " + lowerCase(question['question_type']) + "'>" +
					"<input type='hidden' value='" + question['id'] + "'>" + 
					"<a class='back-menu right' href='javascript:void(0)'>" +
						"<img src='./images/menu.svg' alt='voltar'>" +
					"</a>" +
					"<span class='query'>" + question['query'] + "</span>";

			li += htmlInfosOptions(question['options'], question['answers'], lowerCase(question['question_type']));
			li += "</li>";
		ul += li;	
	});

	ul += "</ul>";
	$("#questions").html(ul);		
	convertSvgToHtml();
}

function htmlInfosOptions(options, answers, questionType)
{
	var html = "";
	var arrAnswers = [];	
	$.each(answers, function()
	{
		arrAnswers.push(this);
	});
	var lastAnswer = arrAnswers[arrAnswers.length - 1];

	switch (questionType)
	{		
		case "multipla-escolha":
			html += "<ul class='options'>";		
			$.each(options, function(index, option)
			{
				html += "<li class='subitem'>" +
							"<a class='answer' href='javascript:void(0)'>" +
								"<input type='hidden' value=''>" + 
								"<img class='svg' src='./images/radiobutton.svg' alt='" + lowerCase(option['description']) + "' >" +
								"<span class='caption'>" + option['description'] + "</span>" +
							"</a>" + 
						"</li>";
			});			
			html += "</ul>";			
			html += getButtonSave(lastAnswer, false);
			break;

		case "caixas-de-selecao":
			html += "<ul class='options'>";
			$.each(options, function(index, option)
			{
				html += "<li class='subitem'>" +
							"<a class='answer' href='javascript:void(0)'>" +
								"<input type='hidden' value=''>" + 
								"<img class='svg' src='./images/checkbox.svg' alt='" + lowerCase(option['description']) + "' >" +
								"<span class='caption'>" + option['description'] + "</span>" +
							"</a>" + 
						"</li>";
			});
			html += "</ul>";
			html += getButtonSave(lastAnswer, false);
			break;

		case "escolha-de-uma-lista":
			html += "<ul class='list'>";
			$.each(options, function(index, option)
			{
				html += "<li>" +
							"<input type='hidden' value=''>" + 
							"<span class='caption'>" + option['description'] + "</span>" +
						"</li>";
			});
			html += "</ul>";
			break;
		
		case "escala":
			$.each(options, function(index, option)
			{				
				var opts = convertStringInObjOption(option['description'].split(";"));
				console.log()

				html += "<span class='marker min left'>" + summary(opts["markerMin"], 12, "...") + "</span>" +
						"<ul class='options left'>";
						for(var i = parseInt(opts["min"]); i <= parseInt(opts["max"]); i++)
						{
							html += "<li class='subitem' style='margin: 0 " + 390 / parseInt(opts["max"]) + ";'>" +
										"<a class='answer' href='javascript:void(0)'>" +
											"<input type='hidden' value=''>" + 
											"<span class='caption'>" + i + "</span>" +
											"<img class='svg' src='./images/radiobutton.svg' alt='" + i + "' >" +	
										"</a>" + 
									"</li>";
						}
				html += "</ul>" + 
						"<span class='marker max left'>" + summary(opts["markerMax"], 12, "...") + "</span>" +
						getButtonSave(lastAnswer, false);
			});
			break;

		case "numeral":
			var answer = answerText(options, answers);

			html += "<div style='text-align:center;'>" +
						"<input type='hidden' value='" + answer["value"] + "'>" + 
						"<input class='number' type='text' value='" + answer["text"] + "'>";
						$.each(options, function(index, option)
						{
							var opts = convertStringInObjOption(option['description'].split(";"));
							html += "<span class='instruction'>" +
										"Limites de valores entre " + opts["min"] + " e " + opts["max"] + "." +
									"</span>";
						});
			html += "</div>";
			html += getButtonSave(lastAnswer, false);				
			break;

		case "duplo-numeral":
			var answer = answerText(options, answers);

			html += "<div style='text-align:center;'>" +
						"<input type='hidden' value='" + answer["value"] + "'>" + 
						"<input class='number-a' type='text' value='" + answer["text"] + "'>" +
						"<span class='division'>x</span>"+ 
						"<input class='number-b' type='text' value='" + answer["text"] + "'>";
						$.each(options, function(index, option)
						{
							var opts = convertStringInObjOption(option['description'].split(";"));
							html += "<span class='instruction'>" +
										"Limites de valores entre " + 
										opts["min"] + " e " + 
										opts["max"] + ", para ambos os campos." +
									"</span>";
						});
			html += "</div>";
			html += getButtonSave(lastAnswer, false);					
			break;

		case "texto":
			var answer = answerText(options, answers);

			html += "<div style='text-align:center;'>" +
						"<input type='hidden' value='" + answer["value"] + "'>" + 
						"<textarea class='free-text'>" + answer["text"] + "</textarea>" +
					"</div>";
			html += getButtonSave(lastAnswer, false);
			break;
	}
	
	convertSvgToHtml();
	return html;
}

function getButtonSave(lastAnswer, update)
{
	var span = "<span>Não há registro<br/>salvo ainda.</span>";
	if(lastAnswer != undefined)
	{
		var date = convertDateToStringWithHours(lastAnswer['date'], true);
		span = "<img src='./images/last-save.svg' alt='save'><span>Salvo em:</span><br/><span>" + date + "</span>";
	}

	if(update)
	{
		return span;
	}

	var div = "<div class='option-save'>" +
				"<div class='last-save'>" +					
					span +
				"</div>" +
				"<a class='save' href='javascript:void(0)'>" +							
					"<span>Salvar</span>" +						
				"</a>" +						
				"<span class='feedback'>Salvo com sucesso!</span>" +
			"</div>";
	return div;
}

function answerText(options, answers)
{
	var value = "";
	var text = "";
	$.each(answers, function(index, answer)
	{
		var ad = new Date(answer.date).getTime();
		var ds = new Date(_dateSelected).getTime();
		
		$.each(options, function(index, option)
		{
			if(answer.id_question == option.id_question && ad == ds)
			{
				value = answer.id;
				text = answer.choice;
			}
		});
	});

	return { value: value, text: text };
}

function popupAnswerText(answer, popup)
{
	var li = "<li>" +
				"<div class='date'>" + convertDateToStringWithHours(answer["date"], true) + "</div>" +
				"<div class='choice'>" + answer["choice"] + "</div>" +
			"</li>";

	popup.children("ul.answer").append(li);
}

function htmlListMessages(data)
{	
	var li = "";
	$("#report-saved").html(li);
	
	$.each(data, function(i, d)
	{
		li += 	"<li>" +
					"<div class='photo left'>" +
						"<img src='" + d["photo"] + "' alt='" + d["name"] + "'>" +
					"</div>" +				
					"<div class='header-message right'>" +
						"<span class='name left'>" + d["name"] + "</span>" +
						"<span class='date right'>" + convertDateToStringWithHours(d["date"], true) + "</span>" +
					"</div>" +
					"<div class='text right'>" + d["message"] + "</div>" +
				"</li>";				
	});	
	
	$("#report-saved").append(li);

	if(_messageActive != true) 
	{
		$("ul.report-saved").scrollTop($("ul.report-saved").prop("scrollHeight"));	
	}	
}

function htmlListUsersReports(data)
{
	var li = "";	
	var receiver = "";	

	if($("#people > li > a").hasClass("selected")) 
	{
		receiver = $("#people > li > a.selected").first().siblings("input[type='hidden']").first().val();		
	}

	$("#people").html(li);

	$.each(data, function(index, user)
	{
		var hidden = "";
		var selected = "";

		if(parseInt(user["notification"]) <= 0)
		{
			hidden = "hidden";
		}

		if(receiver == user["id"])
		{
			selected = "selected";
		}

		li += 	"<li>" +
					"<input type='hidden' value='" + user["id"] + "'>" + 
					"<a class='" + selected + "' href='javascript:void(0)'>" +						
						"<img class='photo' src='" + user['photo'] + "' alt='" + user['name'] + "'>" +
						"<span class='name'>" + summary(user['name'], 20) + "</span>" +
						"<img class='unread right " + hidden + "' src='./images/unread.svg' alt='Não lida'>" +
					"</a>" +
				"</li>";
	});
	
	$("#people").append(li);
}

function htmlListAllUsers(data)
{
	_listAllUser = [];
	var li = "<li>" + 
				"<input type='hidden' value='0'>" + 
				"<a class='new selected' href='javascript:void(0)'>" +
					"<img src='./images/menu/new-plus.svg' alt='new user'>" +
					"<span>Criar novo usuário</span>" +
				"</a>" +
			"</li>";

	$.each(data, function(index, user)
	{
		_listAllUser.push(user);
		li += "<li>" + 
				"<input type='hidden' value= " + user['id'] + ">" + 
				"<a class='delete' href='javascript:void(0)' data-name='" + user['name'] + "'>" +
					"<img src='./images/menu/delete-trash.svg' alt='delete user'>" +
				"</a>" +
				"<a class='update' href='javascript:void(0)'>" +					
					"<img src='" + user['photo'] + "' alt='" + lowerCase(user['name']) + "'>" +
					"<span class='name'>" + summary(user['name'], 18, "...") + "</span>" +
					"<span class='function'>" + user['title'] + "</span>" +
				"</a>" +				
			"</li>";
	});

	$("#list-user").append(li);

	if(_loginCurrent['type'] == "tutor")
	{		
		$.each($("#list-user > li"), function(index, item)
		{
			var id = $(item).children("input[type='hidden']").first().val();
			if(id == _loginCurrent['id'])
			{
				$(item).children("a.update").first().trigger("click");
				return false;
			}
		});	
	}
	else if(_loginCurrent["type"] == "admin")
	{
		$(".list-user").first().removeClass("hidden");
		$(".data-user > .user-type").first().removeClass("hidden");
		$(".data-user > .users-dependents").first().removeClass("hidden");
	}
}

function htmlListUsersDependentsAdmin(data)
{
	$("#users").empty();
	var li = "";
	_listUserCurrent = [];

	$.each(data, function(index, user) 
	{		
		_listUserCurrent.push(user);	
		$.each(user.usersDependents, function(i, userDeps) 
		{
			var inArray = false;
			$.each(_listUserCurrent, function()
			{
				if(userDeps['id'] == this['id'])
				{
					inArray = true;
				}
			});
			
			if(!inArray)
			{
				_listUserCurrent.push(userDeps);	
				if(userDeps["type"] == "user")
				{				
					li += "<li>" +
							"<input type='hidden' value='" + userDeps['id'] + "'>" +
							"<div>" +									
								"<img class='user' src='" + userDeps['photo'] + "' alt='" + userDeps['name'] + "'>" +
								"<span class='name'>" + summary(userDeps['name'], 20) + "</span>" +
							"</div>" +
							"<a class='manage-questions' href='javascript:void(0)'>" +
								"<img src='./images/manage-question.svg' alt='Question Management'>" +
							"</a>" +
							"<a class='statistic' href='javascript:void(0)'>" +
								"<img src='./images/visualization.svg' alt='Visualization'>" +
							"</a>" +
							"<a class='report' href='javascript:void(0)'>" +
								"<img src='./images/report-audio.svg' alt='Report'>" +
								"<span class='unread hidden'></span>" + 
							"</a>" +

						"</li>";	
				}
			}
		});		
	});

	$("#users").append(li);
	convertSvgToHtml();
	getNotifications();
}

function htmlListUsersDependentsTutor(data)
{
	$("#users").empty();
	var buttons = "";
	var li = "";
	_listUserCurrent = [];

	$.each(data, function(index, user) 
	{
		_listUserCurrent.push(user);
	});

	$.each(_listUserCurrent, function(index, user) 
	{
		buttons = "<a class='report right' href='javascript:void(0)' ref='report'>" +
						"<img src='./images/report-audio.svg' alt='Report'>" +
						"<span class='unread hidden'></span>" + 
					"</a>";

		if(parseInt(user['view']) > 0)
		{
			buttons += "<a class='statistic right' href='javascript:void(0)'>" +
							"<img src='./images/visualization.svg' alt='Visualization'>" +
						"</a>";
		}

		if(parseInt(user['edit']) > 0)
		{
			buttons += "<a class='fill right' href='javascript:void(0)'>" +							
							"<img src='./images/manage-question.svg' alt='Question Management'>" +
						"</a>";
		}

		li += "<li>" +
				"<input type='hidden' value='" + user['id'] + "'>" +
				"<img class='user' src='" + user['photo'] + "' alt='" + user['name'] + "'>" +
				"<span class='name'>" + user['name'] + "</span>" +
				buttons +
			"</li>";
	});

	$("#users").append(li);
	convertSvgToHtml();
	getNotifications();
}

function htmlListUsersDependentsManage(userType)
{
	$("#users-dependents").empty();
	var type = "";

	if(userType == "admin")
	{
		type = "tutor";
	}
	else if(userType == "tutor")
	{
		type = "user";
	}

	$.each(_listAllUser, function(i, u)
	{
		if(u['type'] == type)
		{
			var li = "<li class='checkbox'>" +
						"<input type='hidden' value='" + u['id'] + "'>" +
						"<img src='" + u['photo'] + "' alt='" + u['name'] + "'>" +
						"<span class='name'>" + u['name'] + "</span>" +					
					"</li>";
			$("#users-dependents").append(li);
		}
	});
}

function updateDataUser(idUserSelected)
{
	var user = $.grep(_listAllUser, function(u)
	{
		return u['id'] == idUserSelected;
	}).shift();

	if(_loginCurrent['type'] == "admin")
	{
		$(".manage-user .user-type > ul > .type").each(function()
		{
			if($(this).attr("data-id") == user['type'])
			{
				$(this).trigger("click");
			}
		});
	}
	
	htmlListUsersDependentsManage(user['type']);
	var listIdUsersDep = [];

	$.each(user['usersDependents'], function(i, u)
	{
		listIdUsersDep.push(u['id']);
	});
	
	$("#users-dependents > li").each(function()
	{
		var id = $(this).children("input[type='hidden']").first().val();
		var select = $.grep(listIdUsersDep, function(u)
		{
			return u == id;
		});

		if(select.length > 0)
		{
			$(this).addClass("selected");
		}
	});

	$(".manage-user").children("input[type='hidden']").first().val(user['id']);
	$(".function-user").children("input[type='text']").first().val(user['title']);
	$(".name-user").children("input[type='text']").first().val(user['name']);
	$(".login-user").children("input[type='text']").first().val(user['login']);
	$(".photo-user").children(".photo").children("img").first().attr("src", user['photo']);

	$(".password-user").children("input[type='text']").first().val(user['password']);	
	$(".manage-user input[type='text']").trigger("blur");
	$(".manage-user .data-user > .user-type").addClass("hidden");
	//$(".re-password-user").children("input[type='text']").first().val(user["password"]);
}

function convertStringInObjOption(arrOptions)
{	
	var options = {};
	$.each(arrOptions, function(index, option)
	{
		options[option.split(":")[0]] = option.split(":")[1];
	});

	return options;
}

function animeClick(element)
{
	$(element).children(".svg").stop().animate(
	{
		width: "60px",
		height: "60px",
		easing: "easeInOutQuart"
	}, 200, function()
	{
		$(this).stop().animate(
		{
			width: "45px",
			height: "45px",
			easing: "easeInOutQuart"
		}, 200)
	});
}

function updateMarginLeft()
{	
	$(".questions .item .options").each(function(index, element)
	{
		if($(element).css("margin-left") == "0px")
		{
			var halfWidth = $(element).width()/2;		
			$(element).css({ "margin-left": -halfWidth, "left": "50%" });
		}	
	});
}

function insertHtmlField(id, text) 
{
	var field = "<div class='field'>	" + 
					"<input type='hidden' value='" + id + "'>	" +
					"<input type='text' value='" + text + "'>	" +
					"<a class='cancel-field' href='javascript:void(0)'>	" +
						"<img src='./images/cancel.svg' alt='Cancel field'>	" +
					"</a>	" + 
				"</div>";
	return field;
}

function manageButtonDeleteField()
{	
	if($(".text-field").children(".field").length <= 1)
	{
		$(".text-field").children(".field:first-child").children("a.cancel-field").addClass("hidden");
	}
	else
	{
		$(".text-field").children(".field:first-child").children("a.cancel-field").removeClass("hidden");
	}
}

function updateDataQuestion(idQuestionSelected)
{
	var question = $.grep(_listQuestionCurrent, function(value)
	{
		return value.id == idQuestionSelected;
	}).shift();

	if(question['visible'] == 1)
	{
		$("#manage-question .visible > .checkbox").first().addClass("selected");
	}
	else
	{
		$("#manage-question .visible > .checkbox").first().removeClass("selected");
	}
	
	$("#manage-question .title > input[type='text']").first().val(question['title']);	
	$("#manage-question .query > textarea").first().val(question['query']);
	limitControl($("#manage-question .title > input[type='text']"), 30);
	limitControl($("#manage-question .query > textarea"), 140);
	
	/* icon */
	$("#icon > li").removeClass("selected");
	$("#manage-question #icon > li").each(function()
	{
		if($(this).children("input[type='hidden']").val() == question['id_icon'])
		{
			$(this).addClass("selected");
			$('#icon').stop().animate(
			{
				scrollTop: $("#icon li.selected").position().top - $("#icon li:first").position().top
			}, 400);

			return false;		
		}
	});

	/* question type */	
	$("#manage-question #question-type").val(question['id_question_type']).change();

	/* options */
	clearDataOptions();
	switch(lowerCase(question['question_type']))
	{
		case "multipla-escolha":
		case "caixas-de-selecao": 
		case "escolha-de-uma-lista":
			$(".text-field").empty();			
			$.each(question['options'], function(index, value)
			{
				var newField = insertHtmlField(value['id'], value['description']);
				$(".text-field").append(newField);
			});
			manageButtonDeleteField();
		break;

		case "escala":
			var options = question['options'][0]['description'].split(";");
			var min = options[0].split(":")[1];
			var max = options[1].split(":")[1];
			var markerMin = options[2].split(":")[1];
			var markerMax = options[3].split(":")[1];
			$(".range > .min").val(min).change();
			$(".range > .max").val(max).change();
			$(".markers > .marker.min > input[type='text']").val(markerMin);
			$(".markers > .marker.max > input[type='text']").val(markerMax);
		break;

		case "numeral":
		case "duplo-numeral":
			var options = question['options'][0]['description'].split(";");
			var min = options[0].split(":")[1];
			var max = options[1].split(":")[1];
			$(".numeral > .num.min > input[type='text']").val(min);
			$(".numeral > .num.max > input[type='text']").val(max);
		break;
	}

	/* user edit */
	$("#edit-by > li.checkbox").each(function()
	{
		var self = this;
		var id = $(this).children("input[type='hidden']").first().val();
		$(this).removeClass("selected");

		$.each(question['edits'], function(index, value)
		{			
			if(id == value['id_user'])
			{
				$(self).addClass("selected");
			}
		});
	});

	/* user view */
	$("#view-for > li.checkbox").each(function()
	{
		var self = this;
		var id = $(this).children("input[type='hidden']").first().val();
		$(this).removeClass("selected");

		$.each(question['views'], function(index, value)
		{			
			if(id == value['id_user'])
			{
				$(self).addClass("selected");
			}
		});
	});
}

function clearDataQuestion()
{
	$("#manage-question .visible > .checkbox").first().addClass("selected");
	$("#manage-question .title > input[type='text']").first().val("");
	$("#manage-question .query > textarea").first().val("");
	$("#manage-question #icon > li.selected").removeClass("selected");
	$("#manage-question #question-type").val(1).change();	
	$("#manage-question #question-type").prop( "disabled", false);
	$("#edit-by > li.checkbox").removeClass("selected");
	$("#view-for > li.checkbox").removeClass("selected");
	limitControl($("#manage-question .title > input[type='text']"), 30);
	limitControl($("#manage-question .query > textarea"), 140);

	clearDataOptions();
}

function clearDataOptions()
{
	$(".text-field").empty();
	var newField = insertHtmlField("", "Opção 1");
	$(".text-field").append(newField);

	$(".range > .min").val(0).change();
	$(".range > .max").val(5).change();
	$(".markers > .marker.min > input[type='text']").val("");
	$(".markers > .marker.max > input[type='text']").val("");

	$(".numeral > .num.min > input[type='text']").val("");
	$(".numeral > .num.max > input[type='text']").val("");

	$(".duplo-numeral > .num.min > input[type='text']").val("");
	$(".duplo-numeral > .num.max > input[type='text']").val("");

	manageButtonDeleteField();
}

function mountOptions(questionType)
{
	var options = [];

	if(questionType == 1 || questionType == 2 || questionType == 3)
	{
		/* multipla escolha, caixas de selecao, escolha de uma lista */
		$("#manage-question .question-type .field").each(function(index, field)
		{
			options.push($(field).children("input[type='text']").first().val());
		});
	}
	else if(questionType == 4)
	{
		/* escala */
		var min = $("#manage-question .range > select.min > option:selected").first().val();
		var max = $("#manage-question .range > select.max > option:selected").first().val();	
		var markerMin = $("#manage-question .markers > .marker.min > input[type='text']").first().val();	
		var markerMax = $("#manage-question .markers > .marker.max > input[type='text']").first().val();
		options.push("min:" + min + ";max:" + max + ";markerMin:" + markerMin + ";markerMax:" + markerMax);	
	}
	else if(questionType == 5 || questionType == 6)
	{
		/* numeral, duplo numeral */
		var min = $("#manage-question .num.min > input[type='text']").first().val();
		var max = $("#manage-question .num.max > input[type='text']").first().val();
		options.push("min:" + min + ";max:" + max);	
	}
	else if(questionType == 7)
	{
		/* texto */
		options.push("texto");	
	}

	return options;
}

function getCheckboxEditAndView(type)
{
	var checkbox = [];
	var elem = "";
	switch(type)
	{
		case "edit":
			elem = "#edit-by";
			break;

		case "view":
			elem = "#view-for";
			break;
	}

	$(elem + " > li.checkbox").each(function()
	{
		var id = $(this).children("input[type='hidden']").first().val();
		var value = 0;
		if($(this).hasClass("selected"))
		{
			value = 1;
		}
		checkbox.push({ id: id, value: value });
	});

	return checkbox;
}

function getUserCurrentById(id)
{
	_userCurrent = $.grep(_listUserCurrent, function(value)
	{
		return value['id'] == id;
	}).shift();

}

function getEditAndViewUsers()
{
	$("#edit-by").empty();
	$("#view-for").empty();
	
	$.each(_listUserCurrent, function(index, value) 
	{
		if(value["type"] == "tutor")
		{
			var isDependent = false;
			$.each(value['usersDependents'], function(i, v)
			{
				if(_userCurrent == null)
				{
					isDependent = true;
					return false;
				}
				else (v['id'] == _userCurrent['id'])
				{
					isDependent = true;
					return false;
				}
			});

			if(isDependent)
			{
				var li = "<li class='checkbox'>" +
							"<input type='hidden' value='" + value['id'] + "'>" +
							"<img src='" + value['photo'] + "' alt='" + value['name'] + "'>" +
							"<span class='name'>" + value['name'] + "</span>" +					
						"</li>";

				$("#edit-by").append(li);
				$("#view-for").append(li);
			}				
		}
	});
}

function mountFormQuestion()
{
	var div = 	"<div class='button right'>" +
					"<a href='javascript:void(0)' class='save'>Salvar</a>" +
				"</div>" +
				"<div class='visible'>" +
					"<span class='checkbox selected'>Pergunta visível</span>" +
				"</div>" +
				"<div class='title'>" +
					"<span class='label'>Título da pergunta</span>" +
					"<span class='instruction'>O título suporta no máximo 30 caracteres.</span>" +
					"<span class='limit'>30</span>" +
					"<input type='text' value=''>" +
				"</div>" +
				"<div class='query'>" +
					"<span class='label'>Pergunta</span>" +
					"<span class='instruction'>Tente criar perguntas claras e diretas. Máximo de 140 caracteres.</span>" +
					"<span class='limit'>140</span>" +
					"<textarea></textarea>" +
				"</div>" +
				"<div class='icon'>" +
					"<span class='label'>Ícone</span>" +
					"<span class='instruction'>Escolha um ícone que seja representativo para sua pergunta.</span>" +
					"<ul id='icon'>" +
						
					"</ul>" +
				"</div>" +
				"<div class='question-type'>" +
					"<span class='label'>Tipo de resposta</span>" +
					"<select id='question-type'>" +
						
					"</select>" +
					"<div class='multipla-escolha caixas-de-selecao escolha-de-uma-lista specification'>" +
						"<div class='text-field'>" +
							"<div class='field'>" +
								"<input type='hidden' value=''>" +
								"<input type='text' value='Opção 1'>" +
								"<a class='cancel-field hidden' href='javascript:void(0)'>" +
									"<img src='images/cancel.svg' alt='Cancel field'>" +
								"</a>" +
							"</div>" +
						"</div>" +
						"<div class='button'>" +
							"<a class='add-field' href='javascript:void(0)'>Adicionar nova opção</a>" +
						"</div>" +
					"</div>" +
					"<div class='escala hidden specification'>" +
						"<div class='range'>" +
							"De" +
							"<select class='min'>" +
								"<option value='0'>0</option>" +
								"<option value='1'>1</option>" +
							"</select>" +
							"a" +
							"<select class='max'>" +
								"<option value='2'>2</option>" +
								"<option value='3'>3</option>" +
								"<option value='4'>4</option>" +
								"<option value='5' selected>5</option>" +
								"<option value='6'>6</option>" +
								"<option value='7'>7</option>" +
								"<option value='8'>8</option>" +
								"<option value='9'>9</option>" +
								"<option value='10'>10</option>" +
							"</select>" +
						"</div>" +
						"<div class='markers'>" +
							"<div class='marker min'>" +
								"<span class='number'>0</span>: <input type='text' value=''>" +
								"<span class='instruction'> Marcador (opcional)</span>" +
							"</div>" +
							"<div class='marker max'>" +
								"<span class='number'>5</span>: <input type='text' value=''>" +
								"<span class='instruction'> Marcador (opcional)</span>" +
							"</div>" +
						"</div>" +
					"</div>" +
					"<div class='numeral duplo-numeral hidden specification'>" +
						"<div class='num min'>" +
							"<span>Mínimo: </span><input type='text' value=''>" +
						"</div>" +
						"<div class='num max'>" +
							"<span>Máximo: </span><input type='text' value=''>" +
						"</div>" +
					"</div>" +
				"</div>";

	$("#manage-question").append(div);
}

function loading(view, process)
{
	if(view == "show")
	{
		$("#preload-async > #process").html(process);
		$("#preload-async").stop().animate(
		{
			top: "0",
			easing: "easeInOutQuart"
		}, 300);
	}
	else if(view == "hide")
	{
		$("#preload-async").stop().animate(
		{
			top: "-40px",
			easing: "easeInOutQuart"
		}, 200);
	}
}

function closePopup()
{
	$.each($(".popup-graphic"), function(i, elem) 	
	{
		if(!$(elem).hasClass("hidden"))
		{
			$(elem).addClass("hidden");
		}		
	});
	$("*").off("click", closePopup);
}

function summary(str, cut, end)
{
	if(cut < str.length)
	{
		if(end == undefined)
		{
			end = "";
		}
		return str.substring(0, cut) + end;	
	}
	else
	{
		return str;
	}
}

function convertDateToStringWithHours(date, reduced)
{
	var parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;
	if($.type(date) !== "date")
	{
		date = parseDate(date);
	}
	
	var dayFull = $.datepicker.formatDate('dd-mm-yy', date);
	var hourFull = date.toString().split(" ")[4];

	if(reduced)
	{
		dayFull = $.datepicker.formatDate('dd-mm-y', date);
		dayFull = dayFull.replace(/-/g, "/");
		hourFull = hourFull.substr(0, 5);
	}
	return dayFull + " - " + hourFull;
}

$(document).on("input", "#manage-question > .title > input[type='text']", function()
{
	limitControl(this, 30);
});

$(document).on("input", "#manage-question > .query > textarea", function()
{
	limitControl(this, 140);
});

function limitControl(elem, limit)
{	
	if($(elem).val().length >= limit)
	{
		$(elem).val($(elem).val().substr(0, (limit - 0)));
	}
	$(elem).siblings("span.limit").first().html(limit - $(elem).val().length);
}

function removeAccentAndSpace(strToReplace) 
{
	mapAccents = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
	mapWithoutAccents = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
	mapSpecialCaracters = ".:/=+!?|{}[]()*&%$#@;<>";
	var strWithoutSpecialCaracters = "";
	var strRight = "";
	
	for (var i = 0; i < mapSpecialCaracters.length; i++) 
	{
		strToReplace = strToReplace.replace(mapSpecialCaracters.charAt(i), "-");
	}

	for (var i = 0; i < strToReplace.length; i++) 
	{
		if (mapAccents.indexOf(strToReplace.charAt(i)) != -1) 
		{
			strRight += mapWithoutAccents.substr(mapAccents.search(strToReplace.substr(i, 1)), 1);
		} 
		else 
		{
			strRight += strToReplace.substr(i, 1);
		}
	}

	return strRight.replace(/\s+/g, '').toLowerCase();
}