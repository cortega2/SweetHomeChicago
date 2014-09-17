// object that takes care of the viz that are made in the left pane
function overallSpace(svg, viewboxWidth, viewboxHeight){
	var context = this;
	var dataObjects = [];
	var dataCounter = 0;

	this.canvas = svg.append("g")
		.attr("transform", "translate(" + 0 + "," + 0 +")");

	this.canvas.append("rect")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", viewboxHeight -4)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	this.donutBox = this.canvas.append("g");

	this.arrowSpace = this.canvas.append("g")
		.attr("transform", "translate(0," + (viewboxHeight-4)/2 + ")");

	this.prevArrow = this.arrowSpace.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.prevArrow.transition()
				.duration(500)
				.attr("opacity", 0)
			context.arrowClick("prev");
			context.prevArrow.transition()
				.delay(500)													//remember to alter this so that it looks smother                                        
				.duration(500)
				.attr("opacity", 1);
		});

	this.nextArrow = this.arrowSpace.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/4)-(4+24), -16, (viewboxWidth/4)-(4+10), 0, (viewboxWidth/4)-(4+24), 16];
		})
		.on("click", function(){
			context.nextArrow.transition()
				.duration(500)
				.attr("opacity", 0)
			context.arrowClick("next");
			context.nextArrow.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});;

	this.makeDonut = function(data, label, value){
		makeDonut(this.donutBox, 150, viewboxWidth/8,  viewboxHeight/2,data, label, value);
	};

	this.clearDonut = function(){
		this.donutBox.selectAll("*").remove();
	};

	this.arrowClick = function(direction){
		if(dataCounter >0 && direction == "prev"){
			dataCounter--;
			// call method to graph dataObjects[dataCounter]
			var headers = [];
			for (name in dataObjects[dataCounter][0]){headers.push(name)};
			this.clearDonut();
			this.makeDonut(dataObjects[dataCounter], headers[0], headers[1]);
		}
		else if(dataCounter < dataObjects.length - 1 && direction == "next"){
			dataCounter++;
			// call method to graph dataObjects[dataCounter]
			var headers = [];
			for (name in dataObjects[dataCounter][0]){headers.push(name)};
			this.clearDonut();
			this.makeDonut(dataObjects[dataCounter], headers[0], headers[1]);
		}
	};

	this.addData = function(dataObject){
		dataObjects.push(dataObject);
	};
};

// object that deals with the map and stuff
function mapArea(svg, viewboxWidth, viewboxHeight){
	var context = this;
	var comObj;
	var dataObjects = [];
	var dataCounter = 0;

	this.canvas = svg.append("g")
		.attr("transform", "translate(" + viewboxWidth/4 + "," + 0 +")");

	this.canvas.append("rect")
		.attr("width", (viewboxWidth/2) - 4)
		.attr("height", viewboxHeight - 4)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	this.map = this.canvas.append("g");

	this.arrowSpace = this.canvas.append("g")
		.attr("transform", "translate(0," + (viewboxHeight-4)/2 + ")");

	this.prevArrow = this.arrowSpace.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.arrowClick("prev");
			context.prevArrow.transition()
				.duration(500)
				.attr("opacity", 0)
			context.prevArrow.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	this.nextArrow = this.arrowSpace.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/2)-(4+24), -16, (viewboxWidth/2)-(4+10), 0, (viewboxWidth/2)-(4+24), 16];
		})
		.on("click", function(){
			context.arrowClick("next");
			context.nextArrow.transition()
				.duration(500)
				.attr("opacity", 0)
			context.nextArrow.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	this.arrowClick = function(direction){
		// this.clearDonut();
		console.log("click " + direction);
		if(dataCounter >0 && direction == "prev"){
			// call method to graph dataObjects[dataCounter]
			dataCounter--;
		}
		else if(dataCounter < dataObjects.length && direction == "next"){
			// call method to graph dataObjects[dataCounter]
			dataCounter++;
		}
	};

	this.setComObj = function(comunityObj){
		comObj = comunityObj;
	};

	this.drawMap = function (data){
		// this.data = d;
		var center = d3.geo.centroid(data);
		var scale = 80500;
		var offset = [200, 400];
		var projection = d3.geo
			.mercator()
			.scale(scale)
			.center(center)
			.translate(offset);

		var path = d3.geo.path().projection(projection);

		this.map.selectAll("path")
			.data(data.features)
			.enter()
				.append("path")
				.attr("d", path)
				.attr("fill", "#fff")
				.attr("stroke", "#000")
				.on("mouseover", function(d){
					d3.select(this)
						.attr("fill", "red");
				})
				.on("mouseout", function(){
					d3.select(this)
						.attr("fill", "white")
				})
				.on("click", function(d){
					comObj.useLocalArea(d.properties.name);
				});

		// add labels code thanks to:
		// http://stackoverflow.com/questions/13897534/add-names-of-the-states-to-a-map-in-d3-js
		this.map.selectAll("text")
			.data(data.features)
			.enter()
				.append("svg:text")
				.text(function(d){
					return d.properties.name;
				})
				.attr("x", function(d){
					return path.centroid(d)[0];
				})
				.attr("y", function(d){
					return path.centroid(d)[1];
				})
				.attr("text-anchor", "middle")
				.attr("font-size", "8pt");
	};
};

// object that deals with the data shown on the right most pane
function community(svg, viewboxWidth, viewboxHeight){
	var context = this;
	var sections = [];

	this.canvas = svg.append("g")
		.attr("transform", "translate(" + 3*(viewboxWidth/4) + "," + 0 +")");

	this.canvas.append("rect")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", viewboxHeight -4)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	// Things dealing with the first rectable area that will show data for one of the selected regions
	sections.push(this.canvas.append("g")
		.attr("transform", "translate(0, 0)"));

	sections[0].append("rect")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", (viewboxHeight-4)/3)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	this.arrowSpace1 = this.canvas.append("g")
		.attr("transform", "translate(0," + (viewboxHeight-4)/6 + ")");

	this.prevArrow1 = this.arrowSpace1.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.arrowClick("prev1");
			context.prevArrow1.transition()
				.duration(500)
				.attr("opacity", 0)
			context.prevArrow1.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	this.nextArrow1 = this.arrowSpace1.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/4)-(4+24), -16, (viewboxWidth/4)-(4+10), 0, (viewboxWidth/4)-(4+24), 16];
		})
		.on("click", function(){
			context.arrowClick("next1");
			context.nextArrow1.transition()
				.duration(500)
				.attr("opacity", 0)
			context.nextArrow1.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	// things dealing with the second rectangle area that will show stuff with the second selected region
	this.area2 = this.canvas.append("g")
		.attr("transform", "translate(0, " + (viewboxHeight-4)/3 + ")");
	this.area2.append("rect")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", (viewboxHeight-4)/3)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	this.arrowSpace2 = this.canvas.append("g")
		.attr("transform", "translate(0," + (viewboxHeight-4)/3/2 + ")");

	this.prevArrow2 = this.arrowSpace2.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.arrowClick("prev2");
			context.prevArrow2.transition()
				.duration(500)
				.attr("opacity", 0)
			context.prevArrow2.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	this.nextArrow2 = this.arrowSpace2.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/4)-(4+24), -16, (viewboxWidth/4)-(4+10), 0, (viewboxWidth/4)-(4+24), 16];
		})
		.on("click", function(){
			context.arrowClick("next2");
			context.nextArrow2.transition()
				.duration(500)
				.attr("opacity", 0)
			context.nextArrow2.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	// things dealing with the third rectangle are that will show stuff with the third selected rigion
	this.area3 = this.canvas.append("g")
		.attr("transform", "translate(0, " + 2*(viewboxHeight-4)/3 + ")");
	this.area3.append("rect")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", (viewboxHeight-4)/3)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	this.arrowSpace3 = this.canvas.append("g")
		.attr("transform", "translate(0," + (viewboxHeight-4)/3/2 + ")");

	this.prevArrow3 = this.arrowSpace3.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.arrowClick("prev3");
			context.prevArrow3.transition()
				.duration(500)
				.attr("opacity", 0)
			context.prevArrow3.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	this.nextArrow3 = this.arrowSpace3.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 6)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/4)-(4+24), -16, (viewboxWidth/4)-(4+10), 0, (viewboxWidth/4)-(4+24), 16];
		})
		.on("click", function(){
			context.arrowClick("next3");
			context.nextArrow3.transition()
				.duration(500)
				.attr("opacity", 0)
			context.nextArrow3.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	var sectionsUsed = [false, false, false];
	// helper function that helps retrieve the area that does not have any vis on it
	this.getSection = function(){
		for (var i = 0; i < sectionsUsed.length; i++) {
			if(sectionsUsed[i] == false)
				return i;
		};
		return -1;
	}

	// deals with the arow events
	this.arrowClick = function(direction){
		// this.clearDonut();
		console.log("click " + direction);
	};

	// deals with the area space(community or district) given by the mapArea object
	this.useLocalArea = function(area){
		console.log(area);

		var freeSection = this.getSection();
		if(freeSection > -1){
			sectionsUsed[freeSection] = true;
			this.drawInSection(freeSection, area);
		};
	};

	this.drawInSection = function(section, localPlace){
		console.log("using sections[" + section + "] for " +  localPlace);
		sections[section].append("rect")
			.attr("width", 100)
			.attr("height", 100)
			.attr("fill", "red");
	};
};

// function that makes donut charts
// with help from:
// http://bl.ocks.org/dbuezas/9306799
function makeDonut(drawSection, radius, centerX, centerY, dataObject, label, value){
	var colorScale = d3.scale.category10();
   
	var dough = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);

	var yumPie = d3.layout.pie()
		.value(function(d){return d[value]});

	var yummyGraph = drawSection.append("g")
		.attr("transform", "translate(" + centerX +"," + centerY + ")")
		.selectAll(".arc")
		.data(yumPie(dataObject))
		.enter()
			.append("g")
			.attr("class", "arc");

	// slices
	yummyGraph.append("path")
		.attr("d", dough)
		.style("fill", function (d){ return colorScale(d[value]);});

	// text labels
	yummyGraph.append("text")
		.attr("transform", function(d) {
			var c = dough.centroid(d),
			x = c[0],
			y = c[1],
			// pythagorean theorem for hypotenuse
			h = Math.sqrt(x*x + y*y);
			return "translate(" + (x/h * (radius + 40)) + ',' + (y/h * (radius + 40)) + ")"; 
		})
		.attr("text-anchor", "middle")
		.text(function(d) {
			return d.data[label];
		});

	// text lines
	yummyGraph.append("polyline")
		.attr("points", function (d){
			var c = dough.centroid(d),
					x = c[0],
					y = c[1],
					// pythagorean theorem for hypotenuse
					h = Math.sqrt(x*x + y*y);
			return [x*1.05 , y*1.05, (x/h * (radius + 20)), (y/h * (radius + 20))]; 
		})
		.attr("stroke", "black");

	// percentage stuff
	var total = 0;
	for (var i = dataObject.length - 1; i >= 0; i--) {
		total = total + dataObject[i][value];
	};

	yummyGraph.append("text")
		.attr("transform", function(d) {
			var c = dough.centroid(d),
			x = c[0],
			y = c[1],
			// pythagorean theorem for hypotenuse
			h = Math.sqrt(x*x + y*y);
			return "translate(" + c +")"; 
		})
		.attr("text-anchor", "middle")
		.text(function(d) {
			return Math.round((d.data[value] / total) * 100) + "%";
		})
		.attr("fill", "white");
};