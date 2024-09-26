import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <Paper sx={{ p: 2, backgroundColor: color, color: 'white' }}>
      <Typography variant="h6">{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
        <Typography variant="h4" component="span">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;