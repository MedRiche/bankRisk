// src/components/client/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  AccountCircle,
  ExitToApp,
  AddCard,
  Assessment,
  CheckCircle,
  Pending,
  Cancel,
} from '@mui/icons-material';
import authService from '../../services/authService';
import clientService from '../../services/clientService';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userEmail = authService.getCurrentUser();
      setUser({ email: userEmail });
      
      // Charger les demandes de crédit de l'utilisateur
      // À adapter selon votre API
      const clientData = await clientService.getClientByEmail(userEmail);
      if (clientData) {
        setApplications(clientData.applications || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé':
        return 'success';
      case 'En attente':
        return 'warning';
      case 'Rejeté':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approuvé':
        return <CheckCircle />;
      case 'En attente':
        return <Pending />;
      case 'Rejeté':
        return <Cancel />;
      default:
        return null;
    }
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
      {/* En-tête */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
              BankRisk
            </Typography>
            <Chip label="Client" size="small" color="secondary" />
          </Box>
          
          <Button
            color="inherit"
            startIcon={<AccountCircle />}
            onClick={() => navigate('/client/profile')}
            sx={{ mr: 2 }}
          >
            Mon Profil
          </Button>
          
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Bannière de bienvenue */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Bienvenue sur BankRisk AI
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {user?.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Système Intelligent d'Évaluation de Crédit
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Actions principales */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate('/client/apply-credit')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <AddCard sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Demander un Crédit
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Soumettez une nouvelle demande de crédit et obtenez une évaluation rapide
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 3 }}
                  fullWidth
                >
                  Nouvelle Demande
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate('/client/profile')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <AccountCircle sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Mon Profil
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gérez vos informations personnelles et consultez votre historique
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ mt: 3 }}
                  fullWidth
                >
                  Voir le Profil
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Mes demandes de crédit */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Assessment sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Mes Demandes de Crédit
            </Typography>
          </Box>

          {applications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <AddCard sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune demande de crédit
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Vous n'avez pas encore soumis de demande de crédit
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCard />}
                onClick={() => navigate('/client/apply-credit')}
              >
                Faire une Demande
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {applications.map((app, index) => (
                <Grid item xs={12} key={index}>
                  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Date de demande
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {new Date(app.submission_date).toLocaleDateString('fr-FR')}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Montant
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {app.credit_amount?.toLocaleString()} €
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={3}>
                          <Typography variant="caption" color="text.secondary">
                            Durée
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {app.duration_in_month} mois
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} sm={3}>
                          <Chip
                            icon={getStatusIcon(app.status)}
                            label={app.status || 'En attente'}
                            color={getStatusColor(app.status)}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Informations utiles */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ bgcolor: '#e3f2fd', border: 'none' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                  Évaluation Rapide
                </Typography>
                <Typography variant="body2">
                  Notre IA analyse votre demande en temps réel pour une réponse rapide et précise.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ bgcolor: '#f3e5f5', border: 'none' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="secondary" sx={{ fontWeight: 'bold' }}>
                  Sécurisé
                </Typography>
                <Typography variant="body2">
                  Vos données sont protégées avec les meilleurs standards de sécurité bancaire.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ bgcolor: '#e8f5e9', border: 'none' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="success.main" sx={{ fontWeight: 'bold' }}>
                  Transparent
                </Typography>
                <Typography variant="body2">
                  Comprenez facilement les critères d'évaluation de votre demande de crédit.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientDashboard;