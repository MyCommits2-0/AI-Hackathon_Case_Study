// frontend/src/pages/LibrarianDashboardPage.jsx

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header'; // Import the new Header

const LibrarianDashboardPage = () => {
    const { user } = useContext(AuthContext);
    
    // Static data for demonstration, we will make this dynamic later
    const stats = {
        totalBooks: 247,
        issuedBooks: 89,
        availableCopies: 158,
        overdueBooks: 3,
        activeMembers: 45,
        todaysCollections: "₹2,850"
    };

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div className="welcome-section">
                        <h1>Welcome Back, {user?.name}!</h1>
                        <p>Here's your library overview for today, {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{stats.totalBooks}</div>
                            <div className="stat-label">Total Books</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.issuedBooks}</div>
                            <div className="stat-label">Currently Issued</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.availableCopies}</div>
                            <div className="stat-label">Available Copies</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number urgent">{stats.overdueBooks}</div>
                            <div className="stat-label">Overdue Books</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{stats.activeMembers}</div>
                            <div className="stat-label">Active Members</div>
                        </div>
                         <div className="stat-card">
                            <div className="stat-number">{stats.todaysCollections}</div>
                            <div className="stat-label">Today's Collections</div>
                        </div>
                    </div>

                    <div className="panel">
                        <h2>Quick Actions</h2>
                        <div className="quick-actions">
                            <Link to="/issue-book" className="action-card">
                                <h3>Issue Book</h3>
                                <p>Issue book to member</p>
                            </Link>
                            <Link to="/return-book" className="action-card">
                                <h3>Return Book</h3>
                                <p>Process book return</p>
                            </Link>
                             <Link to="/collect-payment" className="action-card">
                                <h3>Collect Payment</h3>
                                <p>Monthly fees & fines</p>
                            </Link>
                            <Link to="/books-catalog" className="action-card">
                                <h3>Manage Books</h3>
                                <p>View and edit catalog</p>
                            </Link>
                            <Link to="/add-book" className="action-card">
                                <h3>Add New Book</h3>
                                <p>Register new title</p>
                            </Link>
                            <Link to="/manage-members" className="action-card">
                                <h3>Manage Members</h3>
                                <p>View and edit users</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default LibrarianDashboardPage;
