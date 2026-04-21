import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store per gestire l'utente attualmente loggato
export const useLoggedUserStore = create(
  persist(
    (set) => ({
      user: null, // null significa nessun utente loggato

      // Azione per effettuare il login
      login: (userData) => set({ user: userData }),

      // Azione per effettuare il logout
      logout: () => set({ user: null })
    }),
    {
      name: 'logged-user-storage', // Chiave nel localStorage
    }
  )
);

