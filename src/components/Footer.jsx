import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2 className="footer-title">Social Web</h2>
          <p className="footer-subtitle">Connettiti con il mondo, in alta definizione.</p>
        </div>

      </div>
      
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Social Web. Tutti i diritti riservati.
      </div>
    </footer>
  );
}