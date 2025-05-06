package com.example.redweb

import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.core.widget.NestedScrollView
import android.widget.ScrollView

class DonationHistoryActivity : BaseActivity() {

    private lateinit var donationsViewButton: Button
    private lateinit var requestsViewButton: Button
    private lateinit var donationsViewContent: NestedScrollView
    private lateinit var requestsViewContent: ScrollView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_donation_history)

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
        // Note: menuButton and drawerLayout are already in BaseActivity
        donationsViewButton = findViewById(R.id.donationsViewButton)
        requestsViewButton = findViewById(R.id.requestsViewButton)
        donationsViewContent = findViewById(R.id.donationsViewContent)
        requestsViewContent = findViewById(R.id.requestsViewContent)
    }

    private fun setupListeners() {
        // Set up menu button - this is likely already handled in BaseActivity's setupNavigationDrawer()

        // Set up view toggle buttons
        donationsViewButton.setOnClickListener {
            showDonationsView()
        }

        requestsViewButton.setOnClickListener {
            showRequestsView()
        }

        // Set up donation item buttons
        setupDonationItemButtons()
    }

    private fun showDonationsView() {
        // Update button styles
        donationsViewButton.setBackgroundResource(R.drawable.tab_selected_background)
        donationsViewButton.setTextColor(ContextCompat.getColor(this, android.R.color.white))
        requestsViewButton.setBackgroundResource(R.drawable.tab_unselected_background)
        requestsViewButton.setTextColor(ContextCompat.getColor(this, R.color.colorPrimary))

        // Show donations view, hide requests view
        donationsViewContent.visibility = View.VISIBLE
        requestsViewContent.visibility = View.GONE
    }

    private fun showRequestsView() {
        // Update button styles
        requestsViewButton.setBackgroundResource(R.drawable.tab_selected_background)
        requestsViewButton.setTextColor(ContextCompat.getColor(this, android.R.color.white))
        donationsViewButton.setBackgroundResource(R.drawable.tab_unselected_background)
        donationsViewButton.setTextColor(ContextCompat.getColor(this, R.color.colorPrimary))

        // Show requests view, hide donations view
        requestsViewContent.visibility = View.VISIBLE
        donationsViewContent.visibility = View.GONE
    }

    private fun setupDonationItemButtons() {
        // Set up view certificate buttons
        val viewCertificateBtn1 = findViewById<Button>(R.id.btn_view_certificate)
        viewCertificateBtn1.setOnClickListener {
            showCertificate("April 23, 2025")
        }

        val viewCertificateBtn2 = findViewById<Button>(R.id.btn_view_certificate2)
        viewCertificateBtn2.setOnClickListener {
            showCertificate("February 23, 2025")
        }

        // Set up thank you note buttons
        val thankYouNoteBtn1 = findViewById<Button>(R.id.btn_thank_you_note)
        thankYouNoteBtn1.setOnClickListener {
            showThankYouNote("Emergency trauma patient")
        }

        val thankYouNoteBtn2 = findViewById<Button>(R.id.btn_thank_you_note2)
        thankYouNoteBtn2.setOnClickListener {
            showThankYouNote("Maria Rodriguez (Cancer treatment)")
        }
    }

    private fun showCertificate(donationDate: String) {
        // TODO: Implement showing certificate for the given donation date
        // This could open a dialog or navigate to a certificate detail activity
    }

    private fun showThankYouNote(recipient: String) {
        // TODO: Implement showing thank you note from the recipient
        // This could open a dialog or navigate to a thank you note detail activity
    }

    override fun onBackPressed() {
        // Close drawer if open, otherwise perform normal back action
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}