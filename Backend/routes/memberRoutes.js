// backend/routes/memberRoutes.js
const express = require('express');
const router = express.Router();
const { getAllMembers, addMember, searchMembers } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAllMembers)
    .post(protect, addMember);

router.get('/search', protect, searchMembers);



module.exports = router;