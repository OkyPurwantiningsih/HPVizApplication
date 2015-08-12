package com.lirmm.parser;

import java.io.IOException;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.BSONObject;
import org.bson.types.ObjectId;

import com.fasterxml.jackson.core.JsonParseException;
import com.lirmm.parser.JsonFile;
import com.lirmm.parser.JsonParserSummary;
import com.lirmm.parser.JsonParserSummaryAllSession;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.MongoException;

public class MongoData {
	
	private static final String DB_NAME = "vapeur";
	//private static final String rootDir = "C:/workspace/HPViz/src/main/webapp/hpViz2/data/";
	private static final String rootDir = "C:/Users/Advanse-/Documents/gitRepo/HPViz/src/main/webapp/hpViz2/data/";
	//private static final String writeRootDir = "C:/workspace/HPViz/src/main/webapp/summaryViz2/data/";
	private static final String writeRootDir = "C:/Users/Advanse-/Documents/gitRepo/HPViz/src/main/webapp/summaryViz2/data/";
	
	public MongoData() {
	}
	
	public void UpdateSessionPatient(){
		try {
			 
			System.out.println("Inside MongoData");
			/**** Connect to MongoDB ****/
			// Since 2.10.0, uses MongoClient
			MongoClient mongo = new MongoClient("localhost", 27017);
		 
			/**** Get database ****/
			// if database doesn't exists, MongoDB will create it for you
			DB db = mongo.getDB(DB_NAME);
			
			// Get patient id and name
			DBCollection patientColl = db.getCollection("patients");
			Map patientsMap = new HashMap();

			
			DBCursor cursor = patientColl.find();
			try {
			   while(cursor.hasNext()) {
				   //System.out.println(cursor.next());
				   DBObject patCur = cursor.next();
				   patientsMap.put((patCur.get("_id")).toString(), patCur.get("firstname").toString()+" "+patCur.get("lastname").toString());
			       //System.out.println("Patient ID: "+(ObjectId)patCur.get("_id"));
			       //System.out.println("Name: "+patCur.get("firstname")+" "+patCur.get("lastname"));

			   }
			} finally {
			   cursor.close();
			}
			/**** Get collection / table from 'sessions' ****/
			// if collection doesn't exists, MongoDB will create it for you
			DBCollection session = db.getCollection("sessions");
			DBCollection patSesColl = db.getCollection("patientSession2");
		 
			DBCursor mySessionCursor = session.find();
			mySessionCursor.sort(new BasicDBObject("date", 1));
			
			int newSessionCounter = 0;
			String sessionCounter = "";
			try {
				   while(mySessionCursor.hasNext()) {
					   
					   	DBObject mySession = mySessionCursor.next();

						//== check if already in patientSession collection		
						
						BasicDBObject searchQuery = new BasicDBObject();
						searchQuery.put("_id", mySession.get("_id").toString());
						searchQuery.putAll((BSONObject)searchQuery);
						DBCursor cursorPatSes = patSesColl.find(searchQuery);
						
						// If the session is not in patientSession collection
						if(!cursorPatSes.hasNext()){

							// Check if the session is the first for the particular patient
							BasicDBObject queryPatient = new BasicDBObject();
							queryPatient.put("patientID", mySession.get("patientId").toString());
							queryPatient.putAll((BSONObject)queryPatient);
							
							DBCursor cursorPatient = patSesColl.find(queryPatient);
							cursorPatient.sort(new BasicDBObject("date", -1));
							System.out.println("Document With the same patient ID count: "+cursorPatient.size());
							
							// If it is the first, set the name to session 1
							if(!cursorPatient.hasNext()){
								sessionCounter = "1";
							}else{
								// If it is not the first, get the last session number
								DBObject mySessionNumber = cursorPatient.next();
								newSessionCounter = Integer.parseInt(mySessionNumber.get("sessionName").toString().substring(8)) + 1;
								sessionCounter = String.valueOf(newSessionCounter);
							}
							cursorPatient.close();
							
							//insert the information into table patientSession and generate json file
							BasicDBObject document = new BasicDBObject();
							String sessionID = mySession.get("_id").toString();
							String searchKey = mySession.get("patientId").toString();
							String dirName = patientsMap.get(searchKey).toString().replaceAll("\\s","").toLowerCase();
							String fileLoc = dirName+"/"+sessionID;
							GenJSONFile newJsonFile = new GenJSONFile();
							try {
								Boolean createStatus = newJsonFile.genJSON(mySession, sessionID, dirName);
								if(createStatus){
									// Format the date to readable date
									Date date = new Date(Double.valueOf(mySession.get("date").toString()).longValue());
									String formattedDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
									
									document.put("_id", sessionID);
									document.put("patientID", mySession.get("patientId").toString());
									document.put("date", formattedDate);
									document.put("exercise", ((DBObject)mySession.get("settings")).get("exercise"));
									document.put("exerciseDirection", ((DBObject)mySession.get("settings")).get("exerciseDirection"));
									document.put("sessionName", "Session "+ sessionCounter);
									document.put("fileLocation", fileLoc);
									patSesColl.insert(document);
								}

							} catch (JsonParseException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							} catch (IOException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}

						}

						// create a document to store key and value
						
				   }
			} finally {
				mySessionCursor.close();
			}
		 	
			/**** Done ****/
			System.out.println("Done");
		 
		    } catch (UnknownHostException e) {
			e.printStackTrace();
		    } catch (MongoException e) {
			e.printStackTrace();
		    }
	}
	
	public void UpdateSummary() throws JsonParseException, IOException{
		
		System.out.println("Inside Update Summary");

		
		try {
			 
			MongoClient mongo = new MongoClient("localhost", 27017);
			DB db = mongo.getDB(DB_NAME);
			
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
					 /*JsonParserSummary jsonParserSummary = new JsonParserSummary();
				     Boolean isWritten = jsonParserSummary.writeSummary(jsonFiles, rootDir, writeRootDir);
				     
				     if(isWritten){
				        	System.out.println("Summaryyyyyy Json File is written in "+jsonFiles.get(0).getDirectory());
				        }*/
					 
					// write summary by putting together all the data in each session in one json file
					 // so that it will be easier to read from d3js
					 JsonParserSummaryAllSession summaryAll = new JsonParserSummaryAllSession();
					 Boolean isWritten = summaryAll.writeSummary(jsonFiles, rootDir, writeRootDir);
					 
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
	}
	
}
