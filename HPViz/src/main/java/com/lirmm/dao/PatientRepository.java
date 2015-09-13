package com.lirmm.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.lirmm.model.Patient;

@Repository
public class PatientRepository {
	
public static final String COLLECTION_NAME = "patients";
	
	@Autowired
    private MongoTemplate mongoTemplate;
	
	public List<Patient> getAllPatients(int skip, int limit) {
        //return mongoTemplate.findAll(Patient.class, COLLECTION_NAME);
		Query queryPatient = new Query();

		queryPatient.skip(skip).limit(limit);

        return mongoTemplate.find(queryPatient, Patient.class, COLLECTION_NAME);
    }
	
	public long getCount(){
		return mongoTemplate.count(new Query(), COLLECTION_NAME);
	}
}
