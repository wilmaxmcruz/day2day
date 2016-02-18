/***************************************************************/
/***************************        ****************************/
/*************************** Clicks ****************************/
/***************************        ****************************/
/***************************************************************/

$(document).on("click", "#enter", function()
{
	login($("#login").val(), $("#password").val(), 'true');
});

$(document).on("click", ".logo > a", function()
{
	$.post(
		"php/" + _loginCurrent.type + "/index.php",
		function(data)
		{
			clearInterval(_timer);
			_timer = null;
			_reportActive = false;
			_messageActive = false;

			$("#content").html(data);
			$("#band").css("backgroundColor", _colorBand['basic']);
		}
	);
});

$(document).on("click", "#logout", function()
{
	_timeStamp['systemEnd'] = $.now();

	var type = "timeSystem";
	var record = JSON.stringify(
	{
		id: _loginCurrent.id,
		timeSystemStart: _timeStamp['systemStart'],
		timeSystemEnd: _timeStamp['systemEnd']
	});

	$.post(
		"php/functions/logout.php",
		function(data)
		{
			saveScreenOpen("Report");
			saveLog(type, record);

			clearInterval(_timer);
			_timer = null;
			_reportActive = false;
			_messageActive = false;

			window.document.location.href = './';
		}
	);
});

$(document).on("click", ".checkbox", function()
{
	var current = $(this).hasClass("selected");
	
	if(current)
	{
		$(this).removeClass("selected");	
	}
	else
	{
		$(this).addClass("selected");
	}	
});

$(document).on("click", "#login-current", function()
{			
	$("#login-current-information").removeClass("hidden");
});

$(document).on("click", "*", function()
{
	if($(this).hasClass("login-current"))
	{
		$("#login-current-information").removeClass("hidden");
		return false;
	}
	else
	{
		$("#login-current-information").addClass("hidden");
	}
});

$(document).on("click", "#manage-users", function()
{
	$.post(
		"php/admin/manageUsers.php",
		function(data)
		{
			clearInterval(_timer);
			_timer = null;
			_reportActive = false;
			_messageActive = false;

			$("#content").html(data);	
		}
	);
});

$(document).on("click", ".manage-user .user-type > ul > .type", function()
{	
	$(".manage-user .data-user > div").removeClass("hidden");
	$(".manage-user .user-type > ul > .type").removeClass("selected");

	var image = "./images/profile/" + $(this).attr("data-id") + ".svg";
	$(".photo-user > .photo > img").first().attr("src", image);

	$(this).addClass("selected");

	if($(this).attr("data-id") == "user")
	{
		$(".manage-user .data-user > .function-user").addClass("hidden");
		$(".manage-user .data-user > .login-user").addClass("hidden");
		$(".manage-user .data-user > .password-user").addClass("hidden");
		$(".manage-user .data-user > .re-password-user").addClass("hidden");

		$(".manage-user .data-user > .users-dependents").addClass("hidden");
	}
	else
	{
		htmlListUsersDependentsManage($(this).attr("data-id"));
	}
});

$(document).on("blur", ".manage-user input[type='text']", function()
{	
	if($(this).val() == "")
	{
		$(this).siblings(".instruction").children("span").html("Você não pode deixar este campo em branco.");
		$(this).siblings(".instruction").children("span").removeClass("hidden");
		$(this).parent().addClass("error");
	}
	else
	{
		$(this).siblings(".instruction").children("span").addClass("hidden");
		$(this).parent().removeClass("error");	
	}
});

$(document).on("click", "#list-user > li > a.update", function()
{
	var idUserSelected = $(this).siblings("input[type='hidden']").first().val();
	$("#list-user > li > a").removeClass("selected");
	$(this).addClass("selected");

	$("#list-user > li > a.delete").removeClass("view", 400, "easeInOutQuad");
	$(this).siblings("a.delete").first().addClass("view", 400, "easeInOutQuad");
	
	if(idUserSelected != 0)
	{		
		//Atualizar usuário
		$("#manage-user > .data-user .button > a").removeClass("save").addClass("update").html("Atualizar");		
		updateDataUser(idUserSelected);
	}
});

$(document).on("click", "#list-user > li > a.new", function()
{
	$("#manage-users").trigger("click");
});

$(document).on("click", "#people > li > a", function()
{
	var receiver = $(this).siblings("input[type='hidden']").first().val();

	$("#people > li > a").removeClass("selected");
	$(this).addClass("selected");
	$(this).children("img.unread").first().addClass("hidden");
	
	_messageActive = false;
	getAllMessages(receiver);
});

$(document).on("click", ".users-tutor > li > a.fill", function()
{
	clearInterval(_timer);
	_timer = null;

	$(".user-current > a").addClass("disabled");
	_dateSelected = $("#calendar").datepicker().val();
	var userDependent = $(this).siblings("input[type='hidden']").first().val();
	
	$.post(
		"php/tutor/menu.php",
		{ userDependent: userDependent, dateSelected: _dateSelected },
		function(data)
		{
			$("#content").html(data);
			$("#band").css("backgroundColor", _colorBand['question']);
		}
	);	
});

$(document).on("click", ".users-admin > li > a.statistic, .users-tutor > li > a.statistic", function()
{
	clearInterval(_timer);
	_timer = null;
	
	var userDependent = $(this).siblings("input[type='hidden']").first().val();	
	
	$.post(
		"php/visual/index.php",
		{ userDependent: userDependent },
		function(data)
		{
			$("#content").html(data);
			$("#band").css("backgroundColor", _colorBand['data']);
		}
	);
});

$(document).on("click", ".users-admin > li > a.report, .users-tutor > li > a.report", function()
{
	clearInterval(_timer);
	_timer = null;

	var userDependent = $(this).siblings("input[type='hidden']").first().val();	
	
	$.post(
		"php/report/index.php",
		{ userDependent: userDependent },
		function(data)
		{
			$("#content").html(data);
			$("#band").css("backgroundColor", _colorBand['messege']);
		}
	);
});

$(document).on("click", ".users-admin > li > a.manage-questions", function()
{
	clearInterval(_timer);
	_timer = null;
	
	var userDependent = $(this).siblings("input[type='hidden']").first().val();
	
	$.post(
		"php/admin/manage.php",
		{ userDependent: userDependent, dateSelected: "" },
		function(data)
		{
			$("#content").html(data);
			$("#band").css("backgroundColor", _colorBand['question']);
		}
	);	
});

$(document).on("click", ".question-all-user > a", function()
{
	clearInterval(_timer);
	_timer = null;
	
	var userDependent = 0;
	
	$.post(
		"php/admin/manage.php",
		{ userDependent: userDependent, dateSelected: "" },
		function(data)
		{
			$("#content").html(data);	
			$("#band").css("backgroundColor", _colorBand['question']);		
		}
	);	
});

$(document).on("click", "#report > .script > #send", function()
{
	var receiver = $(".people > li > a.selected").siblings("input[type='hidden']").first().val();
	var message = $("#transcription").val();

	if(receiver != undefined && message != "")
	{
		var sender = _loginCurrent.id;
		var patient = _userCurrent.id;
		
		var report = JSON.stringify(
		{
			sender: sender,
			patient: patient,
			receiver: receiver,
			message: message
		});
		
		saveReport(report);	
	}
});

$(document).on("touchstart mousedown", "#mic", function()
{
	$(".report span.instruction").stop().fadeIn().delay(3500).fadeOut();

	recognizer.start();
	$("#status > span").first().html("Gravando...");
	$("#status > span").addClass("rec");
	$("textarea#transcription").addClass("rec");
});

$(document).on("touchend touchleave mouseup mouseout", "#mic", function()
{
	$(".report span.instruction").stop().fadeOut();

	recognizer.stop();		
	$("#status > span").first().html("Aguardando permissão.");
	$("#status > span").removeClass("rec");
	$("textarea#transcription").removeClass("rec");
});

$(document).on("click", "a.question", function()
{
	$(".user-current > a").removeClass("disabled");
	$("#menu").toggleClass("hidden");
	$("#questions > ul > li.q-" + $(this).attr("ref")).toggleClass("hidden");	
	//updateMarginLeft();
});

$(document).on("click", "a.back-menu, .user-current > a", function()
{
	if ($(this).hasClass("disabled")) return false;
	$("#menu").toggleClass("hidden");	
	$("#questions > ul > li").addClass("hidden");
	$(".user-current > a").addClass("disabled");
	$("span.feedback").css("opacity", "0");
});

$(document).on("click", ".caixas-de-selecao a.answer", function()
{	
	$(this).toggleClass("selected");
	//animeClick($(this));
});

$(document).on("click", ".multipla-escolha a.answer, .escala a.answer", function()
{		
	$(this).parent().siblings().find(".answer.selected").removeClass("selected");
	$(this).toggleClass("selected");
	//animeClick($(this));
});

$(document).on("click", ".escolha-de-uma-lista ul.list > li", function()
{	
	$(this).siblings(".selected").removeClass("selected");
	$(this).toggleClass("selected");
});

$(document).on(
	"click", 
	"li.multipla-escolha > div > a.save, li.caixas-de-selecao > div > a.save, li.escala > div > a.save", 
	function()
	{
		var self = this;
		var idQuestion = $(this).parents(".item").children("input[type='hidden']").first().val();
		var choices = $(this).parents(".item").find(".answer.selected");
		
		$.each(choices, function()
		{
			var choice = $(this).children(".caption").html();

			var questionCurrent = $.grep(_listQuestionCurrent, function(value)
			{
				return value.id == idQuestion;
			}).shift();	

			var answer = JSON.stringify(
			{
				idUser: _loginCurrent.id,
				idQuestion: idQuestion,
				date: _dateSelected,
				choice: choice,
				questionType: lowerCase(questionCurrent.question_type)
			});

			saveAnswer(answer, self);
		});		
	}
);

$(document).on(
	"click", 
	"li.numeral > div > a.save, li.duplo-numeral > div > a.save, li.texto > div > a.save", 
	function()
	{
		var self = this;
		var idQuestion = $(this).parents(".item").children("input[type='hidden']").first().val();
		var valueAnswer = "";
		var opts;
		var rtnA = true;
		var rtnB = true;

		var questionCurrent = $.grep(_listQuestionCurrent, function(value)
		{
			return value.id == idQuestion;
		}).shift();

		$.each(questionCurrent['options'], function(index, option)
		{
			opts = convertStringInObjOption(option['description'].split(";"));
		});

		if($(this).parents("li").hasClass("texto"))
		{
			valueAnswer = $(this).parents("li").find("textarea.free-text").first().val();
		}
		else if($(this).parents("li").hasClass("numeral"))
		{
			valueAnswer = $(this).parents("li").find("input[type='text'].number").first().val();

			if(valueAnswer == "" || valueAnswer < parseFloat(opts['min']) || valueAnswer > parseFloat(opts['max']) || parseFloat(valueAnswer).toString() == "NaN")
			{
				$(this).parents("li").find("input[type='text'].number").addClass("error");
				rtnA = false;
			}
			else
			{
				valueAnswer = parseFloat(valueAnswer);
				$(this).parents("li").find("input[type='text'].number").removeClass("error");
				rtnA = true;
			}
		}
		else if($(this).parents("li").hasClass("duplo-numeral"))
		{
			var valueA = $(this).parents("li").find("input[type='text'].number-a").first().val();
			var valueB = $(this).parents("li").find("input[type='text'].number-b").first().val();

			if(valueA == "" || valueA < parseFloat(opts['min']) || valueA > parseFloat(opts['max']) || parseFloat(valueA).toString() == "NaN")
			{
				$(this).parents("li").find("input[type='text'].number-a").addClass("error");
				rtnA = false;
			}
			else
			{
				$(this).parents("li").find("input[type='text'].number-a").removeClass("error");
				rtnA = true;
			}

			if(valueB == "" || valueB < parseFloat(opts['min']) || valueB > parseFloat(opts['max']) || parseFloat(valueB).toString() == "NaN")
			{
				$(this).parents("li").find("input[type='text'].number-b").addClass("error");
				rtnB = false;
			}
			else
			{
				$(this).parents("li").find("input[type='text'].number-b").removeClass("error");
				rtnB = true;
			}

			valueAnswer = parseFloat(valueA) + "x" + parseFloat(valueB);
		}	

		var answer = JSON.stringify(
		{
			idUser: _loginCurrent.id,
			idQuestion: idQuestion,
			date: _dateSelected,
			choice: valueAnswer,
			questionType: lowerCase(questionCurrent.question_type)
		});

		if(valueAnswer != "" && rtnA && rtnB)
		{
			saveAnswer(answer, self);
		}
	}
);

$(document).on("click", ".popup-answer-text div.close > a", function()
{	
	$(this).parents(".popup-answer-text").first().addClass("hidden");
});

$(document).on("click", "a.graphic-list", function()
{	
	if($(this).siblings(".minimize-graphic").hasClass("minimize"))
		return false;
	
	var popup = $(this).parents("li").children(".popup-graphic").first();
	popup.removeClass("hidden");

	$("*").on("click", closePopup);
});

$(document).on("click", "a.minimize-graphic", function()
{
	var self = this;
	var idQuestion = $(this).parent(".question").siblings("input[type='hidden'].idQuestion").first().val();
	var idGraphic = $(this)
					.parent(".question")
					.siblings(".popup-graphic")
					.children(".selected")
					.children(("input[type='hidden'].idGraphic")).first().val();
	console.log(idQuestion + "," + _loginCurrent.id+ "," + idGraphic)
	if($(this).hasClass("minimize"))
	{
		updateMinimize(idQuestion, _loginCurrent.id, idGraphic, 0);
		$(self).rotate({ angle: 180, animateTo: 0 });
		$(self).removeClass("minimize");
		$(this).parent(".question").siblings("svg").slideDown("slow", "easeInOutQuart");
		$(this).parent(".question").siblings("div.calendar-answers").slideDown("slow", "easeInOutQuart");
	}
	else
	{
		updateMinimize(idQuestion, _loginCurrent.id, idGraphic, 1);	
		$(self).rotate({ angle: 0, animateTo: 180 });
		$(self).addClass("minimize");
		$(this).parents("li").children("svg").slideUp("slow", "easeInOutQuart");
		$(this).parents("li").children("div.calendar-answers").slideUp("slow", "easeInOutQuart");		
	}
});

$(document).on("click", ".popup-graphic > a", function()
{
	$(this).siblings(".selected").removeClass("selected");
	$(this).toggleClass("selected");
	
	var idQuestion = $(this).parent(".popup-graphic").siblings("input[type='hidden'].idQuestion").first().val();	
	var idGraphic = $(this).children("input[type='hidden'].idGraphic").first().val();
	var graphic = $(this).parents("li").children("svg");

	updateGraphic(idQuestion, _loginCurrent.id, idGraphic);

	$.each(_listQuestionCurrent, function(index, value)
	{		
		if(value.id == idQuestion)
		{
			graphic.remove();
			switch (parseInt(idGraphic)) 
			{
				case 1: //Barra					
					createBar(value, true);
					break;

				case 2: //Linha
					createLine(value, true);
					break;

				case 3: //Pizza
					createDonut(value, true);
					break;

				case 4: //Indicador
					createGauge(value, true);
					break;

				case 5: //Dispersão
					createScatterplot(value, true);
					break;

				case 6: //Linha para escala
					createLineForScale(value, true);
					break;

				case 7: //Dispersão para escala
					createScatterplotForScale(value, true);
					break;
			}			
		}
	});
});

/***** ADMIN *****/

$(document).on("click", "ul#icon > li", function()
{	
	if(!$(this).hasClass("selected"))
	{
		$("ul#icon > li").removeClass("selected");	
	}
	$(this).toggleClass("selected");
});

$(document).on("change", "select#question-type", function()
{	
	var optionSelected = $("option:selected", this);
	var classSelected = lowerCase($(optionSelected).attr("ref"));

	$(".question-type > .specification").addClass("hidden");
	$(".question-type > ." + classSelected).removeClass("hidden");
});

$(document).on("click", ".text-field > .field > input[type='text']", function()
{		
	$(this).select();
});

$(document).on("click", ".add-field", function()
{	
	numItens = $(".text-field").children(".field").length;
	var newField = insertHtmlField("", "Opção " + (numItens + 1))
	$(this).parent(".button").siblings(".text-field").append(newField);

	manageButtonDeleteField();
});

$(document).on("click", ".cancel-field", function()
{		
	$(this).parent(".field").remove();	
	manageButtonDeleteField();
});

$(document).on("change", ".range > select", function()
{		
	var optionSelected = $("option:selected", this);
	var classSelected = $(optionSelected).parent("select").attr("class");
	$(".markers > .marker." + classSelected + " > span.number").html(this.value);
});


$(document).on("click", "#list-questions > li > a.new", function()
{	
	$("#list-questions > li > a").removeClass("selected");
	$(this).addClass("selected");

	$("#list-questions > li > a.delete").removeClass("view", 400, "easeInOutQuad");
	
	//Nova pergunta
	$("#manage-question #question-type").prop("disabled", false);
	clearDataQuestion();
	$("#manage-question > .button > a").removeClass("update").addClass("save").html("Salvar");
});

$(document).on("click", "#list-questions > li > a.update", function()
{	
	var idQuestionSelected = $(this).siblings("input[type='hidden']").first().val();
	$("#list-questions > li > a").removeClass("selected");
	$(this).addClass("selected");

	$("#list-questions > li > a.delete").removeClass("view", 400, "easeInOutQuad");
	$(this).siblings("a.delete").first().addClass("view", 400, "easeInOutQuad");
	
	if(idQuestionSelected != 0)
	{		
		//Atualizar pergunta
		$("#manage-question #question-type").prop("disabled", true);		
		updateDataQuestion(idQuestionSelected);
		$("#manage-question > .button > a").removeClass("save").addClass("update").html("Atualizar");
	}
});

$(document).on("click", "#list-questions > li > a.delete", function()
{	
	var idQuestionSelected = $(this).siblings("input[type='hidden']").first().val();
	var titleQuestionSelected = $("#manage-question > .title > input[type='text']").first().val();
	var confirmDelete = confirm("Deseja realmente apagar esta pergunta: '" + titleQuestionSelected + "'?");
	
	if (confirmDelete == true)
	{
		deleteQuestion(idQuestionSelected);	
	}	
});

$(document).on("click", "#manage-question > .button > a", function()
{
	var titleRepeat = false;
	var question = [];
	var options = [];
	var idQuestion = $("#list-questions > li > a.update.selected").first().siblings("input[type='hidden']").first().val();
	var title = $("#manage-question .title > input[type='text']").first().val();
	var query = $("#manage-question .query > textarea").first().val();
	var icon = $("#manage-question #icon > li.selected > input[type='hidden']").first().val();
	var idQuestionType = $("#manage-question #question-type > option:selected").first().val();
	var visible = $("#manage-question .visible > .checkbox").first().hasClass("selected");
	visible = visible == true ? 1 : 0;
		
	var edits = getCheckboxEditAndView("edit");
	var views = getCheckboxEditAndView("view");

	options = mountOptions(idQuestionType);

	question = JSON.stringify(
	{
		id: idQuestion,
		userManager: _loginCurrent.id,
		user: userDependent,
		title: title,
		query: query,
		icon: icon,
		idQuestionType: idQuestionType,
		options: options,
		visible: visible,
		edits: edits,
		views: views
	});

	$.each(_listQuestionCurrent, function(index, question)
	{
		if(question['title'].toLowerCase() == title.toLowerCase() && question['id'] != idQuestion)
		{
			titleRepeat = true;
			return false;
		}
	});
	
	if((title == "") || (query == "") || (icon == undefined))
	{
		alert("Atenção: Verifique se o Título e a Pergunta foram preenchidos, e se o Ícone foi selecionado.");	
	}
	else if(titleRepeat == true)
	{
		alert("Atenção: O 'Título da pergunta' já existe, por favor escolha outro título.");
	}
	else
	{
		if($(this).attr("class") == "save")
		{
			if(userDependent == 0)
			{
				$.each(_listUserCurrent, function(index, user)
				{
					if(user["type"] == "user")
					{
						question = JSON.stringify(
						{
							id: idQuestion,
							userManager: _loginCurrent.id,
							user: user["id"],
							title: title,
							query: query,
							icon: icon,
							idQuestionType: idQuestionType,
							options: options,
							visible: visible,
							edits: edits,
							views: views
						});
						saveQuestion(question, true);
					}
				});				
			}
			else
			{
				saveQuestion(question);
			}
		}
		else if ($(this).attr("class") == "update")
		{
			updateQuestion(question);
		}
	}
});

$(document).on("click", "#manage-user .data-user > .button > a", function()
{//Salva novo ou atualiza dados usuário
	$(".manage-user input[type='text']").trigger("blur");
	var user = [];
	
	var idUser = $(".manage-user").children("input[type='hidden']").first().val();
	var userType = $(".user-type > ul > li.selected").first().attr("data-id");
	var functionUser = $(".function-user").children("input[type='text']").first().val();
	var nameUser = $(".name-user").children("input[type='text']").first().val();
	var loginUser = $(".login-user").children("input[type='text']").first().val();
	var passwordUser = $(".password-user").children("input[type='text']").first().val();
	var photoUser = $(".photo-user").children(".photo").children("img").first().attr("src");

	var userDep = [];
	$.each($("#users-dependents > li.selected"), function()
	{
		userDep.push($(this).children("input[type='hidden']").first().val());
	});

	if(userType == "user")
	{
		functionUser = "Paciente";
		loginUser = null;
		passwordUser = null;
	}

	user = JSON.stringify(
	{
		id: idUser,
		type: userType,
		title: functionUser,
		name: nameUser,
		login: loginUser,
		password: passwordUser,
		photo: photoUser,//"./images/profile/default.svg"
		userDep: userDep
	});
	
	if($(".manage-user").find(".error").not(".hidden").length > 0)
	{
		alert("Erro: Algumas informações não foram preenchidas.");
	}
	else
	{
		if($(this).attr("class") == "save")
		{
			saveUser(user);
		}
		else if ($(this).attr("class") == "update")
		{
			updateUser(user);	
		}
	}
});

$(document).on("click", "#list-user > li > a.delete", function()
{	
	var idUserSelected = $(this).siblings("input[type='hidden']").first().val();
	var userSelected = $(this).attr("data-name");
	var confirmDelete = confirm("Deseja realmente apagar este usuário: '" + userSelected + "'?");
	
	if (confirmDelete == true)
	{
		deleteUser(idUserSelected);
	}	
});

$(document).on("keyup", ".number, .number-a, .number-b, .num > input[type='text']", function () 
{     
	if(!(this.value == ""))
	{
		this.value = this.value.replace(/[^0-9\.\-]/g,'');	
	}
});


/***************
***** LOG ******
***************/

$(document).on("click", "*", function(e)
{
	if(_loginCurrent != null && ($(this).is("a") || $(this).css("cursor") == "pointer"))
	{
		if(!($(this).parent().css("cursor") == "pointer"))
		{
			var type = "clickButtons";
			var record = JSON.stringify(
			{
				id: _loginCurrent.id,
				timeClick: $.now(),
				screenName: _timeStamp['screenName'],
				click: 1
			});
			
			saveLog(type, record);
		}
	}
});
