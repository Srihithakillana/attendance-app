# 📊 Employee Attendance Management System

This is a full-stack web application designed for robust, role-based attendance tracking, management, and reporting, built using the MERN stack (MongoDB, Express, React, Node.js).

## 🌟 Key Features

### Employee Dashboard
* **Quick Actions:** Check-in and Check-out functionality.
* **Monthly Summary:** Shows days Present, Late, Absent, and Total Hours worked for the current month.
* **Attendance History:** Dedicated page with Calendar and List views of past attendance.
* **Color-Coded Statuses:** Calendar tiles show color coding for Present (Green), Absent (Red), Late (Yellow), and Half-Day (Orange).
* **Profile View:** Dedicated page to view user details (Employee ID, Department).

### Manager Dashboard
* **Overview:** Real-time stats on Total Employees, Present Today, Late Today, and Absent Today.
* **Analytics Charts:** Includes Weekly Attendance Trends (Bar Chart) and Department Distribution (Pie Chart).
* **Team Calendar:** Tab to view team attendance visually by selecting a date.
* **Absentee List:** Explicitly lists employees who have not checked in today.
* **Reports:** Dedicated tab to filter attendance records by date range and employee name, with **CSV Export** functionality.

## 🛠️ Tech Stack & Requirements

| Layer | Technology | Status |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Zustand | Complete |
| **Styling** | Custom Inline Styles (Aesthetic UI/UX) | Complete |
| **Charts** | Recharts, React-Calendar | Complete |
| **Backend** | Node.js, Express.js | Complete |
| **Database** | MongoDB (Mongoose) | Complete |
| **Authentication** | JWT (JSON Web Tokens) | Complete |

## 🚀 Setup & Installation

### Prerequisites
* Node.js (LTS Version)
* MongoDB Instance (Local or Atlas)
* Git (for cloning and pushing)

### 1. Install Dependencies
Run these commands in the terminal from the project root:

```bash
# Install Server Dependencies (Express, Mongoose, etc.)
cd server
npm install

# Install Client Dependencies (React, Zustand, Recharts, etc.)
cd ../client
npm install


2. Configure Environment Variables
Create a file named .env inside the server directory:

Code snippet

PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_db_project  # <-- Update with your MongoDB URI
JWT_SECRET=supersecretkey123  # <-- Use a strong, complex secret key
▶️ Running the Application
1. Seed the Database (Required for First Run)
The seed script creates the initial Manager and Employee accounts and generates 30 days of sample attendance data.

Bash

cd server
node seed.js
(Wait for confirmation logs: "Users Created..." and "Attendance Records Created...")

2. Start Backend API
In your first terminal tab, start the server with nodemon for automatic restarts during development:

Bash

npm run dev
(Server should confirm "MongoDB Connected" and "Server running on port 5000". This process must remain running.)

3. Start Frontend Client
In your second terminal tab, start the React client:

Bash

cd ../client
npm run dev
(The client will open in your browser at http://localhost:5173.)

🔑 Default Login Credentials
Use these credentials to test role-based access immediately after seeding the database:

Role	Email	Password
Manager	admin@test.com	123
Employee	bob@test.com	123

Export to Sheets

📐 Database Schema
The system uses two primary collections linked by userId.

Shutterstock
Explore

users Collection
Field	Type	Description
_id	ObjectId	MongoDB unique identifier.
name	String	User's full name.
email	String	Unique login identifier.
password	String	Hashed using bcrypt.
role	String	('employee' / 'manager').
employeeId	String	Unique company ID (e.g., EMP001).
department	String	User's department.

Export to Sheets

attendances Collection
Field	Type	Description
_id	ObjectId	MongoDB unique identifier.
userId	ObjectId	Reference to the users collection.
date	String	Attendance date (YYYY-MM-DD format).
checkInTime	Date	Timestamp of check-in.
checkOutTime	Date	Timestamp of check-out.
status	String	('present' / 'absent' / 'late' / 'half-day').
totalHours	Number	Calculated hours worked between check-in and check-out.

Export to Sheets

🌐 API Endpoints
All endpoints are protected by JWT authentication middleware (/api/*), requiring a valid token in the Authorization: Bearer <token> header, unless otherwise noted.

Authentication (Public & Protected)
Method	Endpoint	Description
POST	/api/auth/register	Creates a new employee account.
POST	/api/auth/login	Authenticates user and returns JWT.
GET	/api/auth/me	Fetches details of the currently authenticated user.

Export to Sheets

Attendance (Employee Role)
Method	Endpoint	Description
POST	/api/attendance/checkin	Records today's check-in time and initial status.
POST	/api/attendance/checkout	Records check-out time and calculates final status/hours.
GET	/api/attendance/today	Retrieves today's attendance record (for dashboard quick stats).
GET	/api/attendance/my-history	Retrieves all attendance records for the current user.

Export to Sheets

Reporting & Management (Manager Role)
Method	Endpoint	Description
GET	/api/attendance/all	Retrieves all attendance records for all employees.
GET	/api/dashboard/stats	Retrieves aggregated data for charts (weekly trends, daily attendance summary).
GET	/api/attendance/export	Generates and streams CSV file containing all attendance data.
DELETE	/api/attendance/:id	Deletes a specific attendance record (for corrections).
