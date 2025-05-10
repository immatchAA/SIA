package com.example.RedWeb.Repo;

import com.example.RedWeb.Entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorEmail(String donorEmail);
}