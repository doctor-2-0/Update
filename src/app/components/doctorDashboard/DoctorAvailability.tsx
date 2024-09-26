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
import { RootState, AppDispatch } from "../../store/store";
import { fetchSession } from "../../features/sessionSlice";
import { useSelector, useDispatch } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

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
  const [doctorId, setDoctorId] = useState<number | null>(null);

  const { session, loading, error } = useSelector(
    (state: RootState) => state.session
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);

  useEffect(() => {
    if (session) {
      console.log("Session Data:", session);
    }
  }, [session]);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      if (!session) return;
      if (loading) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/doctor/${session.UserID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
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
      // Ensure startTime is before endTime and not the same
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