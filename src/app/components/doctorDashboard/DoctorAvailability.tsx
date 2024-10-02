"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

interface Availability {
  AvailabilityID: number;
  DoctorID: number;
  AvailableDate: string;
  StartTime: string;
  EndTime: string;
  IsAvailable: boolean;
}

interface Props {
  session: any;
}

const DoctorAvailability: React.FC<Props> = ({ session }) => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (!session) return;

      try {
        const response = await axios.get(`/api/doctor/${session.UserID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setDoctorId(response.data.UserID);
      } catch (error) {
        console.error("Failed to fetch doctor info", error);
      }
    };

    fetchDoctorInfo();
  }, [session]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (doctorId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/availability/${doctorId}`
          );
          setAvailability(response.data);
        } catch (error) {
          console.error("Failed to fetch availability", error);
        }
      }
    };

    fetchAvailability();
  }, [doctorId]);

  const handleAddAvailability = async () => {
    if (selectedDate && startTime && endTime && doctorId) {
      if (startTime.isSame(endTime)) {
        alert("Start time and end time cannot be the same.");
        return;
      }

      if (startTime.isAfter(endTime)) {
        alert("Start time must be before end time.");
        return;
      }

      const newAvailability = {
        DoctorID: doctorId,
        AvailableDate: selectedDate.format("YYYY-MM-DD"),
        StartTime: startTime.format("HH:mm:ss"),
        EndTime: endTime.format("HH:mm:ss"),
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/availability",
          newAvailability
        );
        setAvailability((prev) => [...prev, response.data]);
        // Reset inputs
        setSelectedDate(null);
        setStartTime(null);
        setEndTime(null);
        console.log("Availability added successfully", response.data);
      } catch (error) {
        console.error("Failed to add availability", error);
      }
    } else {
      alert("Please fill in all fields and ensure doctor ID is loaded.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Doctor Availability
          </Typography>
          <Box display="flex" gap={2}>
            <Box>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                minDate={dayjs()}
              />
            </Box>
            <Box  maxWidth="md" sx={{ mt: 4 }}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
            <Box  maxWidth="md" sx={{ mt: 4 }}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddAvailability}
            sx={{ mt: 3 }}
            fullWidth
          >
            Add Availability
          </Button>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Doctor's Available Schedule
          </Typography>
          <List>
            {availability.map((slot, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={dayjs(slot.AvailableDate).format("MMMM D, YYYY")}
                  secondary={`${dayjs(slot.StartTime, "HH:mm:ss").format(
                    "h:mm A"
                  )} to ${dayjs(slot.EndTime, "HH:mm:ss").format("h:mm A")}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export async function getServerSideProps(context: any) {
  const { req } = context;
  const authToken = req.cookies.authToken;

  const session = authToken ? { UserID: "1" } : null;

  return {
    props: { session },
  };
}

export default DoctorAvailability;
const db = require('../models');
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



module.exports = {
  createAvailability,
  getDoctorAvailability,
  deleteAvailability,
  getAvailableSlots,
};