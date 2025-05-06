package com.example.redweb

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.appcompat.widget.Toolbar
import com.google.android.material.tabs.TabLayout

class DonationDrivesActivity : BaseActivity() {

    private lateinit var tabLayout: TabLayout
    private lateinit var btnCreateDrive: Button
    private lateinit var btnFilter: Button
    private lateinit var btnSort: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_drives)

        // Set up the toolbar
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        // Set up the navigation drawer
        setupNavigationDrawer()

        // Initialize views
        initializeViews()

        // Set up listeners
        setupListeners()
    }

    private fun initializeViews() {
        tabLayout = findViewById(R.id.tabLayout)
        btnCreateDrive = findViewById(R.id.btnCreateDrive)
        btnFilter = findViewById(R.id.btnFilter)
        btnSort = findViewById(R.id.btnSort)
    }

    private fun setupListeners() {
        // Tab selection listener
        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab) {
                // Handle tab selection
                when (tab.position) {
                    0 -> loadUpcomingDrives()
                    1 -> loadPastDrives()
                    2 -> loadMyDrives()
                }
            }

            override fun onTabUnselected(tab: TabLayout.Tab) {}

            override fun onTabReselected(tab: TabLayout.Tab) {}
        })

        // Button click listeners
        btnCreateDrive.setOnClickListener {
            val intent = Intent(this, CreateDriveActivity::class.java)
            startActivity(intent)
        }

        btnFilter.setOnClickListener {
            // Show filter dialog
            showFilterDialog()
        }

        btnSort.setOnClickListener {
            // Show sort options
            showSortOptions()
        }

        // Set up register buttons for each drive card
        setupDriveCardButtons()
    }

    private fun loadUpcomingDrives() {
        // Load upcoming drives data
        // This would typically involve a network call or database query
    }

    private fun loadPastDrives() {
        // Load past drives data
    }

    private fun loadMyDrives() {
        // Load drives the user has registered for
    }

    private fun showFilterDialog() {
        // Show a dialog with filter options
        // This could filter by distance, blood type needed, date, etc.
    }

    private fun showSortOptions() {
        // Show options to sort by date, distance, etc.
    }

    private fun setupDriveCardButtons() {
        // Find all register buttons and set click listeners
        val registerButtons = listOf(
            findViewById<Button>(R.id.btnRegister1),
            findViewById<Button>(R.id.btnRegister2)
        )

        registerButtons.forEach { button ->
            button.setOnClickListener {
                // Register for the drive
                // This would typically involve a network call
                // Then update the UI to show "Registered" instead of the button
            }
        }

        // Set up share and view details buttons
        val shareButtons = listOf(
            findViewById<Button>(R.id.btnShare),
            findViewById<Button>(R.id.btnShare2),
            findViewById<Button>(R.id.btnShare3)
        )

        shareButtons.forEach { button ->
            button.setOnClickListener {
                // Share the drive details
                shareDrive(button.tag as? Int ?: 0)
            }
        }

        val viewDetailsButtons = listOf(
            findViewById<Button>(R.id.btnViewDetails),
            findViewById<Button>(R.id.btnViewDetails2),
            findViewById<Button>(R.id.btnViewDetails3)
        )

        viewDetailsButtons.forEach { button ->
            button.setOnClickListener {
                // View drive details
                viewDriveDetails(button.tag as? Int ?: 0)
            }
        }
    }

    private fun shareDrive(driveId: Int) {
        // Share drive using Android's share functionality
    }

    private fun viewDriveDetails(driveId: Int) {
        // Navigate to drive details screen
    }
}
