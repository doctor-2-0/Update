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
