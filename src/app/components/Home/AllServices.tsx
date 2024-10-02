import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import ServiceCard from './ServiceCard';

const ServicesWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(10, 0),
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
}));

const AllServices: React.FC = () => {
  const services = [
    { id: '1', title: 'General Checkup', description: 'Comprehensive health examination', imageUrl: 'https://d.newsweek.com/en/full/1570341/fe-tophospitals-01.jpg' },
    { id: '2', title: 'Specialist Consultation', description: 'Expert advice from specialists', imageUrl: 'https://media.istockphoto.com/id/1404179486/photo/anesthetist-working-in-operating-theatre-wearing-protecive-gear-checking-monitors-while.jpg?s=612x612&w=0&k=20&c=gecZ0b-nDIuMOvRIt8Qyam-eSx6RBdUzn5yDh0nNEvM=' },
    { id: '3', title: 'Lab Tests', description: 'Wide range of laboratory tests', imageUrl: 'https://alamhospital.in/wp-content/uploads/2022/01/Prevea-Internal-Medicine-Focused-on-Wellness.jpg' },
    { id: '4', title: 'Vaccinations', description: 'Immunization services for all ages', imageUrl: 'https://media.istockphoto.com/id/1437830105/photo/cropped-shot-of-a-female-nurse-hold-her-senior-patients-hand-giving-support-doctor-helping.jpg?s=612x612&w=0&k=20&c=oKR-00at4oXr4tY5IxzqsswaLaaPsPRkdw2MJbYHWgA=' },
  ];


  return (
    <ServicesWrapper>
      <Container maxWidth="lg">
        <TitleWrapper>
          <GradientTitle variant="h2" align="center">
            Our Services
          </GradientTitle>
        </TitleWrapper>
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <ServiceCard id={service.id} title={service.title} description={service.description} imageUrl={service.imageUrl} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ServicesWrapper>
  );
};

export default AllServices;