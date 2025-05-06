package com.example.redweb

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import com.example.redweb.Backend.ApiClient
import com.example.redweb.Backend.UserRegisterRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import com.google.android.material.textfield.TextInputEditText

class RegisterActivity : AppCompatActivity() {

    private lateinit var donorTab: Button
    private lateinit var donorFormContainer: LinearLayout

    @RequiresApi(Build.VERSION_CODES.M)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        supportActionBar?.hide()
        setContentView(R.layout.activity_register)

        donorTab = findViewById(R.id.btnDonorTab)
        donorFormContainer = findViewById(R.id.donorFormContainer)

        findViewById<TextView>(R.id.txtSignIn).setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }

        donorTab.setOnClickListener { showDonorForm() }
        setupDropdowns()

        findViewById<Button>(R.id.btnRegisterDonor).setOnClickListener {
            registerDonor()
        }

        showDonorForm()
    }

    @RequiresApi(Build.VERSION_CODES.M)
    private fun showDonorForm() {
        donorTab.setBackgroundResource(R.drawable.tab_selected_background)
        donorTab.setTextColor(resources.getColor(R.color.red_primary, theme))
        donorFormContainer.visibility = View.VISIBLE
    }

    private fun setupDropdowns() {
        val bloodTypes = arrayOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
        findViewById<AutoCompleteTextView>(R.id.donorBloodTypeAutoComplete)
            .setAdapter(ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, bloodTypes))
    }

    private fun registerDonor() {
        val firstName = findViewById<TextInputEditText>(R.id.donorFirstNameEditText).text.toString()
        val lastName = findViewById<TextInputEditText>(R.id.donorLastNameEditText).text.toString()
        val email = findViewById<TextInputEditText>(R.id.donorEmailEditText).text.toString()
        val phone = findViewById<TextInputEditText>(R.id.donorPhoneEditText).text.toString()
        val bloodType = findViewById<AutoCompleteTextView>(R.id.donorBloodTypeAutoComplete).text.toString()
        val address = findViewById<TextInputEditText>(R.id.donorAddressEditText).text.toString()
        val password = findViewById<TextInputEditText>(R.id.donorPasswordEditText).text.toString()
        val confirmPassword = findViewById<TextInputEditText>(R.id.donorConfirmPasswordEditText).text.toString()

        val availability = mutableListOf<String>()
        if (findViewById<CheckBox>(R.id.checkboxWeekdays).isChecked) availability.add("Weekdays")
        if (findViewById<CheckBox>(R.id.checkboxWeekends).isChecked) availability.add("Weekends")
        if (findViewById<CheckBox>(R.id.checkboxMornings).isChecked) availability.add("Mornings")
        if (findViewById<CheckBox>(R.id.checkboxEvenings).isChecked) availability.add("Evenings")

        val healthConditions = buildString {
            if (findViewById<CheckBox>(R.id.checkboxNoIllness).isChecked) append("No Illness; ")
            if (findViewById<CheckBox>(R.id.checkboxNoMedication).isChecked) append("No Medication")
        }

        if (email.isBlank() || password.isBlank() || confirmPassword.isBlank()) {
            Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show()
            return
        }

        val request = UserRegisterRequest(
            fullName = "$firstName $lastName",
            email = email,
            phone = phone,
            bloodType = bloodType,
            address = address,
            healthConditions = healthConditions,
            availableDays = availability,
            password = password,
            confirmPassword = confirmPassword
        )

        val api = ApiClient.getClient().create(com.example.redweb.Backend.ApiService::class.java)
        api.registerUser(request).enqueue(object : Callback<String> {
            override fun onResponse(call: Call<String>, response: Response<String>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@RegisterActivity, "Registration successful", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(this@RegisterActivity, "Error: ${response.errorBody()?.string() ?: "Unknown"}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<String>, t: Throwable) {
                Toast.makeText(this@RegisterActivity, "Failed: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
