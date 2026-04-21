import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoggedUserStore } from '../store/LoggedUserStore';
import { useAuthStore } from '../store/AuthStore';
import './Register.css';

export default function Login() {
  const navigate = useNavigate();
  const loginAction = useLoggedUserStore((state) => state.login);
  const registeredUsers = useAuthStore((state) => state.registeredUsers);

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setLoginError(''); // Pulisce l'errore digitando
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentativo di accesso con:", loginData);

    console.log("Database utenti carichi:", registeredUsers);

    // Puliamo l'input dell'utente
    const inputUsername = loginData.username.trim().toLowerCase();
    const inputPassword = loginData.password; // Non trimmiamo la password per sicurezza

    // Cerchiamo l'utente nel "Database" fasullo (LocalStorage via Zustand Persist)
    const foundUser = registeredUsers.find(
      (user) => {
        const storedEmail = (user.email || "").trim().toLowerCase();
        const storedUsername = (user.username || "").trim().toLowerCase();
        const storedNome = (user.nome || "").trim().toLowerCase();

        return (storedEmail === inputUsername || storedUsername === inputUsername || storedNome === inputUsername) &&
          user.password === inputPassword;
      }
    );


    if (foundUser) {
      // Accesso Riuscito!
      // Creiamo l'avatar loggato con le iniziali dell'utente
      const mockUser = {
        id: Math.floor(Math.random() * 1000),
        username: foundUser.nome + (foundUser.cognome ? ' ' + foundUser.cognome : ''),
        email: foundUser.email,
        profilePic: `https://api.dicebear.com/9.x/initials/svg?seed=${foundUser.nome} ${foundUser.cognome}&backgroundColor=000000&textColor=00e5ff`
      };

      loginAction(mockUser);
      navigate('/');
    } else {
      // Accesso Fallito
      setLoginError('Credenziali errate o utente non registrato. Riprova!');
    }

  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Bentornato</h2>
        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="username">Username o Email</label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Inserisci username o email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className={`form-input ${loginError ? 'input-error' : ''}`}
              placeholder="La tua password"
              required
            />
            {loginError && <span className="error-message" style={{ textAlign: 'center', marginTop: '10px' }}>{loginError}</span>}
          </div>

          <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>Accedi</button>
        </form>
      </div>
    </div>
  );
}
