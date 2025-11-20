// src/components/clients/ClientList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  ExitToApp,
} from '@mui/icons-material';
import clientService from '../../services/clientService';
import authService from '../../services/authService';

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des clients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientService.deleteClient(id);
        loadClients();
      } catch (err) {
        setError('Erreur lors de la suppression du client');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getSexStatusLabel = (status) => {
    const labels = {
      A91: 'Homme célibataire',
      A92: 'Femme célibataire',
      A93: 'Homme marié',
      A94: 'Femme mariée',
    };
    return labels[status] || status;
  };

  const getTelephoneLabel = (tel) => {
    return tel === 'A191' ? 'Oui' : 'Non';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BankRisk AI - Gestion des Clients
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {authService.getCurrentUser()}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Liste des Clients ({clients.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/clients/new')}
          >
            Nouveau Client
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nom</strong></TableCell>
                <TableCell><strong>Âge</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Téléphone</strong></TableCell>
                <TableCell><strong>Travailleur étranger</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      Aucun client trouvé. Cliquez sur "Nouveau Client" pour commencer.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.age_in_years} ans</TableCell>
                    <TableCell>
                      <Chip
                        label={getSexStatusLabel(client.sex_status)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{getTelephoneLabel(client.telephone)}</TableCell>
                    <TableCell>
                      <Chip
                        label={client.foreign_worker === 'A201' ? 'Oui' : 'Non'}
                        size="small"
                        color={client.foreign_worker === 'A201' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/clients/${client.id}`)}
                        title="Voir les détails"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/clients/${client.id}/edit`)}
                        title="Modifier"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(client.id)}
                        title="Supprimer"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ClientList;