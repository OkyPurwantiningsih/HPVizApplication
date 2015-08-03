// Define variable
var data, stack, trArea, dataCombined, stackData;
var trColor = ["rgb(251,128,144)", "rgb(255,255,179)", "rgb(141,211,199)", "rgb(255,255,255)"],
	eventType = ["Negative","Neutral","Positive"];
var offsetType = "silhouette",
    interpolationType = "monotone";
var width = 700,
	height = 200;
var trMargin,trWidth,trHeight,trCanvasWidth,tr_x,tr_y, tr_xAxis;
	
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
			dataAll = dataAll.filter(isArea1);
			var newDataPos = dataAll.filter(isPositive),
				newDataNet = dataAll.filter(isNeutral),
				newDataNeg = dataAll.filter(isNegative);
			
			dataCombined = [{type:eventType[0], dataArr: newDataNeg, color:trColor[0]},
							{type:eventType[1], dataArr: newDataNet, color:trColor[1]},
							{type:eventType[2], dataArr: newDataPos, color:trColor[2]}];
			
			defineStackFunction();
			stackData = stack(dataCombined);
			initThemeRiverAxis(dataCombined);
			
			defineAreaFunction();
			drawThemeRiverChart();
			drawThemeRiverAxis();
		}
	});
}

function drawThemeRiverAxis(){
	
	// draw x axis
	svgTR.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + trHeight + ")")
	.call(tr_xAxis);
		
	// draw y axis
	svgTR.append("g")
		.attr("class", "y axis")
		.call(tr_yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -35)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Number of Events");
}

function drawThemeRiverChart(){
	// Append Canvas 
	svgTR = d3.select("#trDiv").append("svg")
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
	trMargin = {top: 30, right: 40, bottom: 20, left: 40},
	trWidth = width - trMargin.left - trMargin.right,
	trHeight = height - trMargin.top - trMargin.bottom,
	trCanvasWidth = width - trMargin.left - trMargin.right;
	
	// Define scale
	tr_x = d3.scale.linear().range([0, trWidth]),
	tr_y = d3.scale.linear().range([trHeight, 0]);

	// Set X axis Domain
	minX = d3.min(data, function(d) {return parseFloat(d.sessionName);});
	maxX = d3.max(data, function(d) {return parseFloat(d.sessionName);});
	tr_x.domain([minX-1, maxX+1]);
	
	// Get minimum and maximum y value
	trMinY = getMinY(inputDataCombined),
	trMaxY = getMaxY(inputDataCombined);
	
	tr_y.domain([0, trMaxY+1]);

	
	tr_yAxis = d3.svg.axis()
				.scale(tr_y)
				.orient("left").ticks(5);
	
	tr_xAxis = d3.svg.axis()
				.scale(tr_x)
				.orient("bottom");
				
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
		.x(function(d) { return tr_x(d.sessionName); })
		.y0(function(d) { return tr_y(d.y0); })
		.y1(function(d) { return tr_y(d.y0 + d.y); });
	
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
