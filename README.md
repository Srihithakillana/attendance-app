# 📊 Employee Attendance Management System

A full-stack MERN application for secure, role-based employee attendance tracking, analytics, and reporting.[1]

## ⭐ Features

### 👨‍💼 Employee Features

- Check-In / Check-Out actions  
- Monthly summary dashboard: Present, Late, Absent, Total Hours  
- Attendance history with calendar and list views  
- Color-coded statuses:  
  - 🟩 Present  
  - 🟥 Absent  
  - 🟨 Late  
  - 🟧 Half-Day  
- Profile page with Employee ID and Department  

### 👩‍💼 Manager Features

- Real-time overview: Total Employees, Present Today, Late Today, Absent Today  
- Analytics:  
  - Weekly attendance trends (Bar Chart)  
  - Department distribution (Pie Chart)  
  - Team calendar view  
- Absentee list (employees who did not check in)  
- Reports tab:  
  - Filter by date range or employee  
  - Export to CSV  

## 🛠️ Tech Stack

| Layer     | Technology                          |
|----------|--------------------------------------|
| Frontend | React, Vite, Zustand                 |
| Styling  | Custom Inline Styles                 |
| Charts   | Recharts, React-Calendar             |
| Backend  | Node.js, Express.js                  |
| Database | MongoDB, Mongoose                    |
| Auth     | JWT                                  |[2]

## 🚀 Installation & Setup

### Prerequisites

- Node.js (LTS)  
- MongoDB (Local / Atlas)  
- Git  

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd attendance-system
```

### 2. Install Dependencies

```bash
# Server (Backend)
cd server
npm install

# Client (Frontend)
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside `server`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_db_project #yours
JWT_SECRET=supersecretkey123
```

## ▶️ Running the Application

### 1. Seed the Database (First Time Only)

```bash
cd server
node seed.js
```

Expected logs:

- "Users Created..."  
- "Attendance Records Created..."  

### 2. Start Backend API

```bash
npm run dev
```

### 3. Start Frontend

```bash
cd ../client
npm run dev
```

Application URL:  
👉 http://localhost:5173/

## 🔑 Default Login Credentials

| Role     | Email           | Password |
|----------|-----------------|----------|
| Manager  | admin@test.com  | 123      |
| Employee | bob@test.com    | 123      |[3]

## 🗄️ Database Schema

### 📁 `users` Collection

| Field       | Type     | Description          |
|------------|----------|----------------------|
| _id        | ObjectId | Unique ID            |
| name       | String   | Full name            |
| email      | String   | Unique login email   |
| password   | String   | Hashed password      |
| role       | String   | employee / manager   |
| employeeId | String   | e.g., EMP001         |
| department | String   | Department name      |[4]

### 📁 `attendances` Collection

| Field        | Type     | Description                      |
|-------------|----------|----------------------------------|
| _id         | ObjectId | Unique ID                        |
| userId      | ObjectId | Reference to `users` collection  |
| date        | String   | YYYY-MM-DD                       |
| checkInTime | Date     | Check-in timestamp               |
| checkOutTime| Date     | Check-out timestamp              |
| status      | String   | present / absent / late / half-day |
| totalHours  | Number   | Working hours                    |[4]

## 🌐 API Endpoints

All protected endpoints require:  
`Authorization: Bearer <token>`[2]

### 🔐 Authentication

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| POST   | /api/auth/register| Register new employee |
| POST   | /api/auth/login   | Login and receive JWT |
| GET    | /api/auth/me      | Fetch current user    |

### 👨‍💼 Employee Attendance APIs

| Method | Endpoint                    | Description        |
|--------|-----------------------------|--------------------|
| POST   | /api/attendance/checkin     | Record check-in    |
| POST   | /api/attendance/checkout    | Record check-out   |
| GET    | /api/attendance/today       | Today’s attendance |
| GET    | /api/attendance/my-history  | Attendance history |

### 🧑‍💼 Manager Reporting APIs

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/attendance/all        | All attendance records   |
| GET    | /api/dashboard/stats       | Graph and analytics data |
| GET    | /api/attendance/export     | Export CSV               |
| DELETE | /api/attendance/:id        | Delete attendance entry  |

## 📷 Screenshots
<img width="927" height="796" alt="image" src="https://github.com/user-attachments/assets/319f9824-654a-4e96-acc3-e0c9d8e0a856" />

<img width="1329" height="752" alt="image" src="https://github.com/user-attachments/assets/ac9b6b46-b883-41fd-a2d5-b2a932d3556e" />

<img width="1843" height="808" alt="image" src="https://github.com/user-attachments/assets/da29b943-407b-47e2-bc14-fe9f2fddefbb" />

<img width="1566" height="834" alt="image" src="https://github.com/user-attachments/assets/5a0c3593-b181-4519-ad70-684197f828f8" />

<img width="1171" height="825" alt="image" src="https://github.com/user-attachments/assets/2b3fd8d7-707d-4b44-99f6-845573227957" />

<img width="1897" height="838" alt="image" src="https://github.com/user-attachments/assets/79cddcb2-1fb9-4d00-a0d5-1e50485bc8ea" />

<img width="1870" height="567" alt="image" src="https://github.com/user-attachments/assets/60cfa5a4-e1a9-4632-94ec-d4c4da07cb9c" />

<img width="1332" height="674" alt="image" src="https://github.com/user-attachments/assets/61b5054a-82e5-411f-88af-26a41742b7ac" />

<img width="1490" height="808" alt="image" src="https://github.com/user-attachments/assets/3c7c96e4-4fcf-4d7b-8d39-077b06dd6088" />

<img width="1332" height="674" alt="image" src="https://github.com/user-attachments/assets/71454120-8847-4638-8a1b-6b61fe8d343c" />

<img width="1171" height="825" alt="image" src="https://github.com/user-attachments/assets/1a70f768-37b9-4b82-8b1e-e08796b26244" />
