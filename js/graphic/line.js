/************************/
/****** Interface *******/
/************************/
function createLine(data, reload)
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

	var line = new Line(config.name + "Graphic", config, data);
	line.render();
	_graphics.push(line);
}

/********************/
/****** Class *******/
/********************/
function Line(placeholderName, configuration, data)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	
	this.configure = function(configuration)
	{
		this.config = configuration;

		this.config.name = this.config.name;
		
		this.config.width = configuration.width || _graphicSize.width;
		this.config.height = configuration.height || _graphicSize.height;
		this.config.margin = configuration.margin || (((configuration.width + configuration.height) / 2) * .02) * 4;
		this.config.width = this.config.width - (this.config.margin * 2);	
		
		this.config.transitionDuration = configuration.transitionDuration || 500;

		this.config.x = d3.time.scale()
						.range([0, this.config.width]);

		this.config.y = d3.scale.ordinal()
						.rangeRoundBands([0, this.config.height], 1);

		this.config.xAxis = d3.svg.axis()
							.scale(this.config.x)
							.orient("bottom");

		this.config.yAxis = d3.svg.axis()
							.scale(this.config.y)
							.orient("left");

		this.config.line = d3.svg.line()
							.x(function(d) { return self.config.x(d.date); })
							.y(function(d) { return self.config.y(d.choice); });

		this.config.area = d3.svg.area()
							.x(function(d) { return self.config.x(d.date); })
							.y0(this.config.height)
							.y1(function(d) { return self.config.y(d.choice); });

		this.config.parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;	
	}

	this.render = function()
	{
		this.prepare();

		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "linechart")
							.attr("width", this.config.width + (this.config.margin * 2))
							.attr("height", this.config.height + (this.config.margin * 2))
							.append("g")
								.attr("transform", "translate(" + (this.config.margin + (this.config.margin / 4)) 
								+ "," + this.config.margin + ")");

		this.body.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.config.height + ")")
			.call(this.config.xAxis);

		this.body.append("svg:g")
			.attr("class", "y axis")
			.call(this.config.yAxis)
			.append("text");

		var lineZero = d3.svg.line()
					.x(function(d) { return self.config.x(d.date); })
					.y(this.config.height);

		var areaZero = d3.svg.area()
					.x(function(d) { return self.config.x(d.date); })
					.y0(this.config.height)
					.y1(this.config.height);

		this.body.append("path")
			.datum(data.answers)
				.attr("class", "area")
				.attr("d", areaZero);

		this.body.append("path")
			.datum(data.answers)
				.attr("class", "line")
				.attr("d", lineZero);

		this.body.selectAll(".dot")
			.data(data.answers)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 5)
				.attr("cx", function(d) { return self.config.x(d.date); })
				.attr("cy", this.config.height);

		this.redraw(data);
	}

	this.redraw = function(data)
	{	
		this.prepare();

		this.body.selectAll("path.area")
			.datum(data.answers)
			.transition()
			.duration(750)
				.attr("class", "area")
				.attr("d", this.config.area);

		this.body.selectAll("path.line")
			.datum(data.answers)
			.transition()
			.duration(750)
				.attr("class", "line")
				.attr("d", this.config.line);

		this.body.selectAll(".x.axis")
			.transition()
			.duration(750)
			.call(this.config.xAxis); 

		this.body.selectAll(".y.axis")
			.transition()
			.duration(750)
			.call(this.config.yAxis);

		this.body.selectAll(".dot")
			.data(data.answers)
			.transition()
			.duration(750)
				.attr("r", 5)
				.attr("cx", function(d) { return self.config.x(d.date); })
				.attr("cy", function(d) { return self.config.y(d.choice); });
	}

	this.prepare = function()
	{
		$.each(data.answers, function(i, d) 
		{
			if($.type(d.date) === "string")
				d.date = self.config.parseDate(d.date);
		});

		data.answers = Object.keys(data.answers).map(function(k){return data.answers[k]});
		data.options = Object.keys(data.options).map(function(k){return data.options[k]});

		this.config.x.domain(d3.extent(data.answers, function(d) { return d.date; }));
		this.config.y.domain(data.options.map(function(d) { return d.description; }));
	}

	this.configure(configuration);
}