// Test browser support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

//caso não suporte esta API DE VOZ
if (window.SpeechRecognition === null) 
{
	$('#ws-unsupported').addClass('hidden');
	$('#mic').attr('style','box-shadow: inset 0 0 20px 100px red;color:#000;');
}
else 
{
	var recognizer = new window.SpeechRecognition();

	recognizer.continuous = true;
	//recognizer.interimResults = true;

	recognizer.onresult = function(event)
	{
		for (var i = event.resultIndex; i < event.results.length; i++) 
		{
			$("#transcription").val($("#transcription").val() + event.results[i][0].transcript + " ");
		}
	}
}