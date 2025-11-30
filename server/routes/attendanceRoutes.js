const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Import Controller Functions
const { 
  checkIn, 
  checkOut, 
  getTodayStatus, 
  getMyHistory, 
  getMySummary,
  getAllAttendance, 
  exportAttendance, 
  deleteAttendance 
} = require('../controllers/attendanceController');

// Employee Routes
router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/today', protect, getTodayStatus);
router.get('/my-history', protect, getMyHistory);
router.get('/my-summary', protect, getMySummary);

// Manager Routes
router.get('/all', protect, admin, getAllAttendance);
router.get('/export', protect, admin, exportAttendance);
router.delete('/:id', protect, admin, deleteAttendance);

module.exports = router;