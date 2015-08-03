package com.lirmm.summary;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.MappingJsonFactory;

public class JsonParserSummary {
	public JsonParserSummary() {
	}
	
	public Boolean writeSummary(List<JsonFile> fileList) throws JsonParseException, IOException{
		
		JsonFactory factory = new JsonFactory();
        JsonGenerator generator = factory.createGenerator(new FileWriter(new File(fileList.get(0).getDirectory()+"/"+"summary.json")));
		//JsonGenerator generator = factory.createGenerator(new FileWriter(new File("summary.json")));
		
		//Start Writing Array
        generator.writeStartArray();
        
		for(int i=0; i<fileList.size(); i++){
			//System.out.println(fileList.get(i).getSessionName());
			JsonFactory f = new MappingJsonFactory();
		    JsonParser jp = f.createParser(new File(fileList.get(i).getFileLocation()+".json"));
		    JsonToken current;

		    current = jp.nextToken();

		    if (current != JsonToken.START_ARRAY) {
			      System.out.println("Error: root should be object: quiting.");
			      continue;
			}
		    
		    // Initialize the list to store summary object while doing number of Event calculation
		    List<JsonSummaryObj> positiveList = new ArrayList<JsonSummaryObj>();
		    List<JsonSummaryObj> neutralList = new ArrayList<JsonSummaryObj>();
		    List<JsonSummaryObj> negativeList = new ArrayList<JsonSummaryObj>();
		    
		    String sessionName = fileList.get(i).getSessionName();
	    	int sessionNo = Integer.parseInt(sessionName.substring(8, sessionName.length()));
	    	//System.out.println(sessionName+": "+sessionNo);
	    	
	    	// For each list initialize the value of each object
	    	// The first object in the list will hold the record for area1 (x more than 10)
	    	// The second object in the list will hold the record for area2 (x less than 10 and x more than 5), and so on
	    	// since there are 6 different area, iterate 6 times
		    for(int j=0; j<=30; j++){
		  
		    	JsonSummaryObj jsonSummaryObj = new JsonSummaryObj(sessionNo, j+1, 0, "Positive");
		    	positiveList.add(jsonSummaryObj);
		    	JsonSummaryObj jsonSummaryObjNet = new JsonSummaryObj(sessionNo, j+1, 0, "Neutral");
		    	neutralList.add(jsonSummaryObjNet);
		    	JsonSummaryObj jsonSummaryObjNeg = new JsonSummaryObj(sessionNo, j+1, 0, "Negative");
		    	negativeList.add(jsonSummaryObjNeg);
		    	
		    }
		    
		    if (current == JsonToken.START_ARRAY) {
		    	while (jp.nextToken() != JsonToken.END_ARRAY) {	        					  
		    		
		    		JsonNode node = jp.readValueAsTree();
		    		int noOfEvent = 0;
		    		int totalEventAll = 0;
		    		
		    		Double xValue = node.get("x").asDouble();
	    					    	
		    		if(node.get("eventCat").asText().equals("Positive")){
		    			
		    			if(xValue <= -14 ){
		    				noOfEvent = positiveList.get(0).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(0).setNoOfEvent(noOfEvent);
		    				
		    			}
						
						if((xValue > -14) && (xValue <= -13)){
							noOfEvent = positiveList.get(1).getNoOfEvent();
							noOfEvent++;
		    				positiveList.get(1).setNoOfEvent(noOfEvent);
						}
						
						if((xValue > -13) && (xValue <= -12)){
							noOfEvent = positiveList.get(2).getNoOfEvent();
							noOfEvent++;
		    				positiveList.get(2).setNoOfEvent(noOfEvent);
						}
						
		    			if((xValue > -12) && (xValue <= -11)){
		    				noOfEvent = positiveList.get(3).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(3).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -11)  && (xValue <= -10)){
		    				noOfEvent = positiveList.get(4).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(4).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -10)  && (xValue <= -9)){
		    				noOfEvent = positiveList.get(5).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(5).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -9)  && (xValue <= -8)){
		    				noOfEvent = positiveList.get(6).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(6).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -8)  && (xValue <= -7)){
		    				noOfEvent = positiveList.get(7).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(7).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -7)  && (xValue <= -6)){
		    				noOfEvent = positiveList.get(8).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(8).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -6)  && (xValue <= -5)){
		    				noOfEvent = positiveList.get(9).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(9).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -5)  && (xValue <= -4)){
		    				noOfEvent = positiveList.get(10).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(10).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -4)  && (xValue <= -3)){
		    				noOfEvent = positiveList.get(11).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(11).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -3)  && (xValue <= -2)){
		    				noOfEvent = positiveList.get(12).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(12).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -2)  && (xValue <= -1)){
		    				noOfEvent = positiveList.get(13).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(13).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -1)  && (xValue <= 0)){
		    				noOfEvent = positiveList.get(14).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(14).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 0)  && (xValue <= 1)){
		    				noOfEvent = positiveList.get(15).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(15).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 1)  && (xValue <= 2)){
		    				noOfEvent = positiveList.get(16).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(16).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 2)  && (xValue <= 3)){
		    				noOfEvent = positiveList.get(17).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(17).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 3)  && (xValue <= 4)){
		    				noOfEvent = positiveList.get(18).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(18).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 4)  && (xValue <= 5)){
		    				noOfEvent = positiveList.get(19).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(19).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 5)  && (xValue <= 6)){
		    				noOfEvent = positiveList.get(20).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(20).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 6)  && (xValue <= 7)){
		    				noOfEvent = positiveList.get(21).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(21).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 7)  && (xValue <= 8)){
		    				noOfEvent = positiveList.get(22).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(22).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 8)  && (xValue <= 9)){
		    				noOfEvent = positiveList.get(23).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(23).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 9)  && (xValue <= 10)){
		    				noOfEvent = positiveList.get(24).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(24).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 10)  && (xValue <= 11)){
		    				noOfEvent = positiveList.get(25).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(25).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 11)  && (xValue <= 12)){
		    				noOfEvent = positiveList.get(26).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(26).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 12)  && (xValue <= 13)){
		    				noOfEvent = positiveList.get(27).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(27).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 13)  && (xValue <= 14)){
		    				noOfEvent = positiveList.get(28).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(28).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 14)){
		    				noOfEvent = positiveList.get(29).getNoOfEvent();
		    				noOfEvent++;
		    				positiveList.get(29).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			totalEventAll = positiveList.get(30).getNoOfEvent();
		    			totalEventAll++;
		    			positiveList.get(30).setNoOfEvent(totalEventAll);
		    			
		    		}
		    		
		    		if(node.get("eventCat").asText().equals("Neutral")){
						if(xValue <= -14 ){
		    				noOfEvent = neutralList.get(0).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(0).setNoOfEvent(noOfEvent);
		    				
		    			}
						
						if((xValue > -14) && (xValue <= -13)){
							noOfEvent = neutralList.get(1).getNoOfEvent();
							noOfEvent++;
		    				neutralList.get(1).setNoOfEvent(noOfEvent);
						}
						
						if((xValue > -13) && (xValue <= -12)){
							noOfEvent = neutralList.get(2).getNoOfEvent();
							noOfEvent++;
		    				neutralList.get(2).setNoOfEvent(noOfEvent);
						}
						
		    			if((xValue > -12) && (xValue <= -11)){
		    				noOfEvent = neutralList.get(3).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(3).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -11)  && (xValue <= -10)){
		    				noOfEvent = neutralList.get(4).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(4).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -10)  && (xValue <= -9)){
		    				noOfEvent = neutralList.get(5).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(5).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -9)  && (xValue <= -8)){
		    				noOfEvent = neutralList.get(6).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(6).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -8)  && (xValue <= -7)){
		    				noOfEvent = neutralList.get(7).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(7).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -7)  && (xValue <= -6)){
		    				noOfEvent = neutralList.get(8).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(8).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -6)  && (xValue <= -5)){
		    				noOfEvent = neutralList.get(9).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(9).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -5)  && (xValue <= -4)){
		    				noOfEvent = neutralList.get(10).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(10).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -4)  && (xValue <= -3)){
		    				noOfEvent = neutralList.get(11).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(11).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -3)  && (xValue <= -2)){
		    				noOfEvent = neutralList.get(12).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(12).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -2)  && (xValue <= -1)){
		    				noOfEvent = neutralList.get(13).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(13).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -1)  && (xValue <= 0)){
		    				noOfEvent = neutralList.get(14).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(14).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 0)  && (xValue <= 1)){
		    				noOfEvent = neutralList.get(15).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(15).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 1)  && (xValue <= 2)){
		    				noOfEvent = neutralList.get(16).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(16).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 2)  && (xValue <= 3)){
		    				noOfEvent = neutralList.get(17).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(17).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 3)  && (xValue <= 4)){
		    				noOfEvent = neutralList.get(18).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(18).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 4)  && (xValue <= 5)){
		    				noOfEvent = neutralList.get(19).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(19).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 5)  && (xValue <= 6)){
		    				noOfEvent = neutralList.get(20).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(20).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 6)  && (xValue <= 7)){
		    				noOfEvent = neutralList.get(21).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(21).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 7)  && (xValue <= 8)){
		    				noOfEvent = neutralList.get(22).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(22).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 8)  && (xValue <= 9)){
		    				noOfEvent = neutralList.get(23).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(23).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 9)  && (xValue <= 10)){
		    				noOfEvent = neutralList.get(24).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(24).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 10)  && (xValue <= 11)){
		    				noOfEvent = neutralList.get(25).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(25).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 11)  && (xValue <= 12)){
		    				noOfEvent = neutralList.get(26).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(26).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 12)  && (xValue <= 13)){
		    				noOfEvent = neutralList.get(27).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(27).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 13)  && (xValue <= 14)){
		    				noOfEvent = neutralList.get(28).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(28).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 14)){
		    				noOfEvent = neutralList.get(29).getNoOfEvent();
		    				noOfEvent++;
		    				neutralList.get(29).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			totalEventAll = neutralList.get(30).getNoOfEvent();
		    			totalEventAll++;
		    			neutralList.get(30).setNoOfEvent(totalEventAll);
		    		}

					if(node.get("eventCat").asText().equals("Negative")){
						if(xValue <= -14 ){
		    				noOfEvent = negativeList.get(0).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(0).setNoOfEvent(noOfEvent);
		    				
		    			}
						
						if((xValue > -14) && (xValue <= -13)){
							noOfEvent = negativeList.get(1).getNoOfEvent();
							noOfEvent++;
		    				negativeList.get(1).setNoOfEvent(noOfEvent);
						}
						
						if((xValue > -13) && (xValue <= -12)){
							noOfEvent = negativeList.get(2).getNoOfEvent();
							noOfEvent++;
		    				negativeList.get(2).setNoOfEvent(noOfEvent);
						}
						
		    			if((xValue > -12) && (xValue <= -11)){
		    				noOfEvent = negativeList.get(3).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(3).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -11)  && (xValue <= -10)){
		    				noOfEvent = negativeList.get(4).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(4).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -10)  && (xValue <= -9)){
		    				noOfEvent = negativeList.get(5).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(5).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -9)  && (xValue <= -8)){
		    				noOfEvent = negativeList.get(6).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(6).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -8)  && (xValue <= -7)){
		    				noOfEvent = negativeList.get(7).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(7).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -7)  && (xValue <= -6)){
		    				noOfEvent = negativeList.get(8).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(8).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -6)  && (xValue <= -5)){
		    				noOfEvent = negativeList.get(9).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(9).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -5)  && (xValue <= -4)){
		    				noOfEvent = negativeList.get(10).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(10).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -4)  && (xValue <= -3)){
		    				noOfEvent = negativeList.get(11).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(11).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -3)  && (xValue <= -2)){
		    				noOfEvent = negativeList.get(12).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(12).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -2)  && (xValue <= -1)){
		    				noOfEvent = negativeList.get(13).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(13).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > -1)  && (xValue <= 0)){
		    				noOfEvent = negativeList.get(14).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(14).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 0)  && (xValue <= 1)){
		    				noOfEvent = negativeList.get(15).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(15).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 1)  && (xValue <= 2)){
		    				noOfEvent = negativeList.get(16).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(16).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 2)  && (xValue <= 3)){
		    				noOfEvent = negativeList.get(17).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(17).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 3)  && (xValue <= 4)){
		    				noOfEvent = negativeList.get(18).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(18).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 4)  && (xValue <= 5)){
		    				noOfEvent = negativeList.get(19).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(19).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 5)  && (xValue <= 6)){
		    				noOfEvent = negativeList.get(20).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(20).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 6)  && (xValue <= 7)){
		    				noOfEvent = negativeList.get(21).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(21).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 7)  && (xValue <= 8)){
		    				noOfEvent = negativeList.get(22).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(22).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 8)  && (xValue <= 9)){
		    				noOfEvent = negativeList.get(23).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(23).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 9)  && (xValue <= 10)){
		    				noOfEvent = negativeList.get(24).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(24).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 10)  && (xValue <= 11)){
		    				noOfEvent = negativeList.get(25).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(25).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 11)  && (xValue <= 12)){
		    				noOfEvent = negativeList.get(26).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(26).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 12)  && (xValue <= 13)){
		    				noOfEvent = negativeList.get(27).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(27).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 13)  && (xValue <= 14)){
		    				noOfEvent = negativeList.get(28).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(28).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			if((xValue > 14)){
		    				noOfEvent = negativeList.get(29).getNoOfEvent();
		    				noOfEvent++;
		    				negativeList.get(29).setNoOfEvent(noOfEvent);
		    			}
		    			
		    			totalEventAll = negativeList.get(30).getNoOfEvent();
		    			totalEventAll++;
		    			negativeList.get(30).setNoOfEvent(totalEventAll);
					}
					
		    	}
		    	
		    	
		    }
		    
		    
		    for(int j=0; j<=30; j++){
		    	//System.out.println("Area"+Integer.toString(j));
		    	//System.out.println("pos: "+positiveList.get(j).getNoOfEvent());
		    	//System.out.println("net: "+neutralList.get(j).getNoOfEvent());
		    	//System.out.println("neg: "+negativeList.get(j).getNoOfEvent());
		    	
		    	// Write Object Summary for Positive Event
		    	generator.writeStartObject();
  			  	generator.writeFieldName("sessionName");
		        generator.writeString(Integer.toString(positiveList.get(j).getSessionName()));
		        generator.writeFieldName("xArea");
		        generator.writeString(Integer.toString(j+1));
		        generator.writeFieldName("noOfEvent");
		        generator.writeString(Integer.toString(positiveList.get(j).getNoOfEvent()));
		        generator.writeFieldName("eventCat");
		        generator.writeString("Positive");
		        generator.writeEndObject();
		        
		        // Write Object Summary for Neutral Event
		    	generator.writeStartObject();
  			  	generator.writeFieldName("sessionName");
		        generator.writeString(Integer.toString(neutralList.get(j).getSessionName()));
		        generator.writeFieldName("xArea");
		        generator.writeString(Integer.toString(j+1));
		        generator.writeFieldName("noOfEvent");
		        generator.writeString(Integer.toString(neutralList.get(j).getNoOfEvent()));
		        generator.writeFieldName("eventCat");
		        generator.writeString("Neutral");
		        generator.writeEndObject();
		        
		        // Write Object Summary for Negative Event
		    	generator.writeStartObject();
  			  	generator.writeFieldName("sessionName");
		        generator.writeString(Integer.toString(negativeList.get(j).getSessionName()));
		        generator.writeFieldName("xArea");
		        generator.writeString(Integer.toString(j+1));
		        generator.writeFieldName("noOfEvent");
		        generator.writeString(Integer.toString(negativeList.get(j).getNoOfEvent()));
		        generator.writeFieldName("eventCat");
		        generator.writeString("Negative");
		        generator.writeEndObject();
		    }
		    
		}
		
		generator.writeEndArray();
		generator.close();
		return true;
	}
}
