package com.lirmm.summary;

public class JsonSummaryObj {

	private int sessionName;
	private int xArea;
	private int noOfEvent;
	private String eventCat;
	
	public JsonSummaryObj(){
		
	}
	
	public JsonSummaryObj(int sessionName, int xArea, int noOfEvent, String eventCat){
		setSessionName(sessionName);
		setXArea(xArea);
		setNoOfEvent(noOfEvent);
		setEventCat(eventCat);
	}
	
	public int getSessionName() {
		return sessionName;
	}

	public void setSessionName(int sessionName) {
		this.sessionName = sessionName;
	}

	public int getXArea() {
		return xArea;
	}
	
	public void setXArea(int xArea) {
		this.xArea = xArea;
	}
	
	public int getNoOfEvent() {
		return noOfEvent;
	}
	
	public void setNoOfEvent(int noOfEvent) {
		this.noOfEvent = noOfEvent;
	}
	
	public String getEventCat() {
		return eventCat;
	}
	
	public void setEventCat(String eventCat) {
		this.eventCat = eventCat;
	}
	

}
