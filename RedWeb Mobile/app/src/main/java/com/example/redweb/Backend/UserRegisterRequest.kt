package com.example.redweb.Backend

data class UserRegisterRequest(
    val fullName: String,
    val email: String,
    val phone: String,
    val bloodType: String,
    val address: String,
    val healthConditions: String,
    val availableDays: List<String>,
    val password: String,
    val confirmPassword: String
)