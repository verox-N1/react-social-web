import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Users from './pages/Users';
import Register from './pages/Register';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';

function App() {
  const [posts, setPosts] = useState([]);
  
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
          
          {/* Pagina di registrazione */}
          <Route path="register" element={<Register />} />

          {/* Pagina di login */}
          <Route path="login" element={<Login />} />

          {/* Pagina di reset password */}
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Pagina del profilo utente */}
          <Route path="profile" element={<Profile />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;