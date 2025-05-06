package com.example.redweb.Backend

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.redweb.R

class BloodRequestAdapter(private val bloodRequests: List<BloodRequest>) :
    RecyclerView.Adapter<BloodRequestAdapter.BloodRequestViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BloodRequestViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_blood_request, parent, false)
        return BloodRequestViewHolder(view)
    }

    override fun onBindViewHolder(holder: BloodRequestViewHolder, position: Int) {
        val bloodRequest = bloodRequests[position]

        holder.bloodTypeTextView.text = bloodRequest.bloodType
        holder.urgencyLevelTextView.text = bloodRequest.urgencyLevel
        holder.locationTextView.text = bloodRequest.location
        holder.neededByTextView.text = "${bloodRequest.neededByDate} at ${bloodRequest.neededByTime}"
        holder.reasonTextView.text = bloodRequest.reason
    }

    override fun getItemCount(): Int {
        return bloodRequests.size
    }

    class BloodRequestViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val bloodTypeTextView: TextView = view.findViewById(R.id.bloodTypeTextView)
        val urgencyLevelTextView: TextView = view.findViewById(R.id.urgencyLevelTextView)
        val locationTextView: TextView = view.findViewById(R.id.locationTextView)
        val neededByTextView: TextView = view.findViewById(R.id.neededByTextView)
        val reasonTextView: TextView = view.findViewById(R.id.reasonTextView)
    }
}