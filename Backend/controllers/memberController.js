// backend/controllers/memberController.js

const db = require('../config/db');
const bcrypt = require('bcrypt');

const getAllMembers = async (req, res) => {
    try {
        const query = `
            SELECT 
                m.id, 
                m.name, 
                m.email, 
                m.phone,
                m.role,
                COUNT(ir.id) AS booksIssued
            FROM MEMBERS m
            LEFT JOIN ISSUERECORD ir ON m.id = ir.memberId AND ir.returned IS NULL
            GROUP BY m.id
            ORDER BY m.name;
        `;
        const [members] = await db.query(query);
        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Server error fetching members' });
    }
};
// --- Add the new addMember function ---
const addMember = async (req, res) => {
    try {
        const { fullName, email, phone } = req.body;

        // 1. Validate input
        if (!fullName || !email) {
            return res.status(400).json({ message: 'Full name and email are required.' });
        }

        // 2. Check if member already exists
        const [existingMember] = await db.query('SELECT email FROM MEMBERS WHERE email = ?', [email]);
        if (existingMember.length > 0) {
            return res.status(400).json({ message: 'A member with this email already exists.' });
        }

        // 3. Set default password to be the email and hash it
        const defaultPassword = email;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

        // 4. Insert the new member
        await db.query(
            'INSERT INTO MEMBERS (name, email, phone, passwd, role) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, phone, hashedPassword, 'member']
        );

        res.status(201).json({ message: 'Member created successfully!' });

    } catch (error) {
        console.error('Add Member Error:', error);
        res.status(500).json({ message: 'Server error during member creation.' });
    }
};
const searchMembers = async (req, res) => {
    try {
        const { q } = req.query;
        const [members] = await db.query(
            "SELECT id, name, email FROM MEMBERS WHERE role = 'member' AND (name LIKE ? OR email LIKE ?)", 
            [`%${q}%`, `%${q}%`]
        );
        res.json(members);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
module.exports = { getAllMembers, addMember, searchMembers };
