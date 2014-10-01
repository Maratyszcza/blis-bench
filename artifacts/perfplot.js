function PerfPlot(root, title) {
	this.size = {
		"s": [],
		"d": [],
		"c": [],
		"z": []
	};
	this.performance = {
		"s": [],
		"d": [],
		"c": [],
		"z": []
	};
	this.points = {
		"s": [],
		"d": [],
		"c": [],
		"z": []
	};
	this.lines = {
		"s": null,
		"d": null,
		"c": null,
		"z": null
	};
	this.performanceTop = 5;

	var margin = {top: 50, right: 25, bottom: 75, left: 75};
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

	this.line = d3.svg.line()
		.x(function(d, i) { return this.scaleX(d[0]); })
		.y(function(d) { return this.scaleY(d[1]); })
		.interpolate("linear");

	this.title = this.chart.append("text")
		.attr("x", (this.width / 2))
		.attr("y", (margin.top / 2))
		.attr("text-anchor", "middle")
		.attr("class", "title")
		.text(title);
	this.lines["s"] = this.main.append("svg:path")
		.attr("class", "s trend");
	this.lines["d"] = this.main.append("svg:path")
		.attr("class", "d trend");
	this.lines["c"] = this.main.append("svg:path")
		.attr("class", "c trend");
	this.lines["z"] = this.main.append("svg:path")
		.attr("class", "z trend");
}

PerfPlot.prototype.add = function(datatype, size, performance) {
	if (isFinite(performance)) {
		if (performance > plot.performanceTop) {
			this.performanceTop = Math.ceil(performance / 0.5) * 0.5;
			this.scaleY.domain([0, this.performanceTop]);
			this.chart.selectAll("g.y.axis").call(this.axisY);
			for (var dt in this.points) {
				for (var i = 0; i < plot.points[dt].length; i++) {
					this.points[dt][i].attr("cx", this.scaleX(this.size[dt][i]));
					this.points[dt][i].attr("cy", this.scaleY(this.performance[dt][i]));
				}
			}
		}
		this.size[datatype].push(size);
		this.performance[datatype].push(performance);
		var point = this.main.append("svg:circle")
			.attr("cx", this.scaleX(size))
			.attr("cy", this.scaleY(performance))
			.attr("r", 2);
		this.points[datatype].push(point);
		this.lines[datatype].attr("d", this.line(d3.zip(this.size[datatype], this.performance[datatype])));
	}
}
