import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Creazione del Context
const UserContext = createContext();

// 2. Creazione del Provider (lo Store vero e proprio)
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La chiamata degli utenti /users
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Errore nel fetch degli utenti:", error);
        setLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ users, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  return useContext(UserContext);
};
