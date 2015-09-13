package com.lirmm.rest;

import com.lirmm.model.Patient;
import java.util.List;

public class multiplePatientResponse {
	private boolean success;
	private List<Patient> patients;
	private int total;
	
	public multiplePatientResponse(boolean success, List<Patient> patient, int total) {
		this.success = success;
		this.patients = patient;
		this.total = total;
	}
	
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public List<Patient> getPatients() {
		return patients;
	}
	public void setPatient(List<Patient> patients) {
		this.patients = patients;
	}
	public int getTotal(){
		return total;
	}
	public void setTotal(int total){
		this.total = total;
	}
}
