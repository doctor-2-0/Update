import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Grid, Typography, CircularProgress, Pagination } from '@mui/material';
import { styled } from '@mui/system';
import DoctorCard from './DoctorCard';
import { fetchDoctors } from '../../features/HomeSlices/doctorsSlice';
import { RootState, AppDispatch } from '../../store/store';

const DoctorsWrapper = styled(Box)(({ theme }) => ({
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

const AllDoctors: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allDoctors, status, error } = useSelector((state: RootState) => state.doctors);
  const [page, setPage] = useState(1);
  const doctorsPerPage = 4;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <CircularProgress />;
  }

  if (status === 'failed') {
    return <Typography color="error">{error}</Typography>;
  }

  const indexOfLastDoctor = page * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = allDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const pageCount = Math.ceil(allDoctors.length / doctorsPerPage);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <DoctorsWrapper>
      <Container maxWidth="lg">
        <TitleWrapper>
          <GradientTitle variant="h2" align="center">
            Our Doctors
          </GradientTitle>
        </TitleWrapper>
        <Grid container spacing={4}>
        {currentDoctors.map((doctor) => {
 
  return (
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
  );
})}

        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Box>
      </Container>
    </DoctorsWrapper>
  );
};

export default AllDoctors;