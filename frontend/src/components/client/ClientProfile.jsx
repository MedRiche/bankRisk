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
  const [clientId, setClientId] = useState(null);

  const [profile, setProfile] = useState({
    age: '',
    sex: 'male',
    job: 2,
    housing: 'rent',
    saving_accounts: 'NA',
    checking_account: 'NA',
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
          age: clientData.age || '',
          sex: clientData.sex || 'male',
          job: clientData.job || 2,
          housing: clientData.housing || 'rent',
          saving_accounts: clientData.saving_accounts || 'NA',
          checking_account: clientData.checking_account || 'NA',
        });
        setClientId(clientData.id);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement du profil');
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
      
      const profileData = {
        user_email: authService.getCurrentUser(),
        age: parseInt(profile.age),
        sex: profile.sex,
        job: parseInt(profile.job),
        housing: profile.housing,
        saving_accounts: profile.saving_accounts,
        checking_account: profile.checking_account,
      };

      if (clientId) {
        await clientService.updateClient(clientId, profileData);
      } else {
        const newClient = await clientService.createClient(profileData);
        setClientId(newClient.id);
      }

      setSuccess('Profil mis à jour avec succès !');
      setEditMode(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const getJobLabel = (job) => {
    const labels = {
      0: 'Chômeur / Non qualifié',
      1: 'Non qualifié résident',
      2: 'Employé qualifié / Fonctionnaire',
      3: 'Cadre / Hautement qualifié',
    };
    return labels[job] || job;
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
              bgcolor: profile.sex === 'male' ? 'primary.main' : 'secondary.main',
              fontSize: '2.5rem',
              mb: 2,
            }}
          >
            {authService.getCurrentUser()?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {authService.getCurrentUserFullName()}
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
                      label="Âge"
                      name="age"
                      type="number"
                      value={profile.age}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                      inputProps={{ min: 18, max: 100 }}
                      helperText="Entre 18 et 100 ans"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Sexe"
                      name="sex"
                      value={profile.sex}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    >
                      <MenuItem value="male">Homme</MenuItem>
                      <MenuItem value="female">Femme</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations Professionnelles */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Work sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Informations Professionnelles
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Niveau d'emploi"
                      name="job"
                      value={profile.job}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    >
                      <MenuItem value={0}>0 - Chômeur / Non qualifié non-résident</MenuItem>
                      <MenuItem value={1}>1 - Non qualifié résident</MenuItem>
                      <MenuItem value={2}>2 - Employé qualifié / Fonctionnaire</MenuItem>
                      <MenuItem value={3}>3 - Cadre / Hautement qualifié</MenuItem>
                    </TextField>
                  </Grid>

                  {!editMode && (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        <Typography variant="body2">
                          <strong>Votre niveau :</strong> {getJobLabel(profile.job)}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations de Logement */}
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Home sx={{ mr: 1, color: 'warning.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Informations de Logement
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Type de logement"
                      name="housing"
                      value={profile.housing}
                      onChange={handleChange}
                      disabled={!editMode}
                      required
                    >
                      <MenuItem value="own">Propriétaire</MenuItem>
                      <MenuItem value="rent">Locataire</MenuItem>
                      <MenuItem value="free">Gratuit (famille/amis)</MenuItem>
                    </TextField>
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
                      label="Compte épargne"
                      name="saving_accounts"
                      value={profile.saving_accounts}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="NA">Non renseigné</MenuItem>
                      <MenuItem value="little">Peu (100 DM)</MenuItem>
                      <MenuItem value="moderate">Moyen (100-500 DM)</MenuItem>
                      <MenuItem value="quite rich">Assez riche (500-1000 DM)</MenuItem>
                      <MenuItem value="rich">Riche ( 1000 DM)</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Compte courant"
                      name="checking_account"
                      value={profile.checking_account}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="NA">Non renseigné</MenuItem>
                      <MenuItem value="little">Peu ( 200 DM)</MenuItem>
                      <MenuItem value="moderate">Moyen (200-1000 DM)</MenuItem>
                      <MenuItem value="rich">Riche (1000 DM)</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Conseils */}
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2">
                💡 <strong>Conseil :</strong> Un profil complet et à jour améliore vos chances d'obtenir un crédit. 
                Les comptes épargne et courant bien garnis sont des atouts pour votre demande.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ClientProfile;