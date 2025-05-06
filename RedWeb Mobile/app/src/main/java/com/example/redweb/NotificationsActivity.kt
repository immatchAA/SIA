package com.example.redweb

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.example.redweb.Backend.ApiClient
import com.example.redweb.Backend.ApiService
import com.example.redweb.Backend.Notification
import com.example.redweb.Backend.NotificationAdapter
import com.google.android.material.tabs.TabLayout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class NotificationsActivity : BaseActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: NotificationAdapter
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var tabLayout: TabLayout
    private val notificationList = mutableListOf<Notification>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notifications)

        tabLayout = findViewById(R.id.tabLayout)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        recyclerView = findViewById(R.id.notificationRecyclerView)

        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = NotificationAdapter(notificationList)
        recyclerView.adapter = adapter

        // Setup tab selection actions
        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                when (tab?.position) {
                    2 -> startActivity(Intent(this@NotificationsActivity, BloodRequestActivity::class.java))
                    3 -> startActivity(Intent(this@NotificationsActivity, DonationDrivesActivity::class.java))
                }
            }

            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })

        // Enable pull-to-refresh
        swipeRefreshLayout.setOnRefreshListener {
            fetchNotifications()
        }

        // Initial fetch
        fetchNotifications()

        setupNavigationDrawer()
    }

    override fun onResume() {
        super.onResume()
        fetchNotifications()
    }

    private fun fetchNotifications() {
        Log.d("NotificationsActivity", "Fetching notifications...")
        val apiService = ApiClient.getClient().create(ApiService::class.java)
        swipeRefreshLayout.isRefreshing = true

        val noNotificationsText = findViewById<TextView>(R.id.noNotificationsText)

        if (notificationList.isEmpty()) {
            noNotificationsText.visibility = View.VISIBLE
        } else {
            noNotificationsText.visibility = View.GONE
        }

        apiService.getAllNotifications().enqueue(object : Callback<List<Notification>> {
            override fun onResponse(call: Call<List<Notification>>, response: Response<List<Notification>>) {
                swipeRefreshLayout.isRefreshing = false
                if (response.isSuccessful) {
                    val notifications = response.body() ?: emptyList()
                    notificationList.clear()
                    notificationList.addAll(notifications)
                    adapter.notifyDataSetChanged()

                    // 👇 Show or hide empty state text
                    if (notifications.isEmpty()) {
                        noNotificationsText.visibility = View.VISIBLE
                    } else {
                        noNotificationsText.visibility = View.GONE
                    }
                } else {
                    Toast.makeText(this@NotificationsActivity, "Failed to load notifications", Toast.LENGTH_SHORT).show()
                }
            }


            override fun onFailure(call: Call<List<Notification>>, t: Throwable) {
                swipeRefreshLayout.isRefreshing = false
                Toast.makeText(this@NotificationsActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
