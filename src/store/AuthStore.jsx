import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store Zustand per la gestione e validazione dei form di autenticazione
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Stato del form di registrazione
      registerData: {
        username: '',
        nome: '',
        cognome: '',
        email: '',
        password: ''
      },

      // Stato degli errori
      errors: {
        username: '',
        nome: '',
        cognome: '',
        email: '',
        password: ''
      },

      // Aggiorna un singolo campo
      updateRegisterField: (field, value) => set((state) => ({
        registerData: {
          ...state.registerData,
          [field]: value
        },
        // Rimuoviamo l'errore man mano che l'utente digita
        errors: {
          ...state.errors,
          [field]: ''
        }
      })),

      // Funzione di Validazione
      validateRegistration: () => {
        const { username, nome, cognome, email, password } = get().registerData;
        let newErrors = {};
        let isValid = true;

        // Regole di validazione
        if (!username.trim()) {
          newErrors.username = 'Lo username è obbligatorio';
          isValid = false;
        } else if (username.trim().length < 3) {
          newErrors.username = 'Lo username deve avere almeno 3 caratteri';
          isValid = false;
        } else if (get().registeredUsers.some(u => (u.username || '').toLowerCase() === username.trim().toLowerCase())) {
          newErrors.username = 'Questo username è già in uso';
          isValid = false;
        }

        if (!nome.trim()) {
          newErrors.nome = 'Il nome è obbligatorio';
          isValid = false;
        } else if (nome.length < 2) {
          newErrors.nome = 'Il nome deve avere almeno 2 caratteri';
          isValid = false;
        }

        if (!cognome.trim()) {
          newErrors.cognome = 'Il cognome è obbligatorio';
          isValid = false;
        }

        if (!email.trim()) {
          newErrors.email = 'L\'email è obbligatoria';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
          newErrors.email = 'Email non valida';
          isValid = false;
        }

        if (!password) {
          newErrors.password = 'La password è obbligatoria';
          isValid = false;
        } else if (password.length < 6) {
          newErrors.password = 'La password deve avere almeno 6 caratteri';
          isValid = false;
        }

        // Aggiorniamo gli errori nello stato globale
        set({ errors: newErrors });

        return isValid;
      },

      // Mock Database di utenti registrati
      registeredUsers: [],

      // Funzione per salvare l'utente "nel database"
      registerUser: (userData) => set((state) => {
        const newUser = { ...userData };
        console.log("Nuovo utente aggiunto al database:", newUser);
        return {
          registeredUsers: [...state.registeredUsers, { ...newUser }]
        };
      }),

      resetRegisterForm: () => set({
        registerData: { username: '', nome: '', cognome: '', email: '', password: '' },
        errors: {}
      })
    }),
    {
      name: 'auth-storage',
      version: 2, // Incrementato: forza il reset dei dati vecchi senza username
      partialize: (state) => ({ registeredUsers: state.registeredUsers }),
      migrate: (persistedState, version) => {
        if (version < 2) {
          // Vecchi dati senza username: li resettiamo
          return { registeredUsers: [] };
        }
        return persistedState;
      },
    }
  )
);
