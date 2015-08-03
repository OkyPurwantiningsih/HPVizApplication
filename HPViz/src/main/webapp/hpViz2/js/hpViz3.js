// Define General Variables
var data, dataAllGrouped, dataPosGrouped, dataNetGrouped, dataNegGrouped;
var leftChartWidth = 550,
	topChartHeight = 250,
	rightChartWidth = 650,
	bottomChartHeight = 550;
// Define Variables for HeatMap
var hmArrColLen, hmArray, hmYAxisText = "Screen Speed (s)";
var hmMargin, hmWidth, hmHeight, hmXValue, hmXScale, hmXMap, hmBottomXAxis, hmTopXAxis, 
    hmYValue, hmYScale, hmYMap, hmLeftYAxis, hmRightYAxis, svgHMAxis, hmMinY, hmMaxY;

// Define Variables for ThemeRiver
var dataPosGroupedCopy, dataNetGroupedCopy, dataNegGroupedCopy, dataCombined;
var trColor = ["rgb(251,128,144)", "rgb(255,255,179)", "rgb(141,211,199)", "rgb(255,255,255)"],
	eventType = ["Negative","Neutral","Positive"],
	selectedTRType = "linear", //silhouette
    interpolationType = "monotone";
var trMargin, trWidth, trHeight, tr_x, tr_y, tr_xAxis, tr_yAxis, trMinY, trMaxY;
var stack, stackData, trArea, svgTR;

// Define Variables for changing events
var newDataPosGrouped, newDataNetGrouped, newDataNegGrouped, 
	newDataPos, newDataNet, newDataNeg, newDataCombined, emptyArr;
var selectedObject = "All";

$(document).ready(function (){
	DrawGraph();
})

// Function to initialize graph
function DrawGraph(){
	

	// Load Data
	console.log(jsonDoc);
	d3.json("data/"+jsonDoc+".json", function(error, dataAll) {
	//d3.json("data/hpSummary5.json", function(error, dataAll) {
		if(error){
			console.log(error);
			alert("Data can't be loaded");
		}else{
			
			// Change the value to integer
			dataAll.logs.forEach( function(d){
				d.x = +d.x;
				d.screenV = +d.screenV;
			});
			
			// By default, show all object types
			dataAll = dataAll.logs;
			data = dataAll;
			var newDataPos = dataAll.filter(isPositive),
				newDataNet = dataAll.filter(isNeutral),
				newDataNeg = dataAll.filter(isNegative),
				dataPos = dataAll.filter(isPositive),
				dataNet = dataAll.filter(isNeutral),
				dataNeg = dataAll.filter(isNegative);
			
			// Calculate column length for Heatmap Array
			hmArrColLen = d3.max(getMaxScreenV(newDataPos),getMaxScreenV(newDataNeg));
			
			// Group data by x axis integer and count the number of events, then discretisize
			dataAllGrouped = getEventsNumberOverX(dataAll),
			newDataPosGrouped = discretisize(dataAllGrouped,getEventsNumberOverX(newDataPos)),
			newDataNetGrouped = discretisize(dataAllGrouped,getEventsNumberOverX(newDataNet)),
			newDataNegGrouped = discretisize(dataAllGrouped,getEventsNumberOverX(newDataNeg));
			
			newDataPosGroupedCopy = deepCopy(newDataPosGrouped);
			newDataNetGroupedCopy = deepCopy(newDataNetGrouped);
			newDataNegGroupedCopy = deepCopy(newDataNegGrouped);
			dataCombined = [{type:eventType[0], dataArr: newDataNegGroupedCopy, color:trColor[0]},
							{type:eventType[1], dataArr: newDataNetGroupedCopy, color:trColor[1]},
							{type:eventType[2], dataArr: newDataPosGroupedCopy, color:trColor[2]}];
			
			emptyArr = new Array();
			//20150703: disable push newDataEntry since it's useless
			//emptyArr.push(new newDataEntry(0,0));
			emptyArr = discretisize(dataAllGrouped,emptyArr);
			// ============= Draw Theme River graph ==================
			
			// Define Stack
			defineStackFunction();
				
			// Stack the data
			stackData = stack(dataCombined);
			initThemeRiverAxis(selectedTRType, dataCombined);
			drawThemeRiverChart();
			drawThemeRiverAxis();
			drawThemeRiverLegend();
			
			// ============== Draw Heat Map ==========================
			hmArray = generateHeatMapArray(dataPos, dataNet, dataNeg);
			
			initHeatMap();
			
			// Set Axis domain
			hmMinY = d3.max(hmArray, hmYValue)-2;
			hmMaxY = d3.max(hmArray, hmYValue)+2;
			hmXScale.domain([minX-1, maxX+1]);
			//hmYScale.domain([hmMaxY*(-1), hmMaxY]);
			hmYScale.domain([-1.2, 1.2]);
			
			drawHeatMapAxis();
			drawHeatMap();
			
			
			// Call changeObject function when user click a radio button
			d3.selectAll("input").on("change", changeObject);
			d3.select("select").on("change", changeTRType);
							
		}
	});

} 

// Function to get maximum screenV value
function getMaxScreenV(inputData){
	return round(d3.max(inputData, function(d) { return d.screenV;})+1)+1;
}

// Function to discretisize data based on the number of x axis integer
function discretisize(referedData, inputData){

	var j=0;
	var k=0;
	var i=0;
	if(inputData.length==0){
		while(i<referedData.length){
			var newDt = new newDataEntry(referedData[i].key,0);
			inputData.push(newDt);
			i++;
		}
	}
	else{
		while(i<referedData.length){
			// 20150703: Added condition when the size of j is bigger than size of inputData
			if(j>=inputData.length){
				var newDt = new newDataEntry(referedData[i].key,0);
				inputData.push(newDt);
			}
			else if(referedData[i].key!=inputData[j].key){
				var newDt = new newDataEntry(referedData[i].key,0);
				inputData.push(newDt);
			}else{
				j++;
			}
			i++;
			
		}
	}
	
	inputData.sort(function(a, b) {
		return (parseInt(a.key) - parseInt(b.key))
	});
	
	return inputData;
}

// Function to initialize new data entry with two properties: key and values
// For array resulted from d3.nest function
function newDataEntry(key,values){
	this.key = key;
	this.values = values;
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

// Function to check if it's a Bonus
function isBonus(element) {
	return element.spawnType == "Bonus";
}

// Function to check if it's an Enemy
function isEnemy(element) {
	return element.spawnType == "Enemy";
}
// Function to check if it's an Obstacle
function isObstacle(element) {
	return element.spawnType == "Obstacle";
}

// Function to round number to the nearest integer
function round(value, exp) {
	if (typeof exp === 'undefined' || +exp === 0)
		return Math.round(value);

	value = +value;
	exp  = +exp;

	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
		return NaN;

	// Shift
	value = value.toString().split('e');
	value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

	// Shift back
	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

// Function to calculate number of events which happened for each x axis
function getEventsNumberOverX(inputData){
		
		// Calculate number of event for each x position
		// x position is rounded to the nearest integer
		var groupedData = d3.nest()
					.key(function (d) {return round(d.x,0);})
					.sortKeys(function(a, b) {
							return (parseInt(a) - parseInt(b));
							})
					.rollup(function (d) {
						return d.length})
					.entries(inputData);
		
		groupedData.forEach( function(d){
			d.key = +d.key;
			d.values = +d.values;
			//console.log(d);
		});
		
		return groupedData;
}

function deepCopy (arr) {
    var out = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var item = arr[i];
        var obj = {};
        for (var k in item) {
            obj[k] = item[k];
        }
        out.push(obj);
    }
    return out;
}

function initThemeRiverAxis(trChartType, inputDataCombined){

	// Define Margin for ThemeRiver graph
	trMargin = {top: 30, right: 40, bottom: 20, left: 40},
	trWidth = leftChartWidth - trMargin.left - trMargin.right,
	trHeight = topChartHeight - trMargin.top - trMargin.bottom,
	trCanvasWidth = rightChartWidth - trMargin.left - trMargin.right;
	
	// Define scale
	tr_x = d3.scale.linear().range([0, trWidth]),
	tr_y = d3.scale.linear().range([trHeight, 0]);

	// Set X axis Domain
	minX = d3.min(data, function(d) {return parseFloat(d.x);});
	maxX = d3.max(data, function(d) {return parseFloat(d.x);});
	tr_x.domain([minX-1, maxX+1]);
	
	setTRYAxis(trChartType, inputDataCombined);
	
	// Define X axis properties and Y axis Domain
	if(trChartType=="pos"){
		var xAxisOrientation = "top";
	}else{
		var xAxisOrientation = "bottom";
	}
	
	tr_xAxis = d3.svg.axis()
				.scale(tr_x)
				.orient(xAxisOrientation);
}

function setTRYAxis(trChartType, inputData){

	// Get minimum and maximum y value
	trMinY = getMinY(inputData),
	trMaxY = getMaxY(inputData);
	
	switch(trChartType) {
	case "pos": 	
		{ tr_y.domain([trMaxY+1, 0]);
		  break;
		}
	case "net-neg":
	case "pos-net":
		{ tr_y.domain([trMinY-1, trMaxY+1]);
		  break;
		}
	default:
		{ tr_y.domain([0, trMaxY+1]);
		  break;
		}
	}
	
	tr_yAxis = d3.svg.axis()
				.scale(tr_y)
				.orient("left").ticks(5);
	
	// Recalculate the area
	trArea = d3.svg.area()
		.interpolate(interpolationType)
		.x(function(d) { 
						return tr_x(d.key); })
		.y0(function(d) { return tr_y(d.y0); })
		.y1(function(d) { return tr_y(d.y0 + d.y); });
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

function drawThemeRiverChart(){
	// Append Canvas 
	svgTR = d3.select("#themeRiverDiv").append("svg")
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

function changeObject(){

	// ================ Recalculate the data =============================================
	var newValue = this.value;
	if(!(newValue === undefined))
		selectedObject = newValue;
	
	var newData = new Array();
	var bonusChosen = false, 
		enemyChosen = false, 
		obstacleChosen = false,
		allChosen = false;
		
	newDataPosGrouped = new Array(),
	newDataNetGrouped = new Array(),
	newDataNegGrouped = new Array();
	
	switch(selectedObject) {
	case "Bonus": 	
		{ newData = data.filter(isBonus);
		  bonusChosen = true;
		  break;
		}
	case "Enemy":
		{ newData = data.filter(isEnemy);
		  enemyChosen = true;
		  break;
		}
	case "Obstacle":
		{ newData = data.filter(isObstacle);
		  obstacleChosen = true;
		  break;
		}
	case "All":
		{ newData = data;
		  allChosen = true;
		  break;
		}
	}

	newDataPos = newData.filter(isPositive),
	newDataNet = newData.filter(isNeutral),
	newDataNeg = newData.filter(isNegative);
		
	// Group data by x axis integer and count the number of events, then discretisize
	var newDataAllGrouped = getEventsNumberOverX(newData);
	
	if(newDataPos.length > 0){
		newDataPosGrouped = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataPos));
	}
	if(newDataNet.length > 0){
		newDataNetGrouped = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNet));
	}
	if(newDataNeg.length > 0){
		newDataNegGrouped = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNeg));
	}
	
	emptyArr = new Array();
	//emptyArr.push(new newDataEntry(0,0));
	emptyArr = discretisize(newDataAllGrouped,emptyArr);
	
	changeTRType();
	
	// Update HeatMap
	hmArray = generateHeatMapArray(newDataPos, newDataNet, newDataNeg);

	// Update Second HeatMap
	d3.select("#hmCanvas").select("canvas").remove();
	drawHeatMap();
	
}

function changeTRType(){
	
	//changeObject();
	
	var newSelectedTRType = this.value;
	if (!(newSelectedTRType === undefined)) {
		selectedTRType = newSelectedTRType;
	}
	
	defineStackFunction();
	newDataCombined = generateDataCombined();
	initThemeRiverAxis(selectedTRType, newDataCombined);
	setTRYAxis(selectedTRType, newDataCombined);
	switch(selectedTRType) {
	case "pos": 	
		{ tr_y.domain([trMaxY+1, 0]);
		  break;
		}
	case "net-neg":
	case "pos-net":
		{ tr_y.domain([trMinY-1, trMaxY+1]);
		  break;
		}
	default:
		{ tr_y.domain([0, trMaxY+1]);
		  break;
		}
	}
	
	// Redraw Axis
	svgTR.select("g.y.axis")
        .transition().duration(1500).ease("sin-in-out")  // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
        .call(tr_yAxis);
		
	svgTR.select("g.x.axis")
		.transition()
		.duration(1500)
		.attr("transform", "translate(0," + (tr_y(0)) + ")")
		.call(tr_xAxis);
	
	// Redraw Theme River	
	if((newDataCombined[0].dataArr.length==newDataCombined[1].dataArr.length)&&(newDataCombined[0].dataArr.length==newDataCombined[2].dataArr.length)){
		svgTR.selectAll("path")
			  .data(newDataCombined)
			  .transition()
			  .duration(2500)
			  .attr("d", function(d) { return trArea(d.dataArr); })
			  .style("fill", function(d) { return d.color; });
	}
}

function compareEventType(a,b){
	if ((a.type=="Positive" && b.type=="Negative") || (a.type=="Positive" && b.type=="Neutral"))
		return -1;
	if ((a.type=="Negative" && b.type=="Neutral") || (a.type=="Negative" && b.type=="Positive"))
		return 1;
	if ((a.type=="Neutral" && b.type=="Positive"))
		return 1;
	if((a.type=="Neutral" && b.type=="Negative"))
		return -1;
		
	return 0;
}

function generateDataCombined(){

	var tmpDataCombined;
	switch(selectedTRType) {
	case "pos": 	
		{ 	tmpDataCombined = generateDataCombinedDef();
			tmpDataCombined.sort(compareEventType);
			return stack(tmpDataCombined);
			break;
		}
	case "net-neg":
		{	tmpDataCombined = generateDataCombinedNetNeg();
			return tmpDataCombined;
			break;
		}
	case "pos-net":
		{ 	tmpDataCombined = generateDataCombinedPosNet();
			return tmpDataCombined;
			break;
		}
	default:
		{ 	tmpDataCombined = generateDataCombinedDef();
			return stack(tmpDataCombined);
			break;
		}
	}
}

function generateDataCombinedPosNet(){

	var newDtCombined, newDtCombinedBottom;
	var newNetCopy = deepCopy(newDataNetGrouped),
		newNegCopy = deepCopy(newDataNegGrouped),
		newPosCopy = deepCopy(newDataPosGrouped);
		
	
	if((newDataNetGrouped.length > 0) && (newDataNegGrouped.length > 0)){
		newDtCombinedBottom = [{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
							{type:eventType[0], dataArr: newNegCopy, color:trColor[0]}];
	}
	if((newDataNetGrouped.length == 0) && (newDataNegGrouped.length > 0)){
		newDtCombinedBottom = [{type:eventType[1], dataArr: emptyArr, color:trColor[1]},
							{type:eventType[0], dataArr: newNegCopy, color:trColor[0]}];
	}
	if((newDataNetGrouped.length > 0) && (newDataNegGrouped.length == 0)){
		newDtCombinedBottom = [{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
							{type:eventType[0], dataArr: emptyArr, color:trColor[0]}];
	}
	

	var newDtCombined = stack(newDtCombinedBottom);
	convertToNeg2(newDtCombined[0].dataArr);
	convertToNeg2(newDtCombined[1].dataArr);
	
	if(newDataPosGrouped.length > 0){
		var newDataCombinedTop = [{type:eventType[2], dataArr: newPosCopy, color:trColor[2]},
								   {type:eventType[0], dataArr: emptyArr, color:trColor[0]}];
								   
		newDtCombined.push(stack(newDataCombinedTop)[0]);
	}
	if(newDataPosGrouped.length == 0){
		var newDataCombinedBottom = [{type:eventType[0], dataArr: emptyArr, color:trColor[0]}];
		var tmpStack = stack(newDataCombinedBottom);
		newDtCombined.push(tmpStack[0]);
	}
	
	return newDtCombined;
}

function generateDataCombinedNetNeg(){
	var newNetCopy = deepCopy(newDataNetGrouped),
		newNegCopy = deepCopy(newDataNegGrouped),
		newPosCopy = deepCopy(newDataPosGrouped);
	
	var newDtCombined, newDtCombinedTop;
	if((newDataNetGrouped.length > 0) && (newDataPosGrouped.length > 0)){
		newDtCombinedTop = [{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
							{type:eventType[2], dataArr: newPosCopy, color:trColor[2]}];
	}
	if((newDataNetGrouped.length == 0) && (newDataPosGrouped.length > 0)){
		newDtCombinedTop = [{type:eventType[1], dataArr: emptyArr, color:trColor[1]},
							{type:eventType[2], dataArr: newPosCopy, color:trColor[2]}];
	}
	if((newDataNetGrouped.length > 0) && (newDataPosGrouped.length == 0)){
		newDtCombinedTop = [{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
							{type:eventType[2], dataArr: emptyArr, color:trColor[2]}];
	}
	
	
	var newDtCombined = stack(newDtCombinedTop);
	if(newDataNegGrouped.length > 0){
		var newDtCombinedBottom = [{type:eventType[0], dataArr: newNegCopy, color:trColor[0]},
								   {type:eventType[2], dataArr: emptyArr, color:trColor[2]}];
		var tmpStack = stack(newDtCombinedBottom);
		
		convertToNeg2(tmpStack[0].dataArr);
		newDtCombined.push(tmpStack[0]);
		//console.log(tmpStack);
	}
	if(newDataNegGrouped.length == 0){
		var newDtCombinedBottom = [{type:eventType[0], dataArr: emptyArr, color:trColor[0]}];
		var tmpStack = stack(newDtCombinedBottom);
		newDtCombined.push(tmpStack[0]);
	}
	
	return newDtCombined;
}
function generateDataCombinedDef(){
	var newNetCopy = deepCopy(newDataNetGrouped),
		newNegCopy = deepCopy(newDataNegGrouped),
		newPosCopy = deepCopy(newDataPosGrouped);
		
	var newDtCombined;
	
	// For Enemy 
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length > 0)){
		//console.log("Enemy Selected");
		newDtCombined = [{type:eventType[0], dataArr: newNegCopy, color:trColor[0]},
						{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
						{type:eventType[2], dataArr: newPosCopy, color:trColor[2]}];
	}
	
	// For Obstacle
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length == 0)){
		//console.log("Obstacle Selected");
		newDtCombined = [{type:eventType[0], dataArr: newNegCopy, color:trColor[0]},
						{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
						{type:eventType[2], dataArr: emptyArr, color:trColor[3]}];
						
	}
	
	// Special Case
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length == 0) && (newDataPosGrouped.length > 0)){
		newDtCombined = [{type:eventType[0], dataArr: newNegCopy, color:trColor[0]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[2], dataArr: newPosCopy, color:trColor[2]}];
	}
	
	// For Bonus
	if((newDataNegGrouped.length == 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length > 0)){
		newDtCombined = [{type:eventType[0], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
						{type:eventType[2], dataArr: newPosCopy, color:trColor[2]}];				
	}
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length == 0) && (newDataPosGrouped.length == 0)){
		//console.log("Only Neg");
		newDtCombined = [{type:eventType[0], dataArr: newNegCopy, color:trColor[0]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[2], dataArr: emptyArr, color:trColor[3]}];
		
	}
	if((newDataNegGrouped.length == 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length == 0)){
		//console.log("Only Neutral");
		newDtCombined = [{type:eventType[0], dataArr: emptyArr, color:trColor[3]},
							{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
							{type:eventType[2], dataArr: emptyArr, color:trColor[3]}];
						
	}
	if((newDataNegGrouped.length == 0) && (newDataNetGrouped.length == 0) && (newDataPosGrouped.length > 0)){
		//console.log("Only Pos");
		newDtCombined = [{type:eventType[0], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[2], dataArr: newPosCopy, color:trColor[2]}];
	}
	
	return newDtCombined;
}

function convertToNeg2(inputData2){
	var tmpValy, tmpValy0;
	for(var j=0; j<inputData2.length; j++){
		tmpValy = (0-inputData2[j].y);
		tmpValy0 = (0-inputData2[j].y0);
		inputData2[j].y = tmpValy;
		inputData2[j].y0 = tmpValy0;
	}
}

function defineStackFunction(){
	// Define the stack
	stack = d3.layout.stack()
			.offset(selectedTRType)
			.values(function(d) { return d.dataArr; })
			.x(function(d){return d.key;})
			.y(function(d){return d.values;});
			
}

function generateHeatMapArray(inputPos, inputNet, inputNeg){
		
	// Process Positive Events
	var pos, hmDataArray = new Array();
	for(var i=0; i < inputPos.length; i++){
		var newX = round(inputPos[i].x);
		var newY = round(inputPos[i].screenV);

		pos = arrayObjectIndexOf(hmDataArray, newX, newY);

		if(pos >= 0){
			// increment the value
			hmDataArray[pos].value = hmDataArray[pos].value + 1;
		}else{
			// insert new object
			hmDataArray.push({ x: newX, y:newY, value: 1});
		}
	}
	
	// Process Neutral Events
	for(var i=0; i < inputNet.length; i++){
		var newX = round(inputNet[i].x);

		pos = arrayObjectIndexOf(hmDataArray, newX, 0);

		if(pos >= 0){
			// increment the value
			hmDataArray[pos].value = hmDataArray[pos].value + 1;
		}else{
			// insert new object
			hmDataArray.push({ x: newX, y:0, value: 1});
		}
	}
	
	// Process Negative Events
	for(var i=0; i < inputNeg.length; i++){
		var newX = round(inputNeg[i].x);
		var newY = (round(inputNeg[i].screenV)*(-1));
		
		pos = arrayObjectIndexOf(hmDataArray, newX, newY);

		if(pos >= 0){
			// increment the value
			hmDataArray[pos].value = hmDataArray[pos].value + 1;
		}else{
			// insert new object
			hmDataArray.push({ x: newX, y:newY, value: 1});
		}
	}
	
	return hmDataArray;
}

function arrayObjectIndexOf(myArray, searchTermX, searchTermY) {
    for(var i = 0; i < myArray.length; i++) {
        if ((myArray[i].x == searchTermX) && (myArray[i].y == searchTermY)) return i;
    }
    return -1;
}

function drawThemeRiverLegend(){

	// define the legend
	var legend = svgTR.selectAll(".legend")
		  .data(dataCombined)
		.enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	// draw legend colored rectangles
	legend.append("rect")
		  .attr("x", trWidth + 25)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", function (d) { return d.color;});

	// draw legend text
	legend.append("text")
		  .attr("x", trWidth + 50)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "start")
		  .text( function (d) { return d.type;});
}

function initHeatMap(){

	hmMargin = {top: 20, right: 140, bottom: 30, left: 40},
	hmWidth = rightChartWidth - hmMargin.left - hmMargin.right,
	hmHeight = bottomChartHeight - hmMargin.top - hmMargin.bottom;
	
	// setup x axis
	hmXValue = function(d) { return d.x;}, 
	hmXScale = d3.scale.linear().range([0, hmWidth]), 
	hmXMap = function(d) { return hmXScale(hmXValue(d));},
	hmBottomXAxis = d3.svg.axis().scale(hmXScale).orient("bottom").ticks(10),
	hmTopXAxis = d3.svg.axis().scale(hmXScale).orient("top").ticks(10);
	
	// setup y axis
	hmYValue = function(d) { return parseInt(d.y);}, 
	hmYScale = d3.scale.linear().range([hmHeight, 0]), 
	hmYMap = function(d) { return hmYScale(hmYValue(d));},
	hmLeftYAxis = d3.svg.axis().scale(hmYScale).orient("left"),
	hmRightYAxis = d3.svg.axis().scale(hmYScale).orient("right");
	
	// add canvas for axis
	svgHMAxis = d3.select("#bgAxis").append("svg")
		.attr("width", hmWidth + hmMargin.left + hmMargin.right)
		.attr("height", hmHeight + hmMargin.top + hmMargin.bottom)
		.append("g")
			.attr("transform", "translate(" + hmMargin.left + "," + hmMargin.top + ")");
	

}

function drawHeatMapAxis(){

	// draw top x axis
	svgHMAxis.append("g")
				  .attr("class", "x axis")
				  .call(hmTopXAxis);
				  
	// draw bottom x axis
	svgHMAxis.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + hmHeight + ")")
		  .call(hmBottomXAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("x", hmWidth)
		  .attr("y", 30)
		  .style("text-anchor", "end")
		  .text("x axis");
			  
	// draw left y-axis
	svgHMAxis.append("g")
		  .attr("class", "y axis")
		  .call(hmLeftYAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", -35)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text(hmYAxisText);

	// draw right y-axis
	svgHMAxis.append("g")
		  .attr("class", "axis")
		  .attr("transform", "translate(" + hmWidth + ",0)")
		  .call(hmRightYAxis);

}

function drawHeatMap(){
	
	var legendCanvas = document.createElement('canvas');
        legendCanvas.width = 100;
        legendCanvas.height = 10;

        var legendCtx = legendCanvas.getContext('2d');
        var gradientCfg = {};
		
		var minSpan = document.getElementById("min"),
		maxSpan = document.getElementById("max");
	
	function updateLegend(data) {
		// the onExtremaChange callback gives us min, max, and the gradientConfig
		// so we can update the legend
		
		var minTxt = document.createTextNode(data.min),
			maxTxt = document.createTextNode(data.max);
		
		minSpan.innerText = minTxt.textContent;
		maxSpan.innerText = maxTxt.textContent;
		
		  // regenerate gradient image
		  if (data.gradient != gradientCfg) {
			gradientCfg = data.gradient;
			var gradient = legendCtx.createLinearGradient(0, 0, 100, 1);
			for (var key in gradientCfg) {
			  gradient.addColorStop(key, gradientCfg[key]);
			}

			legendCtx.fillStyle = gradient;
			legendCtx.fillRect(0, 0, 100, 10);
			$('gradient').src = legendCanvas.toDataURL();
			d3.select("#gradient").attr("src",legendCanvas.toDataURL());
			//console.log(legendCanvas.toDataURL());
		  }
	};
		
	var heatmap = h337.create({
          container: document.getElementById('hmCanvas'),
          maxOpacity: .9,
          radius: 10,
          blur: .75,
		  onExtremaChange: function onExtremaChange(data) {
            updateLegend(data);
          }
		 /* backgroundColor: 'darkblue',
		  // custom gradient colors
		  gradient: {
			// enter n keys between 0 and 1 here
			// for gradient color customization
			'.1': '#00FFFF',
			'.3': 'green',
			'.5': 'yellow',
			'.7': 'red',
			'.9': 'white'
		  }*/
		  // the maximum opacity (the value with the highest intensity will have it)
		  //maxOpacity: .9,
		  // minimum opacity. any value > 0 will produce 
		  // no transparent gradient transition
		  //minOpacity: .3
        });
	
	var newHmArray = [],
		hmMaxVal = 0,
		yMax = 0,
		width = 470,
		height = 500;
		
	// Find max y
	for(var i=0; i<hmArray.length; i++){
		if(hmArray[i].y > yMax) {yMax = hmArray[i].y}
	}
	var arrScale = d3.scale.linear().range([-1, 1]);
	arrScale.domain([yMax*(-1), yMax]);
	for(var j=0; j<hmArray.length; j++){
		
		var x = hmXScale(hmArray[j].x);
		//var y = hmYScale(hmArray[j].y);
		if(hmArray[j].y == 0){
			var y = hmYScale(hmArray[j].y);
		} else {
			var y = hmYScale(round(arrScale(hmArray[j].y),1));
		}
		//console.log(hmArray[j].y+","+round(arrScale(hmArray[j].y),1));
		var c = parseInt(hmArray[j].value);
		var r = 20;
		newHmArray.push({ x: x, y:y, value: c, radius: r });
		if(c > hmMaxVal) { hmMaxVal = c}
		
		
	}
	
	//var rescaledArr = rescaleHMValue(newHmArray, yMax);
	
	var hmData = {
			min: 0,
            max: hmMaxVal,
            data: newHmArray
    };
	heatmap.setData(hmData);
}

function rescaleHMValue(inputArr, arrYMax){
	var rescaledInputArr = [],
		x,y,val,rad;
	console.log("arrYMax:"+arrYMax);
	// Define scale
	var arrScale = d3.scale.linear().range([-1, 1]);
	arrScale.domain([arrYMax*(-1), arrYMax]);
	for(var i=0; i<inputArr.length; i++){
		x = inputArr[i].x;
		newY = round(arrScale(inputArr[i].y),1);
		val = inputArr[i].value;
		rad = inputArr[i].radius;
		console.log(inputArr[i].y+","+newY)
		rescaledInputArr.push({ x: x, y: newY, value: val, radius: rad });
	}
	
	return rescaledInputArr;
}
