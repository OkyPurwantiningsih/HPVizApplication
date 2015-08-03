// Define Variables
var data, dataCombined, minX, maxX, maxPosY, hmArrColLen;
var trMargin, trWidth, trHeight, tr_x, tr_y, tr_y_rev, tr_xAxis, tr_xAxis_top, 
	tr_yAxis, tr_yAxis_rev, stack, stackData, trArea, svgTR, stackData2;
var lcMargin, lcWidth;
var arStack, arStackData, line, svgLC, svgAC;
var scMargin, scHeight, scWidth, scXValue, scXScale, scXMap, scBottomXAxis, scTopXAxis,
	scYValue, scYScale, scYMap, scLeftYAxis, scRightYAxis, scPosSvg, scTooltip, posScatterPlot,
	scYAxisText = "Screen Speed (s)";
var scMarginNet, scWidthNet, scHeightNet, scYScaleNet, scYMapNet, scNetSvg, netScatterPlot;
var scMarginNeg, scWidthNeg, scHeightNeg, scYScaleNeg, scYMapNeg, scNegSvg, negScatterPlot,
    scXValueNeg, scXScaleNeg, scXMapNeg, scBottomXAxisNeg, scYValueNeg, scLeftYAxisNeg, scRightYAxisNeg;
var hmArray, hmPosSvg, hmNetSvg, hmNegSvg, arrRows, minXValue, yValue, arrCols, arrColNeg, arrColsAll,
	dx, dy, hcolor, hmWidth, hmHeight;
var hmColorDomain = [0,2,4,6,9],
	hmColorRange = ["rgb(8,48,107)", "green","yellow", "red", "white" ];
var hmMarginNeg, hmWidthNeg, hmHeightNeg, hmXValueNeg, hmXScaleNeg,
	hmXMapNeg, hmXAxisNeg, hmYValueNeg, hmYScaleNeg, hmYMapNeg,
	hmLeftYAxisNeg, hmRightYAxisNeg;
var dataNegGroupedRev, dataNegGroupedCopy, dataNetGroupedRev, dataNetGroupedCopy, dataPosGroupedCopy;
var svgTR3, trMargin3, trWidth3, trHeight3, tr_x3, tr_y3, tr_xAxis3, tr_yAxis3, tm3MaxY, tm3MinY;
var svgTR4, trMargin4, trWidth4, trHeight4, tr_x4, tr_y4, tr_xAxis4, tr_yAxis4, tm4MaxY, tm4MinY;
var hmPosSvg2, hmNegSvg2;
var offsetType = "zero", //silhouette
    interpolationType = "monotone",
	trColor = ["rgb(251,128,144)", "rgb(255,255,179)", "rgb(141,211,199)", "rgb(255,255,255)"],
	eventType = ["Negative","Neutral","Positive"],
	scLegendColor = [{type:"Negative",color:"Red"},
			   {type:"Neutral",color:"Orange"},
			   {type:"Positive",color:"Green"}];
var leftChartWidth = 550,
	rightChartWidth = 650,
    topChartHeight = 250,
	posChartHeight = 250,
	negChartHeight = 250,
	netChartHeight = 50,
	trChart3Height = 500;

$(document).ready(function (){
	DrawGraph();
})

// Function to initialize graph
function DrawGraph(){
	
	initThemeRiver();
	
	// Load Data
	d3.json("data/hpSummary5.json", function(error, dataAll) {
		if(error){
			console.log(error);
			alert("Data can't be loaded");
		}else{
			
			dataAll.forEach( function(d){
				d.x = +d.x;
				d.screenV = +d.screenV;
				//console.log(d);
			});
			
			// By default, show all object types
			data = dataAll;
			var dataPos = dataAll.filter(isPositive),
				dataNet = dataAll.filter(isNeutral),
				dataNeg = dataAll.filter(isNegative);
			
			hmArrColLen = calculateArrColLen(dataPos);
			//console.log(hmArrColLen);
			
			// Group data by x axis integer and count the number of events, then discretisize
			var dataAllGrouped = getEventsNumberOverX(dataAll),
				dataPosGrouped = discretisize(dataAllGrouped,getEventsNumberOverX(dataPos)),
				dataNetGrouped = discretisize(dataAllGrouped,getEventsNumberOverX(dataNet)),
				dataNegGrouped = discretisize(dataAllGrouped,getEventsNumberOverX(dataNeg));
			
			dataPosGroupedCopy = deepCopy(dataPosGrouped);
			dataCombined = [{type:eventType[0], dataArr: dataNegGrouped, color:trColor[0]},
								{type:eventType[1], dataArr: dataNetGrouped, color:trColor[1]},
								{type:eventType[2], dataArr: dataPosGrouped, color:trColor[2]}];
			
			dataCombined2 = [{type:eventType[2], dataArr: dataPosGrouped, color:trColor[2]},
								{type:eventType[1], dataArr: dataNetGrouped, color:trColor[1]},
								{type:eventType[0], dataArr: dataNegGrouped, color:trColor[0]}];

			dataCombinedTop3 = [{type:eventType[1], dataArr: dataNetGrouped, color:trColor[1]},
								{type:eventType[2], dataArr: dataPosGrouped, color:trColor[2]}];
			
			dataCombinedTop4 = [{type:eventType[2], dataArr: dataPosGroupedCopy, color:trColor[2]}];
			
								
			// ============= Draw Theme River graph ==================
			
			// Append Canvas 
			svgTR = d3.select("#themeRiverDiv").append("svg")
						.attr("width", trWidth + trMargin.left + trMargin.right)
						.attr("height", trHeight + trMargin.top + trMargin.bottom)
						.append("g")
							.attr("transform", "translate(" + trMargin.left + "," + trMargin.top + ")");
							
			
			// Define the Stack
			stack = d3.layout.stack()
						.offset(offsetType)
						.values(function(d) { return d.dataArr; })
						.x(function(d){return d.key;})
						.y(function(d){return d.values;});
				
			stackData = stack(dataCombined);
			//console.log(stackData);

			var	color = d3.scale.linear()
						.range(function(d) {return d.color;});
			
			// Set Axis Domain
			minX = d3.min(dataAll, function(d) {return parseFloat(d.x);});
			maxX = d3.max(dataAll, function(d) {return parseFloat(d.x);});
			tr_x.domain([minX-1, maxX+1]);
			tr_y.domain([0, d3.max(dataAllGrouped, function(d) { return d.values; })]);
			tr_y_rev.domain([d3.max(dataAllGrouped, function(d) { return d.values; }), 0]);


			trArea = d3.svg.area()
						.interpolate(interpolationType)
						.x(function(d) { 
										//console.log("x:"+d.key+","+x(d.key));
										return tr_x(d.key); })
						.y0(function(d) { return tr_y(d.y0); })
						.y1(function(d) { return tr_y(d.y0 + d.y); });
			
			svgTR.selectAll("path")
					.data(stackData)
					.enter().append("path")
					.attr("d", function(d) { return trArea(d.dataArr); })
					.style("fill", function(d) { return d.color; })
					.append("title")
					.text(function(d) { return d.type; });
			
			drawThemeRiverAxis();
			
			// ============= Draw Area Chart ==================
			
			// Define the area
			arArea = d3.svg.area()
				.x(function(d) { return tr_x(d.key); })
				.y0(function(d) { return tr_y(d.y0); })
				.y1(function(d) { return tr_y(d.y0 + d.y); });
			
			// Define the Stack
			/*arStack = d3.layout.stack()
						.values(function(d) { return d.dataArr; })
						.x(function(d){return d.key;})
						.y(function(d){return d.values;});
			
			arStackData = arStack(dataCombined);
			
			svgAC = d3.select("#lineChartDiv").append("svg")
					.attr("width", trWidth + trMargin.left + trMargin.right)
					.attr("height", trHeight + trMargin.top + trMargin.bottom)
			  .append("g")
				.attr("transform", "translate(" + trMargin.left + "," + trMargin.top + ")");
			
			var objArea = svgAC.selectAll(".objArea")
				  .data(arStackData)
				.enter().append("g")
				  .attr("class", "objArea");

			objArea.append("path")
				  .attr("class", "area")
				  .attr("d", function(d) { return arArea(d.dataArr); })
				  .style("fill", function(d) { return d.color; });
			
			drawAreaChartAxis();*/
			// ============= Draw Line Chart ==================
			
			initLineChart();
			line = d3.svg.line()
					.x(function(d) { return tr_x(d.key); })
					.y(function(d) { return tr_y(d.y); });
					
			svgLC = d3.select("#lineChartDiv").append("svg")
					.attr("width", lcWidth + trMargin.left + trMargin.right)
					.attr("height", trHeight + trMargin.top + trMargin.bottom)
					.append("g")
					.attr("transform", "translate(" + trMargin.left + "," + trMargin.top + ")");
			
			 var objLine = svgLC.selectAll(".objectLine")
							.data(dataCombined)
							.enter().append("g")
							.attr("class", "objectLine");

			/*objLine.append("path")
					.attr("class", "line")
					.attr("d", function(d) { return line(d.dataArr); })
					.style("stroke", function(d) { return d.color; });*/
			
			stackData2 = stack(dataCombined2);
			
			trAreaRev = d3.svg.area()
						.interpolate(interpolationType)
						.x(function(d) { 
										//console.log("x:"+d.key+","+x(d.key));
										return tr_x(d.key); })
						.y0(function(d) { return tr_y_rev(d.y0); })
						.y1(function(d) { return tr_y_rev(d.y0 + d.y); });
			
			svgLC.selectAll("path")
					.data(stackData2)
					.enter().append("path")
					.attr("d", function(d) { return trAreaRev(d.dataArr); })
					.style("fill", function(d) { return d.color; })
					.append("title")
					.text(function(d) { return d.type; });
					
			drawLineChartAxis();
			drawLineChartLegend();
			
						
			// =================== Draw Theme River 3 =====================================
			initThemeRiver3();
			
			// Append Canvas 
			svgTR3 = d3.select("#scPos").append("svg")
						.attr("width", trWidth3 + trMargin3.left + trMargin3.right)
						.attr("height", trHeight3 + trMargin3.top + trMargin3.bottom)
						.append("g")
							.attr("transform", "translate(" + trMargin3.left + "," + trMargin3.top + ")");
						
			stackData3 = stack(dataCombinedTop3);
			dataNegGroupedCopy = deepCopy(dataNegGrouped);
			dataNegGroupedRev = convertToNeg(dataNegGroupedCopy);
			//dataNegGroupedRev = convertToNeg(dataNegGrouped);
			//dataCombinedBottom3 = [{type:eventType[0], dataArr: dataNegGroupedRev, color:trColor[0]}];		
			stackData3.push({type:eventType[0], dataArr: dataNegGroupedRev, color:trColor[0]});

			// Set Axis Domain
			tm3MinY = d3.min(dataNegGroupedRev, function(d) {return parseFloat(d.y);});
			//tm3MaxY d3.max(dataAll, function(d) {return parseFloat(d.x);});
			tm3MaxY = d3.max(dataAllGrouped, function(d) { return d.values; });
			//console.log(tm3MinY);
			//console.log(tm3MaxY);
			tr_y3.domain([tm3MinY-1, tm3MaxY+1]);
			//tr_y3.domain([0, d3.max(dataAllGrouped, function(d) { return d.values; })]);

			trArea3 = d3.svg.area()
						.interpolate(interpolationType)
						.x(function(d) {return tr_x(d.key); })
						.y0(function(d) { return tr_y3(d.y0); })
						.y1(function(d) { return tr_y3(d.y0 + d.y); });
			
			svgTR3.selectAll("path")
					.data(stackData3)
					.enter().append("path")
					.attr("d", function(d) { return trArea3(d.dataArr); })
					.style("fill", function(d) { return d.color; })
					.append("title")
					.text(function(d) { return d.type; });
			
			drawThemeRiverAxis3();
			
			// =================== Draw Theme River 4 =====================================
			initThemeRiver4();
			
			// Append Canvas 
			svgTR4 = d3.select("#scNet").append("svg")
						.attr("width", trWidth4 + trMargin4.left + trMargin4.right)
						.attr("height", trHeight4 + trMargin4.top + trMargin4.bottom)
						.append("g")
							.attr("transform", "translate(" + trMargin4.left + "," + trMargin4.top + ")");
			
			// Stack then convert the value to negative
		
			dataCombinedBottom4 = [{type:eventType[1], dataArr: dataNetGrouped, color:trColor[1]}, 
						{type:eventType[0], dataArr: dataNegGrouped, color:trColor[0]}];
			
			
			stackData4 = stack(dataCombinedBottom4);
			convertToNeg2(stackData4[0].dataArr);
			convertToNeg2(stackData4[1].dataArr);
			
			stackData4.push(stack(dataCombinedTop4)[0]);
			// Set Axis Domain
			var tmpMin0 = d3.min(stackData4[0].dataArr, function(d) {return parseFloat(d.y + d.y0);}),
				tmpMin1 = d3.min(stackData4[1].dataArr, function(d) {return parseFloat(d.y + d.y0);});
			
			if (tmpMin0 < tmpMin1){
				tm4MinY = tmpMin0;
			}else{
				tm4MinY = tmpMin1;
			}
			
			//tm3MaxY d3.max(dataAll, function(d) {return parseFloat(d.x);});
			tm4MaxY = d3.max(stackData4[2].dataArr, function(d) { return d.y; });
			//console.log(tm4MinY);
			//console.log(tm4MaxY);
			tr_y4.domain([tm4MinY-1, tm4MaxY+1]);
			//tr_y3.domain([0, d3.max(dataAllGrouped, function(d) { return d.values; })]);

			trArea4 = d3.svg.area()
						.interpolate(interpolationType)
						.x(function(d) {return tr_x(d.key); })
						.y0(function(d) { return tr_y4(d.y0); })
						.y1(function(d) { return tr_y4(d.y0 + d.y); });
			
			svgTR4.selectAll("path")
					.data(stackData4)
					.enter().append("path")
					.attr("d", function(d) { return trArea4(d.dataArr); })
					.style("fill", function(d) { return d.color; })
					.append("title")
					.text(function(d) { return d.type; });
			
			drawThemeRiverAxis4();
			
			// =================== Draw Scatter Plot for Positive Events ===================
			initPosScatterPlot();
			
			// setting the domain of scatter plot axis.
			maxPosY = d3.max(dataPos, scYValue)+1;
			scXScale.domain([minX-1, maxX+1]);
			scYScale.domain([0, maxPosY]);
		
			// ============================== Heat Map ======================
			hmArray = generateHeatMapArray(dataPos, dataNet, dataNeg);
			//console.log(hmArray);
			initHeatMap();
			
			// ============================= Draw Axis for Positive Events ===========
			// draw top x-axis
			hmPosSvg.append("g")
				  .attr("class", "x axis")
				  .call(scTopXAxis);
			  
			// draw left y-axis
			hmPosSvg.append("g")
				  .attr("class", "y axis")
				  .call(scLeftYAxis)
				.append("text")
				  .attr("class", "label")
				  .attr("transform", "rotate(-90)")
				  .attr("y", -35)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text(scYAxisText);

			// draw right y-axis
			hmPosSvg.append("g")
				  .attr("class", "axis")
				  .attr("transform", "translate(" + scWidth + ",0)")
				  .call(scRightYAxis);
			
			// Drawing Heat Map
			hmWidth = 550-80,
			hmHeight = 500;
				
			dx = arrRows,
			dy = arrColsAll;
			
			//console.log(dx+","+dy);

			/*hcolor = d3.scale.linear()
								.domain([0,3,8])
								.range(["#2c7bb6", "#ffffbf", "#d7191c" ])
								.interpolate(d3.interpolateHcl);*/
			
			hcolor = d3.scale.linear()
								.domain(hmColorDomain)
								.range(hmColorRange)
								//.domain([0,6,10])
								//.range(["rgb(8,48,107)", "cyan", "white" ])
								.interpolate(d3.interpolateHcl);
								
			d3.select(".hmCanvas").append("canvas")
							.attr("width", dx)
							.attr("height", dy)
							.style("width", hmWidth + "px")
							.style("height", hmHeight + "px")
							.call(drawImage);
			
			// ==================  Heat Map : Draw Axis for Negative Events =================
			hmXScaleNeg.domain([d3.min(data, hmXValueNeg)-1, d3.max(data, hmXValueNeg)+1]);
			//yScale.domain([d3.min(data, yValue)-1, 8, d3.max(data, yValue)+1]);
			hmYScaleNeg.domain([0, d3.max(dataPos, hmYValueNeg)+1]);
			
			// draw bottom x-axis
			hmNegSvg.append("g")
				  .attr("class", "x axis")
				  .attr("transform", "translate(0," + hmHeightNeg + ")")
				  .call(hmXAxisNeg)
				.append("text")
				  .attr("class", "label")
				  .attr("x", hmWidthNeg)
				  .attr("y", 30)
				  .style("text-anchor", "end")
				  .text("x axis");
			
			// draw left y-axis
			hmNegSvg.append("g")
				  .attr("class", "y axis")
				  .call(hmLeftYAxisNeg)
				.append("text")
				  .attr("class", "label")
				  .attr("transform", "rotate(-90)")
				  .attr("y", -35)
				  .attr("dy", ".71em")
				  .style("text-anchor", "end")
				  .text("Screen Speed (s)");

			// draw right y-axis
			hmNegSvg.append("g")
				  .attr("class", "axis")
				  .attr("transform", "translate(" + hmWidthNeg + ",0)")
				  .call(hmRightYAxisNeg);
			
			//=========================== Draw Second HeatMap ==========================
			initHeatMap2();
			drawPosAxisHeatMap2();
			drawNegAxisHeatMap2();
			drawTmpHeatMap();
			// Call changeObject function when user click a radio button
			d3.selectAll("input").on("change", changeObject);
			
			
		}
	});

} 

// Function to initialize Themeriver Graph Properties
function initThemeRiver(){
	// Define Margin for ThemeRiver graph
	trMargin = {top: 30, right: 40, bottom: 20, left: 40},
	trWidth = leftChartWidth - trMargin.left - trMargin.right,
	trHeight = topChartHeight - trMargin.top - trMargin.bottom;
	
	// Define scale
	tr_x = d3.scale.linear().range([0, trWidth]),
	tr_y = d3.scale.linear().range([trHeight, 0]);
	tr_y_rev = d3.scale.linear().range([trHeight, 0]);
	
	// Define axis properties
	tr_xAxis = d3.svg.axis()
				.scale(tr_x)
				.orient("bottom");

	tr_yAxis = d3.svg.axis()
				.scale(tr_y)
				.orient("left").ticks(5);
				
	tr_xAxis_top = d3.svg.axis()
				.scale(tr_x)
				.orient("top");
	
	tr_yAxis_rev = d3.svg.axis()
							.scale(tr_y_rev)
							.orient("left").ticks(5);

}
function initLineChart(){
	//lcMargin = {top: 30, right: 120, bottom: 20, left: 40},
	lcWidth = rightChartWidth -  trMargin.left - trMargin.right;
}

function initThemeRiver3(){
		// Define Margin for ThemeRiver graph
	trMargin3 = {top: 30, right: 40, bottom: 20, left: 40},
	trWidth3 = rightChartWidth - trMargin3.left - trMargin3.right,
	trHeight3 = topChartHeight - trMargin3.top - trMargin3.bottom;
	
	// Define scale
	tr_x3 = d3.scale.linear().range([0, trWidth3]),
	tr_y3 = d3.scale.linear().range([trHeight3, 0]);
	
	// Define axis properties
	tr_xAxis3 = d3.svg.axis()
				.scale(tr_x)
				.orient("bottom");

	tr_yAxis3 = d3.svg.axis()
				.scale(tr_y3)
				.orient("left")
				.tickFormat(function(d) { if(parseInt(d)<0)
											{ return (parseInt(d)*-1); }
										  else
										    { return d;}
											})
				.ticks(5);
}

function initThemeRiver4(){
	// Define Margin for ThemeRiver graph
	trMargin4 = {top: 30, right: 40, bottom: 20, left: 40},
	trWidth4 = rightChartWidth - trMargin4.left - trMargin4.right,
	trHeight4 = topChartHeight - trMargin4.top - trMargin4.bottom;
	
	// Define scale
	tr_x4 = d3.scale.linear().range([0, trWidth4]),
	tr_y4 = d3.scale.linear().range([trHeight4, 0]);
	
	// Define axis properties
	tr_xAxis4 = d3.svg.axis()
				.scale(tr_x)
				.orient("bottom");

	tr_yAxis4 = d3.svg.axis()
				.scale(tr_y4)
				.orient("left")
				.tickFormat(function(d) { if(parseInt(d)<0)
											{ return (parseInt(d)*-1); }
										  else
										    { return d;}
											})
				.ticks(5);
}

function drawThemeRiverAxis3(){
	  
	// draw x axis
	svgTR3.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (tr_y3(0)) + ")")
	.call(tr_xAxis3);
		
	// draw y axis
	svgTR3.append("g")
		.attr("class", "y axis")
		.call(tr_yAxis3)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -35)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Number of Events");
}

function drawThemeRiverAxis4(){
	  
	// draw x axis
	svgTR4.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + (tr_y4(0)) + ")")
	.call(tr_xAxis4);
		
	// draw y axis
	svgTR4.append("g")
		.attr("class", "y axis")
		.call(tr_yAxis4)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -35)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Number of Events");
}

function convertToNeg(inputData){
	var tmpData = inputData;
	var tmpVal;
	for(var j=0; j<tmpData.length; j++){
		tmpVal = (0-tmpData[j].y);
		tmpData[j].y = tmpVal;
		//console.log(inputData[j].y);
	}
	
	return tmpData;
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
function initPosScatterPlot(){
	
	scMargin = {top: 20, right: 140, bottom: 5, left: 40},
	scWidth = 650 - scMargin.left - scMargin.right,
	scHeight = posChartHeight - scMargin.top - scMargin.bottom;

	// setup x axis
	scXValue = function(d) { return d.x;}, 
	scXScale = d3.scale.linear().range([0, scWidth]), 
	scXMap = function(d) { return scXScale(scXValue(d));},
	scBottomXAxis = d3.svg.axis().scale(scXScale).orient("bottom").ticks(10),
	scTopXAxis = d3.svg.axis().scale(scXScale).orient("top");

	// setup y axis
	scYValue = function(d) { return parseFloat(d.screenV);}, 
	scYScale = d3.scale.linear().range([scHeight, 0]), 
	scYMap = function(d) { return scYScale(scYValue(d));},
	scLeftYAxis = d3.svg.axis().scale(scYScale).orient("left"),
	scRightYAxis = d3.svg.axis().scale(scYScale).orient("right");

	// add canvas
	/*scPosSvg = d3.select("#scPos").append("svg")
		.attr("width", scWidth + scMargin.left + scMargin.right)
		.attr("height", scHeight + scMargin.top + scMargin.bottom)
		.append("g")
			.attr("transform", "translate(" + scMargin.left + "," + scMargin.top + ")");*/
	
	// add the tooltip area to the webpage
	scTooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
}

function initNetScatterPlot(){
	
	scMarginNet = {top: 0, right: 140, bottom: 0, left: 40};
	scWidthNet = 650 - scMarginNet.left - scMarginNet.right;
	scHeightNet = netChartHeight - scMarginNet.top - scMarginNet.bottom;
	
	// setup y axis
	scYScaleNet = d3.scale.linear().range([scHeightNet, 0]);
	scYMapNet = function(d) { return scYScaleNet(scYValue(d));};
	
	// add heatmap canvas to scNet Div
	scNetSvg = d3.select("#scNet").append("svg")
		.attr("width", scWidthNet + scMarginNet.left + scMarginNet.right)
		.attr("height", scHeightNet + scMarginNet.top + scMarginNet.bottom)
		.append("g")
			.attr("transform", "translate(" + scMarginNet.left + "," + scMarginNet.top + ")");

}

function initNegScatterPlot(){
	scMarginNeg = {top: 5, right: 140, bottom: 30, left: 40},
	scWidthNeg = 650 - scMarginNeg.left - scMarginNeg.right,
	scHeightNeg = negChartHeight - scMarginNeg.top - scMarginNeg.bottom;

	// setup x axis
	scXValueNeg = function(d) { return d.x;}, 
	scXScaleNeg = d3.scale.linear().range([0, scWidthNeg]), 
	scXMapNeg = function(d) { return scXScaleNeg(scXValueNeg(d));},
	scBottomXAxisNeg = d3.svg.axis().scale(scXScaleNeg).orient("bottom").ticks(10),
	
	// setup y axis
	scYValueNeg = function(d) { return parseFloat(d.screenV);}, 
	scYScaleNeg = d3.scale.linear().range([scHeightNeg, 0]), 
	scYMapNeg = function(d) { return scYScaleNeg(scYValueNeg(d));},
	scLeftYAxisNeg = d3.svg.axis().scale(scYScaleNeg).orient("left"),
	scRightYAxisNeg = d3.svg.axis().scale(scYScaleNeg).orient("right");
	
	// add heatmap canvas to scNeg Div
	scNegSvg = d3.select("#scNeg").append("svg")
		.attr("width", scWidthNeg + scMarginNeg.left + scMarginNeg.right)
		.attr("height", scHeightNeg + scMarginNeg.top + scMarginNeg.bottom)
		.append("g")
			.attr("transform", "translate(" + scMarginNeg.left + "," + scMarginNeg.top + ")");
			
}

function initHeatMap(){

	// add canvas
	hmPosSvg = d3.select(".bgAxis").append("svg")
		.attr("width", scWidth + scMargin.left + scMargin.right)
		.attr("height", scHeight + scMargin.top + scMargin.bottom)
		.append("g")
			.attr("transform", "translate(" + scMargin.left + "," + scMargin.top + ")");
	
	// add heatmap canvas to scNet Div
	/*hmNetSvg = d3.select(".hmCanvas").append("svg")
		.attr("width", scWidthNet + scMarginNet.left + scMarginNet.right)
		.attr("height", scHeightNet + scMarginNet.top + scMarginNet.bottom)
		.append("g")
			.attr("transform", "translate(" + scMarginNet.left + "," + scMarginNet.top + ")");*/
	
	// Init Axis Propertiesfor Negative Eventsf
	hmMarginNeg = {top: 52, right: 40, bottom: 30, left: 40},
	hmWidthNeg = 550 - hmMarginNeg.left - hmMarginNeg.right,
	hmHeightNeg = 302 - hmMarginNeg.top - hmMarginNeg.bottom;
		
	// setup x axis
	hmXValueNeg = function(d) { return d.x;}, // data -> value
	hmXScaleNeg = d3.scale.linear().range([0, hmWidthNeg]), // value -> display
	hmXMapNeg = function(d) { return hmXScaleNeg(hmXValueNeg(d));}, // data -> display
	hmXAxisNeg = d3.svg.axis().scale(hmXScaleNeg).orient("bottom").ticks(10);

	// setup y axis
	hmYValueNeg = function(d) { return d.screenV;}, // data -> value
	hmYScaleNeg = d3.scale.linear().range([hmHeightNeg, 0]), // value -> display
	hmYMapNeg = function(d) { return hmYScaleNeg(hmYValueNeg(d));}, // data -> display
	hmLeftYAxisNeg = d3.svg.axis().scale(hmYScaleNeg).orient("left"),
	hmRightYAxisNeg = d3.svg.axis().scale(hmYScaleNeg).orient("right");
			
	// add heatmap canvas to scNeg Div
	hmNegSvg = d3.select("#heatMapNegDiv").append("svg")
		.attr("width", hmWidthNeg + hmMarginNeg.left + hmMarginNeg.right)
		.attr("height", hmHeightNeg + hmMarginNeg.top + hmMarginNeg.bottom)
		.append("g")
			.attr("transform", "translate(" + hmMarginNeg.left + "," + hmMarginNeg.top + ")");
}

function initHeatMap2(){
	// add canvas
	hmPosSvg2 = d3.select(".bgAxis2").append("svg")
		.attr("width", scWidth + scMargin.left + scMargin.right)
		.attr("height", scHeight + scMargin.top + scMargin.bottom)
		.append("g")
			.attr("transform", "translate(" + scMargin.left + "," + scMargin.top + ")");
	
	// add heatmap canvas to scNeg Div
	hmNegSvg2 = d3.select("#heatMapNegDiv2").append("svg")
		.attr("width", hmWidthNeg + hmMarginNeg.left + hmMarginNeg.right)
		.attr("height", hmHeightNeg + hmMarginNeg.top + hmMarginNeg.bottom)
		.append("g")
			.attr("transform", "translate(" + hmMarginNeg.left + "," + hmMarginNeg.top + ")");
}

function drawPosAxisHeatMap2(){
	// draw top x axis
	hmPosSvg2.append("g")
				  .attr("class", "x axis")
				  .call(scTopXAxis);
			  
	// draw left y-axis
	hmPosSvg2.append("g")
		  .attr("class", "y axis")
		  .call(scLeftYAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", -35)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text(scYAxisText);

	// draw right y-axis
	hmPosSvg2.append("g")
		  .attr("class", "axis")
		  .attr("transform", "translate(" + scWidth + ",0)")
		  .call(scRightYAxis);
}

function drawNegAxisHeatMap2(){
	// draw bottom x-axis
	hmNegSvg2.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + hmHeightNeg + ")")
		  .call(hmXAxisNeg)
		.append("text")
		  .attr("class", "label")
		  .attr("x", hmWidthNeg)
		  .attr("y", 30)
		  .style("text-anchor", "end")
		  .text("x axis");
	
	// draw left y-axis
	hmNegSvg2.append("g")
		  .attr("class", "y axis")
		  .call(hmLeftYAxisNeg)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", -35)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Screen Speed (s)");

	// draw right y-axis
	hmNegSvg2.append("g")
		  .attr("class", "axis")
		  .attr("transform", "translate(" + hmWidthNeg + ",0)")
		  .call(hmRightYAxisNeg);
}

function drawImage(canvas) {
	var context = canvas.node().getContext("2d"),
		image = context.createImageData(dx, dy);
				
	for (var y = 0, p = -1; y < dy; ++y) {
		for (var x = 0; x < dx; ++x) {
			//console.log(y+","+x+":"+hmArray[y][x]);
			//var c = d3.rgb(hcolor((hmArray[y][x])));
			var z;
			if((hmArray[y][x])==0)
				z = 0;
			else
				z = (hmArray[y][x])+2;
			var c = d3.rgb(hcolor(z));
			//console.log("p:"+p);
			image.data[++p] = c.r;
			image.data[++p] = c.g;
			image.data[++p] = c.b;
			image.data[++p] = 255;
			
			//console.log(y+","+x);
			//console.log(y+","+x+":"+heatmapPos[y][x]);
		}
	}

	context.putImageData(image, 0, 0);
}

function calculateArrColLen(inputPos){
	return round(d3.max(inputPos, function(d) { return d.screenV;})+1)+1;
	//return (round(d3.max(inputPos, function(d) { return d.screenV;})+1)+1)*2;
}

/*function genHeatMapArr(inputPos, inputNet, inputNeg){
	var heatMapArr = [];
	
	var row = 0;
	var col = 0;
	for(var i=0; i<inputPos.length; i++){

		row = (round(inputPos[i].x)-minXValue);
		col = (10-round(inputPos[i].screenV));
		hmDataArray[col][row]++;

	}
	
}*/
function generateHeatMapArray(inputPos, inputNet, inputNeg){
		
	// Initialize two dimensional array to store heatmap value
	var heatmapArray = function (rows, columns)  {
		this.rows = rows;
		this.columns = columns;
		this.rowArray = new Array(this.rows);
		for (var i=0; i < this.columns; i +=1) {
			this.rowArray[i]=new Array(this.rows)
		}
		return this.rowArray;
	}
	
	//console.log(d3.max(data, function (d) {return d.x;})+","+d3.min(data, function (d) {return d.x;}));
	// Define array dimension 
	arrRows = round((d3.max(data, scXValue)+1)-(d3.min(data, scXValue)-1),0)+1,
	minXValue = round((d3.min(data, scXValue)-1),0),
	yValue = function(d) { return d.screenV;};

	// Set the number of rows as the maximum y value of Positive events or Negative events
	//arrCols = round(d3.max(inputPos, yValue)+1)+1,
	arrColNeg = round(d3.max(inputNeg, yValue)+1),
	arrColsAll = (2*hmArrColLen)-1;
	//console.log(d3.max(inputPos, yValue));
	//console.log(d3.max(data, yValue));
	//console.log(d3.max(inputNeg, yValue));
	//console.log("arrCols:"+hmArrColLen);
	var hmDataArray = new heatmapArray(arrRows,arrColsAll);
	
	// Set default value of the cell = 0
	for(var i=0; i<arrColsAll; i++){
		for(var j=0; j<arrRows; j++){
			hmDataArray[i][j] = 0;
		}
	}
	
	//console.log(hmDataArray);
	var row = 0;
	var col = 0;
	for(var i=0; i<inputPos.length; i++){
		//console.log((round(dataPos[i].x)-minXValue)+","+(10-round(dataPos[i].screenV)));
		//console.log(inputPos[i].x+","+parseInt(inputPos[i].x)+","+round(round(inputPos[i].x,1)-parseInt(inputPos[i].x),1));
		//console.log(inputPos[i].x+","+round(inputPos[i].x,1)+","+round(round(inputPos[i].x,1)-minXValue,1));
		row = (round(inputPos[i].x)-minXValue);
		col = (10-round(inputPos[i].screenV));
		hmDataArray[col][row]++;
		//console.log(col+","+row);
		//console.log(col+","+row+":"+hmDataArray[col][row]);
	}
	
	var rowNet = 0;
	for(var i=0; i<inputNet.length; i++){
		rowNet = (round(inputNet[i].x)-minXValue);
		hmDataArray[hmArrColLen-1][rowNet]++;
		//console.log((arrCols-1)+","+colNet+":"+heatmapPos[arrCols-1][colNet]++);
		//console.log(arrCols-1+","+rowNet);
	}
	//console.log("finish adding neutral events");
	// Adding the negative events in the array
	var colNeg = 0;
	var rowNeg = 0;
	for(var i=0; i<inputNeg.length; i++){
		rowNeg = (round(inputNeg[i].x)-minXValue);
		colNeg = (arrColsAll-round(inputNeg[i].screenV));
		hmDataArray[colNeg][rowNeg]++;
		//console.log(rowNeg+","+colNeg+":"+heatmapPos[colNeg][rowNeg]++);
	}
	
	/*var maxArrVal = 0;
	for(var i=0; i<arrColsAll; i++){
		for(var j=0; j<arrRows; j++){
			if(hmDataArray[i][j]>maxArrVal)
				maxArrVal = hmDataArray[i][j];
			
		}
	}
	console.log("maxArrVal:"+maxArrVal);*/
	
	/*for(var i=0; i<arrColsAll; i++){
		for(var j=0; j<arrRows; j++){
			if((i > 0) && (j > 0) && (i < (arrColsAll - 1)) && (j < (arrRows - 1)) && (hmDataArray[i][j]>0)){
				hmDataArray[i-1][j-1]++;
				hmDataArray[i-1][j]++;
				hmDataArray[i][j-1]++;
				hmDataArray[i-1][j+1]++;
			}
		}
	}*/
	return hmDataArray;
}

function generateHeatMapArray2(inputPos, inputNet, inputNeg){
		
	// Initialize two dimensional array to store heatmap value
	var heatmapArray = function (rows, columns)  {
		this.rows = rows;
		this.columns = columns;
		this.rowArray = new Array(this.rows);
		for (var i=0; i < this.columns; i +=1) {
			this.rowArray[i]=new Array(this.rows)
		}
		return this.rowArray;
	}
	
	//console.log(d3.max(data, function (d) {return d.x;})+","+d3.min(data, function (d) {return d.x;}));
	// Define array dimension 
	arrRows = (round((d3.max(data, scXValue)+1)-(d3.min(data, scXValue)-1),0)+1)*2,
	minXValue = round((d3.min(data, scXValue)-1),0),
	yValue = function(d) { return d.screenV;};

	// Set the number of rows as the maximum y value of Positive events or Negative events
	//arrCols = round(d3.max(inputPos, yValue)+1)+1,
	arrColNeg = round(d3.max(inputNeg, yValue)+1),
	arrColsAll = (2*hmArrColLen)-1;
	//console.log(d3.max(inputPos, yValue));
	//console.log(d3.max(data, yValue));
	//console.log(d3.max(inputNeg, yValue));
	//console.log(arrRows+","+arrColsAll);
	var hmDataArray = new heatmapArray(arrRows,arrColsAll);
	
	// Set default value of the cell = 0
	for(var i=0; i<arrColsAll; i++){
		for(var j=0; j<arrRows; j++){
			hmDataArray[i][j] = 0;
		}
	}
	
	//console.log(hmDataArray);
	var row = 0;
	var col = 0;
	for(var i=0; i<inputPos.length; i++){
		//console.log(inputPos[i].x+","+parseInt(inputPos[i].x)+","+round(round(inputPos[i].x,1)-parseInt(inputPos[i].x),1));
		if((inputPos[i].x < 0)&& (round(round(inputPos[i].x,1)-parseInt(inputPos[i].x),1) > 0.5)){
			row = (parseInt(inputPos[i].x)-minXValue)*2;
			col = ((10-parseInt(inputPos[i].screenV))*2);
		}
		if((inputPos[i].x < 0)&& (round(round(inputPos[i].x,1)-parseInt(inputPos[i].x),1) < 0.5)){
			row = ((parseInt(inputPos[i].x)-minXValue)*2)+1;
			col = ((10-parseInt(inputPos[i].screenV))*2)+1;
			
		}
		if((inputPos[i].x > 0)&& (round(round(inputPos[i].x,1)-parseInt(inputPos[i].x),1) > 0.5)){
			row = ((parseInt(inputPos[i].x)-minXValue)*2)+1;
			col = ((10-parseInt(inputPos[i].screenV))*2)+1;
		}
		if((inputPos[i].x > 0)&& (round(round(inputPos[i].x,1)-parseInt(inputPos[i].x),1) < 0.5)){
			row = (parseInt(inputPos[i].x)-minXValue)*2;
			col = ((10-parseInt(inputPos[i].screenV))*2);
		}
		//row = (round(inputPos[i].x)-minXValue);
		//col = (10-round(inputPos[i].screenV));
		hmDataArray[col][row]++;
		//console.log(inputPos[i].x+","+row);
		//console.log(inputPos[i].x+":"+row+","+(round(inputPos[i].x)-minXValue));
		//console.log(col+","+row+":"+hmDataArray[col][row]);
	}
	
	/*var rowNet = 0;
	for(var i=0; i<inputNet.length; i++){
		rowNet = (round(inputNet[i].x)-minXValue);
		hmDataArray[hmArrColLen-1][rowNet]++;
		//console.log((arrCols-1)+","+colNet+":"+heatmapPos[arrCols-1][colNet]++);
		//console.log(arrCols-1+","+rowNet);
	}
	//console.log("finish adding neutral events");
	// Adding the negative events in the array
	var colNeg = 0;
	var rowNeg = 0;
	for(var i=0; i<inputNeg.length; i++){
		rowNeg = (round(inputNeg[i].x)-minXValue);
		colNeg = (arrColsAll-round(inputNeg[i].screenV));
		hmDataArray[colNeg][rowNeg]++;
		//console.log(rowNeg+","+colNeg+":"+heatmapPos[colNeg][rowNeg]++);
	}*/
	
	var maxArrVal = 0;
	for(var i=0; i<arrColsAll; i++){
		for(var j=0; j<arrRows; j++){
			if(hmDataArray[i][j]>maxArrVal)
				maxArrVal = hmDataArray[i][j];
			
		}
	}
	console.log("maxArrVal:"+maxArrVal);
	
	return hmDataArray;
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

function drawAreaChartAxis(){
	
	// draw x axis
	svgAC.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + trHeight + ")")
	.call(tr_xAxis);
		
	// draw y axis
	svgAC.append("g")
		.attr("class", "y axis")
		.call(tr_yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -35)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Number of Events");
}

function drawLineChartAxis(){
	
	// draw x axis
	svgLC.append("g")
	.attr("class", "x axis")
	//.attr("transform", "translate(0," + trHeight + ")")
	.call(tr_xAxis_top);
		
	// draw y axis
	svgLC.append("g")
		.attr("class", "y axis")
		.call(tr_yAxis_rev)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -35)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Number of Events");
}
function drawLineChartLegend(){

	// define the legend
	var legend = svgLC.selectAll(".legend")
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

function drawScatterPlotLegend(){

	// define the legend
	var sclegend = scPosSvg.selectAll(".legend")
		  .data(scLegendColor)
		.enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	// draw legend colored rectangles
	sclegend.append("rect")
		  .attr("x", scWidth + 25)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", function (d) { return d.color;});

	// draw legend text
	sclegend.append("text")
		  .attr("x", scWidth + 50)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "start")
		  .text( function (d) { return d.type;});
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

// Function to discretisize data based on the number of x axis integer
function discretisize(referedData, inputData){
	
	var j=0;
	var k=0;
	var i=0;
	while(i<referedData.length){
		//console.log(i+",referedData:"+referedData[i].key+"." +j+ ",inputData:"+inputData[j].key);
		if(referedData[i].key!=inputData[j].key){
			var newDt = new newDataEntry(referedData[i].key,0);
			//console.log(newDt.key+","+newDt.values);
			inputData.push(newDt);
			//inputData.splice(j+k,0,newDt);
		}else{
			j++;
		}
		i++;
		
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

// When user chooses a radio button
function changeObject(){

	// ================ Recalculate the data =============================================
	var value = this.value;
	var newData = new Array();
	var bonusChosen = false, 
		enemyChosen = false, 
		obstacleChosen = false,
		allChosen = false;
	var newDataPosGrouped = new Array(),
		newDataNetGrouped = new Array(),
		newDataNegGrouped = new Array(),
		newDataPosGrouped2 = new Array(),
		newDataNetGrouped2 = new Array(),
		newDataNegGrouped2 = new Array(),
		newDataPosGroupedCopy = new Array(),
		newDataNetGroupedCopy = new Array(),
		newDataNegGroupedCopy = new Array(),
		newDataCombined = new Array(),
		newDataCombined2 = new Array(),
		newDataCombined3 = new Array(),
		newDataCombined4 = new Array(),
		emptyArr = new Array();
	
	switch(value) {
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


	var newDataPos = newData.filter(isPositive),
		newDataNet = newData.filter(isNeutral),
		newDataNeg = newData.filter(isNegative);
		
	emptyArr.push(new newDataEntry(0,0));

		
	// Group data by x axis integer and count the number of events, then discretisize
	var newDataAllGrouped = getEventsNumberOverX(newData);
	
	if(newDataPos.length > 0){
		newDataPosGrouped = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataPos));
		newDataPosGrouped2 = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataPos));
		newDataPosGroupedCopy = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataPos));
	}
	if(newDataNet.length > 0){
		newDataNetGrouped = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNet));
		newDataNetGrouped2 = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNet));
		newDataNetGroupedCopy = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNet));
	}
	if(newDataNeg.length > 0){
		newDataNegGrouped = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNeg));
		newDataNegGrouped2 = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNeg));
		newDataNegGroupedCopy = discretisize(newDataAllGrouped,getEventsNumberOverX(newDataNeg));
	}

	emptyArr = discretisize(newDataAllGrouped,emptyArr);
	//console.log(emptyArr);
	/*console.log("init: "+newDataPos.length+",grouped:"+newDataPosGrouped.length);
	console.log("init: "+newDataNet.length+",grouped:"+newDataNetGrouped.length);
	console.log("init: "+newDataNeg.length+",grouped:"+newDataNegGrouped.length);*/

	
	// For Enemy 
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length > 0)){
		//console.log("Enemy Selected");
		newDataCombined = [{type:eventType[0], dataArr: newDataNegGrouped, color:trColor[0]},
						{type:eventType[1], dataArr: newDataNetGrouped, color:trColor[1]},
						{type:eventType[2], dataArr: newDataPosGrouped, color:trColor[2]}];
						
		newDataCombined2 = [{type:eventType[2], dataArr: newDataPosGrouped2, color:trColor[2]},
						{type:eventType[1], dataArr: newDataNetGrouped2, color:trColor[1]},
						{type:eventType[0], dataArr: newDataNegGrouped2, color:trColor[0]}];
	}
	
	// For Obstacle
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length == 0)){
		//console.log("Obstacle Selected");
		newDataCombined = [{type:eventType[0], dataArr: newDataNegGrouped, color:trColor[0]},
						{type:eventType[1], dataArr: newDataNetGrouped, color:trColor[1]},
						{type:eventType[2], dataArr: emptyArr, color:trColor[3]}];
		
		newDataCombined2 = [{type:eventType[2], dataArr: emptyArr, color:trColor[3]},
				{type:eventType[1], dataArr: newDataNetGrouped2, color:trColor[1]},
				{type:eventType[0], dataArr: newDataNegGrouped2, color:trColor[0]}];
						
	}
	
	// Special Case
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length == 0) && (newDataPosGrouped.length > 0)){
		newDataCombined = [{type:eventType[0], dataArr: newDataNegGrouped, color:trColor[0]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[2], dataArr: newDataPosGrouped, color:trColor[2]}];
						
		newDataCombined2 = [{type:eventType[2], dataArr: newDataPosGrouped2, color:trColor[2]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[0], dataArr: newDataNegGrouped2, color:trColor[0]}];
	}
	
	// For Bonus
	if((newDataNegGrouped.length == 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length > 0)){
		console.log("Bonus Selected");
		newDataCombined = [{type:eventType[0], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[1], dataArr: newDataNetGrouped, color:trColor[1]},
						{type:eventType[2], dataArr: newDataPosGrouped, color:trColor[2]}];
		
		newDataCombined2 = [{type:eventType[2], dataArr: newDataPosGrouped2, color:trColor[2]},
				{type:eventType[1], dataArr: newDataNetGrouped2, color:trColor[1]},
				{type:eventType[0], dataArr: emptyArr, color:trColor[3]}];
		
						
	}
	if((newDataNegGrouped.length > 0) && (newDataNetGrouped.length == 0) && (newDataPosGrouped.length == 0)){
		//console.log("Only Neg");
		newDataCombined = [{type:eventType[0], dataArr: newDataNegGrouped, color:trColor[0]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[2], dataArr: emptyArr, color:trColor[3]}];
						
		newDataCombined2 = [{type:eventType[2], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[0], dataArr: newDataNegGrouped2, color:trColor[0]}];
		
	}
	if((newDataNegGrouped.length == 0) && (newDataNetGrouped.length > 0) && (newDataPosGrouped.length == 0)){
		//console.log("Only Neutral");
		newDataCombined = [{type:eventType[0], dataArr: emptyArr, color:trColor[3]},
							{type:eventType[1], dataArr: newDataNetGrouped2, color:trColor[1]},
							{type:eventType[2], dataArr: emptyArr, color:trColor[3]}];
							
		newDataCombined2 = [{type:eventType[2], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[1], dataArr: newDataNetGrouped2, color:trColor[1]},
						{type:eventType[0], dataArr: emptyArr, color:trColor[3]}];
						
	}
	if((newDataNegGrouped.length == 0) && (newDataNetGrouped.length == 0) && (newDataPosGrouped.length > 0)){
		//console.log("Only Pos");
		newDataCombined = [{type:eventType[0], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[2], dataArr: newDataPosGrouped, color:trColor[2]}];
		
		newDataCombined2 = [{type:eventType[2], dataArr: newDataPosGrouped2, color:trColor[2]},
						{type:eventType[1], dataArr: emptyArr, color:trColor[3]},
						{type:eventType[0], dataArr: emptyArr, color:trColor[3]}];
		
	}
	
	var newStackData = stack(newDataCombined);
	var newStackData2 = stack(newDataCombined2);
	
	// Setting new data for ThemeRiver3
	if((newDataNetGroupedCopy.length > 0) && (newDataPosGroupedCopy.length > 0)){
		newDataCombined3 = [{type:eventType[1], dataArr: newDataNetGroupedCopy, color:trColor[1]},
							{type:eventType[2], dataArr: newDataPosGroupedCopy, color:trColor[2]}];
	}
	if((newDataNetGroupedCopy.length == 0) && (newDataPosGroupedCopy.length > 0)){
		newDataCombined3 = [{type:eventType[1], dataArr: emptyArr, color:trColor[1]},
							{type:eventType[2], dataArr: newDataPosGroupedCopy, color:trColor[2]}];
	}
	if((newDataNetGroupedCopy.length > 0) && (newDataPosGroupedCopy.length == 0)){
		newDataCombined3 = [{type:eventType[1], dataArr: newDataNetGroupedCopy, color:trColor[1]},
							{type:eventType[2], dataArr: emptyArr, color:trColor[2]}];
	}
	
	
	var newStackData3 = stack(newDataCombined3);
	if(newDataNegGroupedCopy.length > 0){
		var newDataCombinedTop3 = [{type:eventType[0], dataArr: newDataNegGroupedCopy, color:trColor[0]},
								   {type:eventType[2], dataArr: emptyArr, color:trColor[2]}];
		//newStackData3.push(stack(newDataCombinedTop3[0]));
		var tmpStack = stack(newDataCombinedTop3);
		convertToNeg2(tmpStack[0].dataArr);
		newStackData3.push(tmpStack[0]);
		console.log(tmpStack);
	}
	if(newDataNegGroupedCopy.length == 0){
		newStackData3.push({type:eventType[0], dataArr: emptyArr, color:trColor[0]});
	}
	
	var newNetCopy = deepCopy(newDataNetGroupedCopy),
		newNegCopy = deepCopy(newDataNegGroupedCopy),
		newPosCopy = deepCopy(newDataPosGroupedCopy);
	// Setting new data for ThemeRiver4
	if((newDataNetGroupedCopy.length > 0) && (newDataNegGroupedCopy.length > 0)){
		newDataCombined4 = [{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
							{type:eventType[0], dataArr: newNegCopy, color:trColor[0]}];
	}
	if((newDataNetGroupedCopy.length == 0) && (newDataNegGroupedCopy.length > 0)){
		newDataCombined4 = [{type:eventType[1], dataArr: emptyArr, color:trColor[1]},
							{type:eventType[0], dataArr: newNegCopy, color:trColor[0]}];
	}
	if((newDataNetGroupedCopy.length > 0) && (newDataNegGroupedCopy.length == 0)){
		newDataCombined4 = [{type:eventType[1], dataArr: newNetCopy, color:trColor[1]},
							{type:eventType[0], dataArr: emptyArr, color:trColor[0]}];
	}
	

	var newStackData4 = stack(newDataCombined4);
	convertToNeg2(newStackData4[0].dataArr);
	convertToNeg2(newStackData4[1].dataArr);
	
	if(newDataPosGroupedCopy.length > 0){
		var newDataCombinedTop4 = [{type:eventType[2], dataArr: newPosCopy, color:trColor[2]},
								   {type:eventType[0], dataArr: emptyArr, color:trColor[0]}];
								   
		newStackData4.push(stack(newDataCombinedTop4)[0]);
	}
			
	//console.log(newStackData4);		

	// Set transition for themeriver					
	svgTR.selectAll("path")
		  .data(newStackData)
		  .transition()
		  .duration(2500)
		  .attr("d", function(d) { return trArea(d.dataArr); })
		  .style("fill", function(d) { return d.color; });
		  
	// Set transition for themeriver2					
	svgLC.selectAll("path")
		  .data(newStackData2)
		  .transition()
		  .duration(2500)
		  .attr("d", function(d) { return trAreaRev(d.dataArr); })
		  .style("fill", function(d) { return d.color; });
		  
	svgTR3.selectAll("path")
		  .data(newStackData3)
		  .transition()
		  .duration(2500)
		  .attr("d", function(d) { return trArea3(d.dataArr); })
		  .style("fill", function(d) { return d.color; });
	
	svgTR4.selectAll("path")
		  .data(newStackData4)
		  .transition()
		  .duration(2500)
		  .attr("d", function(d) { return trArea4(d.dataArr); })
		  .style("fill", function(d) { return d.color; });
		  
	// Set transition for line chart
	/*svgLC.selectAll(".line")
		.data(newDataCombined)
		.transition()
		.duration(2500)
		.attr("d", function(d) { return line(d.dataArr); });*/

	
	/*updatePosScatterPlot(newDataPos);
	updateNetScatterPlot(newDataNet);
	updateNegScatterPlot(newDataNeg);*/
	
	// Update HeatMap
	hmArray = generateHeatMapArray(newDataPos, newDataNet, newDataNeg);
	dx = arrRows,
	dy = arrColsAll;
	//console.log(hmArray);
	
	d3.select(".hmCanvas").select("canvas").remove();
	
	d3.select(".hmCanvas").append("canvas")
							.attr("width", dx)
							.attr("height", dy)
							.style("width", hmWidth + "px")
							.style("height", hmHeight + "px")
							.call(drawImage);
	
	
	// Update Second HeatMap
	d3.select("#hmCanvas2").select("canvas").remove();
	drawTmpHeatMap();
	/*svgTR.selectAll("title")
		  .text(function(d) { return d.type; });*/

}

function updatePosScatterPlot(inputData){
	
	//Update all circles for Positive Events
	scPosSvg.selectAll("circle")
			  .data(inputData)
			  .attr("class", "dot")
			  .attr("r", 5)
			  .attr("cx", scXMap)
			  .attr("cy", scYMap)
			  .style("fill", "Green") 
			  .style("opacity", .5)
			  .on("mouseover", function(d) {
				  scTooltip.transition()
					   .duration(200)
					   .style("opacity", .9);
				  scTooltip.html(d.eventCat + "<br/> (" + scXValue(d) 
					+ ", " + scYValue(d) + ")")
					   .style("left", (d3.event.pageX + 5) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
			  })
			  .on("mouseout", function(d) {
				  scTooltip.transition()
					   .duration(500)
					   .style("opacity", 0);
			  });
	
	//Enter new circles
	scPosSvg.selectAll("circle")
		  .data(inputData)
		  .enter()
		  .append("circle")
		  .attr("class", "dot")
		  .attr("r", 5)
		  .attr("cx", scXMap)
			  .attr("cy", scYMap)
			  .style("fill", "Green") 
			  .style("opacity", .5)
			  .on("mouseover", function(d) {
				  scTooltip.transition()
					   .duration(200)
					   .style("opacity", .9);
				  scTooltip.html(d.eventCat + "<br/> (" + scXValue(d) 
					+ ", " + scYValue(d) + ")")
					   .style("left", (d3.event.pageX + 5) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
			  })
			  .on("mouseout", function(d) {
				  scTooltip.transition()
					   .duration(500)
					   .style("opacity", 0);
			  });
			
	// Remove old
	scPosSvg.selectAll("circle")
			.data(inputData)
			.exit()
			.remove();
}

function updateNetScatterPlot(inputData){

	//Update all circles for Neutral Events
	scNetSvg.selectAll("circle")
			  .data(inputData)
			  .attr("class", "dot")
			  .attr("r", 5)
			  .attr("cx", scXMap)
			  .attr("cy", scYMapNet)
			  .style("fill", "Orange") 
			  .style("opacity", .5)
			  .on("mouseover", function(d) {
				  scTooltip.transition()
					   .duration(200)
					   .style("opacity", .9);
				  scTooltip.html(d.eventCat + "<br/> (" + scXValue(d) 
					+ ", " + scYValue(d) + ")")
					   .style("left", (d3.event.pageX + 5) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
			  })
			  .on("mouseout", function(d) {
				  scTooltip.transition()
					   .duration(500)
					   .style("opacity", 0);
			  });
	
	//Enter new circles
	scNetSvg.selectAll("circle")
		  .data(inputData)
		  .enter()
		  .append("circle")
		  .attr("class", "dot")
		  .attr("r", 5)
		  .attr("cx", scXMap)
			  .attr("cy", scYMapNet)
			  .style("fill", "Orange") 
			  .style("opacity", .5)
			  .on("mouseover", function(d) {
				  scTooltip.transition()
					   .duration(200)
					   .style("opacity", .9);
				  scTooltip.html(d.eventCat + "<br/> (" + scXValue(d) 
					+ ", " + scYValue(d) + ")")
					   .style("left", (d3.event.pageX + 5) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
			  })
			  .on("mouseout", function(d) {
				  scTooltip.transition()
					   .duration(500)
					   .style("opacity", 0);
			  });
	
		// Remove old
	scNetSvg.selectAll("circle")
			.data(inputData)
			.exit()
			.remove();
}

function updateNegScatterPlot(inputData){

	//Update all circles for Neutral Events
	scNegSvg.selectAll("circle")
			  .data(inputData)
			  .attr("class", "dot")
			  .attr("r", 5)
			  .attr("cx", scXMapNeg)
			  .attr("cy", scYMapNeg)
			  .style("fill", "Red") 
			  .style("opacity", .5)
			  .on("mouseover", function(d) {
				  scTooltip.transition()
					   .duration(200)
					   .style("opacity", .9);
				  scTooltip.html(d.eventCat + "<br/> (" + scXValueNeg(d) 
					+ ", " + scYValueNeg(d) + ")")
					   .style("left", (d3.event.pageX + 5) + "px")
					   .style("top", (d3.event.pageY - 28) + "px");
			  })
			  .on("mouseout", function(d) {
				  scTooltip.transition()
					   .duration(500)
					   .style("opacity", 0);
			  });
	
	//Enter new circles
	scNegSvg.selectAll("circle")
		  .data(inputData)
		  .enter()
		  .append("circle")
		  .attr("class", "dot")
		  .attr("r", 5)
		  .attr("cx", scXMapNeg)
		  .attr("cy", scYMapNeg)
		  .style("fill", "Red") 
		  .style("opacity", .5)
		  .on("mouseover", function(d) {
			  scTooltip.transition()
				   .duration(200)
				   .style("opacity", .9);
			  scTooltip.html(d.eventCat + "<br/> (" + scXValueNeg(d) 
				+ ", " + scYValueNeg(d) + ")")
				   .style("left", (d3.event.pageX + 5) + "px")
				   .style("top", (d3.event.pageY - 28) + "px");
		  })
		  .on("mouseout", function(d) {
			  scTooltip.transition()
				   .duration(500)
				   .style("opacity", 0);
		  });
	
		// Remove old
	scNegSvg.selectAll("circle")
			.data(inputData)
			.exit()
			.remove();
			
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

function drawTmpHeatMap(){
	
	var legendCanvas = document.createElement('canvas');
        legendCanvas.width = 100;
        legendCanvas.height = 10;

        var legendCtx = legendCanvas.getContext('2d');
        var gradientCfg = {};

        function updateLegend(data) {
          // the onExtremaChange callback gives us min, max, and the gradientConfig
          // so we can update the legend
          $('min').innerHTML = data.min;
          $('max').innerHTML = data.max;
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
          }
        };

	var heatmap = h337.create({
          container: document.getElementById('hmCanvas2'),
          maxOpacity: .9,
          radius: 10,
		  onExtremaChange: function onExtremaChange(hmData) {
            updateLegend(hmData);
			},
          blur: .75
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
		width = 470,
		height = 500;
		
	for(var i=0; i<arrColsAll; i++){
		for(var j=0; j<arrRows; j++){
			//var x = Math.floor(i*width);
			//var y = Math.floor(j*width);
			//var c = parseInt(hmArray[i][j]);
			var x = (j*12);
			//var x = scXScale(j);
			var y =  (i*23);
			//var y = scYScale(i);
			if(hmArray[i][j]>0){
				var c = (parseInt(hmArray[i][j])*10);
				var r = 20;
				newHmArray.push({ x: x, y:y, value: c, radius: r });
				if(c > hmMaxVal) { hmMaxVal = c}
			}

			
		}
	}
	var hmData = {
			min: 0,
            max: hmMaxVal,
            data: newHmArray
    };
	heatmap.setData(hmData);
}





