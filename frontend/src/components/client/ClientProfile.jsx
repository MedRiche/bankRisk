// src/components/client/ClientProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Edit,
  Person,
  Work,
  AccountBalance,
  Home,
} from '@mui/icons-material';
import authService from '../../services/authService';
import clientService from '../../services/clientService';

const ClientProfile = () => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profile, setProfile] = useState({
    // Informations personnelles
    name: '',
    sex_status: 'A91',
    age_in_years: '',
    telephone: 'A192',
    foreign_worker: 'A202',
    
    // Informations financières
    checking_account_status: 'A14',
    savings_account_bonds: 'A65',
    credit_amount: '',
    duration_in_month: '',
    installment: '',
    other_debtors: 'A103',
    
    // Informations d'emploi
    employment_status: 'A75',
    job_type: 'A173',
    existing_credits_no: 0,
    
    // Informations de propriété
    property_type: 'A124',
    housing: 'A153',
    other_installment_plans: 'A143',
    liability_responsibles: 1,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userEmail = authService.getCurrentUser();
      const clientData = await clientService.getClientByEmail(userEmail);
      
      if (clientData) {
        setProfile({
          ...profile,
          ...clientData,
          ...clientData.financial,
          ...clientData.employment,
          ...clientData.property,
        });
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Préparer les données pour l'API
      const clientData = {
        name: profile.name,
        sex_status: profile.sex_status,
        age_in_years: parseInt(profile.age_in_years),
        telephone: profile.telephone,
        foreign_worker: profile.foreign_worker,
      };

      const financialData = {
        checking_account_status: profile.checking_account_status,
        savings_account_bonds: profile.savings_account_bonds,
        credit_amount: parseFloat(profile.credit_amount),
        duration_in_month: parseInt(profile.duration_in_month),
        installment: parseInt(profile.installment),
        other_debtors: profile.other_debtors,
      };

      const employmentData = {
        employment_status: profile.employment_status,
        job_type: profile.job_type,
        existing_credits_no: parseInt(profile.existing_credits_no),
      };

      const propertyData = {
        property_type: profile.property_type,
        housing: profile.housing,
        other_installment_plans: profile.other_installment_plans,
        liability_responsibles: parseInt(profile.liability_responsibles),
      };

      // Appeler l'API pour sauvegarder
      await clientService.updateClientProfile({
        client: clientData,
        financial: financialData,
        employment: employmentData,
        property: propertyData,
      });

      setSuccess('Profil mis à jour avec succès !');
      setEditMode(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
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
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/client/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
            Mon Profil
          </Typography>
          {!editMode ? (
            <Button
              color="inherit"
              startIcon={<Edit />}
              onClick={() => setEditMode(true)}
            >
              Modifier
            </Button>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => setEditMode(false)}
                sx={{ mr: 1 }}
              >
                Annuler
              </Button>
              <Button
                color="inherit"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSave}
                disabled={saving}
              >
                Enregistrer
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Avatar et nom */}
        <Paper elevation={0} sx={{ p: 4, mb: 3, textAlign: 'center', borderRadius: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              margin: '0 auto',
              bgcolor: 'primary.main',
              fontSize: '2.5rem',
              mb: 2,
            }}
          >
            {profile.name?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {profile.name || 'Nom non défini'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {authService.getCurrentUser()}
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Informations Personnelles */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Informations Personnelles
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nom complet"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Statut"
                      name="sex_status"
                      value={profile.sex_status}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    >
                      <MenuItem value="A91">Homme célibataire</MenuItem>
                      <MenuItem value="A92">Femme célibataire</MenuItem>
                      <MenuItem value="A93">Homme marié/veuf</MenuItem>
                      <MenuItem value="A94">Femme mariée/veuve</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Âge"
                      name="age_in_years"
                      type="number"
                      value={profile.age_in_years}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      inputProps={{ min: 18, max: 100 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Téléphone"
                      name="telephone"
                      value={profile.telephone}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A191">Oui</MenuItem>
                      <MenuItem value="A192">Non</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Travailleur étranger"
                      name="foreign_worker"
                      value={profile.foreign_worker}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A201">Oui</MenuItem>
                      <MenuItem value="A202">Non</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations d'Emploi */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Work sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Informations d'Emploi
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Statut d'emploi"
                      name="employment_status"
                      value={profile.employment_status}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A71">Chômeur</MenuItem>
                      <MenuItem value="A72">{'< 1 an'}</MenuItem>
                      <MenuItem value="A73">1-4 ans</MenuItem>
                      <MenuItem value="A74">4-7 ans</MenuItem>
                      <MenuItem value="A75">{'>= 7 ans'}</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      select
                      label="Type de poste"
                      name="job_type"
                      value={profile.job_type}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A171">Non qualifié</MenuItem>
                      <MenuItem value="A172">Qualifié</MenuItem>
                      <MenuItem value="A173">Cadre</MenuItem>
                      <MenuItem value="A174">Indépendant</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Crédits existants"
                      name="existing_credits_no"
                      type="number"
                      value={profile.existing_credits_no}
                      onChange={handleChange}
                      disabled={!editMode}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations Financières */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AccountBalance sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Informations Financières
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Compte courant"
                      name="checking_account_status"
                      value={profile.checking_account_status}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A11">{'< 0 DM'}</MenuItem>
                      <MenuItem value="A12">0-200 DM</MenuItem>
                      <MenuItem value="A13">{'>= 200 DM'}</MenuItem>
                      <MenuItem value="A14">Pas de compte</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Épargne/Obligations"
                      name="savings_account_bonds"
                      value={profile.savings_account_bonds}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A61">{'< 100 DM'}</MenuItem>
                      <MenuItem value="A62">100-500 DM</MenuItem>
                      <MenuItem value="A63">500-1000 DM</MenuItem>
                      <MenuItem value="A64">{'>= 1000 DM'}</MenuItem>
                      <MenuItem value="A65">Inconnu</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Montant du crédit (€)"
                      name="credit_amount"
                      type="number"
                      value={profile.credit_amount}
                      onChange={handleChange}
                      disabled={!editMode}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Durée (mois)"
                      name="duration_in_month"
                      type="number"
                      value={profile.duration_in_month}
                      onChange={handleChange}
                      disabled={!editMode}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Versement (%)"
                      name="installment"
                      type="number"
                      value={profile.installment}
                      onChange={handleChange}
                      disabled={!editMode}
                      inputProps={{ min: 1, max: 4 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Autres débiteurs"
                      name="other_debtors"
                      value={profile.other_debtors}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A101">Aucun</MenuItem>
                      <MenuItem value="A102">Co-emprunteur</MenuItem>
                      <MenuItem value="A103">Garant</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations de Propriété */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Home sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Informations de Propriété
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Type de propriété"
                      name="property_type"
                      value={profile.property_type}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A121">Immobilier</MenuItem>
                      <MenuItem value="A122">Assurance vie</MenuItem>
                      <MenuItem value="A123">Voiture</MenuItem>
                      <MenuItem value="A124">Inconnu</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Logement"
                      name="housing"
                      value={profile.housing}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A151">Locataire</MenuItem>
                      <MenuItem value="A152">Propriétaire</MenuItem>
                      <MenuItem value="A153">Gratuit</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Autres plans de versement"
                      name="other_installment_plans"
                      value={profile.other_installment_plans}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="A141">Banque</MenuItem>
                      <MenuItem value="A142">Magasins</MenuItem>
                      <MenuItem value="A143">Aucun</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Personnes à charge"
                      name="liability_responsibles"
                      type="number"
                      value={profile.liability_responsibles}
                      onChange={handleChange}
                      disabled={!editMode}
                      inputProps={{ min: 1, max: 2 }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientProfile;