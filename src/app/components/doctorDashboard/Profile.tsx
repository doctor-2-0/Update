import { fetchDoctorById, updateDoctorProfile } from "@/features/doctorSlice";
import { AppDispatch, RootState } from "@/lib/store";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  margin: "auto",
  border: `4px solid ${theme.palette.primary.main}`,
}));const db = require("../models"); // Make sure the correct path is used

// Create a new Appointment
exports.createAppointment = async (req, res) => {
  try {
    console.log('Received appointment data:', req.body);
    const { DoctorID, AppointmentDate, DurationMinutes } = req.body;
    const PatientID = req.user.UserID; // Fixed PatientID for testing

    // Validate input
    if (!DoctorID || !AppointmentDate || !DurationMinutes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure the DoctorID is valid and corresponds to a user with the role "Doctor"
    const doctor = await db.User.findOne({
      where: { UserID: DoctorID, Role: "Doctor" },
    });
    if (!doctor) {
      console.log('Doctor not found:', DoctorID);
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Create the appointment
    const newAppointment = await db.Appointment.create({
      PatientID,
      DoctorID,
      AppointmentDate,
      DurationMinutes,
 
    });

    console.log('Appointment created successfully:', newAppointment);
    // Return the newly created appointment
    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({ 
      message: "Error creating appointment", 
      error: error.message
    });
  }
};
// Get all Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await db.Appointment.findAll();
    return res.status(200).json(appointments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving appointments", error });
  }
};

// Get a single Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving appointment", error });
  }
};

// Update an Appointment by ID
exports.updateAppointment = async (req, res) => {
  try {
    const { PatientID, DoctorID, AppointmentDate, DurationMinutes, Status } =
      req.body;
    const appointment = await db.Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.PatientID = PatientID;
    appointment.DoctorID = DoctorID;
    appointment.AppointmentDate = AppointmentDate;
    appointment.DurationMinutes = DurationMinutes;
    appointment.Status = Status;

    await appointment.save();
    return res.status(200).json(appointment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating appointment", error });
  }
};

// Delete an Appointment by ID
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await db.Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await appointment.destroy();
    return res
      .status(204)
      .json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting appointment", error });
  }
};

exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const doctorId = req.user.UserID;
    const appointments = await db.Appointment.findAll({
      where: { DoctorID: doctorId },
      include: [
        {
          model: db.User,
          as: "Patient",
          attributes: ['UserID', 'FirstName', 'LastName', 'Email']
        },
      ],
      order: [['AppointmentDate', 'ASC']]
    });
    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error getting appointments", error: error.message });
  }
};

const ProfileCard = styled(Card)`
  ${({ theme }) => `
    padding: ${theme.spacing(3)};
    text-align: center;
  `}
`;

const ProfileSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
}));

const TabSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const DoctorProfile: React.FC<{ doctorId: string }> = ({ doctorId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { doctor, loading, error } = useSelector(
    (state: RootState) => state.doctor
  );

  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(3);

  const [profileData, setProfileData] = useState({
    FirstName: "",
    LastName: "",
    Speciality: "",
    MeetingPrice: 0,
    Bio: "",
  });

  useEffect(() => {
    dispatch(fetchDoctorById(Number(doctorId)));
  }, [doctorId, dispatch]);

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
      setEditMode(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return doctor ? (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEditProfileClick}
                    >
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
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </ProfileCard>
        </Grid>

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
            {tabValue === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Reviews
                </Typography>
              </Box>
            )}
          </TabSection>
        </Grid>
      </Grid>
    </Container>
  ) : null;
};

export default DoctorProfile;
