// src/services/clientService.js
import api from './api';

const clientService = {
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

  // Créer des informations financières
  createFinancial: async (financialData) => {
    try {
      const response = await api.post('/financials/', financialData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer des informations d'emploi
  createEmployment: async (employmentData) => {
    try {
      const response = await api.post('/employments/', employmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer des informations de propriété
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties/', propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer une application de crédit
  createApplication: async (applicationData) => {
    try {
      const response = await api.post('/applications/', applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default clientService;