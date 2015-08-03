// Define variable
var data, stack, trArea, dataCombined, stackData;
var trColor = ["rgb(251,128,144)", "rgb(255,255,179)", "rgb(141,211,199)", "rgb(255,255,255)"],
	eventType = ["Negative","Neutral","Positive"];
var offsetType = "silhouette",
    interpolationType = "cardinal";
var width = 200,
	height = 400,
	width2 = 130,
	width3 = 140;
var trMargin,trWidth,trHeight,trCanvasWidth,tr_x,tr_y, tr_xAxis, yAxisGrid;
var trMargin2,trWidth2,trHeight2,trCanvasWidth2,tr_x2,tr_y2, tr_xAxis2;
var trMargin3,trWidth3,trHeight3,trCanvasWidth3,tr_x2,tr_y3, tr_xAxis3, tr_RightyAxis3;
var svgTR2, svgTR3, svgTR7;
var xAxisText = ["-15 to -10","-10 to -5","-5 to 0","0 to 5","5 to 10","10 to 15"];
	
$(document).ready(function (){
	DrawGraph();
})

function DrawGraph(){
	d3.json("data/data.json", function(error, dataAll) {
		if(error){
			console.log(error);
			alert("Data can't be loaded");
		}else{
			// Change the value to integer
			dataAll.forEach( function(d){
				d.noOfEvent = +d.noOfEvent;
			});
			
			// Prepare data for stacking
			data = dataAll;
			var area1Data = dataAll.filter(isArea1),
				area2Data = dataAll.filter(isArea2);
			console.log(area1Data);
			// ============= Draw Chart for Area 1 ================
			var newDataPosArea1 = area1Data.filter(isPositive),
				newDataNetArea1 = area1Data.filter(isNeutral),
				newDataNegArea1 = area1Data.filter(isNegative);
			
			dataCombinedArea1 = [{type:eventType[0], dataArr: newDataNegArea1, color:trColor[0]},
							{type:eventType[1], dataArr: newDataNetArea1, color:trColor[1]},
							{type:eventType[2], dataArr: newDataPosArea1, color:trColor[2]}];
			
			defineStackFunction();
			
			
			stackData = stack(dataCombinedArea1);
			initThemeRiverAxis(dataCombinedArea1);
			
			defineAreaFunction();
			drawThemeRiverChart();
			drawThemeRiverAxis();
			
			// ============= Data Initialization ===================
			var newDataPosArea2 = area2Data.filter(isPositive),
				newDataNetArea2 = area2Data.filter(isNeutral),
				newDataNegArea2 = area2Data.filter(isNegative);
			
			dataCombinedArea2 = [{type:eventType[0], dataArr: newDataNegArea2, color:trColor[0]},
							{type:eventType[1], dataArr: newDataNetArea2, color:trColor[1]},
							{type:eventType[2], dataArr: newDataPosArea2, color:trColor[2]}];
			stackData2 = stack(dataCombinedArea2);
			initThemeRiverAxis2(dataCombinedArea2);
			
			// ============= Draw Chart for Area 2-6 ===================
			for(var i = 2; i < 6; i++){
				window['svgTR'+i] = d3.select("#area"+i+"Div").append("svg")
							.attr("width", trCanvasWidth2 + trMargin2.left + trMargin2.right)
							.attr("height", trHeight2 + trMargin2.top + trMargin2.bottom)
							.append("g")
								.attr("transform", "translate(" + trMargin2.left + "," + trMargin2.top + ")");
											
				window['svgTR'+i].selectAll("path")
						.data(stackData)
						.enter().append("path")
						.attr("d", function(d) { return trArea(d.dataArr); })
						.style("fill", function(d) { return d.color; })
						.append("title")
						.text(function(d) { return d.type; });
						
				// draw y axis
				window['svgTR'+i].append("g")
					.attr("class", "lightAxis")
					.call(tr_yAxis2);
					
				// Draw y axis grid
				window['svgTR'+i].append("g")
					.classed('y', true)
					.classed('grid', true)
					.call(yAxisGrid);
					
				// draw x axis
				window['svgTR'+i].append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + trHeight + ")")
				.call(tr_xAxis)
				.append("text")
				  .attr("class", "label")
				  .attr("x", trWidth2/2)
				  .attr("y", 20)
				  .style("text-anchor", "middle")
				  .text(xAxisText[i-1]);
				
				
				
				// draw top x axis
				window['svgTR'+i].append("g")
							  .attr("class", "x axis")
							  .call(tr_topxAxis);
			}
			
			//================ Draw Chart for Area 6 =====================
			initThemeRiverAxis3(dataCombinedArea2);
			// Draw right y axis
			svgTR6 = d3.select("#area6Div").append("svg")
							.attr("width", trCanvasWidth3 + trMargin3.left + trMargin3.right)
							.attr("height", trHeight3 + trMargin3.top + trMargin3.bottom)
							.append("g")
								.attr("transform", "translate(" + trMargin3.left + "," + trMargin3.top + ")");
											
			svgTR6.selectAll("path")
					.data(stackData)
					.enter().append("path")
					.attr("d", function(d) { return trArea(d.dataArr); })
					.style("fill", function(d) { return d.color; })
					.append("title")
					.text(function(d) { return d.type; });
			
			// draw y axis
			svgTR6.append("g")
				.attr("class", "lightAxis")
				.call(tr_yAxis);
				
			// Draw y axis grid
			svgTR6.append("g")
					.classed('y', true)
					.classed('grid', true)
					.call(yAxisGrid);
					
			// draw x axis
			svgTR6.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + trHeight + ")")
			.call(tr_xAxis)
			.append("text")
			  .attr("class", "label")
			  .attr("x", trWidth3/2)
			  .attr("y", 20)
			  .style("text-anchor", "middle")
			  .text(xAxisText[5]);
			
			// draw top x axis
			svgTR6.append("g")
						  .attr("class", "x axis")
						  .call(tr_topxAxis);
							  
			svgTR6.append("g")
			  .attr("class", "y axis")
			  .attr("transform", "translate(" + trWidth3 + ",0)")
			  .call(tr_RightyAxis3);
		}
	});
}

function drawThemeRiverAxis(){
	
	// draw y axis
	svgTR.append("g")
		.attr("class", "y axis")
		.call(tr_yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -35)
		.attr("dy", ".71em")
		.style("text-anchor", "end");
		//.text("Number of Events");
	
	// Draw y axis grid
	yAxisGrid = tr_yAxis.ticks(5)
    .tickSize(trWidth, 0)
    .tickFormat("")
    .orient("right");
	
	svgTR.append("g")
    .classed('y', true)
    .classed('grid', true)
    .call(yAxisGrid);

	// draw x axis
	svgTR.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + trHeight + ")")
	.call(tr_xAxis)
	.append("text")
		  .attr("class", "label")
		  .attr("x", trWidth/2)
		  .attr("y", 20)
		  .style("text-anchor", "middle")
		  .text(xAxisText[0]);
	
	// draw top x axis
	svgTR.append("g")
				  .attr("class", "x axis")
				  .call(tr_topxAxis);
}


function drawThemeRiverChart(){
	// Append Canvas 
	svgTR = d3.select("#area1Div").append("svg")
				.attr("width", trCanvasWidth + trMargin.left + trMargin.right)
				.attr("height", trHeight + trMargin.top + trMargin.bottom)
				.append("g")
					.attr("transform", "translate(" + trMargin.left + "," + trMargin.top + ")");
								
	svgTR.selectAll("path")
			.data(stackData)
			.enter().append("path")
			.attr("d", function(d) { return trArea(d.dataArr); })
			.style("fill", function(d) { return d.color; })
			.append("title")
			.text(function(d) { return d.type; });
}

function initThemeRiverAxis(inputDataCombined){

	// Define Margin for ThemeRiver graph
	trMargin = {top: 30, right: 0, bottom: 20, left: 70},
	trWidth = width - trMargin.left - trMargin.right,
	trHeight = height - trMargin.top - trMargin.bottom,
	trCanvasWidth = width - trMargin.left - trMargin.right;
	
	// Define scale
	tr_x = d3.scale.linear().range([0, trWidth]),
	tr_y = d3.scale.linear().range([trHeight, 0]);
	
	// Get minimum and maximum y value
	minX = getMinY(inputDataCombined),
	maxX = getMaxY(inputDataCombined);
	
	// Set X axis Domain
	trMinY = d3.min(data, function(d) {return parseFloat(d.sessionName);});
	trMaxY = d3.max(data, function(d) {return parseFloat(d.sessionName);});
	tr_x.domain([minX-1, maxX+1]);
	

	
	tr_y.domain([trMaxY, 1]);

	
	tr_yAxis = d3.svg.axis()
				.scale(tr_y)
				.tickFormat(function(d) { return "Session " + d;})
				.orient("left").ticks(5);
	

	
	tr_xAxis = d3.svg.axis()
				.scale(tr_x)
				.orient("bottom").ticks(0);
	
	tr_topxAxis = d3.svg.axis().scale(tr_x).orient("top").ticks(0);
				
}

function initThemeRiverAxis2(inputDataCombined){

	// Define Margin for ThemeRiver graph
	trMargin2 = {top: 30, right: 0, bottom: 20, left: 0},
	trWidth2 = width2 - trMargin2.left - trMargin2.right,
	trHeight2 = height - trMargin2.top - trMargin2.bottom,
	trCanvasWidth2 = width2 - trMargin2.left - trMargin2.right;
	
	// Define scale
	tr_x2 = d3.scale.linear().range([0, trWidth2]),
	tr_y2 = d3.scale.linear().range([trHeight2, 0]);
	
	// Get minimum and maximum y value
	minX2 = getMinY(inputDataCombined),
	maxX2 = getMaxY(inputDataCombined);
	
	// Set X axis Domain
	trMinY2 = d3.min(data, function(d) {return parseFloat(d.sessionName);});
	trMaxY2 = d3.max(data, function(d) {return parseFloat(d.sessionName);});
	tr_x2.domain([minX2-1, maxX2+1]);
	

	
	tr_y2.domain([trMaxY2, 1]);

	
	tr_yAxis2 = d3.svg.axis()
				.scale(tr_y2)
				.orient("left");
	
	tr_xAxis2 = d3.svg.axis()
				.scale(tr_x2)
				.orient("bottom").ticks(0);
				
}

function initThemeRiverAxis3(inputDataCombined){

	// Define Margin for ThemeRiver graph
	trMargin3 = {top: 30, right: 10, bottom: 20, left: 0},
	trWidth3 = width3 - trMargin3.left - trMargin3.right,
	trHeight3 = height - trMargin3.top - trMargin3.bottom,
	trCanvasWidth3 = width3 - trMargin3.left - trMargin3.right;
	
	// Define scale
	tr_x3 = d3.scale.linear().range([0, trWidth3]),
	tr_y3 = d3.scale.linear().range([trHeight3, 0]);
	
	// Get minimum and maximum y value
	minX3 = getMinY(inputDataCombined),
	maxX3 = getMaxY(inputDataCombined);
	
	// Set X axis Domain
	trMinY3 = d3.min(data, function(d) {return parseFloat(d.sessionName);});
	trMaxY3 = d3.max(data, function(d) {return parseFloat(d.sessionName);});
	tr_x3.domain([minX-1, maxX+1]);
	

	
	tr_y3.domain([trMaxY3, 1]);

	
	tr_yAxis3 = d3.svg.axis()
				.scale(tr_y3)
				.tickFormat(function(d) { return "Session " + d;})
				.orient("left").ticks(5);
	
	tr_xAxis3 = d3.svg.axis()
				.scale(tr_x3)
				.orient("bottom").ticks(0);
	
	tr_RightyAxis3 = d3.svg.axis().scale(tr_y3).orient("right").ticks(0);
				
}

function getMinY(inputArray){

	var minYValue = 0;
	for(var i = 0; i < inputArray.length; i++){
		if( minYValue > d3.min(inputArray[i].dataArr, function(d) { return d.y + d.y0; })){
			minYValue = d3.min(inputArray[i].dataArr, function(d) { return d.y + d.y0; });
		}
	}
	
	return minYValue;
}

function getMaxY(inputArray){
	var maxYValue = 0;
	for(var i = 0; i < inputArray.length; i++){
		if( maxYValue < d3.max(inputArray[i].dataArr, function(d) { return d.y + d.y0; })){
			maxYValue = d3.max(inputArray[i].dataArr, function(d) { return d.y + d.y0; });
		}
	}
	
	return maxYValue;
}

function defineAreaFunction(){
	trArea = d3.svg.area()
		.interpolate(interpolationType)
		.y(function(d) { return tr_y(d.sessionName); })
		.x0(function(d) { return tr_x(d.y0); })
		.x1(function(d) { return tr_x(d.y0 + d.y); });
	
}

function defineStackFunction(){
	// Define the stack
	stack = d3.layout.stack()
			.offset(offsetType)
			.values(function(d) { return d.dataArr; })
			.x(function(d){return d.sessionName;})
			.y(function(d){return d.noOfEvent;});
			
}

// Function to check if it's a Positive event
function isPositive(element) {
	return element.eventCat == "Positive";
}

// Function to check if it's a Negative event
function isNegative(element) {
	return element.eventCat == "Negative";
}

// Function to check if it's a Neutral event
function isNeutral(element) {
	return element.eventCat == "Neutral";
}

// Function to check if it's for Area1
function isArea1(element) {
	return element.xArea == "1";
}

// Function to check if it's for Area2
function isArea2(element) {
	return element.xArea == "2";
}