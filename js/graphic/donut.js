/************************/
/****** Interface *******/
/************************/
function createDonut(data, reload)
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
								"id": config.name + "Graphic",
								"data-row": 1,
								"data-col": 2,
								"data-sizex": 1,
								"data-sizey": 1
							});
		htmlQuestionForGraphics(li, data);
		$("#data.graphics").append(li);
	}

	var donut = new Donut(config.name + "Graphic", config, data);
	donut.render();
	_graphics.push(donut);
}

/********************/
/****** Class *******/
/********************/
function Donut(placeholderName, configuration, data)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	var newData = [];
	
	this.configure = function(configuration)
	{
		this.config = configuration;

		this.config.name = this.config.name;
		
		this.config.width = configuration.width || _graphicSize.width;
		this.config.height = configuration.height || _graphicSize.height;		
		this.config.margin = configuration.margin || (((configuration.width + configuration.height) / 2) * .02) * 4;
		this.config.width = this.config.width - (this.config.margin * 2);

		this.config.radius = configuration.radius || Math.min(this.config.width, this.config.height) / 2.3;
		this.config.cx = (this.config.width + this.config.margin * 2) / 2;
		this.config.cy = (this.config.height + this.config.margin * 2) / 2;
		this.config.transitionDuration = configuration.transitionDuration || 500;

		this.config.color = d3.scale.ordinal().range(_colors);		

		this.config.arc = d3.svg.arc()
							.outerRadius(this.config.radius - 10)
							.innerRadius(this.config.radius - 70);

		this.config.outerArc = d3.svg.arc()
							.innerRadius(this.config.radius * 0.9)
							.outerRadius(this.config.radius * 0.9);

		this.config.pie = d3.layout.pie()
							.sort(null)
							.value(function(d) { return d.amount; });
	}

	this.render = function()
	{
		this.prepare();

		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
								.attr("class", "donutchart")
								.attr("width", this.config.width + (this.config.margin * 2))
								.attr("height", this.config.height + (this.config.margin * 2));

		this.body.append("g")
			.attr("class", "slices")
			.attr("transform", "translate(" + this.config.cx + "," + this.config.cy + ")");
		
		this.body.append("g")
			.attr("class", "labels")
			.attr("transform", "translate(" + this.config.cx + "," + this.config.cy + ")");
		
		this.body.append("g")
			.attr("class", "lines")
			.attr("transform", "translate(" + this.config.cx + "," + this.config.cy + ")");

		var slice = this.body.select(".slices")
			.selectAll("path.slice")
			.data(this.config.pie(newData));	

		slice.enter()
			.insert("path")
			.style("fill", function(d, i) { return self.config.color(d.data.option); })
			.attr("class", "slice");

		slice.transition()
			//.delay(function(d, i) { return i * self.config.transitionDuration; })
			.duration(this.config.transitionDuration)
			.attrTween('d', function(d) 
			{
				var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
				return function(t) 
				{
					d.endAngle = i(t);
					return self.config.arc(d);
				}
			})
			.each(function(d) { this._current = d; });

		slice.exit()
			.remove();

		this.insertLabels(newData);
		this.insertLines(newData);
	}

	this.redraw = function(data)
	{
		var slice = this.body.select(".slices")
			.selectAll("path.slice")
			.data(this.config.pie(data));

		slice.transition()
			.duration(this.config.transitionDuration)
				.attrTween('d', this.arcTween);

		slice.exit()
			.remove();

		this.insertLabels(data);
		this.insertLines(data);
	}

	this.prepare = function()
	{
		data.answers = Object.keys(data.answers).map(function(k){return data.answers[k]});
		data.options = Object.keys(data.options).map(function(k){return data.options[k]});
		
		if(data.answers.length > 0)
		{
			newData = [];
			$.each(data.options, function(i, d) 
			{
				var obj = { option: d.description, amount: 0 };
				newData.push(obj);
			});
			
			$.each(data.answers, function(i, d) 
			{			
				$.each(newData, function(ni, nd)
				{
					if(nd.option == d.choice)
					{					
						nd.amount += 1;
					}
				});
			});
		}
	}

	this.insertLabels = function(data)
	{
		var label = this.body.select(".labels")
			.selectAll("text")
			.data(this.config.pie(data));

		label.enter()
			.append("text")				
				.attr("dy", ".35em")
				.style("text-anchor", "middle")
				.text(function(d) { return d.data.option; });

		label.transition()
			.duration(750)
			.attrTween("transform", function(d) 
			{
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) 
				{
					var d2 = interpolate(t);
					var pos = self.config.outerArc.centroid(d2);
					pos[0] = self.config.radius * (self.midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d) 
			{
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) 
				{
					var d2 = interpolate(t);
					return self.midAngle(d2) < Math.PI ? "start":"end";
				};
			});

		label.exit()
			.remove();
	}

	this.insertLines = function(data)
	{
		var polyline = this.body.select(".lines")
			.selectAll("polyline")
			.data(this.config.pie(data));
	
		polyline.enter()
			.append("polyline");

		polyline.transition()
			.duration(750)
			.attrTween("points", function(d)
			{
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) 
				{
					var d2 = interpolate(t);
					var pos = self.config.outerArc.centroid(d2);
					pos[0] = self.config.radius * 0.95 * (self.midAngle(d2) < Math.PI ? 1 : -1);
					return [self.config.arc.centroid(d2), self.config.outerArc.centroid(d2), pos];
				};			
			});
	
		polyline.exit()
			.remove();
	}

	this.arcTween = function(a) 
	{
		var i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) 
		{
			return self.config.arc(i(t));
		};
	}

	this.midAngle = function(d) 
	{
		return d.startAngle + (d.endAngle - d.startAngle) / 2;
	}

	this.configure(configuration);
}