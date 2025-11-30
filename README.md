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
