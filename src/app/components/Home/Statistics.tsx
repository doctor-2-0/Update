import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StatisticsWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
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

const StatItem = styled(Box)(({ theme }) => ({
  textAlign: 'center',
}));

const GradientText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
}));

const Statistics: React.FC = () => {
  return (
    <StatisticsWrapper>
      <Container maxWidth="lg">
        <TitleWrapper>
          <GradientTitle variant="h3" align="center">
            Our Results in Numbers
          </GradientTitle>
        </TitleWrapper>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <StatItem>
              <GradientText variant="h3">5000+</GradientText>
              <Typography variant="subtitle1" fontWeight={500}>Patients Served</Typography>
            </StatItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatItem>
              <GradientText variant="h3">200+</GradientText>
              <Typography variant="subtitle1" fontWeight={500}>Doctors</Typography>
            </StatItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatItem>
              <GradientText variant="h3">50+</GradientText>
              <Typography variant="subtitle1" fontWeight={500}>Specialties</Typography>
            </StatItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatItem>
              <GradientText variant="h3">98%</GradientText>
              <Typography variant="subtitle1" fontWeight={500}>Satisfaction Rate</Typography>
            </StatItem>
          </Grid>
        </Grid>
      </Container>
    </StatisticsWrapper>
  );
};

export default Statistics;