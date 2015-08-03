package com.lirmm.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Session {
	@Id
	private String id;
	private String patientID;
	private String date;
	private String exercise;
	private String exerciseDirection;
	private String sessionName;
	private String fileLocation;

	public Session() {
	}
	
	public Session(String patientID, String date, String exercise, String exerciseDirection, String sessionName, String fileLocation) {
		setPatientID(patientID);
		setDate(date);
		setExercise(exercise);
		setExerciseDirection(exerciseDirection);
		setSessionName(sessionName);
		setFileLocation(fileLocation);
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPatientID() {
		return patientID;
	}
	
	public void setPatientID(String patientID) {
		this.patientID = patientID;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setDate(String date) {
		this.date = date;
	}
	
	public String getExercise() {
		return exercise;
	}
	
	public void setExercise(String exercise) {
		this.exercise = exercise;
	}
	
	public String getExerciseDirection() {
		return exerciseDirection;
	}
	
	public void setExerciseDirection(String exerciseDirection) {
		this.exerciseDirection = exerciseDirection;
	}
	
	public String getSessionName() {
		return sessionName;
	}
	
	public void setSessionName(String sessionName) {
		this.sessionName = sessionName;
	}
	
	public String getFileLocation() {
		return fileLocation;
	}
	
	public void setFileLocation(String fileLocation) {
		this.fileLocation = fileLocation;
	}
	
	public String toString() {
		return "[" + getPatientID() 
				+ ", " + getDate()
				+ ", " + getExercise()
				+ ", " + getExerciseDirection()
				+ ", " + getSessionName() 
				+ ", " + getFileLocation() 
				+ "]";
	}
}


