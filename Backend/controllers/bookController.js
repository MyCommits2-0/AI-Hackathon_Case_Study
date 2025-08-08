// backend/controllers/bookController.js
const db = require('../config/db');

// --- getAllBooks function remains the same ---
const getAllBooks = async (req, res) => {
    try {
        const query = `
            SELECT 
                b.*, 
                COUNT(c.id) AS totalCopies,
                SUM(CASE WHEN c.status = 'available' THEN 1 ELSE 0 END) AS availableCopies
            FROM BOOKS b
            LEFT JOIN COPIES c ON b.id = c.bookId
            GROUP BY b.id
        `;
        const [books] = await db.query(query);
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Server error fetching books' });
    }
};


// --- Add the new addBook function ---
const addBook = async (req, res) => {
    const { name, author, subject, price, isbn, copyOption, copyCount, defaultRack } = req.body;

    // Basic validation
    if (!name || !author || !isbn) {
        return res.status(400).json({ message: 'Name, author, and ISBN are required.' });
    }

    const connection = await db.getConnection(); // Get a connection from the pool

    try {
        await connection.beginTransaction(); // Start a transaction

        // Insert into BOOKS table
        const [bookResult] = await connection.query(
            'INSERT INTO BOOKS (name, author, subject, price, isbn) VALUES (?, ?, ?, ?, ?)',
            [name, author, subject, price, isbn]
        );
        const bookId = bookResult.insertId;

        // If user chose to add copies now, insert into COPIES table
        if (copyOption === 'now' && copyCount > 0) {
            for (let i = 0; i < copyCount; i++) {
                await connection.query(
                    'INSERT INTO COPIES (bookId, rack) VALUES (?, ?)',
                    [bookId, defaultRack]
                );
            }
        }

        await connection.commit(); // Commit the transaction
        res.status(201).json({ message: 'Book added successfully!', bookId: bookId });

    } catch (error) {
        await connection.rollback(); // Roll back the transaction on error
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Server error adding book' });
    } finally {
        connection.release(); // Release the connection back to the pool
    }
};

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const [books] = await db.query('SELECT * FROM BOOKS WHERE id = ?', [id]);
        if (books.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(books[0]);
    } catch (error) {
        console.error('Error fetching book by id:', error);
        res.status(500).json({ message: 'Server error fetching book' });
    }
};

// --- Add the new updateBook function ---
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, author, subject, price, isbn } = req.body;

        if (!name || !author || !isbn) {
            return res.status(400).json({ message: 'Name, author, and ISBN are required.' });
        }

        await db.query(
            'UPDATE BOOKS SET name = ?, author = ?, subject = ?, price = ?, isbn = ? WHERE id = ?',
            [name, author, subject, price, isbn, id]
        );
        res.status(200).json({ message: 'Book updated successfully!' });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Server error updating book' });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { q } = req.query;
        const [books] = await db.query(
            "SELECT id, name, author FROM BOOKS WHERE name LIKE ? OR author LIKE ?", 
            [`%${q}%`, `%${q}%`]
        );
        res.json(books);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const getAvailableCopies = async (req, res) => {
    try {
        const { id } = req.params;
        const [copies] = await db.query("SELECT id, rack FROM COPIES WHERE bookId = ? AND status = 'available'", [id]);
        res.json(copies);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
module.exports = { getAllBooks, addBook, getBookById, updateBook, searchBooks, getAvailableCopies };
