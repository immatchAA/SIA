package com.redweb.backend.repository;

import com.redweb.backend.model.EmergencyRequest;
import com.redweb.backend.model.EmergencyResponse;
import com.redweb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyResponseRepository extends JpaRepository<EmergencyResponse, Long> {
    List<EmergencyResponse> findByDonor(User donor);
    List<EmergencyResponse> findByRequest(EmergencyRequest request);
    List<EmergencyResponse> findByStatus(EmergencyResponse.ResponseStatus status);
    List<EmergencyResponse> findByDonorAndStatus(User donor, EmergencyResponse.ResponseStatus status);
    List<EmergencyResponse> findByRequestAndStatus(EmergencyRequest request, EmergencyResponse.ResponseStatus status);
    List<EmergencyResponse> findByDonorAndRequest(User donor, EmergencyRequest request);
}
