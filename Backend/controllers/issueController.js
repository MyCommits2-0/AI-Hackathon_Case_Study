// backend/controllers/issueController.js
const db = require('../config/db');

const issueBook = async (req, res) => {
    const { memberId, copyId } = req.body;

    if (!memberId || !copyId) {
        return res.status(400).json({ message: 'Member ID and Copy ID are required.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Check member's payment status/membership validity
        const [members] = await connection.query('SELECT membership_expiry_date FROM MEMBERS WHERE id = ?', [memberId]);
        if (members.length === 0) {
            throw new Error('Member not found.');
        }
        const expiryDate = new Date(members[0].membership_expiry_date);
        if (expiryDate < new Date()) {
            throw new Error('Member account is expired or payment is due. Cannot issue book.'); // 
        }

        // 2. Check if the copy is available
        const [copies] = await connection.query('SELECT status FROM COPIES WHERE id = ?', [copyId]);
        if (copies.length === 0 || copies[0].status !== 'available') {
            throw new Error('This book copy is not available for issue.');
        }

        // 3. Update the copy's status to 'issued'
        await connection.query('UPDATE COPIES SET status = "issued" WHERE id = ?', [copyId]);

        // 4. Create a new record in the issue record table
        const issueDate = new Date();
        const returnDueDate = new Date();
        returnDueDate.setDate(issueDate.getDate() + 7); // Book is due in 7 days [cite: 46]

        await connection.query(
            'INSERT INTO ISSUERECORD (copyId, memberId, issued, returndue) VALUES (?, ?, ?, ?)',
            [copyId, memberId, issueDate, returnDueDate]
        );

        await connection.commit();
        res.status(200).json({ message: 'Book issued successfully!' });

    } catch (error) {
        await connection.rollback();
        console.error('Issue Book Error:', error);
        // Send back the specific error message for frontend display
        res.status(400).json({ message: error.message });
    } finally {
        connection.release();
    }
};

module.exports = { issueBook };
