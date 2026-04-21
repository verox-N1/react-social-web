import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/AuthStore';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { 
    registerData, 
    errors, 
    updateRegisterField, 
    validateRegistration, 
    resetRegisterForm,
    registerUser
  } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateRegisterField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isValid = validateRegistration();
    
    if (isValid) {
      // 1. Salva l'utente nello store Auth (Mock Database)
      registerUser(registerData);
      console.log("Utente registrato nel DB fasullo:", registerData);
      
      // 2. Svuota il form
      resetRegisterForm();
      
      // 3. Reindirizza l'utente alla pagina di Login
      alert("Registrazione completata con successo! Ora puoi effettuare l'accesso.");
      navigate('/login');
    } else {
      console.log("Validazione fallita, correggere gli errori");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crea un Account</h2>
        <form className="register-form" onSubmit={handleSubmit} noValidate>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={registerData.username} 
              onChange={handleChange} 
              className={`form-input ${errors.username ? 'input-error' : ''}`} 
              placeholder="Scegli un username unico"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              value={registerData.nome} 
              onChange={handleChange} 
              className={`form-input ${errors.nome ? 'input-error' : ''}`} 
              placeholder="Inserisci il tuo nome"
            />
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cognome">Cognome</label>
            <input 
              type="text" 
              id="cognome" 
              name="cognome" 
              value={registerData.cognome} 
              onChange={handleChange} 
              className={`form-input ${errors.cognome ? 'input-error' : ''}`} 
              placeholder="Inserisci il tuo cognome"
            />
            {errors.cognome && <span className="error-message">{errors.cognome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={registerData.email} 
              onChange={handleChange} 
              className={`form-input ${errors.email ? 'input-error' : ''}`} 
              placeholder="esempio@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password" 
                value={registerData.password} 
                onChange={handleChange} 
                className={`form-input ${errors.password ? 'input-error' : ''}`} 
                placeholder="Crea una password sicura"
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
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn">Registrati Ora</button>
        </form>
      </div>
    </div>
  );
}
