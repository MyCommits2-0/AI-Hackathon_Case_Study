const express = require('express');
const router = express.Router();
const { 
    getAllBooks, 
    addBook, 
    getBookById, 
    updateBook, 
    searchBooks, 
    getAvailableCopies 
} = require('../controllers/bookController'); 
const { protect } = require('../middleware/authMiddleware');
const copyRoutes = require('./copyRoutes');

// --- Specific routes first ---
router.get('/search', protect, searchBooks);
router.get('/:id/available-copies', protect, getAvailableCopies);

// --- Nested routes ---
router.use('/:bookId/copies', copyRoutes);

// --- General routes last ---
router.route('/')
    .get(protect, getAllBooks)
    .post(protect, addBook);

router.route('/:id')
    .get(protect, getBookById)
    .put(protect, updateBook);

module.exports = router;
