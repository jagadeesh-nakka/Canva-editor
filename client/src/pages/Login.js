import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  console.log('Component Rendered');
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useEffect triggered');
    console.log('isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to Dashboard');
      navigate('/Dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    console.log(`Input Changed: ${e.target.name} = ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Submitted');
    console.log('Form Data:', formData);
    
    setError('');
    setLoading(true);
    console.log('Loading set to true');
    
    const { email, password } = formData;
    try {
      console.log('Attempting login...');
      const result = await login(email, password);
      console.log('Login Result:', result);
      
      if (!result.success) {
        console.log('Login failed');
        setError(result.message || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError('An error occurred while logging in.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;