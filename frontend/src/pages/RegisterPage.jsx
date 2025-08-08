import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before new submission

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // On successful registration
      alert('Registration successful! Please log in.');
      navigate('/login');

    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="register-container">
      <div className="logo">
        <h1>Join Our Library</h1>
        <p>Create your member account</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form id="registerForm" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Your phone number"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="terms">
          By creating an account, you agree to our terms of service and privacy
          policy. Monthly membership fees apply as per library policy.
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
      </form>

      <div className="form-footer">
        <div className="divider">Already have an account?</div>
        <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
