package com.example.redweb.Backend

data class Drive(
    val driveTitle: String,
    val organizedBy: String,
    val date: String,
    val startTime: String,
    val endTime: String,
    val venueName: String,
    val address: String,
    val city: String,
    val bloodTypesNeeded: String,
    val urgentNeed: Boolean,
    val urgentBloodType: String?,
    val description: String,
    val additionalInfo: String,
    val createdByEmail: String
)