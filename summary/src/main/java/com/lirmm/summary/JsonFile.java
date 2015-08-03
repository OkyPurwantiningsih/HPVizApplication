package com.lirmm.summary;

public class JsonFile {
	private String sessionName;
	private String fileLocation;
	
	public JsonFile(){
		
	}
	
	public JsonFile(String sessionName, String fileLocation){
		setSessionName(sessionName);
		setFileLocation(fileLocation);
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
	
	public String getDirectory(){
		String[] split = this.fileLocation.split("/");
		return split[0];
	}
}
