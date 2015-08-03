package com.lirmm.rest;

import java.util.List;

import com.lirmm.model.Session;

public class multipleSessionResponse {
	private boolean success;
	private List<Session> sessions;
	
	public multipleSessionResponse(boolean success, List<Session> sessions) {
		this.success = success;
		this.sessions = sessions;
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
}