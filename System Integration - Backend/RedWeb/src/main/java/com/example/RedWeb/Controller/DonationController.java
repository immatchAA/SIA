package com.example.RedWeb.Controller;

import com.example.RedWeb.DTO.DonationDTO;
import com.example.RedWeb.Entity.Donation;
import com.example.RedWeb.Service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping("/add")
    public Donation addDonation(@RequestBody DonationDTO donationDTO, @RequestHeader("email") String donorEmail) {
        return donationService.saveDonation(donationDTO, donorEmail);
    }

    @GetMapping("/history/{donorEmail}")
    public List<Donation> getDonationHistory(@PathVariable String donorEmail) {
        return donationService.getDonationHistoryByDonor(donorEmail);
    }
}
