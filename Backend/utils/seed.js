// backend/utils/seed.js - REVISED

const db = require('../config/db');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    await db.query('SET FOREIGN_KEY_CHECKS=0;');
    await db.query('DROP TABLE IF EXISTS PAYMENTS, ISSUERECORD, COPIES, BOOKS, MEMBERS;');
    console.log('Tables dropped.');
    
    // RECREATE MEMBERS TABLE WITH NEW COLUMN
    await db.query(`
      CREATE TABLE MEMBERS (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          passwd VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'member',
          membership_expiry_date DATE
      );
    `);
    // ... (recreate other tables)
    await db.query(`CREATE TABLE BOOKS (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, subject VARCHAR(100), price DECIMAL(10, 2), isbn VARCHAR(100) UNIQUE);`);
    await db.query(`CREATE TABLE COPIES (id INT AUTO_INCREMENT PRIMARY KEY, bookId INT NOT NULL, rack INT, status VARCHAR(50) NOT NULL DEFAULT 'available', FOREIGN KEY (bookId) REFERENCES BOOKS(id) ON DELETE CASCADE);`);
    await db.query(`CREATE TABLE ISSUERECORD (id INT AUTO_INCREMENT PRIMARY KEY, copyId INT NOT NULL, memberId INT NOT NULL, issued DATETIME NOT NULL, returndue DATETIME NOT NULL, returned DATETIME, fine DECIMAL(10, 2) DEFAULT 0, FOREIGN KEY (copyId) REFERENCES COPIES(id) ON DELETE RESTRICT, FOREIGN KEY (memberId) REFERENCES MEMBERS(id) ON DELETE RESTRICT);`);
    await db.query(`CREATE TABLE PAYMENTS (id INT AUTO_INCREMENT PRIMARY KEY, memberId INT NOT NULL, amount DECIMAL(10, 2) NOT NULL, type VARCHAR(50) NOT NULL, txtime DATETIME NOT NULL, duedate DATETIME, FOREIGN KEY (memberId) REFERENCES MEMBERS(id) ON DELETE CASCADE);`);
    console.log('All five tables recreated.');

    // Seed Users with Expiry Dates
    const saltRounds = 10;
    const ownerPassword = await bcrypt.hash('owner123', saltRounds);
    const librarianPassword = await bcrypt.hash('librarian123', saltRounds);

    // Set expiry date far in the future for admins
    const adminExpiry = '2099-12-31';
    // Create a member with a valid membership and one with an expired one for testing
    const validMemberExpiry = new Date(); validMemberExpiry.setMonth(validMemberExpiry.getMonth() + 1); // Expires next month
    const expiredMemberExpiry = new Date(); expiredMemberExpiry.setMonth(expiredMemberExpiry.getMonth() - 1); // Expired last month

    await db.query("INSERT INTO MEMBERS (name, email, passwd, role, membership_expiry_date) VALUES (?, ?, ?, ?, ?)", ['Library Owner', 'owner@library.com', ownerPassword, 'owner', adminExpiry]);
    await db.query("INSERT INTO MEMBERS (name, email, passwd, role, membership_expiry_date) VALUES (?, ?, ?, ?, ?)", ['Sarah Johnson', 'sarah.j@library.com', librarianPassword, 'librarian', adminExpiry]);
    await db.query("INSERT INTO MEMBERS (name, email, passwd, role, membership_expiry_date) VALUES (?, ?, ?, ?, ?)", ['Valid Member', 'valid@member.com', await bcrypt.hash('password123', saltRounds), 'member', validMemberExpiry]);
    await db.query("INSERT INTO MEMBERS (name, email, passwd, role, membership_expiry_date) VALUES (?, ?, ?, ?, ?)", ['Expired Member', 'expired@member.com', await bcrypt.hash('password123', saltRounds), 'member', expiredMemberExpiry]);
    console.log('Users seeded.');

    // Seed Books and Copies (remains the same)
    await db.query("INSERT INTO BOOKS (name, author, subject, price, isbn) VALUES (?, ?, ?, ?, ?)", ['Clean Code', 'Robert C. Martin', 'Programming', 2499.00, '978-0132350884']);
    await db.query("INSERT INTO BOOKS (name, author, subject, price, isbn) VALUES (?, ?, ?, ?, ?)", ['The Pragmatic Programmer', 'Andrew Hunt', 'Programming', 1899.00, '978-0201616224']);
    await db.query("INSERT INTO COPIES (bookId, rack, status) VALUES (1, 2, 'available'), (1, 2, 'available'), (1, 2, 'issued');");
    await db.query("INSERT INTO COPIES (bookId, rack, status) VALUES (2, 3, 'available');");
    console.log('Books and copies seeded.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.query('SET FOREIGN_KEY_CHECKS=1;');
    db.end();
    console.log('Database connection closed.');
  }
};

seedDatabase();