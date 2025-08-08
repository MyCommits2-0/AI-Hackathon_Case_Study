// backend/routes/copyRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
// Import both controller functions
const { getCopiesForBook, addCopy } = require('../controllers/copyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCopiesForBook)
    .post(protect, addCopy); // <-- Chain the .post() method here

module.exports = router;
