// src/services/authService.js
import api from './api';

const authService = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Connexion
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      const { access, refresh, email } = response.data;

      // Stocker les tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_email', email);
      
      // Déterminer si c'est un admin (basé sur l'email ou une propriété renvoyée par l'API)
      const isAdmin = email.includes('admin') || email.includes('conseiller');
      localStorage.setItem('is_admin', isAdmin.toString());

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('is_admin');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Vérifier si l'utilisateur est admin
  isAdmin: () => {
    return localStorage.getItem('is_admin') === 'true';
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser: () => {
    return localStorage.getItem('user_email');
  },

  // Obtenir le token d'accès
  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },
};

export default authService;