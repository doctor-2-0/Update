import React from 'react';
import { Box, Grid, Typography, Button, Container } from '@mui/material';

const HeroSection: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: '#f0f8ff', py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
              Providing Quality Healthcare For A Brighter And Healthy Future
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#666', mb: 4 }}>
              Find a doctor and book an appointment in minutes. Join thousands of satisfied patients who found their perfect healthcare match.
            </Typography>
            <Box>
              <Button variant="contained" color="primary" size="large" sx={{ mr: 2, borderRadius: 50, px: 4 }}>
                Book Appointment
              </Button>
              <Button variant="outlined" color="primary" size="large" sx={{ borderRadius: 50, px: 4 }}>
                Watch Video
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <img src="https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1726876800&semt=ais_hybrid" alt="Doctor" style={{ width: '100%', height: 'auto' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;