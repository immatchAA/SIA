package com.example.redweb

import android.content.Intent
import android.os.Bundle
import retrofit2.Call
import android.text.TextUtils
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.redweb.Backend.ApiClient
import com.example.redweb.Backend.ApiService
import com.example.redweb.Backend.LoginRequest
import com.example.redweb.Backend.LoginResponse
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class LoginActivity : AppCompatActivity() {

    private lateinit var emailEditText: TextInputEditText
    private lateinit var passwordEditText: TextInputEditText
    private lateinit var btnSignIn: Button
    private lateinit var txtRegisterNow: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        supportActionBar?.hide()
        setContentView(R.layout.activity_login)

        initializeViews()
        setupClickListeners()
    }

    private fun initializeViews() {
        emailEditText = findViewById(R.id.emailEditText)
        passwordEditText = findViewById(R.id.passwordEditText)
        btnSignIn = findViewById(R.id.btnSignIn)
        txtRegisterNow = findViewById(R.id.txtRegisterNow)
    }

    private fun setupClickListeners() {
        btnSignIn.setOnClickListener {
            if (validateForm()) {
                signIn()
            } else {
                Snackbar.make(btnSignIn, "Please fill in the fields properly.", Snackbar.LENGTH_SHORT).show()
            }
        }

        txtRegisterNow.setOnClickListener {
            startActivity(Intent(this@LoginActivity, RegisterActivity::class.java))
        }
    }

    private fun validateForm(): Boolean {
        var isValid = true
        if (TextUtils.isEmpty(emailEditText.text) || !android.util.Patterns.EMAIL_ADDRESS.matcher(emailEditText.text.toString()).matches()) {
            (emailEditText.parent.parent as TextInputLayout).error = "Valid email is required"
            isValid = false
        } else {
            (emailEditText.parent.parent as TextInputLayout).error = null
        }

        if (TextUtils.isEmpty(passwordEditText.text)) {
            (passwordEditText.parent.parent as TextInputLayout).error = "Password is required"
            isValid = false
        } else {
            (passwordEditText.parent.parent as TextInputLayout).error = null
        }

        return isValid
    }

    private fun signIn() {
        val email = emailEditText.text.toString()
        val password = passwordEditText.text.toString()

        val apiService = ApiClient.getClient().create(ApiService::class.java)
        val loginRequest = LoginRequest(email, password)

        val call = apiService.login(loginRequest)
        call.enqueue(object : retrofit2.Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: retrofit2.Response<LoginResponse>) {
                if (response.isSuccessful && response.body() != null) {
                    val loginResponse = response.body()
                    Snackbar.make(btnSignIn, "Login Successful: ${loginResponse?.message}", Snackbar.LENGTH_SHORT).show()

                    val intent = Intent(this@LoginActivity, DashboardActivity::class.java)
                    startActivity(intent)
                    finish()
                } else {
                    Snackbar.make(btnSignIn, "Login Failed. Please check your credentials.", Snackbar.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                Snackbar.make(btnSignIn, "Network Error: ${t.localizedMessage}", Snackbar.LENGTH_SHORT).show()
            }
        })
    }


}
