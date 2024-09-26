import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById, updateDoctorProfile } from '../../features/doctorSlice';
import { RootState, AppDispatch } from '../../store/store';
import { jwtDecode } from 'jwt-decode';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import Rating from '@mui/material/Rating';

// Styled Components
import { Theme } from '@mui/material/styles';

const ProfileAvatar = styled(Avatar)(({ theme }: { theme: Theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: 'auto',
  border: `4px solid ${theme.palette.primary.main}`,
}));

const ProfileCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  boxShadow: theme.shadows[4],
}));

const ProfileSection = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const TabSection = styled(Box)(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const DoctorProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { doctor, loading, error } = useSelector((state: RootState) => state.doctor);

  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = React.useState(3);

  // Local form state for profile fields
  const [profileData, setProfileData] = useState({
    FirstName: '',
    LastName: '',
    Speciality: '',
    MeetingPrice: 0,
    Bio: '',
  });

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.UserID; // Assuming the UserID is stored as 'id' in the token payload
    }
    return null;
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      dispatch(fetchDoctorById(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (doctor) {
      setProfileData({
        FirstName: doctor.FirstName,
        LastName: doctor.LastName,
        Speciality: doctor.Speciality,
        MeetingPrice: parseFloat(doctor.MeetingPrice.toString()),
        Bio: doctor.Bio,
      });
    }
  }, [doctor]);



const ProfileAvatar = styled(Avatar)({
  width: 160,
  height: 160,
  margin: 'auto',
  border: '4px solid #3f51b5',
});

const ProfileCard = styled(Card)({
  padding: 16,
  textAlign: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
});

const ProfileSection = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: 16,
});

const TabSection = styled(Box)({
  padding: 16,
  borderTop: '1px solid #ddd',
});


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleEditProfileClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSubmit = () => {
    if (doctor && doctor.id) {
      dispatch(updateDoctorProfile({ id: doctor.id, ...profileData }));
      setEditMode(false); // Close the form after submission
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return doctor ? (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <ProfileCard>
            <CardContent>
              <ProfileAvatar
                alt={`${doctor.FirstName} ${doctor.LastName}`}
                src="/path/to/doctor-avatar.jpg"

              />
              {!editMode ? (
                <>
                  <Typography variant="h5" gutterBottom mt={2}>
                    {`Dr. ${doctor.FirstName} ${doctor.LastName}`}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {doctor.Speciality}
                  </Typography>
                  <ProfileSection>
                    <Button variant="contained" color="primary" onClick={handleEditProfileClick}>
                      Edit Profile
                    </Button>
                  </ProfileSection>
                  <Box my={2}>
                    <Typography variant="h6" component="div">
                      Meeting Price: ${doctor.MeetingPrice}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography variant="subtitle1">Bio</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {doctor.Bio}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  {/* Editable Form */}
                  <TextField
                    label="First Name"
                    name="FirstName"
                    value={profileData.FirstName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Last Name"
                    name="LastName"
                    value={profileData.LastName}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    select
                    label="Speciality"
                    name="Speciality"
                    value={profileData.Speciality}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="Cardiologist">Cardiologist</MenuItem>
                    <MenuItem value="Dermatologist">Dermatologist</MenuItem>
                    <MenuItem value="Pediatrician">Pediatrician</MenuItem>
                    {/* Add more specialities here */}
                  </TextField>
                  <TextField
                    label="Meeting Price"
                    name="MeetingPrice"
                    type="number"
                    value={profileData.MeetingPrice}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Bio"
                    name="Bio"
                    value={profileData.Bio}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                  />
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                      Save Changes
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </ProfileCard>
        </Grid>

        {/* Tab Section */}
        <Grid item xs={12} md={8}>
          <Box mb={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="My Profile" />
              <Tab label="Change Password" />
              <Tab label="Notifications" />
              <Tab label="Reviews" />
            </Tabs>
          </Box>
          <TabSection>
            {/* Render content based on selected tab */}
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Reviews
                </Typography>
                {/* Reviews will be rendered here */}
              </Box>
            )}
            {/* Add other tab content here */}
          </TabSection>
        </Grid>
      </Grid>
    </Container>
  ) : null;
};

export default DoctorProfile;
