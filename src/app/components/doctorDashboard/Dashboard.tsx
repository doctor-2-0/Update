import React, { useEffect } from 'react';
import { Grid, Typography, Paper, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { login } from '../../features/authSlice';
import { fetchAppointmentsByUserId } from '../../features/appointmentSlice';
import StatCard from './StatCard';
import AppointmentList from './AppointmentList';
import PatientChart from './PatientChart';
import RecentPatients from './RecentPatients';
import Sidebar from './Sidebar'; // Import the Sidebar component

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, isAuthenticated } = useSelector((state: RootState) => state.Auth);
  const { appointments, loadingApp, errorApp } = useSelector((state: RootState) => state.appointments);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated && !loading) {
      dispatch(login({ token }))
        .unwrap()
        .then(() => {
          dispatch(fetchAppointmentsByUserId());
        })
        .catch(console.error);
    } else if (isAuthenticated) {
      dispatch(fetchAppointmentsByUserId());
    }
  }, [dispatch, isAuthenticated, loading]);

  const getWelcomeMessage = () => {
    if (loading) return 'Loading...';
    if (!isAuthenticated || !user) return 'Welcome, Doctor';
    
    const doctorName = user.LastName || 'Doctor';
    return `Welcome, Dr. ${doctorName}`;
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <Sidebar /> {/* Render the Sidebar on the left */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {getWelcomeMessage()}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Have a nice day at great work!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Appointments" value={appointments.length.toString()} color="#8e44ad" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Patients" value="N/A" color="#e74c3c" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Clinic Consulting" value="N/A" color="#f39c12" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Video Consulting" value="N/A" color="#3498db" />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              {loadingApp ? (
                <Typography>Loading appointments...</Typography>
              ) : errorApp ? (
                <Typography color="error">{errorApp}</Typography>
              ) : (
                <AppointmentList appointments={appointments} />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <PatientChart />
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <RecentPatients />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;