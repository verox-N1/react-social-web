import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Users.css';

const Users = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;

  const [following, setFollowing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const cities = ["Roma", "Milano", "Napoli", "Torino", "Bologna"];
      const regions = ["Lazio", "Lombardia", "Campania", "Piemonte", "Emilia-Romagna"];
      const jobs = ["Developer", "Designer", "Manager", "Studente", "Freelancer"];
      const streets = ["Via Roma", "Via Milano", "Via Napoli", "Corso Italia"];
      const genders = ["Uomo", "Donna", "Non specificato"];
      const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
      const age = Math.floor(Math.random() * 30) + 18;

      setProfileData({
        city: random(cities),
        region: random(regions),
        street: random(streets),
        job: random(jobs),
        age: age,
        gender: random(genders),
      });

      setLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  if (!user) return <p className="user-page-wrapper">Utente non trovato</p>;

  return (
    <div className="user-page-wrapper">
      {loading ? (
        <div className="loader">Caricamento profilo...</div>
      ) : (
        <div className="user-single-card">
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            <span className="icon">←</span> Torna alla Community
          </button>

          <div className="profile-header">
            <div className="profile-banner"></div>
            <div className="profile-avatar">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt="Avatar Utente" />
            </div>
          </div>

          <div className="profile-info-main">
            <h2>{user.name}</h2>
            <h3>@{user.username}</h3>

            <button
              className={`follow-btn ${following ? "following" : ""}`}
              onClick={() => setFollowing(!following)}
            >
              {following ? "✓ Segui Già" : "+ Segui Profilo"}
            </button>
          </div>

          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-icon">👤</span>
              <div className="detail-text">
                <span className="detail-label">Nome Completo</span>
                <span className="detail-value">{user.name}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">⚥</span>
              <div className="detail-text">
                <span className="detail-label">Sesso</span>
                <span className="detail-value">{profileData.gender}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🎂</span>
              <div className="detail-text">
                <span className="detail-label">Età</span>
                <span className="detail-value">{profileData.age} Anni</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🗺</span>
              <div className="detail-text">
                <span className="detail-label">Regione</span>
                <span className="detail-value">{profileData.region}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div className="detail-text">
                <span className="detail-label">Città</span>
                <span className="detail-value">{profileData.city}</span>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">💼</span>
              <div className="detail-text">
                <span className="detail-label">Lavoro</span>
                <span className="detail-value">{profileData.job}</span>
              </div>
            </div>

            <div className="detail-item full-width">
              <span className="detail-icon">🏠</span>
              <div className="detail-text">
                <span className="detail-label">Indirizzo</span>
                <span className="detail-value">{profileData.street}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;