import { fetchDoctors } from "@/features/HomeSlices/doctorsSlice";
import { AppDispatch, RootState } from "@/lib/store";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Dynamically import DoctorCard to improve page performance
const DoctorCard = dynamic(() => import("./DoctorCard"));

const DoctorsWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(10, 0),
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976d2, #2196f3)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 700,
  fontSize: "3rem",
  marginBottom: theme.spacing(2),
}));

interface AllDoctorsProps {
  doctors: any[]; // Replace with appropriate type
}

const AllDoctors: React.FC<AllDoctorsProps> = ({ doctors }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { allDoctors, status, error } = useSelector(
    (state: RootState) => state.doctors
  );
  const [page, setPage] = useState(1);
  const doctorsPerPage = 4;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDoctors());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <Typography color="error">{error}</Typography>;
  }

  const indexOfLastDoctor = page * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = allDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const pageCount = Math.ceil(allDoctors.length / doctorsPerPage);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Head>
        <title>Our Doctors</title>
        <meta
          name="description"
          content="Browse our list of experienced doctors."
        />
      </Head>
      <DoctorsWrapper>
        <Container maxWidth="lg">
          <TitleWrapper>
            <GradientTitle variant="h2" align="center">
              Our Doctors
            </GradientTitle>
          </TitleWrapper>
          <Grid container spacing={4}>
            {currentDoctors.map((doctor) => (
              <Grid item key={doctor.id} xs={12} sm={6} md={3}>
                <DoctorCard
                  UserID={doctor.id}
                  FirstName={doctor.firstName}
                  LastName={doctor.lastName}
                  Speciality={doctor.speciality}
                  imageUrl={
                    doctor.imageUrl || "https://via.placeholder.com/150"
                  }
                  Bio={doctor.bio}
                  LocationLatitude={doctor.locationLatitude || 0}
                  LocationLongitude={doctor.locationLongitude || 0}
                  Email={doctor.email}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Container>
      </DoctorsWrapper>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const response = await fetch("https://api.example.com/doctors"); // Adjust your API call
//   const doctors = await response.json();

//   return {
//     props: {
//       doctors,
//     },
//   };
// };

export default AllDoctors;
