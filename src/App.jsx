import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users';

function App() {
  const [posts, setPosts] = useState([]);
  
  // Lo stato degli utenti è ora gestito globalmente nel file UserStore.jsx !
  // La chiamata dei posts:

  // E poi fa la chiamta dei posts
  // si usano i props, passare variabili da una componente padre ad una componente figlia.
  // 1. Creare uno store jsx richiamabile nelle varie componenti che salvi il risultato della chiamata rest: https://jsonplaceholder.typicode.com/users
  
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          {/* Home */}
          <Route index element={<Home posts={posts}/>} />

          {/* Pagina singolo utente */}
          <Route path="users/:id" element={<Users />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;