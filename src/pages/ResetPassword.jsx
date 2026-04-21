import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import './Register.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const findUserByIdentifier = useAuthStore((state) => state.findUserByIdentifier);
  const updatePassword = useAuthStore((state) => state.updatePassword);

  // Step 1: cerca account, Step 2: inserisci nuova password, Step 3: successo
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 1: Cerca l'account
  const handleFindAccount = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Inserisci il tuo username o email');
      return;
    }

    const user = findUserByIdentifier(identifier);
    if (user) {
      setFoundUser(user);
      setStep(2);
    } else {
      setError('Nessun account trovato con queste credenziali');
    }
  };

  // Step 2: Reimposta la password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword) {
      setError('Inserisci la nuova password');
      return;
    }
    if (newPassword.length < 6) {
      setError('La password deve avere almeno 6 caratteri');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    // Aggiorna la password nello store
    updatePassword(identifier, newPassword);
    setStep(3);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">
          {step === 1 && '🔑 Trova il tuo Account'}
          {step === 2 && '🔒 Nuova Password'}
          {step === 3 && '✅ Password Reimpostata!'}
        </h2>

        {/* STEP 1: Trova account */}
        {step === 1 && (
          <form className="register-form" onSubmit={handleFindAccount}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.95rem' }}>
              Inserisci il tuo username o email per trovare il tuo account.
            </p>

            <div className="form-group">
              <label htmlFor="identifier">Username o Email</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                className={`form-input ${error ? 'input-error' : ''}`}
                placeholder="Il tuo username o email"
                required
              />
              {error && <span className="error-message">{error}</span>}
            </div>

            <button type="submit" className="submit-btn" style={{ marginTop: '10px' }}>
              Cerca Account
            </button>

            <button
              type="button"
              className="submit-btn"
              style={{ marginTop: '5px', background: 'rgba(255,255,255,0.1)' }}
              onClick={() => navigate('/login')}
            >
              ← Torna al Login
            </button>
          </form>
        )}

        {/* STEP 2: Inserisci nuova password */}
        {step === 2 && (
          <form className="register-form" onSubmit={handleResetPassword}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.95rem' }}>
              Account trovato: <strong style={{ color: 'var(--accent)' }}>{foundUser.nome} {foundUser.cognome}</strong>
            </p>

            <div className="form-group">
              <label htmlFor="newPassword">Nuova Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  className={`form-input ${error ? 'input-error' : ''}`}
                  placeholder="Minimo 6 caratteri"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Conferma Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className={`form-input ${error ? 'input-error' : ''}`}
                  placeholder="Ripeti la nuova password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {error && <span className="error-message">{error}</span>}
            </div>

            <button type="submit" className="submit-btn" style={{ marginTop: '10px' }}>
              Reimposta Password
            </button>
          </form>
        )}

        {/* STEP 3: Successo */}
        {step === 3 && (
          <div className="register-form">
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
              La password per l'account <strong style={{ color: 'var(--accent)' }}>{foundUser.nome}</strong> è stata reimpostata con successo!
            </p>
            <button
              className="submit-btn"
              style={{ marginTop: '20px' }}
              onClick={() => navigate('/login')}
            >
              Vai al Login →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
