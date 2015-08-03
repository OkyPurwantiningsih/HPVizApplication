// Define variable
var data, stack, trArea, trAreaSummary, dataCombined, stackData;
var trColor = ["rgb(251,128,144)", "rgb(255,255,179)", "rgb(141,211,199)", "rgb(255,255,255)"],
	eventType = ["Negative","Neutral","Positive"];
var offsetType = "silhouette",//"wiggle",
    interpolationType = "cardinal";
var width = 200,
	height = 400,
	width2 = 130,
	width3 = 140;
var trMargin,trWidth,trHeight,trCanvasWidth,tr_x,tr_y, tr_xAxis, yAxisGrid;
var trMargin2,trWidth2,trHeight2,trCanvasWidth2,tr_y2;
var trMargin3,trWidth3,trHeight3,trCanvasWidth3,tr_y3, tr_xAxis3, tr_RightyAxis3;
var svgTR2, svgTR3, svgTR7;
var xAxisText = ["-15 to -10","-10 to -5","-5 to 0","0 to 5","5 to 10","10 to 15", "Summary"];
var area1Data,area2Data,area3Data,area4Data,area5Data,area6Data,area7Data;
var dataCombinedArea1, dataCombinedArea2, dataCombinedArea3, dataCombinedArea4, dataCombinedArea5, dataCombinedArea6, dataCombinedArea7;
var stackData1,stackData2,stackData3,stackData4,stackData5,stackData6, stackData7;
var maxYAfterStacked1, maxYAfterStacked2, maxYAfterStacked3, maxYAfterStacked4, maxYAfterStacked5, maxYAfterStacked6, maxYAfterStacked7;
var yTickValues, yValues;
//var sessions = "1,2,6";
//var sessionArr = sessions.split(",");
var dataFiltered = [];
	
$(document).ready(function (){
	DrawGraph();
})

function DrawGraph(){

	d3.json("data/"+patientName+"/summary.json", function(error, dataAll) {
	//d3.json("data/summary.json", function(error, dataAll) {
		if(error){
			console.log(error);
			alert("Data can't be loaded");
		}else{
			// Change the value to integer
			dataAll.forEach( function(d){
				d.noOfEvent = +d.noOfEvent;
			});
			
			// Prepare data for stacking
			// data is the global variable which represent the data from json file
			data = dataAll;
			filterSessions();
			dataAll = dataFiltered;
			data = dataAll;
			area1Data = dataAll.filter(isArea1),
			area2Data = dataAll.filter(isArea2),
			area3Data = dataAll.filter(isArea3),
			area4Data = dataAll.filter(isArea4),
			area5Data = dataAll.filter(isArea5),
			area6Data = dataAll.filter(isArea6),
			area7Data = dataAll.filter(isArea7);
			
			defineStackFunction();
			defineAreaFunction();
			defineSummaryAreaFunction();
			
			// ============= Data Initialization ===================
			for(var i = 1; i < 8; i++){
				window['newDataPosArea'+i] = window['area'+i+'Data'].filter(isPositive),
				window['newDataNetArea'+i] = window['area'+i+'Data'].filter(isNeutral),
				window['newDataNegArea'+i] = window['area'+i+'Data'].filter(isNegative);
				
				window['dataCombinedArea'+i] = [{type:eventType[0], dataArr: window['newDataNegArea'+i], color:trColor[0]},
												{type:eventType[1], dataArr: window['newDataNetArea'+i], color:trColor[1]},
												{type:eventType[2], dataArr: window['newDataPosArea'+i], color:trColor[2]}];
								
				window['stackData'+i] = stack(window['dataCombinedArea'+i]);
				
			}

			//============== Draw Chart for Area 1 =======================
			
			initAxisArea1(dataCombinedArea1);
			drawChartArea1();
			drawAxisArea1();
			
			// ============= Draw Chart for Area 2-5 ===================
			for(var i = 2; i < 6; i++){
				
				
				initCanvas();
			
				window['svgTR'+i] = d3.select("#area"+i+"Div").append("svg")
							.attr("width", trCanvasWidth2 + trMargin2.left + trMargin2.right)
							.attr("height", trHeight2 + trMargin2.top + trMargin2.bottom)
							.append("g")
								.attr("transform", "translate(" + trMargin2.left + "," + trMargin2.top + ")");
											
				window['svgTR'+i].selectAll("path")
						.data(window['stackData'+i])
						.enter().append("path")
						.attr("d", function(d) { return trArea(d.dataArr); })
						.style("fill", function(d) { return d.color; })
						.append("title")
						.text(function(d) { return d.type; });
				
				window['maxYAfterStacked'+i] = getMaxY2(window['stackData'+i]);
				window['svgTR'+i].selectAll("path").attr("transform", function(d){ return "translate("+ tr_x((maxX/2)-(window['maxYAfterStacked'+i]/2)) + "," + 0 + ")"; });
						
				// draw y axis
				window['svgTR'+i].append("g")
					.attr("class", "lightAxis")
					.call(tr_yAxis);
					
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
				  .attr("y", 15)
				  .style("text-anchor", "middle")
				  .text(xAxisText[i-1]);
				
				
				
				// draw top x axis
				window['svgTR'+i].append("g")
							  .attr("class", "x axis")
							  .call(tr_topxAxis);
			}
			//================ Draw Chart for Area 7 =====================
			initThemeRiverAxis3(dataCombinedArea7);
			
			svgTR6 = d3.select("#area6Div").append("svg")
							.attr("width", trCanvasWidth3 + trMargin3.left + trMargin3.right)
							.attr("height", trHeight3 + trMargin3.top + trMargin3.bottom)
							.append("g")
								.attr("transform", "translate(" + trMargin3.left + "," + trMargin3.top + ")");
						
			svgTR6.selectAll("path")
					.data(stackData6)
					.enter().append("path")
					.attr("d", function(d) { return trArea(d.dataArr); })
					.style("fill", function(d) { return d.color; })
					.append("title")
					.text(function(d) { return d.type; });
			
			maxYAfterStacked6 = getMaxY2(stackData6);
			svgTR6.selectAll("path").attr("transform", function(d){ return "translate("+ tr_x((maxX/2)-(maxYAfterStacked6/2)) + "," + 0 + ")"; });
			
			// Draw Right y Axis
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
			.call(tr_xAxis3)
			.append("text")
			  .attr("class", "label")
			  .attr("x", trWidth3/2)
			  .attr("y", 15)
			  .style("text-anchor", "middle")
			  .text(xAxisText[5]);
			
			// draw top x axis
			svgTR6.append("g")
						  .attr("class", "x axis")
						  .call(tr_topxAxis);
			
			// Draw Right y Axis
			svgTR6.append("g")
			  .attr("class", "y axis")
			  .attr("transform", "translate(" + trWidth3 + ",0)")
			  .call(tr_RightyAxis3);
			  
			//================ Draw Chart for Area 7 =====================
			
			
			
			// Draw right y axis
			svgTR7 = d3.select("#area7Div").append("svg")
							.attr("width", trCanvasWidth3 + trMargin3.left + trMargin3.right)
							.attr("height", trHeight3 + trMargin3.top + trMargin3.bottom)
							.append("g")
								.attr("transform", "translate(" + trMargin3.left + "," + trMargin3.top + ")");
						
			svgTR7.selectAll("path")
					.data(stackData7)
					.enter().append("path")
					.attr("d", function(d) { return trAreaSummary(d.dataArr); })
					.style("fill", function(d) { return d.color; })
					.append("title")
					.text(function(d) { return d.type; });
					
			//maxYAfterStacked7 = getMaxY2(stackData7);
			//svgTR7.selectAll("path").attr("transform", function(d){ return "translate("+ ((maxX/2)-(maxYAfterStacked7/2)) + "," + 0 + ")"; });

			// draw Left y axis
			/*svgTR7.append("g")
				.attr("class", "lightAxis")
				.call(tr_yAxis);*/
				
			// Draw y axis grid
			svgTR7.append("g")
					.classed('y', true)
					.classed('grid', true)
					.call(yAxisGrid);
					
			// draw x axis
			svgTR7.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + trHeight + ")")
			.call(tr_xAxis3)
			.append("text")
			  .attr("class", "label")
			  .attr("x", trWidth3/2)
			  .attr("y", 15)
			  .style("text-anchor", "middle")
			  .text(xAxisText[6]);
			
			// draw top x axis
			svgTR7.append("g")
						  .attr("class", "x axis")
						  .call(tr_topxAxis);
			
			// Draw Right y Axis
			/*svgTR7.append("g")
			  .attr("class", "y axis")
			  .attr("transform", "translate(" + trWidth3 + ",0)")
			  .call(tr_RightyAxis3);*/
			  
			/*svgTR7.append("g")
				.attr("class", "lightAxis")
				.attr("transform", "translate(" + trWidth3 + ",0)")
				.call(tr_yAxis);*/
		
		
		
		}
	});
}
function filterSessions(){
	//dataFiltered = data.filter(function(d) { return d.sessionName == sessionArr[0] });
	sessionArr = sessions.split(",");
	for(var i = 0; i < sessionArr.length; i++){
		dataFiltered = dataFiltered.concat(data.filter(function(d) { return d.sessionName == sessionArr[i] }));
	}

}

function drawAxisArea1(){
	
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
		  .attr("y", 15)
		  .style("text-anchor", "middle")
		  .text(xAxisText[0]);
	
	// draw top x axis
	svgTR.append("g")
				  .attr("class", "x axis")
				  .call(tr_topxAxis);
}


function drawChartArea1(){
	// Append Canvas 
	svgTR = d3.select("#area1Div").append("svg")
				.attr("width", trCanvasWidth + trMargin.left + trMargin.right)
				.attr("height", trHeight + trMargin.top + trMargin.bottom)
				.append("g")
					.attr("transform", "translate(" + trMargin.left + "," + trMargin.top + ")");
								
	svgTR.selectAll("path")
			.data(stackData1)
			.enter().append("path")
			.attr("d", function(d) { return trArea(d.dataArr); })
			.style("fill", function(d) { return d.color; })
			.append("title")
			.text(function(d) { return d.type; });
	
	maxYAfterStacked = getMaxY2(stackData1);
	svgTR.selectAll("path").attr("transform", function(d){ return "translate("+ tr_x((maxX/2)-(maxYAfterStacked/2)) + "," + 0 + ")"; });

}

function initAxisArea1(inputDataCombined){

	// Define Margin for ThemeRiver graph
	trMargin = {top: 30, right: 0, bottom: 20, left: 70},
	trWidth = width - trMargin.left - trMargin.right,
	trHeight = height - trMargin.top - trMargin.bottom,
	trCanvasWidth = width - trMargin.left - trMargin.right;
	
	yValues = d3.set(data.map(function (d) { return d.sessionName; }))
				.values()
				.sort(function compareString(a,b){
						if (parseInt(a)<parseInt(b))
							return 1;
						if (parseInt(a)>parseInt(b))
							return -1;
							
						return 0;
					});

	// Define scale
	tr_x = d3.scale.linear().range([0, trWidth]),
	//tr_y = d3.scale.linear().range([trHeight, 0]);
	
	tr_y = d3.scale.ordinal()
    .domain(yValues)
    // Setting the rangePoints instead of rangeBands
    .rangePoints([trHeight, 0],0);
	
	// Get minimum and maximum x value for all area
	// Final x value is calculated from initial y and y0 value since the chart is vertical
	minX = getMinY(),
	maxX = getMaxY();
	
	// Set X axis Domain
	trMinY = d3.min(data, function(d) {return parseFloat(d.sessionName);});
	trMaxY = d3.max(data, function(d) {return parseFloat(d.sessionName);});
	tr_x.domain([minX-1, maxX+1]);
	

	
	//tr_y.domain([trMaxY, 1]);

	yTickValues = data.map(function(d){return d.sessionName;}); 
    //array of all y-values
    yTickValues = d3.set(yTickValues).values(); 
	
	tr_yAxis = d3.svg.axis()
				.scale(tr_y)
				.tickFormat(function(d) { return "Session " + d;})
				.orient("left")
				.tickValues(yTickValues);
	
	
	tr_xAxis = d3.svg.axis()
				.scale(tr_x)
				.orient("bottom").ticks(0);
	
	tr_topxAxis = d3.svg.axis().scale(tr_x).orient("top").ticks(0);
				
}

function initCanvas(){

	// Define Margin for ThemeRiver graph
	trMargin2 = {top: 30, right: 0, bottom: 20, left: 0},
	trWidth2 = width2 - trMargin2.left - trMargin2.right,
	trHeight2 = height - trMargin2.top - trMargin2.bottom,
	trCanvasWidth2 = width2 - trMargin2.left - trMargin2.right;
				
}

function initThemeRiverAxis3(inputDataCombined){

	// Define Margin for ThemeRiver graph
	trMargin3 = {top: 30, right: 10, bottom: 20, left: 0},
	trWidth3 = width3 - trMargin3.left - trMargin3.right,
	trHeight3 = height - trMargin3.top - trMargin3.bottom,
	trCanvasWidth3 = width3 - trMargin3.left - trMargin3.right;
	
	// Define scale
	tr_x3 = d3.scale.linear().range([0, trWidth3]),
	//tr_y3 = d3.scale.linear().range([trHeight3, 0]);
	tr_y3 = d3.scale.ordinal()
    .domain(yValues)
    // Setting the rangePoints instead of rangeBands
    .rangePoints([trHeight3, 0],0);
	
	// Get minimum and maximum y value
	minX3 = getMinY2(stackData7),
	maxX3 = getMaxY2(stackData7);

	// Set X axis Domain
	trMinY3 = d3.min(data, function(d) {return parseFloat(d.sessionName);});
	trMaxY3 = d3.max(data, function(d) {return parseFloat(d.sessionName);});
	tr_x3.domain([minX3-1, maxX3+1]);
	

	
	//tr_y3.domain([trMaxY3, 1]);

	
	tr_yAxis3 = d3.svg.axis()
				.scale(tr_y3)
				.tickFormat(function(d) { return "Session " + d;})
				.orient("left")
				.tickValues(yTickValues);
	
	tr_xAxis3 = d3.svg.axis()
				.scale(tr_x3)
				.orient("bottom").ticks(0);
	
	tr_RightyAxis3 = d3.svg.axis().scale(tr_y3).orient("right").ticks(0);
				
}

function getMinY(){
	// Calculate min y value for all area 
	var minYValue = 0;
	for(var j = 1; j < 7; j++){
		for(var i = 0; i < window['dataCombinedArea'+j].length; i++){
			if( minYValue > d3.min(window['dataCombinedArea'+j][i].dataArr, function(d) { return d.y + d.y0; })){
				minYValue = d3.min(window['dataCombinedArea'+j][i].dataArr, function(d) { return d.y + d.y0; });
			}
		}
	}
	
	return minYValue;
}

function getMaxY(){
	// Calculate max y value for all area
	var maxYValue = 0;
	for(var j = 1; j < 7; j++){
		for(var i = 0; i < window['dataCombinedArea'+j].length; i++){
			if( maxYValue < d3.max(window['dataCombinedArea'+j][i].dataArr, function(d) { return d.y + d.y0; })){
				maxYValue = d3.max(window['dataCombinedArea'+j][i].dataArr, function(d) { return d.y + d.y0; });
			}
		}
	}
	return maxYValue;
}

function getMaxY2(inputArray){
	var maxYValue = 0;

	for(var i = 0; i < inputArray.length; i++){
		if( maxYValue < d3.max(inputArray[i].dataArr, function(d) { return d.y + d.y0; })){
			maxYValue = d3.max(inputArray[i].dataArr, function(d) { return d.y + d.y0; });
		}
	}

	return maxYValue;
}

function getMinY2(inputArray){

	var minYValue = 0;

	for(var i = 0; i < inputArray.length; i++){
		if( minYValue > d3.min(inputArray[i].dataArr, function(d) { return d.y + d.y0; })){
			minYValue = d3.min(inputArray[i].dataArr, function(d) { return d.y + d.y0; });
		}
	}

	
	return minYValue;
}

function defineAreaFunction(){
	trArea = d3.svg.area()
		.interpolate(interpolationType)
		.y(function(d) { return tr_y(d.sessionName); })
		.x0(function(d) { return tr_x(d.y0); })
		.x1(function(d) { return tr_x(d.y0 + d.y); });
	
}

function defineSummaryAreaFunction(){
	trAreaSummary = d3.svg.area()
		.interpolate(interpolationType)
		.y(function(d) { return tr_y3(d.sessionName); })
		.x0(function(d) { return tr_x3(d.y0); })
		.x1(function(d) { return tr_x3(d.y0 + d.y); });
	
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

// Function to check if it's for Area3
function isArea3(element) {
	return element.xArea == "3";
}

// Function to check if it's for Area4
function isArea4(element) {
	return element.xArea == "4";
}

// Function to check if it's for Area5
function isArea5(element) {
	return element.xArea == "5";
}

// Function to check if it's for Area6
function isArea6(element) {
	return element.xArea == "6";
}

// Function to check if it's for Area7
function isArea7(element) {
	return element.xArea == "7";
}