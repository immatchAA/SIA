package com.example.redweb

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.redweb.Backend.ApiClient
import com.example.redweb.Backend.ApiService
import com.example.redweb.Backend.BloodRequest
import com.example.redweb.Backend.BloodRequestAdapter
import com.google.android.material.navigation.NavigationView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DashboardActivity : BaseActivity() {

    private lateinit var donorViewButton: Button
    private lateinit var patientViewButton: Button
    private lateinit var donorViewContent: View
    private lateinit var patientViewContent: View
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    private lateinit var bloodRequestRecyclerView: RecyclerView
    private lateinit var bloodRequestAdapter: BloodRequestAdapter
    private var bloodRequestList = mutableListOf<BloodRequest>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        donorViewButton = findViewById(R.id.donorViewButton)
        patientViewButton = findViewById(R.id.patientViewButton)
        donorViewContent = findViewById(R.id.donorViewContent)
        patientViewContent = findViewById(R.id.patientViewContent)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)

        bloodRequestRecyclerView = findViewById(R.id.bloodRequestRecyclerView)
        bloodRequestAdapter = BloodRequestAdapter(bloodRequestList)
        bloodRequestRecyclerView.layoutManager = LinearLayoutManager(this)
        bloodRequestRecyclerView.adapter = bloodRequestAdapter

        setupNavigationDrawer()

        donorViewButton.setOnClickListener { switchToDonorView() }
        patientViewButton.setOnClickListener { switchToPatientView() }

        swipeRefreshLayout.setOnRefreshListener {
            fetchBloodRequests()
        }

        switchToDonorView()
        fetchBloodRequests()
    }

    private fun switchToDonorView() {
        donorViewButton.setBackgroundResource(R.drawable.tab_selected_background)
        donorViewButton.setTextColor(ContextCompat.getColor(this, android.R.color.white))
        patientViewButton.setBackgroundResource(R.drawable.tab_unselected_background)
        patientViewButton.setTextColor(ContextCompat.getColor(this, R.color.colorPrimary))

        donorViewContent.visibility = View.VISIBLE
        patientViewContent.visibility = View.GONE
    }

    private fun switchToPatientView() {
        patientViewButton.setBackgroundResource(R.drawable.tab_selected_background)
        patientViewButton.setTextColor(ContextCompat.getColor(this, android.R.color.white))
        donorViewButton.setBackgroundResource(R.drawable.tab_unselected_background)
        donorViewButton.setTextColor(ContextCompat.getColor(this, R.color.colorPrimary))

        donorViewContent.visibility = View.GONE
        patientViewContent.visibility = View.VISIBLE
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    private fun fetchBloodRequests() {
        val apiService = ApiClient.getClient().create(ApiService::class.java)

        swipeRefreshLayout.isRefreshing = true

        val call = apiService.getAllBloodRequests()
        call.enqueue(object : Callback<List<BloodRequest>> {
            override fun onResponse(call: Call<List<BloodRequest>>, response: Response<List<BloodRequest>>) {
                swipeRefreshLayout.isRefreshing = false
                if (response.isSuccessful) {
                    bloodRequestList.clear()
                    response.body()?.let { bloodRequestList.addAll(it) }
                    bloodRequestAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(this@DashboardActivity, "Failed to fetch blood requests", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<BloodRequest>>, t: Throwable) {
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(this@DashboardActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }


    override fun onResume() {
        super.onResume()
        fetchBloodRequests()
    }
}
