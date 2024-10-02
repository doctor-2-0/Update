import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';

interface TestimonialProps {
  name: string;
  testimonial: string;
  avatarUrl: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, testimonial, avatarUrl }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          "{testimonial}"
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Avatar src={avatarUrl} alt={name} sx={{ mr: 2 }} />
          <Typography variant="subtitle2">{name}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;