package com.lirmm.summary;

public class JsonSummaryAllObj {
	private int sessionName;
	private Double x;
	private String eventCat;
	
	public JsonSummaryAllObj(){
		
	}
	
	public JsonSummaryAllObj(int sessionName, Double x, String eventCat){
		setSessionName(sessionName);
		setX(x);
		setEventCat(eventCat);
	}
	
	public int getSessionName() {
		return sessionName;
	}

	public void setSessionName(int sessionName) {
		this.sessionName = sessionName;
	}

	public Double getX() {
		return x;
	}
	
	public void setX(Double x) {
		this.x = x;
	}
	
	public String getEventCat() {
		return eventCat;
	}
	
	public void setEventCat(String eventCat) {
		this.eventCat = eventCat;
	}
	
}
