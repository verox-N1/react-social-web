import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Post.css'; // stile per il post

// Helper function generatore realmente casuale
const generateRandomSocialTime = () => {
  const isRecent = Math.random() > 0.6;
  if (isRecent) {
    const minutes = Math.floor(Math.random() * 59) + 1;
    // L'utente vuole specificamente che la dicitura generata sia "Proprio ora" e non "Appena adesso"
    if (minutes < 3) return "Proprio ora";
    return `${minutes}m fa`;
  }

  const isHours = Math.random() > 0.4;
  const amount = isHours ? Math.floor(Math.random() * 23) + 1 : Math.floor(Math.random() * 5) + 1;

  // Se le tempistiche sono superiori alle 24 ore (non è né minuti né ore)
  if (!isHours) {
    if (amount === 1) return "Ieri";
    return `${amount}g fa`; // Mostra semplicemente quanti giorni, pulito e minimale.
  }

  return `${amount}h fa`;
};

const Post = ({ postId, user, userData, content, isNew, image }) => {
  const navigate = useNavigate();

  // --- STATO DEL TEMPO ---
  // Se il post è nuovo (passato da props), mettiamo "Proprio ora". 
  // Altrimenti, usiamo l'algoritmo matematico casuale.
  const [randomTime] = useState(isNew ? "Proprio ora" : generateRandomSocialTime());

  // --- STATO DEL LIKE ---
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(Math.floor(Math.random() * 50));

  // --- STATO DEI COMMENTI ---
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Testo del commento che stiamo scrivendo
  const [newCommentText, setNewCommentText] = useState("");

  // Il "Trucco": Scegliamo un numero casuale (da 1 a 12) per ogni post 
  // Usa "setCommentCount" per poterlo aumentare quando inseriamo noi un commento!
  const [commentCount, setCommentCount] = useState(Math.floor(Math.random() * 12) + 1);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const toggleComments = () => {
    const willOpen = !showComments;
    setShowComments(willOpen);

    // Lazy loading
    if (willOpen && comments.length === 0) {
      setLoadingComments(true);

      axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then(res => {
          let fetchedComments = res.data;

          // FIX Baco: Se le API non trovano commenti per questo post 
          // (perché l'abbiamo creato noi in locale ed ha un ID inventato)
          // Assegniamo una finta libreria di commenti assortiti!
          if (!fetchedComments || fetchedComments.length === 0) {
            fetchedComments = [
              { id: "f1", email: "alex99@mail.com", body: "Assolutamente d'accordo, gran bel post!" },
              { id: "f2", email: "sarah_tech@mail.com", body: "Interessante punto di vista, non ci avevo mai pensato." },
              { id: "f3", email: "marco.dev@mail.com", body: "Fantastico! Qualcun altro la pensa in questo modo?" },
              { id: "f4", email: "giulia_web@mail.com", body: "Adoro questa community." },
              { id: "f5", email: "luca.r@mail.com", body: "Ma davvero? Devo assolutamente provare." },
              { id: "f6", email: "ghost_user@mail.com", body: "Ahahah super geniale." },
              { id: "f7", email: "membro_pro@mail.com", body: "Primo! Molto interessante." }
            ];
          }

          const finalComments = [];

          for (let i = 0; i < commentCount; i++) {
            finalComments.push({
              ...fetchedComments[i % fetchedComments.length],
              id: `${postId}-comment-${i}`
            });
          }

          setComments(finalComments);
          setLoadingComments(false);
        })
        .catch(err => {
          console.error("Errore nel caricamento", err);
          setLoadingComments(false);
        });
    }
  };

  // Funzione per inserire il commento!
  const handleAddComment = (e) => {
    e.preventDefault(); // Evita il ricaricamento della pagina in caso lo si agganci a un form
    if (newCommentText.trim() === "") return; // Se è vuoto, non fa nulla

    const newCommentObj = {
      id: `my-comment-${Date.now()}`,
      email: 'Il_Tuo_Profilo@mail.com', // Uso la finta mail perché la nostra grafica splitta al '@'
      body: newCommentText
    };

    // Aggiungo in fondo alla lista dei commenti caricati
    setComments([...comments, newCommentObj]);
    // Aumento il pallino del contatore sul bottone!
    setCommentCount(prevCount => prevCount + 1);
    // Azzero la barra di testo
    setNewCommentText("");
  };

  // --- LOGICA IMMAGINE CASUALE (o Caricata!) ---
  // Se è stato passata un'immagine (image), usiamo quella.
  // Altrimenti decidiamo matematicamente un'immagine random se il post non è nuovo.
  const hasImage = !isNew && (typeof postId === 'number' && postId % 3 === 0);
  const generatedImageUrl = `https://picsum.photos/seed/${postId + 50}/800/400`;

  const displayImage = image || (hasImage ? generatedImageUrl : null);

  return (
    <div className="post">
      {/* Intestazione */}
      <div className="post-header">
        <strong
          className="post-user-link"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (userData) {
              navigate(`/users/${userData.id}`, { state: userData });
            }
          }}
        >
          {user}
        </strong>
        <span className="timestamp">{randomTime}</span>
      </div>

      {/* Corpo del messaggio */}
      <div className="post-content">
        {content}
      </div>

      {/* Immagine Casuale o Caricata (se disponibile) */}
      {displayImage && (
        <div className="post-image-container">
          <img src={displayImage} alt="Contenuto allegato" className="post-image" />
        </div>
      )}

      {/* FOOTER */}
      <div className="post-footer">
        <button
          className={`action-button like-button ${isLiked ? 'liked' : ''}`}
          onClick={toggleLike}
        >
          {isLiked ? '❤️' : '🤍'} <span>{likesCount}</span>
        </button>

        <button
          className={`action-button comment-button ${showComments ? 'active' : ''}`}
          onClick={toggleComments}
        >
          💬 <span>{commentCount}</span>
        </button>
      </div>

      {/* SEZIONE COMMENTI A SCOMPARSA (Mostrata solo dopo aver cliccato il bottone) */}
      {showComments && (
        <div className="comments-section">
          {loadingComments ? (
            <p className="loading-text">Caricamento commenti in corso...</p>
          ) : comments.length > 0 ? (
            <ul className="comments-list">
              {comments.map(c => (
                <li key={c.id} className="comment-item">
                  {/* Estrapolo la prima parte della mail per fingere un "nome utente" (es. pippo@mail.com -> pippo) */}
                  <strong>@{c.email.split('@')[0]}</strong>
                  <p>{c.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="loading-text">Nessun commento.</p>
          )}

          {/* Nuova area per inserire il NOSTRO commento */}
          <form className="add-comment-form" onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Scrivi un commento..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="comment-input"
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={!newCommentText.trim()}
            >
              Invia
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;