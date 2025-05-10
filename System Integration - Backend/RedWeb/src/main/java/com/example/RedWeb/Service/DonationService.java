package com.example.RedWeb.Service;

import com.example.RedWeb.DTO.DonationDTO;
import com.example.RedWeb.Entity.Donation;
import com.example.RedWeb.Repo.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    public Donation saveDonation(DonationDTO donationDTO, String donorEmail) {
        Donation donation = new Donation();
        donation.setDonorEmail(donorEmail);
        donation.setDonationType(donationDTO.getDonationType());
        donation.setBloodType(donationDTO.getBloodType());
        donation.setUnitsDonated(donationDTO.getUnitsDonated());
        donation.setLocation(donationDTO.getLocation());
        donation.setDonationDate(donationDTO.getDonationDate());
        donation.setNotes(donationDTO.getNotes());

        return donationRepository.save(donation);
    }

    public List<Donation> getDonationHistoryByDonor(String donorEmail) {
        return donationRepository.findByDonorEmail(donorEmail);
    }
}
