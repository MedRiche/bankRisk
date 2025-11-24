// frontend/src/services/clientService.js
import api from './api';

const clientService = {
  // ============ CLIENTS ============
  
  // Récupérer tous les clients
  getAllClients: async () => {
    try {
      const response = await api.get('/clients/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un client par ID
  getClientById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un client par email
  getClientByEmail: async (email) => {
    try {
      const response = await api.get(`/clients/by_email/?email=${email}`);
      return response.data;
    } catch (error) {
      // Retourner null si le client n'existe pas
      if (error.response?.status === 404) {
        return null;
      }
      throw error.response?.data || error.message;
    }
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    try {
      const response = await api.post('/clients/', clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}/`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un client
  deleteClient: async (id) => {
    try {
      await api.delete(`/clients/${id}/`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ DEMANDES DE CRÉDIT ============

  // Récupérer toutes les applications
  getAllApplications: async () => {
    try {
      const response = await api.get('/applications/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer une application par ID
  getApplicationById: async (id) => {
    try {
      const response = await api.get(`/applications/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les applications d'un client
  getApplicationsByClient: async (clientId) => {
    try {
      const response = await api.get(`/applications/by_client/?client_id=${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Soumettre une nouvelle demande de crédit
  submitCreditApplication: async (applicationData) => {
    try {
      const response = await api.post('/applications/', applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Évaluer une demande (Admin)
  evaluateApplication: async (id, evaluationData) => {
    try {
      const response = await api.post(`/applications/${id}/evaluate/`, evaluationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer une application
  deleteApplication: async (id) => {
    try {
      await api.delete(`/applications/${id}/`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ STATISTIQUES (pour Admin) ============

  // Obtenir les statistiques du dashboard
  getDashboardStats: async () => {
    try {
      const [clients, applications] = await Promise.all([
        api.get('/clients/'),
        api.get('/applications/')
      ]);

      const apps = applications.data;
      
      return {
        totalClients: clients.data.length,
        totalApplications: apps.length,
        approved: apps.filter(app => app.status === 'approved').length,
        pending: apps.filter(app => app.status === 'pending').length,
        rejected: apps.filter(app => app.status === 'rejected').length,
        riskGood: apps.filter(app => app.risk === 'good').length,
        riskBad: apps.filter(app => app.risk === 'bad').length,
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default clientService;