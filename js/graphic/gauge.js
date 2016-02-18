/************************/
/****** Interface *******/
/************************/
function createGauge(data, reload)
{
	if(data.answers[0] != undefined) 
	{
		var choice = data.answers[0].choice.split("x");
		if(choice.length > 1)
		{
			createDoubleGauge(data, reload);
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
		min: parseInt(range.min),
		max: parseInt(range.max)
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
	
	var gauge = new Gauge(config.name + "Graphic", config, data);
	gauge.render();
	_graphics.push(gauge);
}

/********************/
/****** Class *******/
/********************/
function Gauge(placeholderName, configuration, data)
{
	this.placeholderName = placeholderName;
	
	var self = this; // for internal d3 functions
	
	this.configure = function(configuration)
	{
		this.config = configuration;
				
		this.config.width = configuration.width || _graphicSize.width;
		this.config.height = configuration.height || _graphicSize.height;		
		this.config.size = (this.config.width + configuration.height) / 2;		
		this.config.margin = configuration.margin || (this.config.size * .02) * 4;
		this.config.width = this.config.width - (this.config.margin * 2);
		
		this.config.radius = Math.min(this.config.width, this.config.height) / 2;
		this.config.cx = (this.config.width + this.config.margin * 2) / 2;
		this.config.cy = (this.config.height + this.config.margin * 2) / 2;
		
		this.config.min = undefined != configuration.min ? configuration.min : 0; 
		this.config.max = undefined != configuration.max ? configuration.max : 100; 
		this.config.range = this.config.max - this.config.min;

		this.config.zones = [
				{ from: this.config.min, to: this.config.min + this.config.range * 0.25 },
				{ from: this.config.min + this.config.range * 0.25, to: this.config.min + this.config.range * 0.5 },
				{ from: this.config.min + this.config.range * 0.5, to: this.config.min + this.config.range * 0.75 },
				{ from: this.config.min + this.config.range * 0.75, to: this.config.min + this.config.range * 0.9 },
				{ from: this.config.min + this.config.range * 0.9, to: this.config.max }
			];
		
		this.config.majorTicks = configuration.majorTicks || 5;
		this.config.minorTicks = configuration.minorTicks || 2;
		
		this.config.color = d3.scale.ordinal().range(_colors);		
		this.config.transitionDuration = configuration.transitionDuration || 500;

		this.config.parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;
	}

	this.render = function()
	{
		$.each(data.answers, function(i, d) 
		{
			if($.type(d.date) === "string")
				d.date = self.config.parseDate(d.date);
		});

		this.body = d3.select("#" + this.placeholderName)
							.append("svg:svg")
								.attr("class", "gauge")
								.attr("width", this.config.width + (this.config.margin * 2))
								.attr("height", this.config.height + (this.config.margin * 2));

		this.body.append("svg:circle")
					.attr("cx", this.config.cx)
					.attr("cy", this.config.cy)
					.attr("r", 0.9 * this.config.radius)
					.style("fill", "#fff")
					.style("stroke", "#e0e0e0")
					.style("stroke-width", "2px");			
					
		for (var index in this.config.zones)
		{
			this.drawBand(this.config.zones[index].from, this.config.zones[index].to, index);
		}
		
		if (undefined != this.config.label)
		{
			var fontSize = Math.round(this.config.size / 15);
			this.body.append("svg:text")
						.attr("x", this.config.cx)
						.attr("y", 0)
						.attr("dy", this.config.margin + 10)
						.attr("text-anchor", "middle")
						.text(this.config.label)
						.style("font-size", fontSize + "px")
						.style("fill", "#333")
						.style("stroke-width", "0px");
		}
		
		var fontSize = Math.round(this.config.size / 16);
		var majorDelta = this.config.range / (this.config.majorTicks - 1);
		for (var major = this.config.min; major <= this.config.max; major += majorDelta)
		{
			var minorDelta = majorDelta / this.config.minorTicks;
			for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
			{
				var point1 = this.valueToPoint(minor, 0.75);
				var point2 = this.valueToPoint(minor, 0.85);
				
				this.body.append("svg:line")
							.attr("x1", point1.x)
							.attr("y1", point1.y)
							.attr("x2", point2.x)
							.attr("y2", point2.y)
							.style("stroke", "#666")
							.style("stroke-width", "1px");
			}
			
			var point1 = this.valueToPoint(major, 0.7);
			var point2 = this.valueToPoint(major, 0.85);	
			
			this.body.append("svg:line")
						.attr("x1", point1.x)
						.attr("y1", point1.y)
						.attr("x2", point2.x)
						.attr("y2", point2.y)
						.style("stroke", "#333")
						.style("stroke-width", "2px");
			
			if (major == this.config.min || major == this.config.max)
			{
				var point = this.valueToPoint(major, 0.63);
				
				this.body.append("svg:text")
				 			.attr("x", point.x)
				 			.attr("y", point.y)
				 			.attr("dy", fontSize / 3)
				 			.attr("text-anchor", major == this.config.min ? "start" : "end")
				 			.text(major)
				 			.style("font-size", fontSize + "px")
							.style("fill", "#333")
							.style("stroke-width", "0px");
			}
		}
		
		var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
		
		var midValue = (this.config.min + this.config.max) / 2;
		
		var pointerPath = this.buildPointerPath(midValue);
		
		var pointerLine = d3.svg.line()
									.x(function(d) { return d.x })
									.y(function(d) { return d.y })
									.interpolate("basis");
		
		pointerContainer.selectAll("path")
							.data([pointerPath])
							.enter()
								.append("svg:path")
									.attr("d", pointerLine)
									.style("fill", "#000");
					
		pointerContainer.append("svg:circle")
							.attr("cx", this.config.cx)
							.attr("cy", this.config.cy)
							.attr("r", 0.12 * this.config.radius)
							.style("fill", "#1C1C1C")
							.style("opacity", 1);
		
		var fontSize = Math.round(this.config.size / 10);
		pointerContainer.selectAll("text")
							.data([midValue])
							.enter()
								.append("svg:text")
									.attr("x", this.config.cx)
									.attr("y", this.config.size - this.config.cy / 4 - fontSize)
									.attr("dy", fontSize / 2)
									.attr("text-anchor", "middle")									
									.style("font-size", fontSize + "px")
									.style("fill", "#000")
									.style("stroke-width", "0px");
		
		this.buildSelectHtml();		
	}

	this.buildSelectHtml = function()
	{
		data.answers = Object.keys(data.answers).map(function(k){return data.answers[k]});
		data.options = Object.keys(data.options).map(function(k){return data.options[k]});

		if(data.answers.length > 0)
		{
			var div = $("<div />");
			div.addClass("date");

			var span = $("<span />");
			span.append("Data: ");
			div.append(span);

			var select = $("<select class='date-gauge' />");
			var opts = [];

			$.each(data.answers, function(i, d)
			{
				var opt = $("<option />").attr("value", d.choice).text(convertDateToStringWithHours(d.date, true));
				opts.push(opt);
			});

			select.append(opts.reverse());			
			div.append(select);
			
			this.body.append("svg:foreignObject")
				.attr("x", 10)
				.attr("y", 10)
				.attr("width", 200)
				.attr("height", 50)
					.append("xhtml:body")
						.attr("class", "inside-svg")
						.html(div[0].innerHTML);

			$("#" + placeholderName + " select.date-gauge").change(function() 
			{
				self.redraw(parseInt($(this).val()));
			});
			
			$("#" + placeholderName + " select.date-gauge").change();				
		}
		else
		{
			this.redraw(this.config.min);
		}
	}
	
	this.buildPointerPath = function(value)
	{
		var delta = this.config.range / 13;
		
		var head = valueToPoint(value, 0.85);
		var head1 = valueToPoint(value - delta, 0.12);
		var head2 = valueToPoint(value + delta, 0.12);
		
		var tailValue = value - (this.config.range * (1/(270/360)) / 2);
		var tail = valueToPoint(tailValue, 0.28);
		var tail1 = valueToPoint(tailValue - delta, 0.12);
		var tail2 = valueToPoint(tailValue + delta, 0.12);
		
		return [head, head1, tail2, tail, tail1, head2, head];
		
		function valueToPoint(value, factor)
		{
			var point = self.valueToPoint(value, factor);
			point.x -= self.config.cx;
			point.y -= self.config.cy;
			return point;
		}
	}
	
	this.drawBand = function(start, end, color)
	{
		if (0 >= end - start) return;

		this.body.append("svg:path")
					.style("fill", this.config.color(color))
					.attr("d", d3.svg.arc()
						.startAngle(this.valueToRadians(start))
						.endAngle(this.valueToRadians(end))
						.innerRadius(0.5 * this.config.radius)
						.outerRadius(0.85 * this.config.radius))
					.attr("transform", function() { return "translate(" + self.config.cx 
						+ ", " + self.config.cy + ") rotate(270)" });
	}
	
	this.redraw = function(value)
	{
		var pointerContainer = this.body.select(".pointerContainer");
		
		pointerContainer.selectAll("text").text(Math.round(value));
		
		var pointer = pointerContainer.selectAll("path");
		pointer.transition()
					.duration(this.config.transitionDuration)
					.attrTween("transform", function()
					{
						var pointerValue = value;
						if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
						else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
						var targetRotation = (self.valueToDegrees(pointerValue) - 90);
						var currentRotation = self._currentRotation || targetRotation;
						self._currentRotation = targetRotation;
						
						return function(step) 
						{
							var rotation = currentRotation + (targetRotation-currentRotation)*step;
							return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")"; 
						}
					});
	}
	
	this.valueToDegrees = function(value)
	{
		return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
	}
	
	this.valueToRadians = function(value)
	{
		return this.valueToDegrees(value) * Math.PI / 180;
	}
	
	this.valueToPoint = function(value, factor)
	{
		return {
					x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
					y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value)) 		
				};
	}
	
	// initialization
	this.configure(configuration);	
}