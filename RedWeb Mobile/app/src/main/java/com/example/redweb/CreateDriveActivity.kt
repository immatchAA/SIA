package com.example.redweb

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.redweb.Backend.ApiClient
import com.example.redweb.Backend.ApiService
import com.example.redweb.Backend.Drive
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.content.Intent
import com.google.android.material.textfield.TextInputEditText
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale


class CreateDriveActivity : AppCompatActivity() {

    private lateinit var driveTitleEditText: EditText
    private lateinit var organizedByEditText: EditText
    private lateinit var dateEditText: EditText
    private lateinit var startTimeEditText: EditText
    private lateinit var endTimeEditText: EditText
    private lateinit var venueNameEditText: EditText
    private lateinit var addressEditText: EditText
    private lateinit var cityEditText: EditText
    private lateinit var bloodTypesEditText: EditText
    private lateinit var urgentNeedCheckBox: CheckBox
    private lateinit var urgentBloodTypeEditText: EditText
    private lateinit var descriptionEditText: EditText
    private lateinit var additionalInfoEditText: EditText
    private lateinit var createDriveButton: Button


    private lateinit var checkboxAPos: CheckBox
    private lateinit var checkboxANeg: CheckBox
    private lateinit var checkboxBPos: CheckBox
    private lateinit var checkboxBNeg: CheckBox
    private lateinit var checkboxABPos: CheckBox
    private lateinit var checkboxABNeg: CheckBox
    private lateinit var checkboxOPos: CheckBox
    private lateinit var checkboxONeg: CheckBox
    private lateinit var checkboxAllTypes: CheckBox

    private lateinit var btnSubmitRequest: Button
    private lateinit var dateInput: TextInputEditText
    private lateinit var timeInput: TextInputEditText
    private val userEmail = "sophie.donor@example.com"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_drive)

        // Initialize all views (EditTexts, CheckBoxes, Buttons)
        driveTitleEditText = findViewById(R.id.editDriveTitle)
        organizedByEditText = findViewById(R.id.editOrganizer)
        dateEditText = findViewById(R.id.editDate)
        startTimeEditText = findViewById(R.id.editStartTime)
        endTimeEditText = findViewById(R.id.editEndTime)
        venueNameEditText = findViewById(R.id.editVenueName)
        addressEditText = findViewById(R.id.editAddress)
        cityEditText = findViewById(R.id.editCity)

        checkboxAPos = findViewById(R.id.checkboxAPos)
        checkboxANeg = findViewById(R.id.checkboxANeg)
        checkboxBPos = findViewById(R.id.checkboxBPos)
        checkboxBNeg = findViewById(R.id.checkboxBNeg)
        checkboxABPos = findViewById(R.id.checkboxABPos)
        checkboxABNeg = findViewById(R.id.checkboxABNeg)
        checkboxOPos = findViewById(R.id.checkboxOPos)
        checkboxONeg = findViewById(R.id.checkboxONeg)
        checkboxAllTypes = findViewById(R.id.checkboxAllTypes)

        urgentNeedCheckBox = findViewById(R.id.checkboxUrgentNeed)
        urgentBloodTypeEditText = findViewById(R.id.urgentTypeDropdown)
        descriptionEditText = findViewById(R.id.editDescription)
        additionalInfoEditText = findViewById(R.id.editAdditionalInfo)

        btnSubmitRequest = findViewById(R.id.btnCreateDrive)

        setupButtons()
        initializeViews()
        setupDateAndTimePickers()
    }

    private fun initializeViews() {
        dateInput = findViewById(R.id.dateInput)
        timeInput = findViewById(R.id.timeInput)
    }

    private fun setupDateAndTimePickers() {
        // Date picker
        dateEditText.setOnClickListener {
            val calendar = Calendar.getInstance()
            val year = calendar.get(Calendar.YEAR)
            val month = calendar.get(Calendar.MONTH)
            val day = calendar.get(Calendar.DAY_OF_MONTH)

            val datePickerDialog = DatePickerDialog(
                this,
                { _, selectedYear, selectedMonth, selectedDay ->
                    val selectedDate = Calendar.getInstance()
                    selectedDate.set(selectedYear, selectedMonth, selectedDay)
                    val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                    dateEditText.setText(dateFormat.format(selectedDate.time))
                },
                year,
                month,
                day
            )
            datePickerDialog.datePicker.minDate = calendar.timeInMillis
            datePickerDialog.show()
        }

        // Start Time picker
        startTimeEditText.setOnClickListener {
            val calendar = Calendar.getInstance()
            val hour = calendar.get(Calendar.HOUR_OF_DAY)
            val minute = calendar.get(Calendar.MINUTE)

            val timePickerDialog = TimePickerDialog(
                this,
                { _, selectedHour, selectedMinute ->
                    val selectedTime = String.format("%02d:%02d", selectedHour, selectedMinute)
                    startTimeEditText.setText(selectedTime)
                },
                hour,
                minute,
                true
            )
            timePickerDialog.show()
        }

        // End Time picker
        endTimeEditText.setOnClickListener {
            val calendar = Calendar.getInstance()
            val hour = calendar.get(Calendar.HOUR_OF_DAY)
            val minute = calendar.get(Calendar.MINUTE)

            val timePickerDialog = TimePickerDialog(
                this,
                { _, selectedHour, selectedMinute ->
                    val selectedTime = String.format("%02d:%02d", selectedHour, selectedMinute)
                    endTimeEditText.setText(selectedTime)
                },
                hour,
                minute,
                true
            )
            timePickerDialog.show()
        }
    }


    private fun getSelectedBloodTypes(): String {
        val bloodTypes = mutableListOf<String>()

        if (checkboxAllTypes.isChecked) {
            return "All Types"
        }

        if (checkboxAPos.isChecked) bloodTypes.add("A+")
        if (checkboxANeg.isChecked) bloodTypes.add("A-")
        if (checkboxBPos.isChecked) bloodTypes.add("B+")
        if (checkboxBNeg.isChecked) bloodTypes.add("B-")
        if (checkboxABPos.isChecked) bloodTypes.add("AB+")
        if (checkboxABNeg.isChecked) bloodTypes.add("AB-")
        if (checkboxOPos.isChecked) bloodTypes.add("O+")
        if (checkboxONeg.isChecked) bloodTypes.add("O-")

        return bloodTypes.joinToString(",")
    }

    private fun createDrive() {

        checkboxAPos = findViewById(R.id.checkboxAPos)
        checkboxANeg = findViewById(R.id.checkboxANeg)
        checkboxBPos = findViewById(R.id.checkboxBPos)
        checkboxBNeg = findViewById(R.id.checkboxBNeg)
        checkboxABPos = findViewById(R.id.checkboxABPos)
        checkboxABNeg = findViewById(R.id.checkboxABNeg)
        checkboxOPos = findViewById(R.id.checkboxOPos)
        checkboxONeg = findViewById(R.id.checkboxONeg)
        checkboxAllTypes = findViewById(R.id.checkboxAllTypes)

    }

    private fun setupButtons() {
        btnSubmitRequest.setOnClickListener {
            val drive = Drive(
                driveTitle = driveTitleEditText.text.toString(),
                organizedBy = organizedByEditText.text.toString(),
                date = dateEditText.text.toString(),
                startTime = startTimeEditText.text.toString(),
                endTime = endTimeEditText.text.toString(),
                venueName = venueNameEditText.text.toString(),
                address = addressEditText.text.toString(),
                city = cityEditText.text.toString(),
                bloodTypesNeeded = getSelectedBloodTypes(), // <<=== fixed
                urgentNeed = urgentNeedCheckBox.isChecked,
                urgentBloodType = if (urgentNeedCheckBox.isChecked) urgentBloodTypeEditText.text.toString() else null,
                description = descriptionEditText.text.toString(),
                additionalInfo = additionalInfoEditText.text.toString(),
                createdByEmail = userEmail
            )

            val apiService = ApiClient.getClient().create(ApiService::class.java)

            apiService.createDrive(drive).enqueue(object : Callback<Drive> {
                override fun onResponse(call: Call<Drive>, response: Response<Drive>) {
                    if (response.isSuccessful) {
                        showSuccessDialog()
                    } else {
                        Toast.makeText(this@CreateDriveActivity, "Failed to create drive", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<Drive>, t: Throwable) {
                    Toast.makeText(this@CreateDriveActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    private fun showSuccessDialog() {
        AlertDialog.Builder(this)
            .setTitle("Success")
            .setMessage("Your drive has been created successfully!")
            .setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
                // Optional: Navigate to another page after success
                val intent = Intent(this, DonationDrivesActivity::class.java)
                startActivity(intent)
                finish()
            }
            .show()
    }

}
