function PerfPlot(root, title, lines) {
	this.data = [];
	this.performanceTop = 5;

	var margin = {top: 75, right: 25, bottom: 75, left: 75};
	this.width = 800 - margin.left - margin.right;
	this.height = 600 - margin.top - margin.bottom;

	this.scaleX = d3.scale.log()
		.base(2)
		.domain([16, 1024])
		.range([ 0, this.width ]);

	this.scaleY = d3.scale.linear()
		.domain([0, this.performanceTop])
		.range([ this.height, 0 ]);

	this.chart = d3.select(root)
		.append('svg:svg')
		.attr('width', this.width + margin.right + margin.left)
		.attr('height', this.height + margin.top + margin.bottom)
		.attr('class', 'chart')

	this.main = this.chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', this.width)
		.attr('height', this.height)

	this.axisX = d3.svg.axis()
		.scale(this.scaleX)
		.orient('bottom')
		.tickFormat(this.scaleX.tickFormat(10, ".f"));

	this.axisY = d3.svg.axis()
		.scale(this.scaleY)
		.orient('left');

	this.main.append('g')
		.attr('transform', 'translate(0,' + this.height + ')')
		.attr('class', 'x axis')
		.call(this.axisX)
			.append("text")
			.attr("class", "label")
			.attr("x", this.width / 2)
			.attr("y", margin.bottom * 0.60)
			.style("text-anchor", "middle")
			.text("Problem size (n = m = k)");

	this.main.append('g')
		.attr('transform', 'translate(0,0)')
		.attr('class', 'y axis')
		.call(this.axisY)
			.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("x", -this.height / 2)
			.attr("y", -margin.left * 0.60)
			.style("text-anchor", "middle")
			.text("Performance, GFLOPS");

	var scaleX = this.scaleX;
	var scaleY = this.scaleY;
	this.line = d3.svg.line()
		.x(function(d) { return scaleX(d.size); })
		.y(function(d) { return scaleY(d.performance); })
		.interpolate("linear");

	this.chart.append("text")
		.attr("x", margin.left + this.width / 2)
		.attr("y", margin.top * 0.75)
		.attr("text-anchor", "middle")
		.attr("class", "title")
		.text(title);
	this.main.append("svg:path")
		.datum([])
		.attr("class", "s trend");
	this.main.append("svg:path")
		.datum([])
		.attr("class", "d trend");
	this.main.append("svg:path")
		.datum([])
		.attr("class", "c trend");
	this.main.append("svg:path")
		.datum([])
		.attr("class", "z trend");

	var legend = this.main.selectAll("text.legend")
		.data(lines).enter();
	legend.append("text")
				.attr("x", function(d, i) { return 30; })
				.attr("y", function(d, i) { return 50 + i * 20; })
				.attr("class", function(d) { return "legend " + d.datatype; })
				.text(function(d) { return d.name; })
	legend.append("rect")
				.attr("x", function(d, i) { return 15; })
				.attr("y", function(d, i) { return 40 + i * 20; })
				.attr("width", 10)
				.attr("height", 10)
				.attr("class", function(d) { return "legend " + d.datatype; })
}

PerfPlot.prototype.add = function(datatype, size, performance) {
	if (isFinite(performance)) {
		var scaleX = this.scaleX;
		var scaleY = this.scaleY;
		if (performance > plot.performanceTop) {
			this.performanceTop = Math.ceil(performance / 0.5) * 0.5;
			this.scaleY.domain([0, this.performanceTop]);
			this.chart.selectAll("g.y.axis").call(this.axisY);
			if (this.data.length !== 0) {
				this.main.selectAll("circle")
					.attr("cy", function(d) { return scaleY(d.performance); });
				this.main.selectAll("path.trend")
					.attr("d", this.line);
			}
		}
		this.data.push({
			size: size,
			datatype: datatype,
			performance: performance
		});
		var subdata = this.data.filter(function(d) { return d.datatype === datatype; });
		this.main.selectAll("circle." + datatype)
			.data(subdata)
			.enter()
				.append("circle")
				.attr("cx", function(d) { return scaleX(d.size); })
				.attr("cy", function(d) { return scaleY(d.performance); })
				.attr("class", datatype)
				.attr("r", 2);
		this.main.selectAll("path.trend." + datatype)
			.datum(subdata)
			.attr("d", this.line);
	}
}
