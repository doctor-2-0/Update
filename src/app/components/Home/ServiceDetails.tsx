import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Service } from '../../features/HomeSlices/selectedServiceSlice';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/system';




const HeroWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(5, 0),
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '2.5rem',
  marginBottom: theme.spacing(2),
}));

const ServiceDetails: React.FC = () => {
  const selectedService = useSelector<RootState, Service | null>(state => state.selectedService);

  if (!selectedService) {
    return <Typography>No service selected</Typography>;
  }

  return (
    <HeroWrapper>
      <Container maxWidth="md">
        <GradientTitle variant="h1" align="center">
          {selectedService.title}
        </GradientTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
  <img 
    src={selectedService.imageUrl} 
    alt={selectedService.title} 
    style={{ width: '80%', height: 'auto', maxHeight: '70vh', objectFit: 'cover' }} 
  />
</Box>
<Typography variant="body1" paragraph sx={{ maxWidth: '80%', margin: '0 auto' }}>
  {selectedService.description}
</Typography>
      </Container>
    </HeroWrapper>
  );
};

export default ServiceDetails;