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
		.attr("stroke-width", 15)
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
		.attr("stroke-width", 15)
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

	this.makeDonut = function(data, label, value, makeLabels, makeKey, makeTitle, title){
		makeDonut(this.donutBox, 200, viewboxWidth/8,  viewboxHeight/2, data, label, value, makeLabels, makeKey, makeTitle, title, false);
	};

	this.clearDonut = function(){
		this.donutBox.selectAll("*").remove();
	};

	this.arrowClick = function(direction){
		if(dataCounter >0 && direction == "prev")
			dataCounter--;
		else if(dataCounter < dataObjects.length - 1 && direction == "next")
			dataCounter++;
		else
			return;

		this.clearDonut();
		switch(dataCounter){
			case 0:
				this.makeDonut(dataObjects[dataCounter], "race", "total", false, true, true, "demographics: 2000");
				break;
			case 1:
				// this.makeDonut(dataObjects[dataCounter], headers[0], headers[1]);
				makeBarGraph(this.donutBox, (viewboxWidth/4) - 20, viewboxHeight/3, 10, 60, 
					dataObjects[1], "age", "male", "#1f77b4", true, "Male Population by Age", 3, false);

				makeBarGraph(this.donutBox, (viewboxWidth/4) - 20, viewboxHeight/3, 10, viewboxHeight/3 + 175, 
					dataObjects[1], "age", "female", "#FF7F0E", true, "Female Population by Age", 3, false);

				break;
			case 2:
				this.makeDonut(dataObjects[dataCounter], "origin", "total", false, true, true, "Non North American Origin");
				break;
			case 3:
				this.makeDonut(dataObjects[dataCounter], "Poverty Level", "value", true, false, true, "Poverty Overview");
				break;
			case 4:
				this.makeDonut(dataObjects[dataCounter], "age", "value", false, true, true, "People in Poverty by Age");
				break;
			default:
				break;
		}
	};

	this.addData = function(dataObject){
		dataObjects.push(dataObject);
	};

	this.ready = function(){
		this.makeDonut(dataObjects[dataCounter], "race", "total", false, true, true, "demographics: 2000");
	};
};

// object that deals with the map and stuff
function mapArea(svg, viewboxWidth, viewboxHeight){
	var context = this;
	var comObj;

	// 0 is for the map, 1 is for the district list
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
		.attr("stroke-width", 15)
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
		.attr("stroke-width", 15)
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
		if(dataCounter == 0 && direction == "next"){
			// call method to graph dataObjects[dataCounter]
			dataCounter++;
			this.drawMap(1);
		}
		else if(dataCounter == 1 && direction == "prev"){
			// call method to graph dataObjects[dataCounter]
			dataCounter--;
			this.drawMap(0);
		}
	};

	// simple setters used to get det data into the object
	this.setComObj = function(comunityObj){
		comObj = comunityObj;
	};

	this.setMapData = function(geoJSON, districtList, communityList){
		dataObjects.push(geoJSON);
		dataObjects.push(districtList);
		dataObjects.push(communityList);
		this.drawMap(0);
	};

	// ok this method just keeps getting worse, so bear with me:
	// 
	this.drawMap = function (dataID){
		this.map.selectAll("*").remove();

		var colorScale = d3.scale.category10();
		var center = d3.geo.centroid(dataObjects[0]);
		var scale = 70000;
		var offset = [700, 350];
		var projection = d3.geo
			.mercator()
			.scale(scale)
			.center(center)
			.translate(offset);

		var path = d3.geo.path().projection(projection);

		this.map.selectAll("path")
			.data(dataObjects[0].features)
			.enter()
				.append("path")
				.attr("d", path)
				.attr("fill", function(d){
					var index = getIndexByKey(dataObjects[1], "community", d.properties.name);

					if(dataID == 0)
						return "black";
					else if(dataID == 1)
						return colorScale(dataObjects[1][index]["district number"]);
				})
				.attr("stroke", "#fff")
				.on("mouseover", function(d){
					d3.select(this)
						.attr("fill", "#fff");
				})
				.on("mouseout", function(){
					if(dataID == 0)
						d3.select(this).attr("fill", "black");
					else if(dataID == 1){
						d3.select(this).attr("fill", function(d){
							var index = getIndexByKey(dataObjects[1], "community", d.properties.name);
							return colorScale(dataObjects[1][index]["district number"]);
						});
					}
				})
				.on("click", function(d){
					// need to send number!!!
					var val = getIndexByKey(dataObjects[2], "area", d.properties.name)
					comObj.useLocalArea(dataObjects[2][val]["number"], d.properties.name);
				});

		// add labels code thanks to:
		// http://stackoverflow.com/questions/13897534/add-names-of-the-states-to-a-map-in-d3-js
		this.map.selectAll("text")
			.data(dataObjects[0].features)
			.enter()
				.append("svg:text")
				.text(function(d){
					var val = getIndexByKey(dataObjects[2], "area", d.properties.name)
					return dataObjects[2][val]["number"];
				})
				.attr("x", function(d){
					return path.centroid(d)[0];
				})
				.attr("y", function(d){
					return path.centroid(d)[1];
				})
				.attr("text-anchor", "middle")
				.attr("fill", "white")
				.style("font-size", "12px")
				.style("font-family", "sans-serif");

		var keyArea = this.map.append("g");

		// draw key for regular map
		if(dataID == 0){
			keyArea.selectAll("text")
			.data(dataObjects[2])
			.enter()
				.append("text")
				.text(function(d){
					console.log(d)
					return d.number + ": " + d.area;
				})
				.attr("x",function(d, i) {
					return (i < 40)? 40 : 180;
				})
				.attr("y", function(d, i){
					return (i < 40)? 50 + (i*15): 62 + ((i - 41)*15);
				})
				.attr("text-anchor", "left")
				.attr("fill", "black")
				.style("font-size", "12px")
				.style("font-family", "sans-serif");
		}
		// draw key for district map
		else if(dataID == 1){
			var districtNumber = [];
			var rectCounter = 0;
			for (var i = 0; i < dataObjects[1].length; i++) {
				if(districtNumber.indexOf(dataObjects[1][i]["district number"]) < 0){
					districtNumber.push(dataObjects[1][i]["district number"]);
					
					keyArea.append("rect")
					.attr("width", 15)
					.attr("height", 15)
					.attr("x", 200)
					.attr("y", function(){
						return 300 + (rectCounter*20);
					})
					.attr("fill", function(){
						return colorScale(dataObjects[1][i]["district number"])
					});

					keyArea.append("text")
						.attr("x", 220)
						.attr("y", function(){
							return (300 + (rectCounter*20)) + 15;
						})
						.text(dataObjects[1][i]["district"])
						.attr("text-anchor", "left")
						.attr("fill", "black")
						.style("font-size", "15px")
						.style("font-family", "sans-serif");

					rectCounter ++;
				};
			};
		};
	};
};

// object that deals with the data shown on the right most pane
function community(svg, viewboxWidth, viewboxHeight){
	var context = this;
	var sections = [];
	var sectionsUsed = [false, false, false];
	var dataObjects = [];
	var dataCounters = [0, 0, 0];
	var areas = [{"number" : 0, "name" : ""}, {"number" : 0, "name" : ""}, {"number" : 0, "name" : ""}];

	this.canvas = svg.append("g")
		.attr("transform", "translate(" + 3*(viewboxWidth/4) + "," + 0 +")");

	this.canvas.append("rect")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", viewboxHeight -4)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	// Things dealing with the first rectable area that will show data for one of the selected regions
	this.canvas.append("rect")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", (viewboxHeight-4)/3)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.on("click", function(){
			context.clearSection(0);
		});

	sections.push(this.canvas.append("g")
		.attr("transform", "translate(0, 0)"));

	this.arrowSpace1 = this.canvas.append("g")
		.attr("transform", "translate(0," + (viewboxHeight-4)/6 + ")");

	this.prevArrow1 = this.arrowSpace1.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 15)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.arrowClick("prev", 0);
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
		.attr("stroke-width", 15)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/4)-(4+24), -16, (viewboxWidth/4)-(4+10), 0, (viewboxWidth/4)-(4+24), 16];
		})
		.on("click", function(){
			context.arrowClick("next", 0);
			context.nextArrow1.transition()
				.duration(500)
				.attr("opacity", 0)
			context.nextArrow1.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	// things dealing with the second rectangle area that will show stuff with the second selected region
	this.canvas.append("rect")
		.attr("transform", "translate(0, " + (viewboxHeight-4)/3 + ")")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", (viewboxHeight-4)/3)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.on("click", function(){
			context.clearSection(1);
		});

	sections.push(this.canvas.append("g")
		.attr("transform", "translate(0, " + (viewboxHeight-4)/3 + ")"));

	this.arrowSpace2 = this.canvas.append("g")
		.attr("transform", "translate(0," + (viewboxHeight-4)/2 + ")");

	this.prevArrow2 = this.arrowSpace2.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 15)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.arrowClick("prev", 1);
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
		.attr("stroke-width", 15)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/4)-(4+24), -16, (viewboxWidth/4)-(4+10), 0, (viewboxWidth/4)-(4+24), 16];
		})
		.on("click", function(){
			context.arrowClick("next", 1);
			context.nextArrow2.transition()
				.duration(500)
				.attr("opacity", 0)
			context.nextArrow2.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	// things dealing with the third rectangle are that will show stuff with the third selected rigion
	this.canvas.append("rect")
		.attr("transform", "translate(0, " + 2*(viewboxHeight-4)/3 + ")")
		.attr("width", (viewboxWidth/4) - 4)
		.attr("height", (viewboxHeight-4)/3)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", 1)
		.on("click", function(){
			context.clearSection(2);
		});

	sections.push(this.canvas.append("g")
		.attr("transform", "translate(0, " + 2*(viewboxHeight-4)/3 + ")"));

	this.arrowSpace3 = this.canvas.append("g")
		.attr("transform", "translate(0," + 5*(viewboxHeight-4)/6 + ")");

	this.prevArrow3 = this.arrowSpace3.append("polyline")
		.attr("stroke", "black")
		.attr("stroke-width", 15)
		.attr("fill", "none")
		.attr("points", "24,-16 10,0 24,16")
		.on("click", function(){
			context.arrowClick("prev", 2);
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
		.attr("stroke-width", 15)
		.attr("fill", "none")
		.attr("points", function(){ 
			return [(viewboxWidth/4)-(4+24), -16, (viewboxWidth/4)-(4+10), 0, (viewboxWidth/4)-(4+24), 16];
		})
		.on("click", function(){
			context.arrowClick("next", 2);
			context.nextArrow3.transition()
				.duration(500)
				.attr("opacity", 0)
			context.nextArrow3.transition()
				.delay(500)
				.duration(500)
				.attr("opacity", 1);
		});

	// helper function that helps retrieve the area that does not have any vis on it
	this.getSection = function(){
		for (var i = 0; i < sectionsUsed.length; i++) {
			if(sectionsUsed[i] == false)
				return i;
		};
		return -1;
	}

	// a way to add data
	this.addData = function(dataObject){
		dataObjects.push(dataObject);
	};

	// deals with the arow events
	this.arrowClick = function(direction, sectionNumber){
		if(direction == "prev" && dataCounters[sectionNumber]>0){
			dataCounters[sectionNumber]--;
			this.drawInSection(sectionNumber, areas[sectionNumber]["number"], areas[sectionNumber]["name"], dataCounters[sectionNumber]);
		}
		else if(direction == "next" && dataCounters[sectionNumber] < dataObjects.length){
			dataCounters[sectionNumber]++;
			this.drawInSection(sectionNumber, areas[sectionNumber]["number"], areas[sectionNumber]["name"], dataCounters[sectionNumber]);
		}


	};

	// deals with the area space(community or district) given by the mapArea object
	this.useLocalArea = function(areaNumb, areaName){
		var freeSection = this.getSection();
		if(freeSection > -1){
			sectionsUsed[freeSection] = true;
			areas[freeSection] = {"number": areaNumb, "name" : areaName};
			this.drawInSection(freeSection, areaNumb, areaName, 0);
		};
	};

	this.makeDonut = function(sectionNumber,data, label, value, makeLabels, makeKey, makeTitle, title){
		var y = (viewboxHeight - 4)/6;
		var x = ((viewboxWidth/4) - 4)/2;

		makeDonut(sections[sectionNumber], 80, x - 40, y + 20, data, label, value, makeLabels, makeKey, makeTitle, title, true);
	};

	this.makeBars = function(sectionNumber, data, label, value, color, title){
		var dy = 50;
		var dx = 70;

		makeBarGraph(sections[sectionNumber], (viewboxWidth/4) - 100, (viewboxHeight/3)- 100, dx, dy, data, label, value, color, true, title, 3, true);
	}

	// functions that chooses the correct data to be used
	this.drawInSection = function(section, communityNumb, communityName, dataCount){
		sections[section].selectAll("*").remove();
		
		sections[section].append("text")
			.attr("transform", "translate(" +0 +"," + 18 + ")")
			.text(function(){
				return communityName.toUpperCase();
			})
			.style("font-size", "18px")
			.style("font-family", "sans-serif")
			.style("text-decoration", "underline");

		var localData = [];

		switch(dataCount){
			case 0:
				for (var i = 0; i < dataObjects[dataCount].length; i++) {
					if(dataObjects[dataCount][i]["area"] == communityNumb){
						localData.push({"Race": "NHW", "value": dataObjects[dataCount][i]["NHW"]});
						localData.push({"Race": "NHB", "value": dataObjects[dataCount][i]["NHB"]});
						localData.push({"Race": "NHAM", "value": dataObjects[dataCount][i]["NHAM"]});
						localData.push({"Race": "NHAS", "value": dataObjects[dataCount][i]["NHAS"]});
						localData.push({"Race": "NH Other", "value": dataObjects[dataCount][i]["NH Other"]});
						localData.push({"Race": "HISP", "value": dataObjects[dataCount][i]["HISP"]});
						localData.push({"Race": "NH Multiple", "value": dataObjects[dataCount][i]["NH Multiple"]});
					};
				};
				this.makeDonut(section,localData, "Race", "value", false, true, true, "demographics");
				break;
			case 1:
				for (var i = 0; i < dataObjects[dataCount].length; i++) {
					if(dataObjects[dataCount][i]["area"] == communityNumb){
						localData.push({"gender": "male", "value": dataObjects[dataCount][i]["male"]});
						localData.push({"gender": "female", "value": dataObjects[dataCount][i]["female"]});
					};
				};
				this.makeDonut(section,localData, "gender", "value", false, true, true, "Gender");
				break;
			case 2:
				for (var i = 0; i < dataObjects[dataCount].length; i++) {
					if(dataObjects[dataCount][i]["area"] == communityNumb){
						localData.push({"age": dataObjects[dataCount][i]["age"], "value": dataObjects[dataCount][i]["total"]});
					};
				};
				this.makeBars(section, localData, "age", "value", "#d62728", "Population By Age");
				
				break;
			case 3:
				break;
			case 4:
				break;
			default:
				break;
		}
	};

	this.clearSection = function(sectionNumber){
		sections[sectionNumber].selectAll("*").remove();
		sectionsUsed[sectionNumber] = false;
		dataCounters[sectionNumber] = 0;
	};
};

// function that makes donut charts
// with help from:
// http://bl.ocks.org/dbuezas/9306799
function makeDonut(drawSection, radius, centerX, centerY, dataObject, label, value, makeLabels, makeKey, makeTitle, title, keyOnRight){
	var colorScale = d3.scale.category10();
   
	var dough = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(radius - 40);

	var yumPie = d3.layout.pie()
		.value(function(d){return d[value]});

	var sweetKeys = drawSection.append("g")
		.attr("transform", "translate(" + centerX +"," + centerY + ")");

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
		.style("fill", function (d){ 
			return colorScale(d.data[value]);});

	// title
	if(makeTitle){
		sweetKeys.append("text")
			.attr("transform", "translate(" +(0 - radius) +"," + (0 - (radius + 18)) + ")")
			.text(function(){
				return title.toUpperCase();
			})
			.style("font-size", "18px")
			.style("font-family", "sans-serif");
	};

	// key
	if(makeKey){
		for (var i = 0; i < dataObject.length; i++) {
			sweetKeys.append("rect")
				.attr("transform", function () {
					if (!keyOnRight)
						return "translate(" +(0 - radius) +"," + ((radius) + (i * 12)) + ")";
					else
						return "translate(" + (radius + 10) +"," + ((0 - radius) + (i * 12)) + ")";
				})
				.attr("fill", function (){ 
					return colorScale(dataObject[i][value]);})
				.attr("width", 10)
				.attr("height", 10)
			
			sweetKeys.append("text")
				.attr("transform", function(){
					if(!keyOnRight)
						return "translate(" + (0 - (radius - 12)) +"," + ((radius) + (i * 12) + 10) + ")";
					else
						return "translate(" + (radius + 22) +"," + ((0 - radius) + (i * 12) + 10 ) + ")";
				})
				.text(function() {
					return dataObject[i][label];
				})
				.style("font-size", "10px")
				.style("font-family", "sans-serif");

		};
	};
	// text labels
	if(makeLabels){
		yummyGraph.append("text")
			.attr("transform", function(d) {
				var c = dough.centroid(d),
				x = c[0],
				y = c[1],
				// pythagorean theorem for hypotenuse
				h = Math.sqrt(x*x + y*y);
				dx = (x/h * (radius + 40));
				dy = (y/h * (radius + 40));

				return "translate(" + dx + ',' + dy + ")"; 
				// return "translate(" + 100 + "," + 100 + ")"; 
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.data[label];
			})
			.style("font-size", "10px")
			.style("font-family", "sans-serif");

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
	};

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
			var val =  Math.round((d.data[value] / total) * 100)
			return  (val >= 3)?  val + "%": "";
		})
		.attr("fill", "white")
		.style("font-size", "12px")
		.style("font-family", "sans-serif");
};

function makeBarGraph(drawSection, width, height, dx, dy, dataObject, label, value, color, makeTitle, title, ticks, upright){
	var max = 0;
	var min = 0;
	for (var i = 0; i < dataObject.length; i++) {
		if(dataObject[i][value] > max)
			max = dataObject[i][value];
	};

	var graph = drawSection.append("g")
		.attr("transform", "translate("+ dx + "," + dy + ")");

	if(makeTitle){
		drawSection.append("g")
			.attr("transform", "translate(" +  dx +"," + (dy - 10) + ")")
			.append("text")
			.text(function(){
				return title.toUpperCase();
			})
			.style("font-size", "16px")
			.style("font-family", "sans-serif");
	};

	if(!upright){
		// make axis
		var xscale1 = d3.scale.linear()
		.domain([min, max])
		.range([0, width]);

		var xscale2 = d3.scale.linear()
		.domain([min, max])
		.range([height, 0]);
		var yaxis = d3.svg.axis().scale(xscale1).ticks(ticks).orient("bottom");

		drawSection.append("g")
			.call(yaxis)
			.attr("transform", "translate("+ dx + "," + (height + dy)+ ")");

		// make bars
		graph.selectAll("rect")
			.data(dataObject)
			.enter()
				.append("rect")
				.attr("width", function(d){
					return xscale1(d[value]);
				})
				.attr("height",(height/dataObject.length) - 2)
				.attr("fill", color)
				.attr("y", function(d,i){ 
					return i*(height/dataObject.length)
					// return height - xscale1(d[value]);
				})
				.attr("x", function(d){
					// return i*(width/dataObject.length)
					return 0;
				});

		// labels
		graph.selectAll("text")
			.data(dataObject)
			.enter()
				.append("text")
				.attr("y", function(d,i){ 
					return i*(height/dataObject.length) + ((height/dataObject.length) - 2) ;
					// return height - xscale1(d[value]);
				})
				.attr("x", function(d){
					// return i*(width/dataObject.length)
					return 0;
				})
				.text(function (d){
					return d[label];
				})
				.attr("fill", "white")
				.style("font-size", "8px")
				.style("font-family", "sans-serif");
	};

	if(upright){
		// make axis
		var xscale1 = d3.scale.linear()
		.domain([min, max])
		.range([0, height]);

		var xscale2 = d3.scale.linear()
		.domain([min, max])
		.range([height, 0]);

		var xscale3 = d3.scale.linear()
		.domain([0, 99])
		.range([0, width]);

		var yaxis = d3.svg.axis().scale(xscale2).ticks(ticks).orient("left");

		var xaxis = d3.svg.axis().scale(xscale3).ticks(10).orient("bottom");

		drawSection.append("g")
			.call(yaxis)
			.attr("transform", "translate("+ dx + "," + dy + ")");

		drawSection.append("g")
			.call(xaxis)
			.attr("transform", "translate("+ dx + "," + (dy + height) + ")");

		// make bars
		graph.selectAll("rect")
			.data(dataObject)
			.enter()
				.append("rect")
				.attr("height", function(d){
					return xscale1(d[value]);
				})
				.attr("width",(width/dataObject.length))
				.attr("fill", color)
				.attr("x", function(d,i){ 
					return i*(width/dataObject.length)
					// return height - xscale1(d[value]);
				})
				.attr("y", function(d){
					// return i*(width/dataObject.length)
					return height - xscale1(d[value]);
				});

		graph.append("text")
			.attr("transform", "translate("+ width/2 + "," + (height + (dy - 10))+ ")")
			.text(function(){
				return label;
			})
			.attr("fill", "black")
			.style("font-size", "12px")
			.style("font-family", "sans-serif");
	}
};

// helper function
function getIndexByKey(arrayName, key, valToFind) {
    for (var i = 0; i < arrayName.length; i++) {
        if(arrayName[i][key] == valToFind)
            return i;
    };  
    return -1;
}