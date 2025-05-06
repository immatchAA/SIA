package com.example.redweb

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
// import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Notification permission for Android 13+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    100
                )
            }
        }

        /* FirebaseMessaging.getInstance().subscribeToTopic("all")
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    Log.d("FCM", "Subscribed to topic: all")
                } else {
                    Log.e("FCM", "Subscription failed", task.exception)
                }
            } */

        // Decide where to go based on stored auth token
        val sharedPreferences = getSharedPreferences("RedWebPrefs", MODE_PRIVATE)
        val token = sharedPreferences.getString("auth_token", null)

        val destination = if (!token.isNullOrEmpty()) {
            DashboardActivity::class.java
        } else {
            WelcomeActivity::class.java
        }

        val intent = Intent(this, destination)
        startActivity(intent)
        finish() // Prevent back navigation to MainActivity
    }
}
