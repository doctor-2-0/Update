import { updateStatus } from "@/features/userSlice";
import { AppDispatch } from "@/lib/store";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

dayjs.extend(relativeTime);

const statusOptions = ["rejected", "confirmed", "pending"];

interface AppointmentListProps {
  appointments: any[]; 
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  const dispatch = useDispatch<AppDispatch>();
  const now = dayjs();

  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    appointment: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
    setSelectedStatus(appointment.Status || "");
  };

  const handleClose = () => setAnchorEl(null);

  const handleChangeStatus = async (status: string) => {
    if (selectedAppointment) {
      if (status === "confirmed") {
        setOpenDialog(true);
      } else {
        const result = await dispatch(
          updateStatus({ id: selectedAppointment.AppointmentID, status })
        );
        if (result.meta.requestStatus === "fulfilled") {
          updateLocalAppointment(selectedAppointment.AppointmentID, status);
          setSelectedStatus(status);
          handleClose();
        }
      }
    }
  };

  const handleConfirmAppointment = async () => {
    if (selectedAppointment) {
      const result = await dispatch(
        updateStatus({
          id: selectedAppointment.AppointmentID,
          status: "confirmed",
        })
      );
      if (result.meta.requestStatus === "fulfilled") {
        updateLocalAppointment(selectedAppointment.AppointmentID, "confirmed");
        setSelectedStatus("confirmed");
        setOpenDialog(false);
        handleClose();
      }
    }
  };

  const updateLocalAppointment = (appointmentId: number, newStatus: string) => {
    setLocalAppointments((prevAppointments) =>
      prevAppointments.map((app) =>
        app.AppointmentID === appointmentId
          ? { ...app, Status: newStatus }
          : app
      )
    );
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Appointment Requests
      </Typography>
      <List>
        {localAppointments.length ? (
          localAppointments.map((appointment: any, index: number) => {
            const { Status = "", createdAt, Patient } = appointment;
            return (
              <ListItem key={appointment.AppointmentID} divider>
                <ListItemAvatar>
                  <Avatar src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${Patient.FirstName} ${Patient.LastName}`}
                  secondary={createdAt ? now.from(createdAt) : null}
                />
                <Chip
                  label={Status}
                  color={
                    Status === "pending"
                      ? "warning"
                      : Status === "rejected"
                      ? "error"
                      : "success"
                  }
                  size="small"
                  onClick={(event) => handleClick(event, appointment)}
                />
              </ListItem>
            );
          })
        ) : (
          <Typography>No appointments found</Typography>
        )}
      </List>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {statusOptions.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleChangeStatus(status)}
            selected={status === selectedStatus}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Typography>
              Are you sure you want to confirm the appointment for{" "}
              {selectedAppointment.Patient.FirstName}{" "}
              {selectedAppointment.Patient.LastName}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmAppointment} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentList; 
const db = require('../models');
const { uploadMedia } = require('./media.controller');
const bcrypt = require('bcrypt');




exports.updateUserLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.UserID;
    const updatedUser = await db.User.update(
      { LocationLatitude: latitude, LocationLongitude: longitude },
      { where: { UserID: userId } }
    );
    if (updatedUser[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// Get place name from coordinates
exports.getPlaceName = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
    const data = await response.json();
    res.status(200).json({ placeName: data.display_name });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching place name', error: error.message });
  }
};

// Get user's location
exports.getUserLocation = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const user = await db.User.findByPk(userId, {
      attributes: ['UserID', 'LocationLatitude', 'LocationLongitude']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ 
      message: 'User location retrieved successfully',
      location: {
        latitude: user.LocationLatitude,
        longitude: user.LocationLongitude
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user location', error: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};  


exports.getUserById = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: { role: "PATIENT" },
      include: [
        {
          model: db.Appointment,
          as: "PatientAppointments",
        },
        { model: db.DoctorReview, as: "DoctorReviews" },
        { model: db.Availability, as: "Availabilities" },
      ],
    });

    return res
      .status(200)
      .json(users.filter((i) => i?.PatientAppointments.length > 0));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error getting user profile", error });
  }
};

exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;
  console.log('Updating appointment:', id, status);
  try {
    const appointment = await db.Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.Status = status;
    await appointment.save();

    console.log('Appointment updated successfully:', appointment);
    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return res
      .status(500)
      .json({ message: "Error updating appointment status", error: error.message });
  }
};




exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;
  console.log('Updating appointment:', id, status);
  try {
    const appointment = await db.Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.Status = status;
    await appointment.save();

    console.log('Appointment updated successfully:', appointment);
    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return res
      .status(500)
      .json({ message: "Error updating appointment status", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const user = await db.User.findOne({
      where: { UserID: userId },
      include: [{ model: db.Media, as: 'ProfilePicture', required: false }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userProfile = {
      ...user.toJSON(),
      PhotoUrl: user.ProfilePicture ? user.ProfilePicture.url : null,
    };

    return res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.UserID;
    const { FirstName, LastName, Email, PhotoUrl, Password } = req.body;

    // Hash the password if it is provided
    if (Password) {
      const salt = await bcrypt.genSalt(10);
      req.body.Password = await bcrypt.hash(Password, salt);
    }

    // If there's a file in the request, handle the file upload
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const uploadResponse = await uploadMedia({ body: { base64 }, user: { UserID: userId } }, res);
      if (uploadResponse.error) {
        return res.status(500).json({ message: 'Error uploading image', error: uploadResponse.error });
      }
      req.body.PhotoUrl = uploadResponse.url;
    }

    const [updated] = await db.User.update(req.body, {
      where: { UserID: userId },
    });

    if (!updated) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};
