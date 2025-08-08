// frontend/src/components/Header.jsx

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header>
            <div className="container">
                <div className="header-content">
                    <Link to="/librarian-dashboard" className="logo" style={{ textDecoration: 'none' }}>Library Management System</Link>
                    {user && (
                        <div className="user-info">
                            <span>Welcome, {user.name}</span>
                            <button onClick={handleLogout} className="btn">Sign Out</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
