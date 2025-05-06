package com.example.redweb

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.view.GravityCompat
import com.google.android.material.navigation.NavigationView
import de.hdodenhof.circleimageview.CircleImageView
import retrofit2.*
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path
import java.text.SimpleDateFormat
import java.util.*

class DonorProfileActivity : BaseActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var apiService: ApiService
    private lateinit var token: String
    private var userId: Long = 0

    private lateinit var profileImage: CircleImageView
    private lateinit var tvUserName: TextView
    private lateinit var tvDonorSince: TextView
    private lateinit var tvBloodTypeTag: TextView
    private lateinit var tvDonorStatus: TextView
    private lateinit var tvTotalDonations: TextView
    private lateinit var tvLastDonation: TextView
    private lateinit var tvNextEligible: TextView
    private lateinit var tvLocation: TextView
    private lateinit var tvFirstName: TextView
    private lateinit var tvLastName: TextView
    private lateinit var tvEmail: TextView
    private lateinit var tvPhoneNumber: TextView
    private lateinit var tvBloodType: TextView
    private lateinit var tvDateOfBirth: TextView
    private lateinit var tvAddress: TextView
    private lateinit var tvCurrentMedications: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_donor_profile)

        sharedPreferences = getSharedPreferences("RedWebPrefs", MODE_PRIVATE)
        token = sharedPreferences.getString("auth_token", "") ?: ""
        userId = sharedPreferences.getLong("user_id", 0)

        if (token.isEmpty() || userId == 0L) {
            redirectToLogin()
            return
        }

        setupNavigationDrawer()


        val retrofit = Retrofit.Builder()
            //.baseUrl("http://10.0.2.2:8080")
            .baseUrl("http://192.168.254.169:8080")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        apiService = retrofit.create(ApiService::class.java)

        initializeViews()
        fetchUserProfile()
    }

    private fun initializeViews() {
        profileImage = findViewById(R.id.profileImage)
        tvUserName = findViewById(R.id.tvUserName)
        tvDonorSince = findViewById(R.id.tvDonorSince)
        tvBloodTypeTag = findViewById(R.id.tvBloodTypeTag)
        tvDonorStatus = findViewById(R.id.tvDonorStatus)
        tvTotalDonations = findViewById(R.id.tvTotalDonations)
        tvLastDonation = findViewById(R.id.tvLastDonation)
        tvNextEligible = findViewById(R.id.tvNextEligible)
        tvLocation = findViewById(R.id.tvLocation)

        tvFirstName = findViewById(R.id.tvFirstName)
        tvLastName = findViewById(R.id.tvLastName)
        tvEmail = findViewById(R.id.tvEmail)
        tvPhoneNumber = findViewById(R.id.tvPhoneNumber)
        tvBloodType = findViewById(R.id.tvBloodType)
        tvDateOfBirth = findViewById(R.id.tvDateOfBirth)
        tvAddress = findViewById(R.id.tvAddress)
        tvCurrentMedications = findViewById(R.id.tvCurrentMedications)

        findViewById<ImageButton>(R.id.btnEditProfile).setOnClickListener {
            Toast.makeText(this, "Edit profile feature coming soon", Toast.LENGTH_SHORT).show()
        }

        findViewById<ImageButton>(R.id.logoutButton).setOnClickListener {
            showLogoutConfirmationDialog()
        }
    }

    private fun fetchUserProfile() {
        apiService.getUserProfile("Bearer $token", userId).enqueue(object : Callback<UserProfile> {
            override fun onResponse(call: Call<UserProfile>, response: Response<UserProfile>) {
                if (response.isSuccessful) {
                    response.body()?.let { updateUI(it) }
                } else {
                    Toast.makeText(this@DonorProfileActivity, "Failed: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<UserProfile>, t: Throwable) {
                Toast.makeText(this@DonorProfileActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateUI(profile: UserProfile) {
        tvUserName.text = profile.name
        tvEmail.text = profile.email
        tvPhoneNumber.text = profile.phone
        tvBloodType.text = profile.bloodType
        tvDonorSince.text = "Donor since: ${formatDate(profile.createdAt)}"

        // Optional based on available views
        tvFirstName.text = profile.name.split(" ").firstOrNull() ?: "--"
        tvLastName.text = profile.name.split(" ").lastOrNull() ?: "--"
        tvAddress.text = "Lat: ${profile.latitude}, Lng: ${profile.longitude}"

        // You can hardcode donor status for now
        tvDonorStatus.text = if (profile.points.toIntOrNull() ?: 0 > 0) "Active Donor" else "New Donor"
    }

    private fun formatDate(dateString: String?): String {
        return try {
            val input = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
            val output = SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault())
            val parsed = input.parse(dateString ?: "")
            parsed?.let { output.format(it) } ?: "--"
        } catch (e: Exception) {
            dateString ?: "--"
        }
    }

    private fun showLogoutConfirmationDialog() {
        AlertDialog.Builder(this)
            .setTitle("Logout")
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Yes") { _, _ -> logout() }
            .setNegativeButton("No", null)
            .show()
    }

    private fun logout() {
        sharedPreferences.edit().apply {
            remove("auth_token")
            remove("user_id")
            apply()
        }
        redirectToLogin()
    }

    private fun redirectToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

    // Retrofit service
    interface ApiService {
        @GET("api/users/{id}")
        fun getUserProfile(
            @Header("Authorization") token: String,
            @Path("id") userId: Long
        ): Call<UserProfile>
    }

    data class UserProfile(
        val id: Long,
        val name: String,
        val email: String,
        val phone: String,
        val bloodType: String,
        val latitude: Double,
        val longitude: Double,
        val role: String,
        val points: String,
        val emergencyOptIn: Boolean,
        val createdAt: String,
        val updatedAt: String
    )
}
