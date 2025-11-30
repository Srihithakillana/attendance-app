const Attendance = require('../models/Attendance');
const User = require('../models/User');
const moment = require('moment');

// 1. Check In
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = moment().format('YYYY-MM-DD');
    const existing = await Attendance.findOne({ userId, date });
    if (existing) return res.status(400).json({ message: 'Already checked in today' });

    const now = new Date();
    // Late if after 10:00 AM
    const status = now.getHours() >= 10 ? 'late' : 'present';

    const attendance = await Attendance.create({ userId, date, checkInTime: now, status });
    res.status(201).json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 2. Check Out
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = moment().format('YYYY-MM-DD');
    const attendance = await Attendance.findOne({ userId, date });
    if (!attendance) return res.status(404).json({ message: 'No check-in found' });
    if (attendance.checkOutTime) return res.status(400).json({ message: 'Already checked out' });

    attendance.checkOutTime = new Date();
    const duration = moment.duration(moment(attendance.checkOutTime).diff(moment(attendance.checkInTime)));
    attendance.totalHours = parseFloat(duration.asHours().toFixed(2));
    
    // Half-day logic
    if (attendance.totalHours < 4) attendance.status = 'half-day';

    await attendance.save();
    res.json(attendance);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 3. Get Today Status
exports.getTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = moment().format('YYYY-MM-DD');
    const attendance = await Attendance.findOne({ userId, date });
    res.json(attendance || null);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 4. Get My History
exports.getMyHistory = async (req, res) => {
  try {
    const history = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 5. Get My Summary
exports.getMySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    const records = await Attendance.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } });
    res.json(records);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// 6. Get All Attendance (Manager) <-- THIS WAS LIKELY MISSING
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate('userId', 'name email department employeeId').sort({ date: -1 });
    res.json(records);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.exportAttendance = async (req, res) => {
  try {
    const { startDate, endDate, search } = req.query;
    
    // Build Query
    let query = {};

    // 1. Date Range Filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // 2. Search Filter (Find users first, then filter attendance)
    if (search) {
      const users = await User.find({ 
        name: { $regex: search, $options: 'i' },
        role: 'employee' 
      }).select('_id');
      
      const userIds = users.map(u => u._id);
      query.userId = { $in: userIds };
    }

    const records = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });
    
    let csv = 'Employee ID,Name,Department,Date,Status,Check In,Check Out,Total Hours\n';
    
    records.forEach(rec => {
      const checkIn = rec.checkInTime ? moment(rec.checkInTime).format('HH:mm:ss') : '-';
      const checkOut = rec.checkOutTime ? moment(rec.checkOutTime).format('HH:mm:ss') : '-';
      const name = rec.userId ? rec.userId.name : 'Unknown';
      const empId = rec.userId ? rec.userId.employeeId : 'N/A';
      const dept = rec.userId ? rec.userId.department : '-';

      csv += `${empId},${name},${dept},${rec.date},${rec.status},${checkIn},${checkOut},${rec.totalHours}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 8. Delete Attendance
exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};