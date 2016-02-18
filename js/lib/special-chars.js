var specialChars = [
	{val:"a",let:"áàãâä"},
	{val:"e",let:"éèêë"},
	{val:"i",let:"íìîï"},
	{val:"o",let:"óòõôö"},
	{val:"u",let:"úùûü"},
	{val:"c",let:"ç"},
	{val:"A",let:"ÁÀÃÂÄ"},
	{val:"E",let:"ÉÈÊË"},
	{val:"I",let:"ÍÌÎÏ"},
	{val:"O",let:"ÓÒÕÔÖ"},
	{val:"U",let:"ÚÙÛÜ"},
	{val:"C",let:"Ç"},
	{val:"",let:"?!()"}
];

function replaceSpecialChars(str) 
{
	var $spaceSymbol = '-';
	var regex;
	var returnString = str;	
	for (var i = 0; i < specialChars.length; i++) 
	{
		regex = new RegExp("["+specialChars[i].let+"]", "g");
		returnString = returnString.replace(regex, specialChars[i].val);
		regex = null;
	}
	return returnString.replace(/\s/g,$spaceSymbol);
};