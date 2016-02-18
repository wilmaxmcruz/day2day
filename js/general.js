/* JavaScript Global */
var _reportActive = false;
var _messageActive = false;
var _timer  = null;
var _loginCurrent = null; 
var _userCurrent = null;
var _listAllUser = [];
var _listUserCurrent = [];
var _listQuestionCurrent = [];
var _dateSelected = null;
var _graphics = [];
var _colors = [ "#88DDEB", "#7A8FE3", 
				"#A06DDB", "#D461C5", 
				"#CC566E", "#C5834B", 
				"#ADBD40", "#51B636", 
				"#2DAE68", "#2497A7" ];
var _colorBand = { basic: "#41c6da", question: "#6bd011", data: "#ff7f2a", messege: "#0db3a5" };
var _graphicSize = { width: 900, height: 300 };
var _idSession = null;

var _timeStamp = { 
	systemStart: 0, 
	systemEnd: 0, 
	screenStart: 0, 
	screenEnd: 0, 
	timeClickQuesiton: 0,
	timeClickSave: 0,
	screenName: null,
	order: 0
};

$(function () 
{

});

function lowerCase(text)
{
	text = replaceSpecialChars(text);
	return text.toLowerCase();
}

$(window).keydown(function (e) 
{
	if (e.which === 13 && _loginCurrent === null)
	{
		$("#enter").click();
	}
});

$(window).scroll(function () 
{
	if($("li.item").length > 0)
	{
		$(".option-save").css("top", $(this).scrollTop());	
	}	
});

window.onbeforeunload = function (e) 
{
    var e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) 
    {
        //e.returnValue = 'Atenção!';
    }

    // For Safari
   // return 'Atenção!';
};