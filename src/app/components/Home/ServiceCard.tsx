import React from 'react';
import { Card, CardContent, Typography, CardMedia, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedService } from '../../features/HomeSlices/selectedServiceSlice';
import { styled } from '@mui/system';

interface ServiceProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: 450,
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 250,
  objectFit: 'cover',
}) as typeof CardMedia;

const ServiceCard: React.FC<ServiceProps> = ({ id, title, description, imageUrl }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(setSelectedService({ id, title, description, imageUrl }));
    navigate('/service-details');
  };

  return (
    <StyledCard onClick={handleClick}>
      <StyledCardMedia
        component="img"
        image={imageUrl}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button size="small" color="primary" variant="contained" fullWidth>
          Learn More
        </Button>
      </Box>
    </StyledCard>
  );
};

export default ServiceCard;