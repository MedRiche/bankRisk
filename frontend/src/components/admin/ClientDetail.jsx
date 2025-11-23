// src/components/clients/ClientDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import clientService from '../../services/clientService';

const ClientDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClientById(id);
      setClient(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement du client');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientService.deleteClient(id);
        navigate('/clients');
      } catch (err) {
        setError('Erreur lors de la suppression du client');
      }
    }
  };

  const getSexStatusLabel = (status) => {
    const labels = {
      A91: 'Homme célibataire',
      A92: 'Femme célibataire',
      A93: 'Homme marié/veuf',
      A94: 'Femme mariée/veuve',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!client) {
    return (
      <Container>
        <Alert severity="error">Client non trouvé</Alert>
      </Container>
    );
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/clients')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
            Détails du Client
          </Typography>
          <Button
            color="inherit"
            startIcon={<Edit />}
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            Modifier
          </Button>
          <Button
            color="inherit"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Informations Personnelles
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Nom complet
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {client.name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Âge
                  </Typography>
                  <Typography variant="body1">
                    {client.age_in_years} ans
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Statut
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={getSexStatusLabel(client.sex_status)}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Téléphone
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={client.telephone === 'A191' ? 'Oui' : 'Non'}
                      color={client.telephone === 'A191' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Travailleur étranger
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={client.foreign_worker === 'A201' ? 'Oui' : 'Non'}
                      color={client.foreign_worker === 'A201' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations financières */}
          {client.financial && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informations Financières
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Montant du crédit
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {client.financial.credit_amount?.toLocaleString()} €
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Durée (mois)
                    </Typography>
                    <Typography variant="body1">
                      {client.financial.duration_in_month}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Versement mensuel
                    </Typography>
                    <Typography variant="body1">
                      {client.financial.installment}%
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Compte courant
                    </Typography>
                    <Typography variant="body1">
                      {client.financial.checking_account_status}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Épargne/Obligations
                    </Typography>
                    <Typography variant="body1">
                      {client.financial.savings_account_bonds}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Informations d'emploi */}
          {client.employment && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informations d'Emploi
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Statut d'emploi
                    </Typography>
                    <Typography variant="body1">
                      {client.employment.employment_status}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Type de poste
                    </Typography>
                    <Typography variant="body1">
                      {client.employment.job_type}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Nombre de crédits existants
                    </Typography>
                    <Typography variant="body1">
                      {client.employment.existing_credits_no}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Informations de propriété */}
          {client.property && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Informations de Propriété
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Type de propriété
                    </Typography>
                    <Typography variant="body1">
                      {client.property.property_type}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Logement
                    </Typography>
                    <Typography variant="body1">
                      {client.property.housing}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Autres plans de versement
                    </Typography>
                    <Typography variant="body1">
                      {client.property.other_installment_plans}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Personnes à charge
                    </Typography>
                    <Typography variant="body1">
                      {client.property.liability_responsibles}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Applications */}
          {client.applications && client.applications.length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Demandes de Crédit
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {client.applications.map((app, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2">
                        <strong>Objectif:</strong> {app.purpose}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Historique de crédit:</strong> {app.credit_history}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(app.submission_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientDetail;