/************************/
/****** Interface *******/
/************************/
function createBar(data, reload)
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

	var bar = new Bar(config.name + "Graphic", config, data);
	bar.render();
	_graphics.push(bar);
}

/********************/
/****** Class *******/
/********************/
function Bar(placeholderName, configuration, data)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	var newData = [];
	
	this.configure = function(configuration)
	{
		this.config = configuration;

		this.config.name = this.config.name || "";;
		
		this.config.width = configuration.width || _graphicSize.width;
		this.config.height = configuration.height || _graphicSize.height;
		this.config.margin = configuration.margin || (((configuration.width + configuration.height) / 2) * .02) * 4;
		this.config.width = this.config.width - (this.config.margin * 2);
		
		this.config.transitionDuration = configuration.transitionDuration || 500;
		this.config.color = d3.scale.ordinal().range(_colors);	

		this.config.x = d3.scale.ordinal()
						.rangeRoundBands([0, this.config.width], .1);

		this.config.y = d3.scale.linear()
						.range([this.config.height, 0]);

		this.config.xAxis = d3.svg.axis()
							.scale(this.config.x)
							.orient("bottom");

		this.config.yAxis = d3.svg.axis()
							.scale(this.config.y)
							.orient("left");
	}

	this.render = function()
	{
		this.prepare();

		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
							.attr("class", "barchart")
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
			.call(this.config.yAxis);

		this.body.selectAll("rect")
			.data(newData)
			.enter().append("rect")				
				.attr("class", "bar")
				.style("fill", function(d, i) { return self.config.color(d.option); })
				.attr("x", function(d) { return self.config.x(d.option); })
				.attr("width", this.config.x.rangeBand())
				.attr("y", this.config.height)
				.attr("height", 0);

		this.redraw(newData);
	}

	this.redraw = function(data)
	{
		this.prepare();

		this.body.selectAll("rect")
			.data(data)
			.transition()
			.duration(1000)
				.attr("y", function(d) { return self.config.y(d.amount); })
				.attr("height", function(d) { return self.config.height - self.config.y(d.amount); });

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

		this.config.x.domain(newData.map(function(d) { return d.option; }));
		this.config.y.domain([0, d3.max(newData, function(d) { return d.amount; })]);
	}

	this.configure(configuration);
}