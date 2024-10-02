import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const SocialMedia: React.FC = () => {
  return (
    <Box mt={4} textAlign="center">
      <Typography variant="h5" gutterBottom>
        Connect With Us
      </Typography>
      <Box>
        <IconButton color="primary" aria-label="Facebook">
          <FacebookIcon />
        </IconButton>
        <IconButton color="primary" aria-label="Twitter">
          <TwitterIcon />
        </IconButton>
        <IconButton color="primary" aria-label="Instagram">
          <InstagramIcon />
        </IconButton>
        <IconButton color="primary" aria-label="LinkedIn">
          <LinkedInIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SocialMedia;