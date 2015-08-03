package com.lirmm.summary;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.BSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;

/**
 * Hello world!
 *
 */
public class App 
{
    public static void main( String[] args ) throws JsonParseException, IOException
    {
        
    	try {
			 
			MongoClient mongo = new MongoClient("localhost", 27017);
			DB db = mongo.getDB("vapeur-patient1");
			
			// Get list of patient id
			DBCollection patientColl = db.getCollection("patients");
			List<String> patientList = new ArrayList<String>();
			
			DBCursor cursorPatient = patientColl.find();
			try {
			   while(cursorPatient.hasNext()) {

				   DBObject patCur = cursorPatient.next();
				   patientList.add((patCur.get("_id")).toString());
				   
			   }
			} finally {
				cursorPatient.close();
			}
			
			DBCollection patSesColl = db.getCollection("patientSession2");
			for(int i=0; i<patientList.size(); i++){
				
				// Search all Session for a particular patient
				BasicDBObject queryPatient = new BasicDBObject();
				queryPatient.put("patientID", patientList.get(i));
				queryPatient.putAll((BSONObject)queryPatient);
				
				DBCursor cursorPatSes = patSesColl.find(queryPatient);
				List<JsonFile> jsonFiles = new ArrayList<JsonFile>();
				
				// For each record of the search result, create a JsonFile object and add it to the list
				 while(cursorPatSes.hasNext()) {
					 
					 DBObject myPatSes = cursorPatSes.next();
					 
					 JsonFile jsonFile = new JsonFile(myPatSes.get("sessionName").toString(), myPatSes.get("fileLocation").toString());
					 jsonFiles.add(jsonFile);
				 }
				 
				 cursorPatSes.close();
				 
				 if(jsonFiles.size()>0){
					 // This is to write summary by combine the value of noOfEvent by 1 x axis unit
					 /*JsonParserSummary jsonParserSummary = new JsonParserSummary();
				     Boolean isWritten = jsonParserSummary.writeSummary(jsonFiles);
				     
				     if(isWritten){
				        	System.out.println("Summary Json File is written");
				     }*/
					 
					 // write summary by putting together all the data in each session in one json file
					 // so that it will be easier to read from d3js
					 JsonParserSummaryAllSession summaryAll = new JsonParserSummaryAllSession();
					 Boolean isWritten = summaryAll.writeSummary(jsonFiles);
					 
					 if(isWritten){
				        	System.out.println("SummaryAll.json File is written in "+jsonFiles.get(0).getDirectory());
				     }
				 }
			}
			
    	}catch (UnknownHostException e) {
			e.printStackTrace();
	    } catch (MongoException e) {
		e.printStackTrace();
	    }
    	
    	
    	/*List<JsonFile> jsonFiles = new ArrayList<JsonFile>();
        JsonFile jsonFile = new JsonFile("Session 1", "miajohnson/55925c1bb75a5fbc1b3cf2fe");
        jsonFiles.add(jsonFile);
        JsonFile jsonFile2 = new JsonFile("Session 2","miajohnson/5593adf075df28c4176494a8");
        jsonFiles.add(jsonFile2);
        JsonFile jsonFile3 = new JsonFile("Session 3","miajohnson/5594fe864abe25c001399eed");
        jsonFiles.add(jsonFile3);
        JsonFile jsonFile4 = new JsonFile("Session 4","miajohnson/5596783a3712212808a28918");
        jsonFiles.add(jsonFile4);
        JsonFile jsonFile5 = new JsonFile("Session 5","miajohnson/559a46440af034e817b9b759");
        jsonFiles.add(jsonFile5);
        JsonFile jsonFile6 = new JsonFile("Session 6","miajohnson/559b9500c1b823701b93478d");
        jsonFiles.add(jsonFile6);
        
        JsonParserSummary jsonParserSummary = new JsonParserSummary();
        Boolean isWritten = jsonParserSummary.writeSummary(jsonFiles);
        
        if(isWritten){
        	System.out.println("Summary Json File is written");
        }*/
        
    }
}
