// src/components/client/CreditApplication.jsx
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
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  Send,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import clientService from '../../services/clientService';
import authService from '../../services/authService';

const steps = ['Informations du crédit', 'Vérification du profil', 'Confirmation'];

const CreditApplication = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState({
    // Informations du crédit
    credit_amount: '',
    duration: '',
    purpose: 'car',
    
    // Informations du profil (si manquant)
    age: '',
    sex: 'male',
    job: 2,
    housing: 'rent',
    saving_accounts: 'NA',
    checking_account: 'NA',
  });

  useEffect(() => {
    checkUserProfile();
  }, []);

  const checkUserProfile = async () => {
    try {
      setCheckingProfile(true);
      const userEmail = authService.getCurrentUser();
      const client = await clientService.getClientByEmail(userEmail);
      
      if (client) {
        setHasProfile(true);
        setFormData(prev => ({
          ...prev,
          age: client.age,
          sex: client.sex,
          job: client.job,
          housing: client.housing,
          saving_accounts: client.saving_accounts,
          checking_account: client.checking_account,
        }));
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleNext = () => {
    // Validation selon l'étape
    if (activeStep === 0) {
      if (!formData.credit_amount || !formData.duration) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      if (parseFloat(formData.credit_amount) < 250) {
        setError('Le montant minimum est de 250 €');
        return;
      }
      if (parseInt(formData.duration) < 6 || parseInt(formData.duration) > 72) {
        setError('La durée doit être entre 6 et 72 mois');
        return;
      }
    }
    
    if (activeStep === 1 && !hasProfile) {
      if (!formData.age) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }

    setActiveStep((prevStep) => prevStep + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const applicationData = {
        credit_amount: parseFloat(formData.credit_amount),
        duration: parseInt(formData.duration),
        purpose: formData.purpose,
        age: parseInt(formData.age),
        sex: formData.sex,
        job: parseInt(formData.job),
        housing: formData.housing,
        saving_accounts: formData.saving_accounts,
        checking_account: formData.checking_account,
      };

      await clientService.submitCreditApplication(applicationData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la soumission de la demande');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Détails de votre demande de crédit
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Montant souhaité (€)"
                name="credit_amount"
                type="number"
                value={formData.credit_amount}
                onChange={handleChange}
                required
                inputProps={{ min: 250, step: 100 }}
                helperText="Montant minimum : 250 €"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Durée (mois)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
                inputProps={{ min: 6, max: 72 }}
                helperText="Entre 6 et 72 mois"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Objectif du crédit"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
              >
                <MenuItem value="car">🚗 Voiture</MenuItem>
                <MenuItem value="radio/TV">📺 Radio/TV</MenuItem>
                <MenuItem value="furniture/equipment">🛋️ Meubles/Équipement</MenuItem>
                <MenuItem value="education">🎓 Éducation</MenuItem>
                <MenuItem value="business">💼 Affaires</MenuItem>
                <MenuItem value="domestic appliances">🏠 Électroménager</MenuItem>
                <MenuItem value="repairs">🔧 Réparations</MenuItem>
                <MenuItem value="vacation/others">✈️ Vacances/Autres</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={0} sx={{ bgcolor: '#e3f2fd', border: 'none' }}>
                <CardContent>
                  <Typography variant="body2" color="primary">
                    💡 <strong>Mensualité estimée:</strong>{' '}
                    {formData.credit_amount && formData.duration
                      ? `${(parseFloat(formData.credit_amount) / parseInt(formData.duration)).toFixed(2)} €`
                      : '- €'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1:
        if (checkingProfile) {
          return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Vérification de votre profil...
              </Typography>
            </Box>
          );
        }

        if (hasProfile) {
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="success" icon={<CheckCircle />}>
                  <Typography variant="h6" gutterBottom>
                    Votre profil est complet !
                  </Typography>
                  <Typography variant="body2">
                    Nous avons toutes les informations nécessaires pour traiter votre demande.
                  </Typography>
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Card elevation={0}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Récapitulatif de votre profil
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Âge</Typography>
                        <Typography variant="body2" fontWeight="bold">{formData.age} ans</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Sexe</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formData.sex === 'male' ? 'Homme' : 'Femme'}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Emploi</Typography>
                        <Typography variant="body2" fontWeight="bold">Niveau {formData.job}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Logement</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {formData.housing === 'own' ? 'Propriétaire' : formData.housing === 'rent' ? 'Locataire' : 'Gratuit'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    Si vos informations ont changé, vous pouvez les mettre à jour dans votre profil.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          );
        }

        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning" icon={<Warning />}>
                <Typography variant="h6" gutterBottom>
                  Complétez votre profil
                </Typography>
                <Typography variant="body2">
                  Nous avons besoin de quelques informations supplémentaires pour traiter votre demande.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Âge"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                inputProps={{ min: 18, max: 100 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Sexe"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <MenuItem value="male">Homme</MenuItem>
                <MenuItem value="female">Femme</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Niveau d'emploi"
                name="job"
                value={formData.job}
                onChange={handleChange}
                required
              >
                <MenuItem value={0}>0 - Chômeur</MenuItem>
                <MenuItem value={1}>1 - Non qualifié</MenuItem>
                <MenuItem value={2}>2 - Employé qualifié</MenuItem>
                <MenuItem value={3}>3 - Cadre</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Type de logement"
                name="housing"
                value={formData.housing}
                onChange={handleChange}
                required
              >
                <MenuItem value="own">Propriétaire</MenuItem>
                <MenuItem value="rent">Locataire</MenuItem>
                <MenuItem value="free">Gratuit</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Compte épargne"
                name="saving_accounts"
                value={formData.saving_accounts}
                onChange={handleChange}
              >
                <MenuItem value="NA">Non renseigné</MenuItem>
                <MenuItem value="little">Peu</MenuItem>
                <MenuItem value="moderate">Moyen</MenuItem>
                <MenuItem value="quite rich">Assez riche</MenuItem>
                <MenuItem value="rich">Riche</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Compte courant"
                name="checking_account"
                value={formData.checking_account}
                onChange={handleChange}
              >
                <MenuItem value="NA">Non renseigné</MenuItem>
                <MenuItem value="little">Peu</MenuItem>
                <MenuItem value="moderate">Moyen</MenuItem>
                <MenuItem value="rich">Riche</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );

      case 2:
        const monthlyPayment = formData.credit_amount && formData.duration
          ? (parseFloat(formData.credit_amount) / parseInt(formData.duration)).toFixed(2)
          : 0;

        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Confirmation de votre demande
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={0} sx={{ border: '2px solid', borderColor: 'primary.main' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Montant demandé
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                        {parseFloat(formData.credit_amount).toLocaleString()} €
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Durée
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {formData.duration} mois
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Objectif
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {formData.purpose}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Mensualité estimée
                      </Typography>
                      <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                        ~{monthlyPayment} €
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="body2">
                  ⚠️ En soumettant cette demande, vous acceptez que vos informations soient analysées par notre système d'évaluation de crédit basé sur l'IA. Vous recevrez une réponse sous 24-48 heures.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (success) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Demande soumise avec succès !
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Votre demande de crédit est en cours d'analyse. Vous recevrez une notification dès que nous aurons terminé l'évaluation.
          </Typography>
          <CircularProgress size={30} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Redirection vers le dashboard...
          </Typography>
        </Paper>
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
          <Typography variant="h6" sx={{ ml: 2 }}>
            Demande de Crédit
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Retour
            </Button>

            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                  size="large"
                >
                  Soumettre la demande
                </Button>
              ) : (
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={checkingProfile}
                  size="large"
                >
                  Suivant
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreditApplication;