package com.lirmm.rest;

import java.util.List;

import com.lirmm.model.Session;

public class multipleSessionResponse {
	private boolean success;
	private List<Session> sessions;
	private int total;
	
	public multipleSessionResponse(boolean success, List<Session> sessions, int total) {
		this.success = success;
		this.sessions = sessions;
		this.total = total;
	}
	
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public List<Session> getSession() {
		return sessions;
	}
	public void setSession(List<Session> sessions) {
		this.sessions = sessions;
	}
	public int getTotal(){
		return total;
	}
	public void setTotal(int total){
		this.total = total;
	}
}