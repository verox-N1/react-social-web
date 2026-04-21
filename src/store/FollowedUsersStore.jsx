import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Store per gestire gli utenti seguiti
export const useFollowedUsersStore = create(
  persist(
    (set, get) => ({
      // Array degli utenti seguiti
      followedUsers: [],

      // Azione per seguire un utente
      followUser: (user) => set((state) => {
        // Evitiamo duplicati controllando per id
        const alreadyFollowing = state.followedUsers.some(u => u.id === user.id);
        if (alreadyFollowing) return state;

        return {
          followedUsers: [...state.followedUsers, user]
        };
      }),

      // Azione per smettere di seguire un utente
      unfollowUser: (userId) => set((state) => ({
        followedUsers: state.followedUsers.filter(u => u.id !== userId)
      })),

      // Toggle follow/unfollow
      toggleFollow: (user) => {
        const { followedUsers } = get();
        const isFollowing = followedUsers.some(u => u.id === user.id);

        if (isFollowing) {
          get().unfollowUser(user.id);
        } else {
          get().followUser(user);
        }
      },

      // Controlla se un utente è seguito
      isFollowing: (userId) => {
        return get().followedUsers.some(u => u.id === userId);
      }
    }),
    {
      name: 'followed-users-storage', // Chiave nel localStorage
    }
  )
);
