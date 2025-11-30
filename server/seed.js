const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const moment = require('moment');

dotenv.config();

const REAL_NAMES = [
  "Emma Wilson", "Liam Brown", "Olivia Davis", "Noah Miller", "Ava Garcia",
  "Ethan Martinez", "Sophia Rodriguez", "Mason Hernandez", "Isabella Lopez", "Logan Gonzalez",
  "Mia Anderson", "Lucas Thomas", "Charlotte Taylor", "Jackson Moore", "Amelia Jackson",
  "Aiden Martin", "Harper Lee", "Elijah Perez", "Evelyn Thompson", "James White"
];

const DEPARTMENTS = ['Engineering', 'Sales', 'HR', 'Marketing', 'Support'];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clean DB
    try {
        if (mongoose.connection.collections['users']) await mongoose.connection.collections['users'].drop();
        if (mongoose.connection.collections['attendances']) await mongoose.connection.collections['attendances'].drop();
    } catch (e) {}

    // Create Manager
    await User.create({
      name: 'Admin Manager',
      email: 'admin@test.com',
      password: '123',
      role: 'manager',
      employeeId: 'MGR001',
      department: 'Management'
    });

    const attendanceRecords = [];

    // Create Employees
    for (let i = 0; i < REAL_NAMES.length; i++) {
        const name = REAL_NAMES[i];
        const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
        
        const employee = await User.create({
            name: name,
            email: `${name.split(' ')[0].toLowerCase()}@test.com`,
            password: '123',
            role: 'employee',
            employeeId: `EMP${100 + i}`,
            department: dept
        });

        // Generate 30 Days History
        for (let j = 0; j < 30; j++) {
            const date = moment().subtract(j, 'days');
            
            // Skip Weekends
            if (date.day() === 0 || date.day() === 6) continue;

            const rand = Math.random();

            // 30% Chance of ABSENT (Red)
            if (rand < 0.30) {
                attendanceRecords.push({
                    userId: employee._id,
                    date: date.format('YYYY-MM-DD'),
                    status: 'absent',
                    totalHours: 0
                });
                continue; 
            }

            // 20% Chance of LATE (Yellow)
            let hour, minute, status;
            
            if (rand < 0.50) { 
                // Late: Arrive between 9:45 AM and 11:00 AM
                hour = 9 + Math.floor(Math.random() * 2); 
                minute = 45 + Math.floor(Math.random() * 15);
                status = 'late';
            } else {
                // Present (Green): Arrive between 8:00 AM and 9:00 AM
                hour = 8;
                minute = Math.floor(Math.random() * 59);
                status = 'present';
            }

            const checkIn = date.clone().hour(hour).minute(minute).toDate();
            const checkOut = date.clone().hour(hour + 9).minute(minute).toDate();

            attendanceRecords.push({
                userId: employee._id,
                date: date.format('YYYY-MM-DD'),
                checkInTime: checkIn,
                checkOutTime: checkOut,
                status: status,
                totalHours: 9
            });
        }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log('Seeding Complete');
    console.log('Manager: admin@test.com | 123');
    console.log('Employee: emma@test.com | 123');

    await mongoose.connection.close();
    process.exit();
    
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();