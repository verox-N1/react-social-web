import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoggedUserStore } from '../store/LoggedUserStore';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useLoggedUserStore();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-center-logo">
          <img src={logo} alt="Logo" className="header-logo" />
          <h1>Social Web</h1>
        </Link>
        
        <nav className="header-nav" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-main)', cursor: 'pointer' }}>Ciao, {user.username}</span>
                <img 
                  src={user.profilePic} 
                  alt="Profilo Utente" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent)', objectFit: 'cover', cursor: 'pointer' }} 
                />
              </Link>
              <button 
                onClick={logout} 
                className="register-nav-btn" 
                style={{ background: 'transparent', borderColor: '#ff3366', color: '#ff3366', boxShadow: 'none', cursor: 'pointer' }}>
                Esci
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="register-nav-btn" style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', boxShadow: 'none' }}>Accedi</Link>
              <Link to="/register" className="register-nav-btn">Registrati</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;