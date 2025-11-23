// src/services/clientService.js
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
      const response = await api.get(`/clients/?email=${email}`);
      return response.data[0] || null;
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

  // ============ PROFIL CLIENT ============

  // Mettre à jour le profil complet du client
  updateClientProfile: async (profileData) => {
    try {
      // Cette méthode combine la mise à jour du client et de ses informations liées
      const clientResponse = await api.put(`/clients/${profileData.client.id}/`, profileData.client);
      
      if (profileData.financial) {
        await api.post('/financials/', { ...profileData.financial, client: clientResponse.data.id });
      }
      
      if (profileData.employment) {
        await api.post('/employments/', { ...profileData.employment, client: clientResponse.data.id });
      }
      
      if (profileData.property) {
        await api.post('/properties/', { ...profileData.property, client: clientResponse.data.id });
      }

      return clientResponse.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ INFORMATIONS FINANCIÈRES ============

  // Créer des informations financières
  createFinancial: async (financialData) => {
    try {
      const response = await api.post('/financials/', financialData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour des informations financières
  updateFinancial: async (id, financialData) => {
    try {
      const response = await api.put(`/financials/${id}/`, financialData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ INFORMATIONS D'EMPLOI ============

  // Créer des informations d'emploi
  createEmployment: async (employmentData) => {
    try {
      const response = await api.post('/employments/', employmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour des informations d'emploi
  updateEmployment: async (id, employmentData) => {
    try {
      const response = await api.put(`/employments/${id}/`, employmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ INFORMATIONS DE PROPRIÉTÉ ============

  // Créer des informations de propriété
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties/', propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour des informations de propriété
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}/`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ============ DEMANDES DE CRÉDIT ============

  // Soumettre une nouvelle demande de crédit
  submitCreditApplication: async (applicationData) => {
    try {
      // 1. Créer ou récupérer le client
      const userEmail = localStorage.getItem('user_email');
      let clientResponse = await api.get(`/clients/?email=${userEmail}`);
      
      let clientId;
      if (clientResponse.data.length === 0) {
        // Créer un nouveau client si nécessaire
        const newClient = await api.post('/clients/', {
          name: userEmail.split('@')[0],
          email: userEmail,
          age_in_years: 30, // Valeur par défaut, à ajuster
          sex_status: 'A91',
          telephone: 'A192',
          foreign_worker: 'A202',
        });
        clientId = newClient.data.id;
      } else {
        clientId = clientResponse.data[0].id;
      }

      // 2. Créer les informations financières
      await api.post('/financials/', {
        client: clientId,
        checking_account_status: applicationData.checking_account_status,
        savings_account_bonds: applicationData.savings_account_bonds,
        credit_amount: applicationData.credit_amount,
        duration_in_month: applicationData.duration_in_month,
        installment: applicationData.installment,
        other_debtors: applicationData.other_debtors,
      });

      // 3. Créer les informations d'emploi
      await api.post('/employments/', {
        client: clientId,
        employment_status: applicationData.employment_status,
        job_type: applicationData.job_type,
        existing_credits_no: 0,
      });

      // 4. Créer les informations de propriété
      await api.post('/properties/', {
        client: clientId,
        property_type: applicationData.property_type,
        housing: applicationData.housing,
        other_installment_plans: 'A143',
        liability_responsibles: 1,
      });

      // 5. Créer la demande de crédit
      const applicationResponse = await api.post('/applications/', {
        client: clientId,
        purpose: applicationData.purpose,
        credit_history: applicationData.credit_history,
      });

      return applicationResponse.data;
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

  // ============ SCORING ============

  // Créer un scoring
  createScoring: async (scoringData) => {
    try {
      const response = await api.post('/scorings/', scoringData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer tous les scorings
  getAllScorings: async () => {
    try {
      const response = await api.get('/scorings/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un scoring par ID d'application
  getScoringByApplicationId: async (applicationId) => {
    try {
      const response = await api.get(`/scorings/?application=${applicationId}`);
      return response.data[0] || null;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default clientService;