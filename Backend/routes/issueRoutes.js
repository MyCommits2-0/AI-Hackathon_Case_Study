// backend/routes/issueRoutes.js
const express = require('express');
const router = express.Router();
const { issueBook } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, issueBook);

module.exports = router;
