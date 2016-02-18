/************************/
/****** Interface *******/
/************************/
function createCalendarForText(data, reload)
{
	if(data.answers[0] == undefined)
		return false;
	
	name = removeAccentAndSpace(data.title);
	var config = 
	{
		name: name + data.id.toString()
	}
	
	if(!reload)
	{
		var li = $('<li>', {
								"id": config.name + "Calendar",
								"data-row": 1,
								"data-col": 2,
								"data-sizex": 1,
								"data-sizey": 1
							});
		htmlQuestionForGraphics(li, data);
		$("#data.graphics").append(li);
	}

	var calendar = new Calendar(config.name + "Calendar", config, data);
	calendar.render();
	_graphics.push(calendar);
}

/********************/
/****** Class *******/
/********************/
function Calendar(placeholderName, configuration, data)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	var newData = [];
	
	this.configure = function(configuration)
	{
		this.config = configuration;
		this.config.name = this.config.name || "";
		this.config.parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;		
	}

	this.render = function()
	{
		var arrDates = [];
		$.each(data.answers, function(i, d) 
		{
			arrDates.push(d.date.split(" ")[0]);
			if($.type(d.date) === "string")
				d.date = self.config.parseDate(d.date);
		});

		var lastItem = Object.keys(data.answers).length - 1;
		var dateMin = lastItem > 0 ? data.answers[0].date : 0;
		var dateMax = lastItem > 0 ? data.answers[lastItem].date : 0;
		
		$("#" + self.placeholderName).append("<div class='calendar-answers'></div>");
		$("#" + self.placeholderName + " > .calendar-answers").datepicker(
		{ 
			dateFormat: "dd-mm-yy",
			minDate: dateMin,
			maxDate: dateMax,
			onSelect: function(dateText, inst) 
			{
				var popup = $("#" + self.placeholderName + " > .calendar-answers").children(".popup-answer-text").first();
				popup.removeClass("hidden");
				popup.children("ul.answer").html("");

				$.each(data.answers, function(i, d) 
				{					
					if(dateText == $.datepicker.formatDate('dd-mm-yy', d.date))
					{
						popupAnswerText(d, popup);					
					}
				});
			},
			beforeShowDay: function(date)
			{
				var gotDate = $.inArray($.datepicker.formatDate('dd-mm-yy', date), arrDates);
				if (gotDate >= 0) 
				{
					return [true, "ui-state-highlight"];
				}
				return [false, ""];
			},
			defaultDate: 0
		});

		var subtitle = "<div class='subtitle'>" +
							"<span class='square'></span>" +
							"<span class='text'>Há resposta(s)</span>" +
						"</div>";
		$("#" + self.placeholderName + " > .calendar-answers").append(subtitle);

		var popup = "<div class='popup-answer-text hidden'>" +
						"<div class='close'>" +
							"<a href='javascript:void(0)'>" + 
								"<img src='./images/cancel.svg' alt='Fechar pop-up'>" +
							"</a>" +
						"</div>" +
						"<ul class='answer'></ul>" +					
					"</div>";
		$("#" + self.placeholderName + " > .calendar-answers").append(popup);
	}	

	this.configure(configuration);
}