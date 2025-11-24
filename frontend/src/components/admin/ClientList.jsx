// src/components/admin/ClientList.jsx (Corrigé)
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
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  ExitToApp,
  Search,
} from '@mui/icons-material';
import clientService from '../../services/clientService';
import authService from '../../services/authService';

const ClientList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      client.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.age?.toString().includes(searchTerm) ||
      client.sex?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.housing?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data);
      setFilteredClients(data);
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

  const getJobLabel = (job) => {
    const labels = {
      0: 'Chômeur',
      1: 'Non qualifié',
      2: 'Qualifié',
      3: 'Cadre',
    };
    return labels[job] || `Niveau ${job}`;
  };

  const getAccountLabel = (account) => {
    const labels = {
      'little': 'Peu',
      'moderate': 'Moyen',
      'quite rich': 'Assez riche',
      'rich': 'Riche',
      'NA': 'Non renseigné',
    };
    return labels[account] || account;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
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
            Clients German Credit Dataset ({filteredClients.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/clients/new')}
          >
            Nouveau Client
          </Button>
        </Box>

        {/* Barre de recherche */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher par email, âge, sexe, logement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Âge</strong></TableCell>
                <TableCell><strong>Sexe</strong></TableCell>
                <TableCell><strong>Emploi</strong></TableCell>
                <TableCell><strong>Logement</strong></TableCell>
                <TableCell><strong>Compte Épargne</strong></TableCell>
                <TableCell><strong>Compte Courant</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      {searchTerm ? 'Aucun client trouvé pour cette recherche.' : 'Aucun client trouvé.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {client.user_email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${client.age} ans`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.sex === 'male' ? 'Homme' : 'Femme'}
                        size="small"
                        color={client.sex === 'male' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getJobLabel(client.job)}
                        size="small"
                        color="default"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.housing === 'own' ? 'Propriétaire' : 
                               client.housing === 'rent' ? 'Locataire' : 'Gratuit'}
                        size="small"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getAccountLabel(client.saving_accounts)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getAccountLabel(client.checking_account)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/admin/clients/${client.id}`)}
                        title="Voir les détails"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/admin/clients/${client.id}/edit`)}
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