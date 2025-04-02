import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import "../styles/Navbar.css";
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">DesignCollab</Link>
      </div>
      
      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>
          <Link to="/design/new" className="nav-link">
            <FaPlus /> New Design
          </Link>
        </div>
      )}
      
      <div className="navbar-user">
        {isAuthenticated ? (
          <>
            <span className="user-info">
              <FaUser /> {user?.username} ({user?.role})
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;