package com.redweb.backend.repository;

import com.redweb.backend.model.DonationDrive;
import com.redweb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationDriveRepository extends JpaRepository<DonationDrive, Long> {
    List<DonationDrive> findByOrganizer(User organizer);
    List<DonationDrive> findByStatus(DonationDrive.DriveStatus status);
    List<DonationDrive> findByStartDateAfter(LocalDateTime date);
    List<DonationDrive> findByEndDateBefore(LocalDateTime date);
    List<DonationDrive> findByStartDateBeforeAndEndDateAfterAndStatus(
            LocalDateTime now, LocalDateTime now2, DonationDrive.DriveStatus status);
    List<DonationDrive> findByRequiredBloodTypesContaining(String bloodType);
}
