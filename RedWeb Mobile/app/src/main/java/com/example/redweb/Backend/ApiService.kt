package com.example.redweb.Backend

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path


interface ApiService {
    @POST("api/auth/login")
    fun login(@Body loginRequest: LoginRequest): Call<LoginResponse>

    @POST("/api/auth/register/user")
    fun registerUser(@Body request: UserRegisterRequest): Call<String>

    @GET("api/notifications")
    fun getAllNotifications(): Call<List<Notification>>

    @POST("api/blood-request/create")
    fun submitBloodRequest(@Body bloodRequest: BloodRequest): Call<Void>

    @GET("api/blood-request/user/{email}")
    fun getBloodRequestsByUser(
        @Path("email") email: String
    ): Call<List<BloodRequest>>

    @POST("/api/auth/create")
    fun createDrive(@Body drive: Drive): Call<Drive>

    @GET("/api/blood-request/get")
    fun getAllBloodRequests(): Call<List<BloodRequest>>
}