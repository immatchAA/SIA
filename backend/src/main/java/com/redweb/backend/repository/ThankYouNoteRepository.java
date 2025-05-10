package com.redweb.backend.repository;

import com.redweb.backend.model.Donation;
import com.redweb.backend.model.ThankYouNote;
import com.redweb.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThankYouNoteRepository extends JpaRepository<ThankYouNote, Long> {
    List<ThankYouNote> findByDonor(User donor);
    List<ThankYouNote> findByPatient(User patient);
    List<ThankYouNote> findByDonation(Donation donation);
    boolean existsByDonationAndPatient(Donation donation, User patient);
}
