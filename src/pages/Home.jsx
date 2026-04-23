import React, { useState } from 'react';
import './Home.css';
import Post from '../components/Post';
import { useUsers } from '../store/UserStore'; 
import Loader from '../components/Loader';

const Home = ({ posts }) => {
  const { users, loading } = useUsers();
  
  // STATO PER LA CREAZIONE DEL PROPRIO POST
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  // Gestione allegati (preview immagine)
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Creiamo un URL temporaneo per mostrare l'anteprima nel browser
      setNewPostImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  if (loading) {
    return <Loader text="Connessione alla Community..." />;
  }

  // Funzione per inviare il nuovo post alla lista locale
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImage) return;

    const newPostObj = {
      id: `custom-post-${Date.now()}`, // ID fittizio per questo post
      userId: 99999, // Un ID utente speciale che riconosciremo
      body: newPostText,
      image: newPostImage 
    };

    // Aggiungo il nuovo post ALL'INIZIO (usando un nuovo array con l'elemento in testa)
    setMyPosts([newPostObj, ...myPosts]);
    setNewPostText("");
    setNewPostImage(null);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Esplora la Community ✨</h1>

      {/* CARD CENTRALE PER CREARE IL TUO POST */}
      <div className="create-post-wrapper">
        <form onSubmit={handleCreatePost} className="create-post-form">
          <textarea
             className="create-post-input"
             placeholder="Cosa ti passa per la testa?"
             value={newPostText}
             onChange={e => setNewPostText(e.target.value)}
             rows="3"
          />
          {newPostImage && (
            <div className="create-post-image-preview">
              <img src={newPostImage} alt="Anteprima Post" />
              <button type="button" onClick={() => setNewPostImage(null)}>✖ Rimuovi Foto</button>
            </div>
          )}

          <div className="create-post-footer">
             <label className="upload-image-btn">
               📷 Aggiungi Foto
               <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
             </label>

             <button type="submit" className="create-post-btn" disabled={!newPostText.trim() && !newPostImage}>
               Pubblica Post
             </button>
          </div>
        </form>
      </div>

      <div className="posts-list">
        
        {/* Renderizziamo PRIMA I NOSTRI nuovi Post in cima alla Timeline! */}
        {myPosts.map(myPost => (
          <Post 
            key={myPost.id}
            postId={myPost.id} 
            user="Il Tuo Profilo Personale" 
            userData={{ id: 99999, name: "Il Tuo Profilo Personale", username: "tuoprofilo" }}
            content={myPost.body}
            isNew={true} 
            image={myPost.image}
          />
        ))}

        {/* Poi carichiamo tutti i post originali scaricati dalle API */}
        {posts.map(post => {
          const postUser = users.find(user => user.id === post.userId);
          return (
            <Post 
              key={post.id}
              postId={post.id} 
              user={postUser ? postUser.name : "Utente Sconosciuto"}
              userData={postUser}
              content={post.body}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;