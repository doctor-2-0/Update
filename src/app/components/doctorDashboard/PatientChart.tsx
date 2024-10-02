import { Box, Typography } from "@mui/material";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const data = [
  { name: "Male", value: 60 },
  { name: "Female", value: 35 },
  { name: "Other", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const PatientChart: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Patient Gender Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {data.map((entry, index) => (
          <Box
            key={entry.name}
            sx={{ display: "flex", alignItems: "center", mx: 1 }}
          >const db = require('../models');
          // Create Availability
          const createAvailability = async (req, res) => {
            const { DoctorID, AvailableDate, StartTime, EndTime } = req.body;
          
            try {
              const newAvailability = await db.Availability.create({
                DoctorID,
                AvailableDate,
                StartTime,
                EndTime,
              });
          
              res.status(201).json(newAvailability);
            } catch (error) {
              console.log(error)
              res.status(500).json({ error: 'Failed to create availability' });
            }
          };
          
          // Get All Availability for a Doctor
          const getDoctorAvailability = async (req, res) => {
            const { DoctorID } = req.params;
          
            try {
              const availability = await db.Availability.findAll({ where: { DoctorID } });
              res.status(200).json(availability);
            } catch (error) {
              res.status(500).json({ error: 'Failed to retrieve availability' });
            }
          };
          
          // Delete Availability
          const deleteAvailability = async (req, res) => {
            const { AvailabilityID } = req.params;
          
            try {
              await db.Availability.destroy({ where: { AvailabilityID } });
              res.status(200).json({ message: 'Availability deleted successfully' });
            } catch (error) {
              res.status(500).json({ error: 'Failed to delete availability' });
            }
          };
          
          
          
          const { Op } = require('sequelize');
          
          const getAvailableSlots = async (req, res) => {
            const { DoctorID } = req.params;
          
            try {
              // Fetch doctor's availability
              const availabilities = await db.Availability.findAll({
                where: { 
                  DoctorID, 
                  IsAvailable: true,
                  AvailableDate: {
                    [Op.gte]: new Date()
                  }
                },
                attributes: ['AvailableDate', 'StartTime', 'EndTime'],
                order: [['AvailableDate', 'ASC'], ['StartTime', 'ASC']]
              });
          
              // Fetch confirmed appointments
              const confirmedAppointments = await db.Appointment.findAll({
                where: {
                  DoctorID,
                  Status: 'confirmed',
                  AppointmentDate: {
                    [Op.gte]: new Date()
                  }
                },
                attributes: ['AppointmentDate', 'DurationMinutes']
              });
          
              // Process available slots
              const availableSlots = availabilities.flatMap(slot => {
                const date = slot.AvailableDate;
                const startTime = new Date(`${date}T${slot.StartTime}`);
                const endTime = new Date(`${date}T${slot.EndTime}`);
                const slots = [];
          
                while (startTime < endTime) {
                  const slotEndTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour slots
                  const isBooked = confirmedAppointments.some(appointment => {
                    const appointmentStart = new Date(appointment.AppointmentDate);
                    const appointmentEnd = new Date(appointmentStart.getTime() + appointment.DurationMinutes * 60 * 1000);
                    return appointmentStart < slotEndTime && appointmentEnd > startTime;
                  });
          
                  if (!isBooked) {
                    slots.push({
                      date: date,
                      startTime: startTime.toTimeString().slice(0, 5),
                      endTime: slotEndTime.toTimeString().slice(0, 5)
                    });
                  }
          
                  startTime.setTime(slotEndTime.getTime());
                }
          
                return slots;
              });
          
              res.status(200).json(availableSlots);
            } catch (error) {
              console.error('Error retrieving available slots:', error);
              res.status(500).json({ error: 'Failed to retrieve available slots' });
            }
          };
          
          
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
          
          module.exports = {
            createAvailability,
            getDoctorAvailability,
            deleteAvailability,
            getAvailableSlots,
          };
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: COLORS[index % COLORS.length],
                mr: 1,
              }}
            />
            <Typography variant="body2">{entry.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PatientChart;
