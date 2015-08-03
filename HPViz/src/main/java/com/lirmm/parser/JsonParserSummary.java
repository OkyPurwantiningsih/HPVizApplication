package com.lirmm.parser;

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
import com.lirmm.parser.JsonFile;
import com.lirmm.parser.JsonSummaryObj;

public class JsonParserSummary {

	public JsonParserSummary() {
	}
	
	public Boolean writeSummary(List<JsonFile> fileList, String rootDir, String writeDir) throws JsonParseException, IOException{
		
		 String dataDir = fileList.get(0).getDirectory();
		 File theDir = new File(writeDir+dataDir);

		 // if the directory does not exist, create it
		 if (!theDir.exists()) {
		     System.out.println("creating directory: " + dataDir);
		     boolean result = false;
	
		     try{
		         theDir.mkdir();
		         result = true;
		     } 
		     catch(SecurityException se){
		         //handle it
		     }        
		     if(result) {    
		         System.out.println("DIR created");  
		     }
		 }
		 
		JsonFactory factory = new JsonFactory();
        JsonGenerator generator = factory.createGenerator(new FileWriter(new File(writeDir + dataDir+"/"+"summary.json")));
		//JsonGenerator generator = factory.createGenerator(new FileWriter(new File("summary.json")));
		
		//Start Writing Array
        generator.writeStartArray();
        
		for(int i=0; i<fileList.size(); i++){
			//System.out.println(fileList.get(i).getSessionName());
			JsonFactory f = new MappingJsonFactory();
		    JsonParser jp = f.createParser(new File(rootDir + fileList.get(i).getFileLocation()+".json"));
		    JsonToken current;

		    current = jp.nextToken();

		    if (current != JsonToken.START_OBJECT) {
			      System.out.println("Error: root should be object: quiting.");
			      continue;
			}
		    
		    // Initialize the list to store summary object while doing number of Event calculation
		    List<JsonSummaryObj> positiveList = new ArrayList<JsonSummaryObj>();
		    List<JsonSummaryObj> neutralList = new ArrayList<JsonSummaryObj>();
		    List<JsonSummaryObj> negativeList = new ArrayList<JsonSummaryObj>();
		    
		    String sessionName = fileList.get(i).getSessionName();
	    	//int sessionNo = Integer.parseInt(sessionName.substring(sessionName.length() - 1, sessionName.length()));
	    	int sessionNo = Integer.parseInt(sessionName.substring(8, sessionName.length()));
	    	//System.out.println(sessionName+": "+sessionNo);
	    	
	    	// For each list initialize the value of each object
	    	// The first object in the list will hold the record for area1 (x more than 10)
	    	// The second object in the list will hold the record for area2 (x less than 10 and x more than 5), and so on
	    	// since there are 6 different area, iterate 6 times
		    for(int j=0; j<7; j++){
		  
		    	JsonSummaryObj jsonSummaryObj = new JsonSummaryObj(sessionNo, j+1, 0, "Positive");
		    	positiveList.add(jsonSummaryObj);
		    	JsonSummaryObj jsonSummaryObjNet = new JsonSummaryObj(sessionNo, j+1, 0, "Neutral");
		    	neutralList.add(jsonSummaryObjNet);
		    	JsonSummaryObj jsonSummaryObjNeg = new JsonSummaryObj(sessionNo, j+1, 0, "Negative");
		    	negativeList.add(jsonSummaryObjNeg);
		    	
		    }
		    
		    while (jp.nextToken() != JsonToken.END_OBJECT) {
		    	String fieldName = jp.getCurrentName();
		    	// move from field name to field value
		        current = jp.nextToken();
		        
		    	// Start extracting data from the logs
		        if (fieldName.equals("logs")) {
		        	if (current == JsonToken.START_ARRAY) {
				    	while (jp.nextToken() != JsonToken.END_ARRAY) {	        					  
				    		
				    		JsonNode node = jp.readValueAsTree();
				    		int noOfEvent = 0;
				    		int totalEventAll = 0;
				    		
				    		Double xValue = node.get("x").asDouble();
			    					    	
				    		if(node.get("eventCat").asText().equals("Positive")){
				    			
				    			if(xValue <= -10 ){
				    				noOfEvent = positiveList.get(0).getNoOfEvent();
				    				noOfEvent++;
				    				positiveList.get(0).setNoOfEvent(noOfEvent);
				    				
				    			}
								
								if((xValue > -10) && (xValue <= -5)){
									noOfEvent = positiveList.get(1).getNoOfEvent();
				    				noOfEvent++;
				    				positiveList.get(1).setNoOfEvent(noOfEvent);

								}
								
								if((xValue > -5) && (xValue <= 0)){
									noOfEvent = positiveList.get(2).getNoOfEvent();
									noOfEvent++;
				    				positiveList.get(2).setNoOfEvent(noOfEvent);
								}
								
								if((xValue > 0) && (xValue <= 5)){
									noOfEvent = positiveList.get(3).getNoOfEvent();
									noOfEvent++;
				    				positiveList.get(3).setNoOfEvent(noOfEvent);
								}
								
				    			if((xValue > 5) && (xValue <= 10)){
				    				noOfEvent = positiveList.get(4).getNoOfEvent();
				    				noOfEvent++;
				    				positiveList.get(4).setNoOfEvent(noOfEvent);
				    			}
				    			
				    			if(xValue > 10 ){
				    				noOfEvent = positiveList.get(5).getNoOfEvent();
				    				noOfEvent++;
				    				positiveList.get(5).setNoOfEvent(noOfEvent);
				    			}
				    			
				    			totalEventAll = positiveList.get(6).getNoOfEvent();
				    			totalEventAll++;
				    			positiveList.get(6).setNoOfEvent(totalEventAll);
				    			
				    		}
				    		
				    		if(node.get("eventCat").asText().equals("Neutral")){
				    			if(xValue <= -10 ){
				    				noOfEvent = neutralList.get(0).getNoOfEvent();
				    				noOfEvent++;
				    				neutralList.get(0).setNoOfEvent(noOfEvent);
				    				
				    			}
								
								if((xValue > -10) && (xValue <= -5)){
									noOfEvent = neutralList.get(1).getNoOfEvent();
				    				noOfEvent++;
				    				neutralList.get(1).setNoOfEvent(noOfEvent);

								}
								
								if((xValue > -5) && (xValue <= 0)){
									noOfEvent = neutralList.get(2).getNoOfEvent();
									noOfEvent++;
									neutralList.get(2).setNoOfEvent(noOfEvent);
								}
								
								if((xValue > 0) && (xValue <= 5)){
									noOfEvent = neutralList.get(3).getNoOfEvent();
									noOfEvent++;
									neutralList.get(3).setNoOfEvent(noOfEvent);
								}
								
				    			if((xValue > 5) && (xValue <= 10)){
				    				noOfEvent = neutralList.get(4).getNoOfEvent();
				    				noOfEvent++;
				    				neutralList.get(4).setNoOfEvent(noOfEvent);
				    			}
				    			
				    			if(xValue > 10 ){
				    				noOfEvent = neutralList.get(5).getNoOfEvent();
				    				noOfEvent++;
				    				neutralList.get(5).setNoOfEvent(noOfEvent);
				    			}
				    			
				    			totalEventAll = neutralList.get(6).getNoOfEvent();
				    			totalEventAll++;
				    			neutralList.get(6).setNoOfEvent(totalEventAll);
				    		}

							if(node.get("eventCat").asText().equals("Negative")){
								if(xValue <= -10 ){
				    				noOfEvent = negativeList.get(0).getNoOfEvent();
				    				noOfEvent++;
				    				negativeList.get(0).setNoOfEvent(noOfEvent);
				    				
				    			}
								
								if((xValue > -10) && (xValue <= -5)){
									noOfEvent = negativeList.get(1).getNoOfEvent();
				    				noOfEvent++;
				    				negativeList.get(1).setNoOfEvent(noOfEvent);

								}
								
								if((xValue > -5) && (xValue <= 0)){
									noOfEvent = negativeList.get(2).getNoOfEvent();
									noOfEvent++;
									negativeList.get(2).setNoOfEvent(noOfEvent);
								}
								
								if((xValue > 0) && (xValue <= 5)){
									noOfEvent = negativeList.get(3).getNoOfEvent();
									noOfEvent++;
									negativeList.get(3).setNoOfEvent(noOfEvent);
								}
								
				    			if((xValue > 5) && (xValue <= 10)){
				    				noOfEvent = negativeList.get(4).getNoOfEvent();
				    				noOfEvent++;
				    				negativeList.get(4).setNoOfEvent(noOfEvent);
				    			}
				    			
				    			if(xValue > 10 ){
				    				noOfEvent = negativeList.get(5).getNoOfEvent();
				    				noOfEvent++;
				    				negativeList.get(5).setNoOfEvent(noOfEvent);
				    			}
				    			
				    			totalEventAll = negativeList.get(6).getNoOfEvent();
				    			totalEventAll++;
				    			negativeList.get(6).setNoOfEvent(totalEventAll);
							}
							
				    	}
				    	
				    	
				    }else if(current == JsonToken.END_OBJECT){
				    	System.out.println("======== Skip "+ sessionName + " =========");
				    	continue;
				    }
		        }
		    }
		    
		    
		    
		    System.out.println("======== Writing "+ sessionName + " =========");
		    for(int j=0; j<7; j++){
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

