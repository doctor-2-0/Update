import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { updateUserProfile, fetchUserProfile } from '../../features/userProfileSlice';
import { Avatar, Box, Button, Container, Grid, TextField, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { UserProfile } from '../../types/UserProfile';

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: 'auto',
  border: `4px solid ${theme.palette.primary.main}`,
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
 
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const UserAccountProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { user, loading, error } = useSelector((state: RootState) => state.userProfile);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile>({
    FirstName: '',
    LastName: '',
    Email: '',
    PhotoUrl: '',
    Password: '',
  });

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        PhotoUrl: user.PhotoUrl || '',
        Password: '',
      });
      setPreview(user.PhotoUrl || '');
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    let photoUrl = user?.PhotoUrl;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const response = await axios.post(
            'http://localhost:5000/api/media/upload',
            { base64 },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          photoUrl = response.data.media.url;
          dispatch(updateUserProfile({ ...profileData, PhotoUrl: photoUrl }));
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      reader.readAsDataURL(file);
    } else {
      dispatch(updateUserProfile({ ...profileData, PhotoUrl: photoUrl }));
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ProfileCard>
        <CardContent>
          <ProfileAvatar
            alt={`${profileData.FirstName} ${profileData.LastName}`}
            src={preview || user?.PhotoUrl || '/path/to/default-avatar.jpg'}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} className="upload-photo" id="upload-photo" style={{ display: 'none' }} />
          <label htmlFor="upload-photo" className="upload-photo-label">
            <Button variant="contained" color="primary" component="span">
              Upload Photo
            </Button>
          </label>
          <Typography variant="h5" gutterBottom mt={2}>
            {`${profileData.FirstName} ${profileData.LastName}`}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {profileData.Email}
          </Typography>
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
            label="Email"
            name="Email"
            value={profileData.Email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="Password"
            type="password"
            value={profileData.Password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </ProfileCard>
    </Container>
  );
};

export default UserAccountProfile;