package com.example.redweb

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.widget.ImageButton
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import kotlin.reflect.KClass


open class BaseActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {

    protected lateinit var drawerLayout: DrawerLayout
    protected lateinit var navigationView: NavigationView
    protected lateinit var menuButton: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("BaseActivity", "BaseActivity created!")
    }

    protected fun setupNavigationDrawer() {
        drawerLayout = findViewById(R.id.drawerLayout)
        navigationView = findViewById(R.id.navigationView)
        menuButton = findViewById(R.id.menuButton)
        navigationView.setNavigationItemSelectedListener(this)
        menuButton.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }
    }

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.nav_dashboard -> {
                Toast.makeText(this, "Clicked: Dashboard", Toast.LENGTH_SHORT).show()
                navigateToActivity(DashboardActivity::class)
            }
            R.id.nav_profile -> {
                Toast.makeText(this, "Clicked: Profile", Toast.LENGTH_SHORT).show()
                navigateToActivity(DonorProfileActivity::class)
            }
            R.id.nav_request_blood -> {
                Toast.makeText(this, "Clicked: Request Blood", Toast.LENGTH_SHORT).show()
                navigateToActivity(RequestBloodActivity::class)
            }
            R.id.nav_donation_history -> {
                Toast.makeText(this, "Clicked: Donation History", Toast.LENGTH_SHORT).show()
                navigateToActivity(DonationHistoryActivity::class)
            }
            R.id.nav_notifications -> {
                Toast.makeText(this, "Clicked: Notifications", Toast.LENGTH_SHORT).show()
                navigateToActivity(NotificationsActivity::class)
            }
            R.id.nav_donation_drives -> {
                Toast.makeText(this, "Clicked: Donation Drives", Toast.LENGTH_SHORT).show()
                navigateToActivity(DonationDrivesActivity::class)
            }
            R.id.nav_emergency -> {
                Toast.makeText(this, "Clicked: Emergency Mode", Toast.LENGTH_SHORT).show()
                navigateToActivity(EmergencyModeActivity::class)
            }
        }

        drawerLayout.closeDrawer(GravityCompat.START)
        return true
    }


    private fun <T : AppCompatActivity> navigateToActivity(activityClass: KClass<T>) {
        if (this::class == activityClass) {
            return
        }
        val intent = Intent(this, activityClass.java)
        startActivity(intent)
        finish()
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}
