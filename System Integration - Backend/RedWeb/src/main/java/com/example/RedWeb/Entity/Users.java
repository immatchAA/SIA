package com.example.RedWeb.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue (strategy = GenerationType.AUTO)

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String bloodType;
    private String address;
    private String healthConditions;

    @ElementCollection
    private List<String> availableDays;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.DONOR;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getHealthConditions() {
        return healthConditions;
    }

    public void setHealthConditions(String healthConditions) {
        this.healthConditions = healthConditions;
    }

    public List<String> getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(List<String> availableDays) {
        this.availableDays = availableDays;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
