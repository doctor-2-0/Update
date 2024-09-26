import React from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, Typography, CardMedia, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setSelectedDoctor, SelectedDoctor } from '../../features/HomeSlices/selectedDoctorSlice';
import { styled } from '@mui/system';
import MapIcon from '@mui/icons-material/Map';
import { setSelectedDoctorLocation } from '../../features/userLocationSlice';
import { setShowMap } from '../../features/HomeSlices/mapSlice';

interface DoctorProps {
  UserID: number;
  FirstName: string;
  LastName: string;
  Speciality: string;
  Bio: string;
  imageUrl: string;
  LocationLatitude: number;
  LocationLongitude: number;
  Email: any;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: 400,
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

const DoctorCard: React.FC<DoctorProps> = ({ UserID, FirstName, LastName, Speciality, imageUrl, Bio, LocationLatitude, LocationLongitude, Email }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    const doctor: SelectedDoctor = {
      UserID,
      FirstName,
      LastName,
      Speciality,
      Bio,
      imageUrl,
      LocationLatitude,
      LocationLongitude,
      Email,
    };
    dispatch(setSelectedDoctor(doctor));
    navigate(`/doctor-details/${UserID}`);
  };

  
  const handleGPSClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Dispatching setSelectedDoctorLocation:', { latitude: LocationLatitude, longitude: LocationLongitude });
    dispatch(setSelectedDoctorLocation({ latitude: LocationLatitude, longitude: LocationLongitude }));
    dispatch(setShowMap(true));


    setTimeout(() => {
      const mapElement = document.getElementById('user-location-map');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <StyledCard onClick={handleClick}>
      <StyledCardMedia
        component="img"
        image={imageUrl}
        alt={`${FirstName} ${LastName}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {`${FirstName} ${LastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {Speciality}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
        <Button size="small" color="primary" variant="contained" sx={{ flexGrow: 1, mr: 1 }}>
          Book Appointment
        </Button>
        <Button size="small" color="secondary" variant="contained" onClick={handleGPSClick}>
          <MapIcon />
        </Button>
      </Box>
    </StyledCard>
  );
};

export default DoctorCard;