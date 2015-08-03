package com.lirmm.hp;

import java.io.IOException;
import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonParseException;
import com.lirmm.parser.MongoData;
import com.lirmm.rest.*;
import com.lirmm.dao.*;
import com.lirmm.model.*;

/**
 * Handles requests for the application home page.
 */
@Controller
public class RestController {
	
	private static final Logger logger = LoggerFactory.getLogger(RestController.class);
	
	@Autowired
    private PatientRepository patientRepository;
	
	@Autowired
	private SessionRepository sessionRepository;
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Locale locale, Model model) {
		logger.info("Welcome home! The client locale is {}.", locale);
		
		Date date = new Date();
		DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		
		return "home";
	}
	
	@RequestMapping(value="/patients", method = RequestMethod.GET)
	@ResponseBody
	public multiplePatientResponse getAllPatients() {
		logger.info("Inside getAllPatients() method...");

		List<Patient> allPatients = patientRepository.getAllPatients();
		multiplePatientResponse extResp = new multiplePatientResponse(true, allPatients);
		
		return extResp;
	}
	
	@RequestMapping(value="/sessions/{patientID}", method=RequestMethod.GET)
	@ResponseBody
	public multipleSessionResponse getSessionByPatientID(@PathVariable("patientID") String patientID) {
		
		//Update PatientSession collection
		MongoData mongoData = new MongoData();
		mongoData.UpdateSessionPatient();
		
		//get session for the patient
		List<Session> foundSession = sessionRepository.getSessionByPatientID(patientID);
		
		if (foundSession != null) {
			logger.info("Inside getSessionByPatientID, returned: " + foundSession.size() + " sessions");
		} else {
			logger.info("Inside getSessionByPatientID, session for patient: " + patientID + ", NOT FOUND!");
		}
		
		multipleSessionResponse extResp = new multipleSessionResponse(true, foundSession);
		return extResp; 
	}
	
	@RequestMapping(value="/refreshDB", method=RequestMethod.POST)
	@ResponseBody
	public  void  updateDB() throws JsonParseException, IOException {
		
		//Update PatientSession collection
		MongoData mongoData = new MongoData();
		mongoData.UpdateSessionPatient();
		System.out.println("=============  Database Refreshed =============");
		mongoData.UpdateSummary();
		System.out.println("============= Summary Updated ===============");
	}
}
