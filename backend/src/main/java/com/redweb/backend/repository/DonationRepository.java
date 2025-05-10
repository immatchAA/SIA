package com.redweb.backend.repository;

import com.redweb.backend.model.Donation;
import com.redweb.backend.model.DonationDrive;
import com.redweb.backend.model.EmergencyRequest;
import com.redweb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonor(User donor);
    List<Donation> findByDrive(DonationDrive drive);
    List<Donation> findByEmergencyRequest(EmergencyRequest request);
    List<Donation> findByStatus(Donation.DonationStatus status);
    List<Donation> findByDonorAndStatus(User donor, Donation.DonationStatus status);
    List<Donation> findByDonationDateBetween(LocalDateTime start, LocalDateTime end);
    List<Donation> findByBloodType(String bloodType);
}
