package com.example.redweb.Backend

data class BloodRequest(
    val bloodType: String,
    val unitsNeeded: String?,
    val urgencyLevel: String,
    val location: String,
    val neededByDate: String,
    val neededByTime: String,
    val reason: String,
    val additionalNotes: String,
    val contactByEmail: Boolean,
    val contactByPhone: Boolean,
    val contactInApp: Boolean,
    val shareContact: Boolean,
    val createdByEmail: String?
)