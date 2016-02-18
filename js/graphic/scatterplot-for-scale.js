/************************/
/****** Interface *******/
/************************/
function createScatterplotForScale(data, reload)
{
	if(data.answers[0] != undefined) 
	{
		var choice = data.answers[0].choice.split("x");
		if(choice.length > 1)
		{
			createDoubleScatterplotForScale(data, reload);
			return false;
		}
	}
	else
	{
		return false;
	}
			
	name = removeAccentAndSpace(data.title);
	var range;
	$.each(data.options, function(i, d) 
	{
		range = convertStringInObjOption(d.description.split(";"));
	});

	var config = 
	{
		name: name + data.id.toString(),
		range: { min: parseInt(range.min), max: parseInt(range.max) }
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

	var scatterplotForScale = new ScatterplotForScale(config.name + "Graphic", config, data);
	scatterplotForScale.render();
	_graphics.push(scatterplotForScale);
}

/********************/
/****** Class *******/
/********************/
function ScatterplotForScale(placeholderName, configuration, data)
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
		this.config.color = d3.scale.ordinal().range(_colors);

		this.config.x = d3.time.scale()
						.range([0, this.config.width]);

		this.config.y = d3.scale.linear()
						.range([this.config.height, 0]);

		this.config.xAxis = d3.svg.axis()
							.scale(this.config.x)
							.orient("bottom");

		this.config.yAxis = d3.svg.axis()
							.scale(this.config.y)
							.orient("left");

		this.config.parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;	
	}

	this.render = function()
	{
		this.prepare();

		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "scatterplotchart")
							.attr("width", this.config.width + (this.config.margin * 2))
							.attr("height", this.config.height + (this.config.margin * 2))
							.append("g")
								.attr("transform", "translate(" + (this.config.margin + (this.config.margin / 4))
								+ "," + this.config.margin + ")");

		this.body.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.config.height + ")")
			.call(self.config.xAxis);

		this.body.append("svg:g")
			.attr("class", "y axis")
			.call(self.config.yAxis)
			.append("text");

		this.body.selectAll(".dot")
			.data(data.answers)
			.enter().append("circle")
				.attr("class", "dot")
				.attr("r", 0)
				.attr("cx", function(d) { return self.config.x(d.date); })
				.attr("cy", function(d) { return self.config.y(d.choice); })
				.style("stroke", "#000000")
				.style("stroke-width", "1px")
				.style("fill", function(d, i) 
				{ 
					return self.config.color(d.choice);
				});

		this.redraw(data);
	}

	this.redraw = function(data)
	{
		this.prepare();

		this.body.selectAll(".dot")
			.data(data.answers)
			.transition()
			.duration(750)
				.attr("r", 8)
				.attr("cx", function(d) { return self.config.x(d.date); })
				.attr("cy", function(d) { return self.config.y(d.choice); });

		this.body.selectAll(".x.axis")
			.transition()
			.duration(750)
			.call(this.config.xAxis); 

		this.body.selectAll(".y.axis")
			.transition()
			.duration(750)
			.call(this.config.yAxis);
	}

	this.prepare = function()
	{
		data.answers = Object.keys(data.answers).map(function(k){return data.answers[k]});
		this.config.range = Object.keys(this.config.range).map(function(k){return self.config.range[k]});

		$.each(data.answers, function(i, d) 
		{
			if($.type(d.date) === "string")
				d.date = self.config.parseDate(d.date);
		});

		this.config.x.domain(d3.extent(data.answers, function(d) { return d.date; })).nice();
		this.config.y.domain(d3.extent(this.config.range, function(d) { return d; }));
	}

	this.configure(configuration);
}