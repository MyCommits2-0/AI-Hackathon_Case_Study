import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const AddMemberPage = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:5001/api/members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add member');
            }

            alert('Member added successfully!');
            navigate('/manage-members');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="register-container">
                    <div className="logo">
                        <h1>Add New Member</h1>
                        <p>Create new member account</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter member's full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter member's email address" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Member's phone number" />
                        </div>

                        <div className="terms">
                            The default password will be the same as the email address. The member can change it from their profile settings later.
                        </div>

                        <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Create Account</button>
                    </form>
                     <div className="form-footer">
                        <Link to="/manage-members">Cancel</Link>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AddMemberPage;
