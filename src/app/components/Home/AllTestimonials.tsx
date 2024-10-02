import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import TestimonialCard from "./TestimonialCard";

const TestimonialsWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
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
const AllTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: "John Smith",
      testimonial: "Great experience with DocConnect!",
      avatarUrl:
        "https://www.findtherightclick.com/wp-content/uploads/2017/07/Matt-T-Testimonial-pic.jpg",
    },
    {
      name: "Sarah Johnson",
      testimonial: "The doctors are very professional.",
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSKicD_26pEwOIlh5hgyyMg0nP49OBSaXK1A&s",
    },
    {
      name: "Mike Brown",
      testimonial: "Highly recommend their services.",
      avatarUrl:
        "https://simg.nicepng.com/png/small/792-7926701_speakers-men-png-images-testimonial.png",
    },
  ];

  return (
    <TestimonialsWrapper>
      <Container maxWidth="lg">
        <TitleWrapper>
          <GradientTitle variant="h2" align="center">
            What Our Patients Say
          </GradientTitle>
        </TitleWrapper>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <TestimonialCard
                name={testimonial.name}
                testimonial={testimonial.testimonial}
                avatarUrl={testimonial.avatarUrl}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </TestimonialsWrapper>
  );
};

export default AllTestimonials;
