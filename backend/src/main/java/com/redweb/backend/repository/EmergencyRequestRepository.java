package com.redweb.backend.repository;

import com.redweb.backend.model.EmergencyRequest;
import com.redweb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
    List<EmergencyRequest> findByPatient(User patient);
    List<EmergencyRequest> findByStatus(EmergencyRequest.RequestStatus status);
    List<EmergencyRequest> findByUrgencyLevel(EmergencyRequest.UrgencyLevel urgencyLevel);
    List<EmergencyRequest> findByBloodType(String bloodType);
    List<EmergencyRequest> findByStatusAndBloodType(EmergencyRequest.RequestStatus status, String bloodType);
    List<EmergencyRequest> findByStatusAndUrgencyLevel(EmergencyRequest.RequestStatus status, EmergencyRequest.UrgencyLevel urgencyLevel);
}
