package com.lirmm.parser;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.MappingJsonFactory;
import com.mongodb.DBObject;

public class GenJSONFile {
	
	public GenJSONFile() {
	}
	
	public Boolean genJSON(DBObject inputJSON, String fName, String dirName) throws JsonParseException, IOException{
		JsonFactory f = new MappingJsonFactory();
	    //JsonParser jp = f.createParser(new File("file1.json"));
		JsonParser jp = f.createParser(inputJSON.toString());
	    Map<String,Spawn> spawnObject = new HashMap<String, Spawn>();
	    Map<String,String> obstacles = new HashMap<String, String>();
	    Map<String,String> enemies = new HashMap<String, String>();
	    
	    File currentDir = new File("");
	    System.out.println("current directory: " + currentDir);
	    //String rootDir = "src/main/webapp/hpViz2/data/";
	    //String rootDir = "C:/workspace/HPViz/src/main/webapp/hpViz2/data/";
	    String rootDir = "C:/Users/Advanse-/Documents/gitRepo/HPViz/src/main/webapp/hpViz2/data/";

	    File theDir = new File(rootDir+dirName);

		 // if the directory does not exist, create it
		 if (!theDir.exists()) {
		     System.out.println("creating directory: " + dirName);
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
        JsonGenerator generator = factory.createGenerator(new FileWriter(new File(rootDir+dirName+"/"+fName+".json")));
        
	    JsonToken current;

	    current = jp.nextToken();
	    if (current != JsonToken.START_OBJECT) {
	      System.out.println("Error: root should be object: quiting.");
	      return false;
	    }
	    
	    // Start writing the file
	    generator.writeStartObject();
	    
	    while (jp.nextToken() != JsonToken.END_OBJECT) {
	    	String fieldName = jp.getCurrentName();
	        // move from field name to field value
	        current = jp.nextToken();
	        
	     // Start writing general information of the session
	        switch (fieldName){
	        case "_id": 
	        	generator.writeFieldName("sessionID");
	        	generator.writeString(fName);
	        	break;
	        case "patientId":
	        	generator.writeFieldName("patientId");
	        	generator.writeString(jp.getText());
	        	break;
	        case "date": 
	        	generator.writeFieldName("date");
	        	
	        	// Format the date to readable date
				Date date = new Date(Double.valueOf(jp.getText()).longValue());
				String formattedDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
			    generator.writeString(formattedDate);
	        	break;
	        case "settings": 
	        	if (current == JsonToken.START_OBJECT) {
	        		JsonNode node = jp.readValueAsTree();
	        		generator.writeFieldName("exerciseType");
				    generator.writeString(node.get("exercise").asText());
	        		generator.writeFieldName("exerciseDirection");
				    generator.writeString(node.get("exerciseDirection").asText());
				    generator.writeFieldName("nbRepetitions");
				    generator.writeString(node.get("nbRepetitions").asText());
				    generator.writeFieldName("actionPhaseDuration");
				    generator.writeString(node.get("actionPhaseDuration").asText());
				    generator.writeFieldName("restPhaseDuration");
				    generator.writeString(node.get("restPhaseDuration").asText());
	        	}
	        	
	        	break;
	        case "score": 
	        	generator.writeFieldName("score");
			    generator.writeString(jp.getText());
	        	break;
	        case "performance": 
	        	generator.writeFieldName("performance");
			    generator.writeString(jp.getText());
	        	break;
	        case "completed": 
	        	generator.writeFieldName("completed");
			    generator.writeString(jp.getText());
	        	break;
	        case "duration": 
	        	generator.writeFieldName("duration");
			    generator.writeString(jp.getText());
	        	break;
	        }
	        
	        // Start extracting data from the logs
	        if (fieldName.equals("logs")) {
	        	
	        	generator.writeFieldName("logs");
	        	generator.writeStartArray();
	        	if (current == JsonToken.START_OBJECT) {
	        		while (jp.nextToken() != JsonToken.END_OBJECT) {
	        			String fieldName2 = jp.getCurrentName();
	        			current = jp.nextToken();
	        			if(fieldName2.equals("logs")){
	        				if (current == JsonToken.START_ARRAY) {
	        					// For each of the records in the array
	        			        int i = 1; 
	        			        int missedBonus = 0;
	        			        int missedEnemy = 0;
	        			        int catchedBonus = 0;
	        			        int dodgeObstacle = 0;
	        			        int collidedObstacle = 0;
	        			        int collidedEnemy = 0;
	        			        int killEnemy = 0;
	        			        int hitEnemy = 0;
	        			        int hurtEnemy = 0;
	        			        int totalEnemies = 0;
	        			        int totalBonuses = 0;
	        			        int totalObstacles = 0;
	        			        
	        			        //Start Writing Object
	        			        //generator.writeStartArray();
	        					while (jp.nextToken() != JsonToken.END_ARRAY) {	        					  
	        			        	  JsonNode node = jp.readValueAsTree();
	        			              // And now we have random access to everything in the object
	        			              //System.out.println("type " + node.get("type").asText());
	        			        	  if(node.get("type").asText().equals("Event")){
	        			        		  //System.out.println("There is an event");
	        			        		  JsonNode data = node.get("data");
	        			        		  
	        			        		  //If it is a spawn, add it to Array
	        			        		  if(data.get("type").asText().equals("Spawn")){
	        			        			  JsonNode arg = data.get("arguments");
	        			        			  JsonNode pos = data.get("position");

        			        				  Spawn spawn = new Spawn();
        			        				  spawn.spawnType = arg.get(0).asText();
        			        				  spawn.apparitionTime = node.get("timestamp").asText();
        			        				  spawn.apparitionY = pos.get(2).asText();
        			        				  spawnObject.put(data.get("id").asText(), spawn);
        			        				  if(spawn.spawnType.equals("Enemy")){
        			        					  totalEnemies++;
        			        				  }else if(spawn.spawnType.equals("Bonus")){
        			        					  totalBonuses++;
        			        				  }else if(spawn.spawnType.equals("Obstacle")){
        			        					  totalObstacles++;
        			        				  }
	        			        			          			        			  
	        			        		  }
	        			        		  
	        			        		  if(data.get("type").asText().equals("Catch")){
	        			        			  JsonNode pos = data.get("position");
	        			        			  //System.out.println(i + " Catching Bonuses at time:" + node.get("timestamp")+ "; with id: "+ data.get("id")+"; at x: "+ pos.get(0)+"; at y: "+ pos.get(1));
	        			        			  catchedBonus++;
	        			        			  generator.writeStartObject();
	        			        			  generator.writeFieldName("spawnID");
	        		        			      generator.writeString(data.get("id").asText());
	        		        			      generator.writeFieldName("spawnType");
	        		        			      generator.writeString("Bonus");
	        		        			      generator.writeFieldName("eventType");
	        		        			      generator.writeString("Catch");
	        		        			      generator.writeFieldName("eventCat");
	        		        			      generator.writeString("Positive");
	        		        			      generator.writeFieldName("x");
	        		        			      generator.writeString(pos.get(0).asText());
	        		        			      
	        		        			      Spawn sp = spawnObject.get(data.get("id").asText());
	        		        			      BigDecimal startY = new BigDecimal(sp.apparitionY);
	        		        			      BigDecimal endY = new BigDecimal(pos.get(2).asText());
	        		        			      BigDecimal startTime = new BigDecimal(sp.apparitionTime);
	        		        			      BigDecimal endTime = new BigDecimal(node.get("timestamp").asText());
	        		        			      BigDecimal timeToReact = (endTime.subtract(startTime));
	        		        			      BigDecimal screenV = ((startY.subtract(endY)).divide(endTime.subtract(startTime), 5, RoundingMode.HALF_UP));
	        		        			      generator.writeFieldName("timeToReact");
	        		        			      generator.writeString(timeToReact.toString());
	        		        			      generator.writeFieldName("screenV");
	        		        			      generator.writeString(screenV.toString());
	        		        			      generator.writeFieldName("time");
	        		        			      generator.writeString(node.get("timestamp").asText());
	        			        			  generator.writeEndObject();
	        			        			  //i++;
	        			        		  }
	        			        		  if(data.get("type").asText().equals("Miss")){
	        			        			  JsonNode pos = data.get("position");
	        			        			  Spawn sp = spawnObject.get(data.get("id").asText());
	        			        			  //System.out.println(i + " Missing "+sp.spawnType+" at time:" + node.get("timestamp")+ "; with id: "+ data.get("id")+"; at x: "+ pos.get(0)+"; at y: "+ pos.get(1));
	        			        			  generator.writeStartObject();
	        			        			  generator.writeFieldName("spawnID");
	        		        			      generator.writeString(data.get("id").asText());
	        		        			      generator.writeFieldName("spawnType");     	
	        		        			      
	        		        			      BigDecimal startY = new BigDecimal(sp.apparitionY);
	        		        			      BigDecimal endY = new BigDecimal(pos.get(2).asText());
	        		        			      BigDecimal startTime = new BigDecimal(sp.apparitionTime);
	        		        			      BigDecimal endTime = new BigDecimal(node.get("timestamp").asText());
//	        		        			      BigDecimal timeToReact = (endTime.subtract(startTime));
	        		        			      BigDecimal screenV = ((startY.subtract(endY)).divide(endTime.subtract(startTime), 5, RoundingMode.HALF_UP));
//	        		        			      System.out.println("Speed: "+screenV.toString()+","+startY.toString()+","+endY.toString()+","+startTime.toString()+","+endTime.toString());

	        			        			  if(sp.spawnType.equals("Enemy")){
	        			        				  missedEnemy++;
	        			        				  generator.writeString("Enemy");
	        			        				  generator.writeFieldName("eventType");
	        			        				  generator.writeString("Miss");
		        		        			      generator.writeFieldName("eventCat");
		        		        			      generator.writeString("Neutral");
		        			        			  generator.writeFieldName("x");
		        		        			      generator.writeString(pos.get(0).asText());
		        		        			      generator.writeFieldName("y");
		        		        			      generator.writeString(pos.get(2).asText());
	        			        			  }else{
	        			        				  missedBonus++;
	        			        				  generator.writeString("Bonus");
	        			        				  generator.writeFieldName("eventType");
	        			        				  generator.writeString("Miss");
		        		        			      generator.writeFieldName("eventCat");
		        		        			      generator.writeString("Neutral");
		        			        			  generator.writeFieldName("x");
		        		        			      generator.writeString(pos.get(0).asText());

	        			        			  }
	        			        			  generator.writeFieldName("timeToReact");
	        		        			      generator.writeString("99");
	        		        			      generator.writeFieldName("screenV");
	        		        			      generator.writeString("99");
	        		        			      generator.writeFieldName("time");
	        		        			      generator.writeString(node.get("timestamp").asText());
	        			        			  generator.writeEndObject();
	        			        			  //i++;
	        			        		  }
	        			        		  if(data.get("type").asText().equals("Dodge")){
	        			        			  JsonNode pos = data.get("position");
	        			        			  //System.out.println(i + " Dodge Obstacle at time:" + node.get("timestamp")+ "; with id: "+ data.get("id")+"; at x: "+ pos.get(0)+"; at y: "+ pos.get(1));
	        			        			  dodgeObstacle++;
	        			        			  generator.writeStartObject();
	        			        			  generator.writeFieldName("spawnID");
	        		        			      generator.writeString(data.get("id").asText());
	        		        			      generator.writeFieldName("spawnType");
	        		        			      generator.writeString("Obstacle");
	        		        			      generator.writeFieldName("eventType");
	        		        			      generator.writeString("Dodge");
	        		        			      generator.writeFieldName("eventCat");
	        		        			      generator.writeString("Neutral");
	        		        			      generator.writeFieldName("x");
	        		        			      generator.writeString(pos.get(0).asText());
	        		        			      
	        		        			      Spawn sp = spawnObject.get(data.get("id").asText());
	        		        			      BigDecimal startY = new BigDecimal(sp.apparitionY);
	        		        			      BigDecimal endY = new BigDecimal(pos.get(2).asText());
	        		        			      BigDecimal startTime = new BigDecimal(sp.apparitionTime);
	        		        			      BigDecimal endTime = new BigDecimal(node.get("timestamp").asText());
	        		        			      BigDecimal timeToReact = (endTime.subtract(startTime));
	        		        			      BigDecimal screenV = ((startY.subtract(endY)).divide(endTime.subtract(startTime), 5, RoundingMode.HALF_UP));
	        		        			      generator.writeFieldName("timeToReact");
	        		        			      generator.writeString("99");
	        		        			      generator.writeFieldName("screenV");
	        		        			      generator.writeString("99");
	        		        			      generator.writeFieldName("time");
	        		        			      generator.writeString(node.get("timestamp").asText());
	        			        			  generator.writeEndObject();
	        			        			  //i++;
	        			        		  }
	        			        		  if(data.get("type").asText().equals("Collision")){
	        			        			  JsonNode pos = data.get("position");
	        			        			  //System.out.println(i + " Collided with Obstacle at time:" + node.get("timestamp")+ "; with id: "+ data.get("id")+"; at x: "+ pos.get(0)+"; at y: "+ pos.get(1));
	        			        			  Spawn sp = spawnObject.get(data.get("id").asText());
	        			        			  generator.writeStartObject();
	        			        			  generator.writeFieldName("spawnID");
	        		        			      generator.writeString(data.get("id").asText());
	        		        			      generator.writeFieldName("spawnType");     	
	        		        			      
	        		        			      BigDecimal startY = new BigDecimal(sp.apparitionY);
	        		        			      BigDecimal endY = new BigDecimal(pos.get(2).asText());
	        		        			      BigDecimal startTime = new BigDecimal(sp.apparitionTime);
	        		        			      BigDecimal endTime = new BigDecimal(node.get("timestamp").asText());
	        		        			      BigDecimal timeToReact = (endTime.subtract(startTime));
	        		        			      BigDecimal screenV = ((startY.subtract(endY)).divide(endTime.subtract(startTime), 5, RoundingMode.HALF_UP));
	        			        			  if(sp.spawnType.equals("Enemy")){
//	        			        				  collidedEnemy++;
	        			        				  generator.writeString("Enemy");
	        			        				  generator.writeFieldName("eventType");
	        			        				  generator.writeString("Collision");
		        		        			      generator.writeFieldName("eventCat");
		        		        			      generator.writeString("Negative");
		        			        			  generator.writeFieldName("x");
		        		        			      generator.writeString(pos.get(0).asText());
		        		        			      generator.writeFieldName("y");
		        		        			      generator.writeString(pos.get(2).asText());
	        			        			  }else{
//	        			        				  collidedObstacle++;
	        			        				  generator.writeString("Obstacle");
	        			        				  generator.writeFieldName("eventType");
	        			        				  generator.writeString("Collision");
		        		        			      generator.writeFieldName("eventCat");
		        		        			      generator.writeString("Negative");
		        			        			  generator.writeFieldName("x");
		        		        			      generator.writeString(pos.get(0).asText());
	        			        			  }
	        			        			  
	        			        			  generator.writeFieldName("timeToReact");
	        		        			      generator.writeString(timeToReact.toString());
	        		        			      generator.writeFieldName("screenV");
	        		        			      generator.writeString(screenV.toString());
	        		        			      generator.writeFieldName("time");
	        		        			      generator.writeString(node.get("timestamp").asText());
	        			        			  generator.writeEndObject();
	        			        			  //i++;
	        			        		  }
	        			        		  if(data.get("type").asText().equals("Kill")){
	        			        			  JsonNode pos = data.get("position");
//	        			        			  System.out.println(i + " Kill Enemy at time:" + node.get("timestamp")+ "; with id: "+ data.get("id")+"; at x: "+ pos.get(0)+"; at y: "+ pos.get(1));
	        			        			  killEnemy++;
	        			        			  
	        			        			  generator.writeStartObject();
	        			        			  generator.writeFieldName("spawnID");
	        		        			      generator.writeString(data.get("id").asText());
	        		        			      generator.writeFieldName("spawnType");
	        		        			      generator.writeString("Enemy");
	        		        			      generator.writeFieldName("eventType");
	        		        			      generator.writeString("Kill");
	        		        			      generator.writeFieldName("eventCat");
	        		        			      generator.writeString("Positive");
	        		        			      generator.writeFieldName("x");
	        		        			      generator.writeString(pos.get(0).asText());
	        		        			      
	        		        			      Spawn sp = spawnObject.get(data.get("id").asText());
	        		        			      BigDecimal startY = new BigDecimal(sp.apparitionY);
	        		        			      BigDecimal endY = new BigDecimal(pos.get(2).asText());
	        		        			      BigDecimal startTime = new BigDecimal(sp.apparitionTime);
	        		        			      BigDecimal endTime = new BigDecimal(node.get("timestamp").asText());
	        		        			      BigDecimal timeToReact = (endTime.subtract(startTime));
	        		        			      BigDecimal screenV = ((startY.subtract(endY)).divide(endTime.subtract(startTime), 5, RoundingMode.HALF_UP));
	        		        			      generator.writeFieldName("timeToReact");
	        		        			      generator.writeString(timeToReact.toString());
	        		        			      generator.writeFieldName("screenV");
	        		        			      generator.writeString(screenV.toString());
	        		        			      generator.writeFieldName("time");
	        		        			      generator.writeString(node.get("timestamp").asText());
	        			        			  generator.writeEndObject();
//	        			        			  i++;
	        			        		  }
	        			        		  if(data.get("type").asText().equals("Hit")){
	        			        			  JsonNode pos = data.get("position");
//	        			        			  System.out.println(i + " Hit Enemy at time:" + node.get("timestamp")+ "; with id: "+ data.get("id")+"; at x: "+ pos.get(0)+"; at y: "+ pos.get(1));
	        			        			  hitEnemy++;
	        			        			  
	        			        			  generator.writeStartObject();
	        			        			  generator.writeFieldName("spawnID");
	        		        			      generator.writeString(data.get("id").asText());
	        		        			      generator.writeFieldName("spawnType");
	        		        			      generator.writeString("Enemy");
	        		        			      generator.writeFieldName("eventType");
	        		        			      generator.writeString("Hit");
	        		        			      generator.writeFieldName("eventCat");
	        		        			      generator.writeString("Positive");
	        		        			      generator.writeFieldName("x");
	        		        			      generator.writeString(pos.get(0).asText());
	        		        			      
	        		        			      Spawn sp = spawnObject.get(data.get("id").asText());
	        		        			      BigDecimal startY = new BigDecimal(sp.apparitionY);
	        		        			      BigDecimal endY = new BigDecimal(pos.get(2).asText());
	        		        			      BigDecimal startTime = new BigDecimal(sp.apparitionTime);
	        		        			      BigDecimal endTime = new BigDecimal(node.get("timestamp").asText());
	        		        			      BigDecimal timeToReact = (endTime.subtract(startTime));
	        		        			      BigDecimal screenV = ((startY.subtract(endY)).divide(endTime.subtract(startTime), 5, RoundingMode.HALF_UP));
	        		        			      generator.writeFieldName("timeToReact");
	        		        			      generator.writeString(timeToReact.toString());
	        		        			      generator.writeFieldName("screenV");
	        		        			      generator.writeString(screenV.toString());
	        		        			      generator.writeFieldName("time");
	        		        			      generator.writeString(node.get("timestamp").asText());
	        			        			  generator.writeEndObject();

//	        			        			  i++;
	        			        		  }
	        			        		  if(data.get("type").asText().equals("Hurt")){
	        			        			  JsonNode pos = data.get("position");
//	        			        			  System.out.println(i + " Hurt Enemy at time:" + node.get("timestamp")+ "; with id: "+ data.get("id")+"; at x: "+ pos.get(0)+"; at y: "+ pos.get(1));
	        			        			  hurtEnemy++;
	        			        			  
	        			        			  generator.writeStartObject();
	        			        			  generator.writeFieldName("spawnID");
	        		        			      generator.writeString(data.get("id").asText());
	        		        			      generator.writeFieldName("spawnType");
	        		        			      generator.writeString("Enemy");
	        		        			      generator.writeFieldName("eventType");
	        		        			      generator.writeString("Hurt");
	        		        			      generator.writeFieldName("eventCat");
	        		        			      generator.writeString("Negative");
	        		        			      generator.writeFieldName("x");
	        		        			      generator.writeString(pos.get(0).asText());
	        		        			      
	        		        			      Spawn sp = spawnObject.get(data.get("id").asText());
	        		        			      BigDecimal startY = new BigDecimal(sp.apparitionY);
	        		        			      BigDecimal endY = new BigDecimal(pos.get(2).asText());
	        		        			      BigDecimal startTime = new BigDecimal(sp.apparitionTime);
	        		        			      BigDecimal endTime = new BigDecimal(node.get("timestamp").asText());
	        		        			      BigDecimal timeToReact = (endTime.subtract(startTime));
	        		        			      BigDecimal screenV = ((startY.subtract(endY)).divide(endTime.subtract(startTime), 5, RoundingMode.HALF_UP));
	        		        			      generator.writeFieldName("timeToReact");
	        		        			      generator.writeString(timeToReact.toString());
	        		        			      generator.writeFieldName("screenV");
	        		        			      generator.writeString(screenV.toString());
	        		        			      generator.writeFieldName("time");
	        		        			      generator.writeString(node.get("timestamp").asText());
	        			        			  generator.writeEndObject();
//	        			        			  i++;
	        			        		  }
        			        			  
	        			        	  }          			        	  
	        			        }

	        					//generator.writeEndArray();	        			        
	        			        
	        				}
	        				break;
	        			}
	        			else{
	        				 //System.out.println("Unprocessed property: " + fieldName2);
	        			}
	        		}
	        	}
	        	generator.writeEndArray();
	        	break;
	        }
	        else {
	            //System.out.println("Unprocessed property: " + fieldName);
	        
	            jp.skipChildren();
	        }
	    }
	    
	    generator.writeEndObject();
	    generator.close();
	    System.out.println("Finished processing the file.");
		return true;
	}
	
}
