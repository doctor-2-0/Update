"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchSession } from "@/features/sessionSlice";
import { useSelector, useDispatch } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import axios from "@/lib/axios";

interface Availability {
  AvailabilityID: number;
  DoctorID: number;
  AvailableDate: string;
  StartTime: string;
  EndTime: string;
  IsAvailable: boolean;
}

const DoctorAvailability: React.FC = () => {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  const { session, loading, error } = useSelector(
    (state: RootState) => state.session
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (session && session.userId) {
        try {
          const response = await axios.get(
            `/api/availability/${session.userId}`
          );
          setAvailability(response.data.availability);
        } catch (error) {
          console.error("Failed to fetch availability", error);
        }
      }
    };

    fetchAvailability();
  }, [session]);

  const handleAddAvailability = async () => {
    if (selectedDate && startTime && endTime && session?.userId) {
      if (startTime.isSame(endTime) || startTime.isAfter(endTime)) {
        alert("Start time must be before end time.");
        return;
      }

      const newAvailability = {
        doctorId: session.userId,
        availableDate: selectedDate.format("YYYY-MM-DD"),
        startTime: startTime.format("HH:mm:ss"),
        endTime: endTime.format("HH:mm:ss"),
      };

      try {
        const response = await axios.post("/api/availability", newAvailability);
        setAvailability((prev) => [...prev, response.data]);
        setSelectedDate(null);
        setStartTime(null);
        setEndTime(null);
        console.log("Availability added successfully", response.data);
      } catch (error) {
        console.error("Failed to add availability", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Doctor Availability
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                minDate={dayjs()}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>
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

export default DoctorAvailability;
