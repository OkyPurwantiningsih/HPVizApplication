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
import org.springframework.web.bind.annotation.RequestParam;
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
	public multiplePatientResponse getAllPatients(@RequestParam("page") String page, @RequestParam("start") String recStart, @RequestParam("limit") String limit){
		
		// Calculate start of document to retrieve
		int size = Integer.parseInt(limit);
		int skip = Integer.parseInt(page) > 0 ? ((Integer.parseInt(page) - 1)*size): 0; 
		
		logger.info("Inside getAllPatients() method, with skipping "+skip);
		
		// Query to mongoDB
		List<Patient> allPatients = patientRepository.getAllPatients(skip, size);
		int total = (int) patientRepository.getCount();
		multiplePatientResponse extResp = new multiplePatientResponse(true, allPatients, total);
		
		return extResp;
	}
	
	@RequestMapping(value="/sessions/{patientID}", method=RequestMethod.GET)
	@ResponseBody
	public multipleSessionResponse getSessionByPatientID(@PathVariable("patientID") String patientID, @RequestParam("page") String page, @RequestParam("start") String recStart, @RequestParam("limit") String limit) {
		
		//Update PatientSession collection
		//MongoData mongoData = new MongoData();
		//mongoData.UpdateSessionPatient();
		
		// Calculate start of document to retrieve
		int size = Integer.parseInt(limit);
		int skip = Integer.parseInt(page) > 0 ? ((Integer.parseInt(page) - 1)*size): 0; 
				
		//get session for the patient
		List<Session> foundSession = sessionRepository.getSessionByPatientID(patientID, skip, size);
		int total = (int) sessionRepository.getCount(patientID);
		
		if (foundSession != null) {
			logger.info("Inside getSessionByPatientID, returned: " + foundSession.size() + " sessions");
		} else {
			logger.info("Inside getSessionByPatientID, session for patient: " + patientID + ", NOT FOUND!");
		}
		
		multipleSessionResponse extResp = new multipleSessionResponse(true, foundSession, total);
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
