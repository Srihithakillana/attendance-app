const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
// Import the NEW Dashboard Controller
const { getManagerStats, getEmployeeStats } = require('../controllers/dashboardController');

// Manager Stats (Charts & Absent List)
router.get('/manager', protect, admin, getManagerStats);

// Employee Stats (Monthly Summary)
router.get('/employee', protect, getEmployeeStats);

module.exports = router;