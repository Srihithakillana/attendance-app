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
  <img width="1329" height="752" alt="Screenshot 2025-11-30 181804" src="https://github.com/user-attachments/assets/70022d9d-f14f-475e-aeb4-61524524615e" />
  <img width="927" height="796" alt="Screenshot 2025-11-30 182159" src="https://github.com/user-attachments/assets/678c49ea-f59c-4633-a9ec-81661d3b285f" />
<img width="1843" height="808" alt="Screenshot 2025-11-30 181925" src="https://github.com/user-attachments/assets/8db05333-385f-43fd-904b-b13459bd4f65" />
<img width="1566" height="834" alt="Screenshot 2025-11-30 181943" src="https://github.com/user-attachments/assets/70954643-0526-4407-aea0-ee8ab03a8ebf" />
<img width="1171" height="825" alt="Screenshot 2025-11-30 181955" src="https://github.com/user-attachments/assets/b2c87f08-8b68-4d27-b4e5-5628db3c7328" />
<img width="1897" height="838" alt="Screenshot 2025-11-30 182016" src="https://github.com/user-attachments/assets/67c49d6b-b222-4bfc-9567-f0ce42c871f2" />
<img width="1907" height="689" alt="Screenshot 2025-11-30 182031" src="https://github.com/user-attachments/assets/ae37671c-0002-4129-a4f7-ca4ef66a9420" />
<img width="1870" height="567" alt="Screenshot 2025-11-30 182042" src="https://github.com/user-attachments/assets/9cb96d87-c509-4a39-81cd-ab89199d837f" />
<img width="1789" height="857" alt="Screenshot 2025-11-30 182107" src="https://github.com/user-attachments/assets/377e5abf-ecf1-4c85-8491-da8bb9df591b" />
<img width="1332" height="674" alt="Screenshot 2025-11-30 182121" src="https://github.com/user-attachments/assets/066fad14-20b9-40bd-9768-9fb473db7550" />
<img width="1490" height="808" alt="Screenshot 2025-11-30 182137" src="https://github.com/user-attachments/assets/9792a8f1-dde5-4404-9310-65e43cf44c1f" />


