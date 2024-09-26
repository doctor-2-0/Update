import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Grid, Typography, CircularProgress } from '@mui/material';
import DoctorCard from './DoctorCard';

const SearchResults: React.FC = () => {
  const { searchedDoctors, status, error } = useSelector((state: RootState) => state.doctors);

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  if (searchedDoctors.length === 0) {
    return <Typography>No doctors found matching your criteria.</Typography>;
  }

  return (
    <Grid container spacing={4}>
     {searchedDoctors.map((doctor) => (
  <Grid item key={doctor.UserID} xs={12} sm={6} md={3}>
    <DoctorCard
      UserID={doctor.UserID}
      FirstName={doctor.FirstName}
      LastName={doctor.LastName}
      Speciality={doctor.Speciality}
      imageUrl={doctor.imageUrl || "https://via.placeholder.com/150"}
      Bio={doctor.Bio}
      LocationLatitude={doctor.LocationLatitude || 0}
      LocationLongitude={doctor.LocationLongitude || 0}
      Email={doctor.Email}
     
    />
  </Grid>
))}
    </Grid>
  );
};

export default SearchResults;