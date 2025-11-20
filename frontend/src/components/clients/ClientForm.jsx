// src/components/clients/ClientForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import clientService from '../../services/clientService';

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    sex_status: 'A91',
    age_in_years: '',
    telephone: 'A192',
    foreign_worker: 'A202',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClientById(id);
      setFormData({
        name: data.name || '',
        sex_status: data.sex_status || 'A91',
        age_in_years: data.age_in_years || '',
        telephone: data.telephone || 'A192',
        foreign_worker: data.foreign_worker || 'A202',
      });
    } catch (err) {
      setError('Erreur lors du chargement du client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await clientService.updateClient(id, formData);
      } else {
        await clientService.createClient(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
    } catch (err) {
      setError(
        err.name?.[0] ||
        err.age_in_years?.[0] ||
        'Erreur lors de l\'enregistrement du client'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
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
          <Typography variant="h6" sx={{ ml: 2 }}>
            {isEditMode ? 'Modifier le Client' : 'Nouveau Client'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Client {isEditMode ? 'modifié' : 'créé'} avec succès !
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Statut sexe"
                  name="sex_status"
                  value={formData.sex_status}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="A91">Homme célibataire</MenuItem>
                  <MenuItem value="A92">Femme célibataire</MenuItem>
                  <MenuItem value="A93">Homme marié/veuf</MenuItem>
                  <MenuItem value="A94">Femme mariée/veuve</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Âge"
                  name="age_in_years"
                  type="number"
                  value={formData.age_in_years}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 18, max: 100 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Téléphone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="A191">Oui</MenuItem>
                  <MenuItem value="A192">Non</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Travailleur étranger"
                  name="foreign_worker"
                  value={formData.foreign_worker}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="A201">Oui</MenuItem>
                  <MenuItem value="A202">Non</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/clients')}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    disabled={loading || success}
                  >
                    {isEditMode ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ClientForm;