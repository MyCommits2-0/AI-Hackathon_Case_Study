import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in');
      }

      // Use the login function from AuthContext
      login(data.user, data.token);
      
      // Redirect based on role
      if (data.user.role === 'librarian') {
        navigate('/librarian-dashboard');
      } else if (data.user.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <h1>Sign In</h1>
        <p>Access your library account</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form id="loginForm" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Sign In</button>
      </form>

      <div className="form-footer">
        {/* We will add this page later */}
        <a href="#">Forgot your password?</a>
        <div className="divider">Don't have an account?</div>
        <Link to="/register" style={{ fontWeight: 500 }}>Create Account</Link>
      </div>
    </div>
  );
};

export default LoginPage;