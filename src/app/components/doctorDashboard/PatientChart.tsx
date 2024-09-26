import React from 'react';
import { Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Male', value: 60 },
  { name: 'Female', value: 35 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const PatientChart: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Patient Gender Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        {data.map((entry, index) => (
          <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', mx: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: COLORS[index % COLORS.length],
                mr: 1,
              }}
            />
            <Typography variant="body2">{entry.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PatientChart;
