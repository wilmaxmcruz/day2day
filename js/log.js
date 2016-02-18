function saveScreenOpen(screenName)
{
	screenName = _loginCurrent.type + screenName;
	if(_timeStamp['screenName'] == null)
	{
		_timeStamp['screenStart'] = $.now();
		_timeStamp['screenName'] = screenName;
		_timeStamp['order'] = parseInt(_timeStamp['order']) + 1;
	}
	else
	{
		_timeStamp['screenEnd'] = $.now();

		var type = "timeScreen";
		var record = JSON.stringify(
		{
			id: _loginCurrent.id,
			timeScreenStart: _timeStamp['screenStart'],
			timeScreeEnd: _timeStamp['screenEnd'],
			screenName: _timeStamp['screenName'],
			order: _timeStamp['order']
		});	

		saveLog(type, record);

		_timeStamp['screenStart'] = $.now();
		_timeStamp['screenName'] = screenName;
		_timeStamp['order'] = parseInt(_timeStamp['order']) + 1;
	}
}