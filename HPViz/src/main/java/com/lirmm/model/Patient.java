package com.lirmm.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Patient {
	@Id
	private String id;
	private String firstname;
	private String lastname;
	private String birthdate;
	private String comments;
	private String gender;
	
	public Patient() {
	}
	
	public Patient(String firstname, String lastname, String birthdate, String comments, String gender) {
		setFirstName(firstname);
		setLastName(lastname);
		setBirthDate(birthdate);
		setComments(comments);
		setGender(gender);
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstname;
	}
	
	public void setFirstName(String firstname) {
		this.firstname = firstname;
	}
	
	public String getLastName() {
		return lastname;
	}
	
	public void setLastName(String lastname) {
		this.lastname = lastname;
	}
	
	public String getBirthDate() {
		return birthdate;
	}
	
	public void setBirthDate(String birthdate) {
		this.birthdate = birthdate;
	}
	
	public String getComments() {
		return comments;
	}
	
	public void setComments(String comments) {
		this.comments = comments;
	}
	
	public String getGender() {
		return gender;
	}
	
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	public String toString() {
		return "[" + getFirstName() 
				+ ", " + getLastName()
				+ ", " + getBirthDate()
				+ ", " + getComments()
				+ ", " + getGender() 
				+ "]";
	}
}
