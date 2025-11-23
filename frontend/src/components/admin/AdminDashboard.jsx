// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  ExitToApp,
  TrendingUp,
  TrendingDown,
  Pending,
  CheckCircle,
  Cancel,
  Visibility,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import authService from '../../services/authService';
import clientService from '../../services/clientService';

const drawerWidth = 240;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState({
    totalClients: 0,
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  
  const [recentClients, setRecentClients] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Charger les statistiques depuis l'API
      const clients = await clientService.getAllClients();
      
      setRecentClients(clients.slice(0, 5));
      
      // Calculer les statistiques (à adapter selon votre API)
      setStats({
        totalClients: clients.length,
        totalApplications: 328,
        approved: 228,
        pending: 15,
        rejected: 85,
      });
    } catch (err) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    if (view === 'clients') {
      navigate('/admin/clients');
    } else if (view === 'analytics') {
      navigate('/admin/analytics');
    }
  };

  // Données pour les graphiques
  const monthlyData = [
    { month: 'Jan', approved: 45, rejected: 12, pending: 8 },
    { month: 'Fév', approved: 52, rejected: 15, pending: 10 },
    { month: 'Mar', approved: 48, rejected: 10, pending: 12 },
    { month: 'Avr', approved: 61, rejected: 18, pending: 9 },
    { month: 'Mai', approved: 55, rejected: 14, pending: 11 },
    { month: 'Juin', approved: 67, rejected: 16, pending: 13 },
  ];

  const riskDistribution = [
    { name: 'Risque Faible', value: 45, color: '#10b981' },
    { name: 'Risque Moyen', value: 35, color: '#f59e0b' },
    { name: 'Risque Élevé', value: 20, color: '#ef4444' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>BR</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              BankRisk
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin Panel
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      
      <List>
        <ListItem
          button
          selected={currentView === 'dashboard'}
          onClick={() => handleNavigation('dashboard')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          button
          selected={currentView === 'clients'}
          onClick={() => handleNavigation('clients')}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Clients" />
        </ListItem>

        <ListItem
          button
          selected={currentView === 'analytics'}
          onClick={() => handleNavigation('analytics')}
        >
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Analytiques" />
        </ListItem>
      </List>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Tableau de Bord Admin
          </Typography>

          <Typography variant="body2" sx={{ mr: 2 }}>
            {authService.getCurrentUser()}
          </Typography>

          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />

        <Container maxWidth="lg">
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* KPIs */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Demandes
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                        {stats.totalApplications}
                      </Typography>
                      <Chip
                        label="+12% ce mois"
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <TrendingUp sx={{ fontSize: 50, color: 'primary.main', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ bgcolor: '#e8f5e9' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Approuvées
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: 'success.main' }}>
                        {stats.approved}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        69.5% du total
                      </Typography>
                    </Box>
                    <CheckCircle sx={{ fontSize: 50, color: 'success.main', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ bgcolor: '#ffebee' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Rejetées
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: 'error.main' }}>
                        {stats.rejected}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        25.9% du total
                      </Typography>
                    </Box>
                    <Cancel sx={{ fontSize: 50, color: 'error.main', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ bgcolor: '#fff3cd' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        En Attente
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1, color: 'warning.main' }}>
                        {stats.pending}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        4.6% du total
                      </Typography>
                    </Box>
                    <Pending sx={{ fontSize: 50, color: 'warning.main', opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Graphiques */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Tendance Mensuelle */}
            <Grid item xs={12} lg={8}>
              <Card elevation={0}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Tendance Mensuelle
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Demandes approuvées, rejetées et en attente
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" fill="#10b981" name="Approuvées" />
                      <Bar dataKey="rejected" fill="#ef4444" name="Rejetées" />
                      <Bar dataKey="pending" fill="#f59e0b" name="En Attente" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Distribution des Risques */}
            <Grid item xs={12} lg={4}>
              <Card elevation={0}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Distribution des Risques
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Répartition par niveau de risque
                  </Typography>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Clients Récents */}
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Demandes de Crédit Récentes
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/clients')}
                >
                  Voir Tout
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Nom</strong></TableCell>
                      <TableCell><strong>Montant</strong></TableCell>
                      <TableCell><strong>Score de Risque</strong></TableCell>
                      <TableCell><strong>Statut</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell align="right"><strong>Action</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentClients.map((client) => (
                      <TableRow key={client.id} hover>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>60,000 €</TableCell>
                        <TableCell>
                          <Chip
                            icon={<TrendingDown />}
                            label="26%"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label="Approuvé" color="success" size="small" />
                        </TableCell>
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;