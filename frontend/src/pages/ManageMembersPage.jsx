// frontend/src/pages/ManageMembersPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const ManageMembersPage = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/members', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch members');
                const data = await response.json();
                setMembers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchMembers();
    }, [token]);

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1>User Management</h1>
                            <p>Manage library members and their account status</p>
                        </div>
                        <Link to="/add-member" className="btn">+ Add New Member</Link>
                    </div>

                    {loading && <p>Loading members...</p>}
                    {error && <p className="error-message">{error}</p>}
                    
                    {!loading && !error && (
                        <div className="panel">
                            <h2>Library Members</h2>
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Member ID</th>
                                        <th>Member Info</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Books Issued</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map(member => (
                                        <tr key={member.id}>
                                            <td><strong>LIB{String(member.id).padStart(4, '0')}</strong></td>
                                            <td>
                                                <div className="user-name">{member.name}</div>
                                                <div className="user-email">{member.email}</div>
                                            </td>
                                            <td>{member.phone}</td>
                                            <td>{member.role}</td>
                                            <td>{member.booksIssued}</td>
                                            <td>
                                                <button className="btn btn-secondary btn-small">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default ManageMembersPage;
