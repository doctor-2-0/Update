import React from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';

const CallToAction: React.FC = () => {
  return (
    <Box mt={4}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" paragraph>
            Get in touch or create an account.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Get Started
          </Button>
          <Button variant="outlined" color="primary">
            Talk to Sales
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <img src="/path-to-cta-image.jpg" alt="Call to Action" style={{ width: '100%', height: 'auto' }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallToAction;