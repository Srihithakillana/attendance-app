const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// 1. Manager Dashboard Stats
exports.getManagerStats = async (req, res) => {
  try {
    const today = moment().format('YYYY-MM-DD');

    // A. Basic Counters
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const presentCount = await Attendance.countDocuments({ date: today, status: { $ne: 'absent' } });
    const lateCount = await Attendance.countDocuments({ date: today, status: 'late' });
    const absentCount = totalEmployees - presentCount;

    // B. Department Stats (Real Data Aggregation)
    // Groups users by department and counts them for the Pie Chart
    const departmentStatsRaw = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    
    const departmentStats = departmentStatsRaw.map(d => ({
      name: d._id || 'General', 
      value: d.count
    }));

    // C. Weekly Trends (Last 7 Days)
    const sevenDaysAgo = moment().subtract(6, 'days').format('YYYY-MM-DD');
    const weeklyData = await Attendance.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing days with 0 (Optional but good for charts)
    const weeklyStats = [];
    for (let i = 6; i >= 0; i--) {
        const d = moment().subtract(i, 'days').format('YYYY-MM-DD');
        const found = weeklyData.find(w => w._id === d);
        weeklyStats.push({
            name: moment(d).format('ddd'), // Mon, Tue...
            checkins: found ? found.count : 0
        });
    }

    // D. ABSENT EMPLOYEES LIST (Specific Requirement)
    // Find IDs of everyone present today
    const presentUserIds = await Attendance.find({ date: today }).distinct('userId');
    
    // Find employees whose IDs are NOT in the present list
    const absentEmployees = await User.find({ 
      role: 'employee', 
      _id: { $nin: presentUserIds } 
    }).select('name email employeeId department');

    res.json({
      totalEmployees,
      presentToday: presentCount,
      lateToday: lateCount,
      absentToday: absentCount,
      departmentStats,
      weeklyStats,
      absentEmployees // List of names for the dashboard
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Employee Dashboard Stats
exports.getEmployeeStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    // Fetch all records for this month
    const records = await Attendance.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Calculate stats
    const present = records.filter(r => r.status === 'present').length;
    const late = records.filter(r => r.status === 'late').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const totalHours = records.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

    res.json({
        present,
        late,
        absent,
        totalHours: parseFloat(totalHours.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};