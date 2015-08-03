package com.lirmm.rest;

import com.lirmm.model.Patient;
import java.util.List;

public class multiplePatientResponse {
	private boolean success;
	private List<Patient> patients;
	
	public multiplePatientResponse(boolean success, List<Patient> patient) {
		this.success = success;
		this.patients = patient;
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
}
