# RedWeb Blood Donation System - Backend

This is the backend service for the RedWeb Blood Donation System, built with Spring Boot 3.1.0 and Java 17.

## Project Overview

RedWeb is a platform that connects blood donors with patients in need, enabling:
- Regular blood donation drives
- Emergency blood donation requests
- Rewards system for donor engagement
- Tracking of donor health records
- Thank you notes between patients and donors

## Technology Stack

- **Java 17**
- **Spring Boot 3.1.0**
- **Spring Security with JWT Authentication**
- **Spring Data JPA**
- **MySQL Database**

## Prerequisites

- Java 17 or higher
- MySQL (via WampServer)
- Maven

## Database Setup

1. Start WampServer
2. Create a MySQL database named `redwebdb`
3. The application will automatically create the required tables on startup

## Configuration

Key configurations in `application.properties`:

```properties
# Server runs on port 8080
server.port=8080

# Database connection uses MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/redwebdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC

# Set your database username and password if needed
spring.datasource.username=root
spring.datasource.password=

# JWT secret and expiration
app.jwtSecret=redWebSecretKey123456789012345678901234567890
app.jwtExpirationMs=86400000
```

## Running the Application

1. Navigate to the project directory
2. Build the project:
   ```
   mvn clean install
   ```
3. Run the application:
   ```
   mvn spring-boot:run
   ```
   
Or use the provided `run-backend.bat` script from the root directory.

## API Endpoints

### Authentication
- `POST /api/auth/register/donor` - Register a new donor
- `POST /api/auth/register/patient` - Register a new patient
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/donors` - Get all donors
- `GET /api/users/patients` - Get all patients
- `PUT /api/users/{id}` - Update user
- `POST /api/users/{id}/points` - Add points to a user

### Health Records
- `GET /api/health-records/user/{userId}` - Get health record by user ID
- `PUT /api/health-records/{id}` - Update health record
- `GET /api/health-records/eligible-donors` - Get all eligible donors

### Donation Drives
- `GET /api/donation-drives` - Get all donation drives
- `GET /api/donation-drives/active` - Get active donation drives
- `GET /api/donation-drives/upcoming` - Get upcoming donation drives
- `POST /api/donation-drives/organizer/{organizerId}` - Create new donation drive
- `PUT /api/donation-drives/{id}` - Update donation drive

### Emergency Requests
- `GET /api/emergency-requests/active` - Get active emergency requests
- `POST /api/emergency-requests/patient/{patientId}` - Create new emergency request
- `PUT /api/emergency-requests/{id}/status` - Update emergency request status

### Emergency Responses
- `GET /api/emergency-responses/donor/{donorId}` - Get donor's emergency responses
- `POST /api/emergency-responses/donor/{donorId}/request/{requestId}` - Create new emergency response
- `PUT /api/emergency-responses/{id}/status` - Update response status
- `PUT /api/emergency-responses/{id}/location` - Update donor's current location

### Donations
- `GET /api/donations/donor/{donorId}` - Get donations by donor
- `POST /api/donations/drive/{donorId}/{driveId}` - Create new donation at a drive
- `POST /api/donations/emergency/{donorId}/{requestId}` - Create new emergency donation

### Badges
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/{userId}` - Get user's badges
- `POST /api/badges/check-and-award/{userId}` - Check and award eligible badges

### Thank You Notes
- `GET /api/thank-you-notes/donor/{donorId}` - Get thank you notes received by donor
- `POST /api/thank-you-notes/patient/{patientId}/donor/{donorId}/donation/{donationId}` - Create new thank you note

## Demo Users

The application initializes with three demo users:

1. **Admin**
   - Email: admin@redweb.com
   - Password: admin123
   - Role: ADMIN

2. **Donor**
   - Email: donor@redweb.com
   - Password: donor123
   - Role: DONOR

3. **Patient**
   - Email: patient@redweb.com
   - Password: patient123
   - Role: PATIENT
