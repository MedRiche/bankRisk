// src/components/client/CreditApplication.jsx
import React, { useState } from 'react';
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
} from '@mui/material';
import {
  ArrowBack,
  Send,
  CheckCircle,
} from '@mui/icons-material';
import clientService from '../../services/clientService';

const steps = ['Informations de base', 'Détails financiers', 'Confirmation'];

const Analytics = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Informations de base
    purpose: 'A40',
    credit_history: 'A30',
    credit_amount: '',
    duration_in_month: '',
    
    // Détails financiers
    checking_account_status: 'A14',
    savings_account_bonds: 'A65',
    installment: '',
    other_debtors: 'A103',
    
    // Informations complémentaires
    property_type: 'A124',
    housing: 'A153',
    employment_status: 'A75',
    job_type: 'A173',
  });

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
      if (!formData.credit_amount || !formData.duration_in_month) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }
      if (parseFloat(formData.credit_amount) < 1000) {
        setError('Le montant minimum est de 1000 €');
        return;
      }
    }
    
    if (activeStep === 1) {
      if (!formData.installment) {
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

      // Préparer les données pour l'API
      const applicationData = {
        purpose: formData.purpose,
        credit_history: formData.credit_history,
        credit_amount: parseFloat(formData.credit_amount),
        duration_in_month: parseInt(formData.duration_in_month),
        checking_account_status: formData.checking_account_status,
        savings_account_bonds: formData.savings_account_bonds,
        installment: parseInt(formData.installment),
        other_debtors: formData.other_debtors,
        property_type: formData.property_type,
        housing: formData.housing,
        employment_status: formData.employment_status,
        job_type: formData.job_type,
      };

      await clientService.submitCreditApplication(applicationData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/client/dashboard');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la soumission de la demande');
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
                Informations sur votre demande
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Objectif du crédit"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
              >
                <MenuItem value="A40">Voiture (neuve)</MenuItem>
                <MenuItem value="A41">Voiture (occasion)</MenuItem>
                <MenuItem value="A42">Meubles/Équipement</MenuItem>
                <MenuItem value="A43">Radio/Télévision</MenuItem>
                <MenuItem value="A44">Électroménager</MenuItem>
                <MenuItem value="A45">Réparations</MenuItem>
                <MenuItem value="A46">Éducation</MenuItem>
                <MenuItem value="A47">Formation</MenuItem>
                <MenuItem value="A48">Affaires</MenuItem>
                <MenuItem value="A49">Autres</MenuItem>
                <MenuItem value="A410">Reconversion</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Historique de crédit"
                name="credit_history"
                value={formData.credit_history}
                onChange={handleChange}
                required
              >
                <MenuItem value="A30">Aucun crédit</MenuItem>
                <MenuItem value="A31">Tous payés</MenuItem>
                <MenuItem value="A32">En cours (banque)</MenuItem>
                <MenuItem value="A33">Retards (banque)</MenuItem>
                <MenuItem value="A34">Compte critique</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Montant demandé (€)"
                name="credit_amount"
                type="number"
                value={formData.credit_amount}
                onChange={handleChange}
                required
                inputProps={{ min: 1000, step: 100 }}
                helperText="Montant minimum : 1000 €"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Durée souhaitée (mois)"
                name="duration_in_month"
                type="number"
                value={formData.duration_in_month}
                onChange={handleChange}
                required
                inputProps={{ min: 6, max: 72 }}
                helperText="Entre 6 et 72 mois"
              />
            </Grid>

            <Grid item xs={12}>
              <Card elevation={0} sx={{ bgcolor: '#e3f2fd', border: 'none' }}>
                <CardContent>
                  <Typography variant="body2" color="primary">
                    💡 <strong>Astuce:</strong> Une durée plus longue réduit vos mensualités mais augmente le coût total du crédit.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Détails financiers
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Statut du compte courant"
                name="checking_account_status"
                value={formData.checking_account_status}
                onChange={handleChange}
                required
              >
                <MenuItem value="A11">Négatif</MenuItem>
                <MenuItem value="A12">0-200 DM</MenuItem>
                <MenuItem value="A13">≥ 200 DM</MenuItem>
                <MenuItem value="A14">Pas de compte</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Épargne/Obligations"
                name="savings_account_bonds"
                value={formData.savings_account_bonds}
                onChange={handleChange}
                required
              >
                <MenuItem value="A61">{'< 100 DM'}</MenuItem>
                <MenuItem value="A62">100-500 DM</MenuItem>
                <MenuItem value="A63">500-1000 DM</MenuItem>
                <MenuItem value="A64">≥ 1000 DM</MenuItem>
                <MenuItem value="A65">Inconnu</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="% de revenu pour remboursement"
                name="installment"
                value={formData.installment}
                onChange={handleChange}
                required
                helperText="Pourcentage de votre revenu disponible"
              >
                <MenuItem value="1">{'< 10%'}</MenuItem>
                <MenuItem value="2">10-20%</MenuItem>
                <MenuItem value="3">20-30%</MenuItem>
                <MenuItem value="4">≥ 30%</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Autres débiteurs/Garants"
                name="other_debtors"
                value={formData.other_debtors}
                onChange={handleChange}
                required
              >
                <MenuItem value="A101">Aucun</MenuItem>
                <MenuItem value="A102">Co-emprunteur</MenuItem>
                <MenuItem value="A103">Garant</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Type de propriété"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                required
              >
                <MenuItem value="A121">Immobilier</MenuItem>
                <MenuItem value="A122">Assurance vie</MenuItem>
                <MenuItem value="A123">Voiture</MenuItem>
                <MenuItem value="A124">Inconnu/Aucun</MenuItem>
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
                <MenuItem value="A151">Locataire</MenuItem>
                <MenuItem value="A152">Propriétaire</MenuItem>
                <MenuItem value="A153">Gratuit</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Statut d'emploi"
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                required
              >
                <MenuItem value="A71">Chômeur</MenuItem>
                <MenuItem value="A72">{'< 1 an'}</MenuItem>
                <MenuItem value="A73">1-4 ans</MenuItem>
                <MenuItem value="A74">4-7 ans</MenuItem>
                <MenuItem value="A75">≥ 7 ans</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Type de poste"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                required
              >
                <MenuItem value="A171">Non qualifié/Résident</MenuItem>
                <MenuItem value="A172">Qualifié</MenuItem>
                <MenuItem value="A173">Cadre/Hautement qualifié</MenuItem>
                <MenuItem value="A174">Indépendant</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Récapitulatif de votre demande
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
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {parseFloat(formData.credit_amount).toLocaleString()} €
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Durée
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formData.duration_in_month} mois
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Objectif
                      </Typography>
                      <Typography variant="body1">
                        {getPurposeLabel(formData.purpose)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Mensualité estimée
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        ~{(parseFloat(formData.credit_amount) / parseInt(formData.duration_in_month)).toFixed(2)} €
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={0} sx={{ bgcolor: '#fff3cd', border: 'none' }}>
                <CardContent>
                  <Typography variant="body2">
                    ⚠️ En soumettant cette demande, vous acceptez que vos informations soient analysées par notre système d'évaluation de crédit basé sur l'IA. Vous recevrez une réponse sous 24-48 heures.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  const getPurposeLabel = (code) => {
    const labels = {
      A40: 'Voiture (neuve)',
      A41: 'Voiture (occasion)',
      A42: 'Meubles/Équipement',
      A43: 'Radio/Télévision',
      A44: 'Électroménager',
      A45: 'Réparations',
      A46: 'Éducation',
      A47: 'Formation',
      A48: 'Affaires',
      A49: 'Autres',
      A410: 'Reconversion',
    };
    return labels[code] || code;
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
                >
                  Soumettre
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
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

export default Analytics;