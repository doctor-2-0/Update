"use client";

import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { Drawer, List, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
// import { useRouter } from "next/router";
import { Box, IconButton, ListItemButton, Typography } from "@mui/material";
import Image from "next/image";

import ChatRooms from "./ChatRooms";
const db = require("../models"); // Make sure the correct path is used

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
const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [showChatRooms, setShowChatRooms] = useState(false);

  const handleMessagesClick = () => {
    setShowChatRooms(true);
    router.push("/chatrooms");
  };

  const menuItems = [
    {
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => router.push("/"),
    },
    {
      text: "Overview",
      icon: <DashboardIcon />,
      onClick: () => router.push("/dashboard"),
    },
    {
      text: "Appointment",
      icon: <EventIcon />,
      onClick: () => router.push("/api/appointments/route"),
    },
    {
      text: "My Patients",
      icon: <PersonIcon />,
      onClick: () => router.push("/doctorDashboard/PatientChat"),
    },
    {
      text: "Schedule Timings",
      icon: <EventIcon />,
      onClick: () => router.push("/doctor/schedule"),
    },
    {
      text: "Payments",
      icon: <PaymentIcon />,
      onClick: () => router.push("/doctor/payments"),
    },
    {
      text: "Messages",
      icon: <MessageIcon />,
      onClick: handleMessagesClick,
    },
    {
      text: "Blog",
      icon: <ArticleIcon />,
      onClick: () => router.push("/blog"),
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      onClick: () => router.push("/api/settings/route"),
    },
  ];

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f8f8f8",
            padding: "16px",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", paddingBottom: "20px" }}
        >
          <Image
            src="https://www.clipartmax.com/png/small/54-545682_doctor-logo-doctor-logo-png.png"
            alt="Doctor Logo"
            width={100}
            height={100}
            loader={({ src }) => src}
            unoptimized
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Doct.
          </Typography>
        </Box>

        {/* Menu Items */}
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              sx={{
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#fff",
                },
                "&.Mui-selected": {
                  backgroundColor: "#000",
                  color: "#fff",
                },
              }}
              onClick={item.onClick}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* ChatRooms Section */}
      {showChatRooms && (
        <Box
          sx={{
            position: "fixed",
            left: drawerWidth,
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            zIndex: 1200,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography variant="h6">Chat Rooms</Typography>
            <IconButton onClick={() => setShowChatRooms(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ChatRooms onClose={() => setShowChatRooms(false)} />
        </Box>
      )}
    </>
  );
};

export default Sidebar;
