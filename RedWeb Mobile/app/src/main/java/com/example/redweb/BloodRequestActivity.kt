package com.example.redweb

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.view.MenuItem
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.google.android.material.switchmaterial.SwitchMaterial
import com.google.android.material.textfield.TextInputEditText
import java.text.SimpleDateFormat
import java.util.*

class BloodRequestActivity : BaseActivity() {

    private lateinit var bloodTypeDropdown: AutoCompleteTextView
    private lateinit var unitsNeededDropdown: AutoCompleteTextView
    private lateinit var reasonDropdown: AutoCompleteTextView
    private lateinit var dateInput: TextInputEditText
    private lateinit var timeInput: TextInputEditText
    private lateinit var locationInput: TextInputEditText
    private lateinit var notesInput: TextInputEditText
    private lateinit var switchEmail: SwitchMaterial
    private lateinit var switchPhone: SwitchMaterial
    private lateinit var switchInApp: SwitchMaterial
    private lateinit var switchShareContact: SwitchMaterial
    private lateinit var btnSubmitRequest: Button
    private lateinit var btnUseCurrentLocation: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_request_blood)

        // Set up toolbar
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowHomeEnabled(true)

        // Initialize views
        initializeViews()
        setupDropdowns()
        setupDateTimePickers()
        setupButtons()
    }

    private fun initializeViews() {
        // Dropdowns
        bloodTypeDropdown = findViewById(R.id.bloodTypeDropdown)
        unitsNeededDropdown = findViewById(R.id.unitsNeededDropdown)
        reasonDropdown = findViewById(R.id.reasonDropdown)

        // Text inputs
        dateInput = findViewById(R.id.dateInput)
        timeInput = findViewById(R.id.timeInput)
        locationInput = findViewById(R.id.locationInput)
        notesInput = findViewById(R.id.notesInput)

        // Switches
        switchEmail = findViewById(R.id.switchEmail)
        switchPhone = findViewById(R.id.switchPhone)
        switchInApp = findViewById(R.id.switchInApp)
        switchShareContact = findViewById(R.id.switchShareContact)

        // Buttons
        btnSubmitRequest = findViewById(R.id.btnSubmitRequest)
        btnUseCurrentLocation = findViewById(R.id.btnUseCurrentLocation)
    }

    private fun setupDropdowns() {
        // Blood type dropdown
        val bloodTypes = arrayOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
        val bloodTypeAdapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, bloodTypes)
        bloodTypeDropdown.setAdapter(bloodTypeAdapter)

        // Units needed dropdown
        val units = arrayOf("1 Unit", "2 Units", "3 Units", "4 Units", "5+ Units")
        val unitsAdapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, units)
        unitsNeededDropdown.setAdapter(unitsAdapter)

        // Reason dropdown
        val reasons = arrayOf(
            "Surgery",
            "Accident/Trauma",
            "Cancer Treatment",
            "Anemia",
            "Childbirth",
            "Blood Disorder",
            "Other Medical Condition"
        )
        val reasonAdapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, reasons)
        reasonDropdown.setAdapter(reasonAdapter)
    }

    private fun setupDateTimePickers() {
        // Date picker
        dateInput.setOnClickListener {
            val calendar = Calendar.getInstance()
            val year = calendar.get(Calendar.YEAR)
            val month = calendar.get(Calendar.MONTH)
            val day = calendar.get(Calendar.DAY_OF_MONTH)

            val datePickerDialog = DatePickerDialog(
                this,
                { _, selectedYear, selectedMonth, selectedDay ->
                    val selectedDate = Calendar.getInstance()
                    selectedDate.set(selectedYear, selectedMonth, selectedDay)
                    val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                    dateInput.setText(dateFormat.format(selectedDate.time))
                },
                year,
                month,
                day
            )
            datePickerDialog.datePicker.minDate = calendar.timeInMillis
            datePickerDialog.show()
        }

        // Time picker
        timeInput.setOnClickListener {
            val calendar = Calendar.getInstance()
            val hour = calendar.get(Calendar.HOUR_OF_DAY)
            val minute = calendar.get(Calendar.MINUTE)

            val timePickerDialog = TimePickerDialog(
                this,
                { _, selectedHour, selectedMinute ->
                    val selectedTime = String.format("%02d:%02d", selectedHour, selectedMinute)
                    timeInput.setText(selectedTime)
                },
                hour,
                minute,
                true
            )
            timePickerDialog.show()
        }
    }

    private fun setupButtons() {
        // Use current location button
        btnUseCurrentLocation.setOnClickListener {
            // In a real app, you would get the user's current location
            // For this example, we'll just set a placeholder
            locationInput.setText("Current Hospital")
            Toast.makeText(this, "Using current location", Toast.LENGTH_SHORT).show()
        }

        // Submit request button
        btnSubmitRequest.setOnClickListener {
            if (validateForm()) {
                submitBloodRequest()
            }
        }
    }

    private fun validateForm(): Boolean {
        var isValid = true

        // Check blood type
        if (bloodTypeDropdown.text.isNullOrEmpty()) {
            bloodTypeDropdown.error = "Please select a blood type"
            isValid = false
        }

        // Check location
        if (locationInput.text.isNullOrEmpty()) {
            locationInput.error = "Please enter a location"
            isValid = false
        }

        // Check date
        if (dateInput.text.isNullOrEmpty()) {
            dateInput.error = "Please select a date"
            isValid = false
        }

        // Check time
        if (timeInput.text.isNullOrEmpty()) {
            timeInput.error = "Please select a time"
            isValid = false
        }

        // Check reason
        if (reasonDropdown.text.isNullOrEmpty()) {
            reasonDropdown.error = "Please select a reason"
            isValid = false
        }

        return isValid
    }

    private fun submitBloodRequest() {
        // In a real app, you would send the request to your backend
        // For this example, we'll just show a success message
        Toast.makeText(
            this,
            "Blood request submitted successfully!",
            Toast.LENGTH_LONG
        ).show()
        finish()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }
}
