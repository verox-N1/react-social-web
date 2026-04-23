import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useLoggedUserStore } from '../store/LoggedUserStore';
import { useAuthStore } from '../store/AuthStore';
import { useFollowedUsersStore } from '../store/FollowedUsersStore';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useLoggedUserStore();
  const { registeredUsers, updatePassword, findUserByIdentifier } = useAuthStore();
  const { followedUsers, unfollowUser } = useFollowedUsersStore();

  // Trova i dati completi dell'utente loggato nel "database"
  const fullUser = registeredUsers.find(
    u => (u.email || '').toLowerCase() === (user?.email || '').toLowerCase()
  );

  // Stato per la modifica dati
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: fullUser?.username || '',
    nome: fullUser?.nome || '',
    cognome: fullUser?.cognome || '',
    email: fullUser?.email || '',
    password: fullUser?.password || ''
  });

  // Stato per mostrare/nascondere la password
  const [showPassword, setShowPassword] = useState(false);

  // Stato per il profilo selezionato (colonna destra)
  const [selectedUser, setSelectedUser] = useState(null);

  // Stato per la modale messaggio
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageData, setMessageData] = useState({ oggetto: '', corpo: '' });
  const [messageSent, setMessageSent] = useState(false);

  // Se non loggato, redirect al login
  if (!user) {
    return (
      <div className="profile-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="profile-right-placeholder">
          <span className="icon">🔒</span>
          <p>Devi essere loggato per vedere il tuo profilo.</p>
          <button className="profile-save-btn" onClick={() => navigate('/login')}>
            Vai al Login
          </button>
        </div>
      </div>
    );
  }

  // Salva modifiche
  const handleSave = () => {
    // Aggiorna nello store AuthStore
    const { registeredUsers } = useAuthStore.getState();
    const updatedUsers = registeredUsers.map(u => {
      if ((u.email || '').toLowerCase() === (user.email || '').toLowerCase()) {
        return { ...u, username: editData.username, nome: editData.nome, cognome: editData.cognome, email: editData.email, password: editData.password };
      }
      return u;
    });
    useAuthStore.setState({ registeredUsers: updatedUsers });

    // Aggiorna anche il LoggedUserStore
    useLoggedUserStore.getState().login({
      ...user,
      email: editData.email,
      username: editData.nome + (editData.cognome ? ' ' + editData.cognome : ''),
      profilePic: `https://api.dicebear.com/9.x/initials/svg?seed=${editData.nome} ${editData.cognome || ''}&backgroundColor=000000&textColor=00e5ff`
    });

    setIsEditing(false);
  };

  // Invia messaggio (simulato)
  const handleSendMessage = () => {
    if (!messageData.oggetto.trim() || !messageData.corpo.trim()) return;
    console.log(`Messaggio inviato a ${selectedUser.name}:`, messageData);
    setMessageSent(true);
    setTimeout(() => {
      setShowMessageModal(false);
      setMessageData({ oggetto: '', corpo: '' });
      setMessageSent(false);
    }, 1500);
  };

  // Smetti di seguire
  const handleUnfollow = (userId) => {
    unfollowUser(userId);
    if (selectedUser?.id === userId) {
      setSelectedUser(null);
    }
  };

  return (
    <div className="profile-wrapper">
      {/* === BOTTONE TORNA INDIETRO === */}
      <button className="profile-back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Torna indietro
      </button>

      <div className="profile-page">
      {/* === COLONNA SINISTRA === */}
      <div className="profile-left">

        {/* Sezione Seguiti */}
        <div className="profile-followed-section">
          <h3>👥 Seguiti</h3>
          {followedUsers.length > 0 ? (
            <div className="followed-list">
              {followedUsers.map(fu => (
                <div
                  key={fu.id}
                  className={`followed-user-item ${selectedUser?.id === fu.id ? 'active' : ''}`}
                  onClick={() => setSelectedUser(fu)}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${fu.username}`}
                    alt={fu.name}
                  />
                  <span>{fu.name?.split(' ')[0] || fu.username}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-followed-msg">Non segui ancora nessuno</p>
          )}
        </div>

        {/* Sezione Info Utente */}
        <div className="profile-info-section">
          <h3>Il Mio Profilo</h3>

          <div className="profile-field">
            <label>Username</label>
            {isEditing ? (
              <input
                type="text"
                className="profile-field-input"
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              />
            ) : (
              <div className="profile-field-value">{fullUser?.username || '—'}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Nome</label>
            {isEditing ? (
              <input
                type="text"
                className="profile-field-input"
                value={editData.nome}
                onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
              />
            ) : (
              <div className="profile-field-value">{fullUser?.nome || '—'}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Cognome</label>
            {isEditing ? (
              <input
                type="text"
                className="profile-field-input"
                value={editData.cognome}
                onChange={(e) => setEditData({ ...editData, cognome: e.target.value })}
              />
            ) : (
              <div className="profile-field-value">{fullUser?.cognome || '—'}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                className="profile-field-input"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            ) : (
              <div className="profile-field-value">{fullUser?.email || '—'}</div>
            )}
          </div>

          <div className="profile-field">
            <label>Password</label>
            {isEditing ? (
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="profile-field-input"
                  value={editData.password}
                  onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '1.1rem'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            ) : (
              <div className="profile-field-value">{'•'.repeat(fullUser?.password?.length || 8)}</div>
            )}
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="profile-save-btn" onClick={handleSave}>
                  ✓ Salva Modifiche
                </button>
                <button
                  className="profile-action-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ username: fullUser?.username || '', nome: fullUser?.nome || '', cognome: fullUser?.cognome || '', email: fullUser?.email || '', password: fullUser?.password || '' });
                  }}
                >
                  Annulla
                </button>
              </div>
            ) : (
              <button className="profile-action-btn" onClick={() => setIsEditing(true)}>
                ✏️ Modifica dati
              </button>
            )}
            <button className="profile-action-btn" onClick={() => navigate('/reset-password')}>
              🔑 Password dimenticata?
            </button>
          </div>
        </div>
      </div>

      {/* === COLONNA DESTRA === */}
      <div className="profile-right">
        {selectedUser ? (
          <div className="selected-profile">
            <div className="selected-profile-header">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`}
                alt={selectedUser.name}
              />
              <h2>{selectedUser.name}</h2>
              <h4>@{selectedUser.username}</h4>
            </div>

            <div className="selected-profile-actions">
              <button className="unfollow-btn" onClick={() => handleUnfollow(selectedUser.id)}>
                ✕ Smetti di seguire
              </button>
              <button className="message-btn" onClick={() => setShowMessageModal(true)}>
                ✉ Invia messaggio
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-right-placeholder">
            <span className="icon">👈</span>
            <p>Seleziona un utente dai tuoi seguiti<br />per vedere il suo profilo</p>
          </div>
        )}
      </div>

      {/* === MODALE MESSAGGIO === */}
      {showMessageModal && (
        <div className="message-modal-overlay" onClick={() => { setShowMessageModal(false); setMessageSent(false); }}>
          <div className="message-modal" onClick={(e) => e.stopPropagation()}>
            {messageSent ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <span style={{ fontSize: '3rem' }}>✅</span>
                <p style={{ marginTop: '15px', color: 'var(--accent)', fontWeight: 600 }}>
                  Messaggio inviato a {selectedUser.name}!
                </p>
              </div>
            ) : (
              <>
                <h3>✉ Messaggio a {selectedUser.name}</h3>

                <div className="form-group">
                  <label>Oggetto</label>
                  <input
                    type="text"
                    value={messageData.oggetto}
                    onChange={(e) => setMessageData({ ...messageData, oggetto: e.target.value })}
                    placeholder="Oggetto del messaggio"
                  />
                </div>

                <div className="form-group">
                  <label>Corpo del messaggio</label>
                  <textarea
                    value={messageData.corpo}
                    onChange={(e) => setMessageData({ ...messageData, corpo: e.target.value })}
                    placeholder="Scrivi il tuo messaggio..."
                  />
                </div>

                <div className="modal-actions">
                  <button className="modal-cancel-btn" onClick={() => setShowMessageModal(false)}>
                    Annulla
                  </button>
                  <button className="modal-send-btn" onClick={handleSendMessage}>
                    Invia
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
