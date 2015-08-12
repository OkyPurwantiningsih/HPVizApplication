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

public class JsonParserSummaryAllSession {
	public JsonParserSummaryAllSession() {
	}
	
	public Boolean writeSummary(List<JsonFile> fileList) throws JsonParseException, IOException{
		
		JsonFactory factory = new JsonFactory();
        JsonGenerator generator = factory.createGenerator(new FileWriter(new File(fileList.get(0).getDirectory()+"/"+"summaryAllSession.json")));
		//JsonGenerator generator = factory.createGenerator(new FileWriter(new File("summary.json")));
		
		//Start Writing Array
        generator.writeStartArray();
	    
		for(int i=0; i<fileList.size(); i++){
			
		    System.out.println(fileList.get(i).getSessionName());
			JsonFactory f = new MappingJsonFactory();
		    JsonParser jp = f.createParser(new File(fileList.get(i).getFileLocation()+".json"));
		    JsonToken current;

		    current = jp.nextToken();

		    if (current != JsonToken.START_ARRAY) {
			      System.out.println("Error: root should be object: quiting.");
			      continue;
			}
		    
	        // Initialize the list to store summary object while doing number of Event calculation
		    List<JsonSummaryAllObj> positiveList = new ArrayList<JsonSummaryAllObj>();
		    List<JsonSummaryAllObj> neutralList = new ArrayList<JsonSummaryAllObj>();
		    List<JsonSummaryAllObj> negativeList = new ArrayList<JsonSummaryAllObj>();
		    
		    String sessionName = fileList.get(i).getSessionName();
	    	int sessionNo = Integer.parseInt(sessionName.substring(8, sessionName.length()));
	    	
	    	// For each list json object, identify the eventCategory the value of each object

		    if (current == JsonToken.START_ARRAY) {
		    	while (jp.nextToken() != JsonToken.END_ARRAY) {	        					  
		    		
		    		JsonNode node = jp.readValueAsTree();
		    		
		    		Double xValue = node.get("x").asDouble();
	    					    	
		    		if(node.get("eventCat").asText().equals("Positive")){
	    				JsonSummaryAllObj jsonSummaryObj = new JsonSummaryAllObj(sessionNo, xValue, "Positive");
	    		    	positiveList.add(jsonSummaryObj);
		    			
		    		}
		    		
		    		if(node.get("eventCat").asText().equals("Neutral")){
		    			JsonSummaryAllObj jsonSummaryObj = new JsonSummaryAllObj(sessionNo, xValue, "Neutral");
	    		    	neutralList.add(jsonSummaryObj);
		    		}

					if(node.get("eventCat").asText().equals("Negative")){
						JsonSummaryAllObj jsonSummaryObj = new JsonSummaryAllObj(sessionNo, xValue, "Negative");
	    		    	negativeList.add(jsonSummaryObj);
					}
					
		    	}
		    	
		    	
		    }
		    
		    System.out.println("pos: "+positiveList.size());
	    	System.out.println("net: "+neutralList.size());
	    	System.out.println("neg: "+negativeList.size());
		    for(int j=0; j<positiveList.size(); j++){

		    	// Write Object Summary for Positive Event
		    	generator.writeStartObject();
  			  	generator.writeFieldName("sessionName");
		        generator.writeString(Integer.toString(positiveList.get(j).getSessionName()));
		        generator.writeFieldName("x");
		        generator.writeString(Double.toString(positiveList.get(j).getX()));
		        generator.writeFieldName("eventCat");
		        generator.writeString("Positive");
		        generator.writeEndObject();
		    }
		    
		    for(int j=0; j<neutralList.size(); j++){
		        // Write Object Summary for Neutral Event
		    	generator.writeStartObject();
  			  	generator.writeFieldName("sessionName");
		        generator.writeString(Integer.toString(neutralList.get(j).getSessionName()));
		        generator.writeFieldName("x");
		        generator.writeString(Double.toString(neutralList.get(j).getX()));
		        generator.writeFieldName("eventCat");
		        generator.writeString("Neutral");
		        generator.writeEndObject();
		    }
		    
		    for(int j=0; j<negativeList.size(); j++){
		        // Write Object Summary for Negative Event
		    	generator.writeStartObject();
  			  	generator.writeFieldName("sessionName");
		        generator.writeString(Integer.toString(negativeList.get(j).getSessionName()));
		        generator.writeFieldName("x");
		        generator.writeString(Double.toString(negativeList.get(j).getX()));
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
