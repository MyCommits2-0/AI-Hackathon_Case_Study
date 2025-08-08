// backend/controllers/copyController.js
const db = require('../config/db');

// Get all copies for a specific book
const getCopiesForBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        // First, get the main book's details
        const [bookDetails] = await db.query('SELECT * FROM BOOKS WHERE id = ?', [bookId]);
        if (bookDetails.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Next, get all copies for that book
        const [copies] = await db.query('SELECT * FROM COPIES WHERE bookId = ?', [bookId]);

        res.status(200).json({
            book: bookDetails[0],
            copies: copies
        });
    } catch (error) {
        console.error('Error fetching copies for book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
const addCopy = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { rackLocation, copyQuantity, copyCount } = req.body;

        // Determine how many copies to create
        const numCopiesToAdd = copyQuantity === 'multiple' ? parseInt(copyCount, 10) : 1;

        if (isNaN(numCopiesToAdd) || numCopiesToAdd < 1) {
            return res.status(400).json({ message: 'Invalid number of copies specified.' });
        }

        // Loop and insert each new copy
        for (let i = 0; i < numCopiesToAdd; i++) {
            await db.query(
                'INSERT INTO COPIES (bookId, rack, status) VALUES (?, ?, ?)',
                [bookId, rackLocation, 'available']
            );
        }

        res.status(201).json({ message: `${numCopiesToAdd} cop(y/ies) added successfully!` });
    } catch (error) {
        console.error('Error adding copy:', error);
        res.status(500).json({ message: 'Server error while adding copy.' });
    }
};

module.exports = { getCopiesForBook, addCopy };

