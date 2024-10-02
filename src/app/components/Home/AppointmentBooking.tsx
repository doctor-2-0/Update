import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "@/lib/axios";
import { SelectedDoctor } from "@/features/HomeSlices/selectedDoctorSlice";
import { isAxiosError } from "axios";

// Add these state variables

interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface AppointmentBookingProps {
  doctor: {
    UserID: number;
    FirstName: string;
    LastName: string;
  };
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ doctor }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    isSuccess: true,
  });
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (doctor.UserID) {
        try {
          const response = await axios.get<AvailableSlot[]>(
            `/availability/slots/${doctor.UserID}`
          );
          console.log("Available slots:", response.data);
          setAvailableSlots(response.data);
        } catch (error) {
          console.error("Failed to fetch available slots", error);
        }
      }
    };

    fetchAvailableSlots();
  }, [doctor.UserID]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(event.target.value);
    setSelectedMonth("");
    setSelectedDay("");
    setSelectedTime("");
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
    setSelectedDay("");
    setSelectedTime("");
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDay(event.target.value);
    setSelectedTime("");
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = async () => {
    if (
      selectedYear &&
      selectedMonth &&
      selectedDay &&
      selectedTime &&
      doctor.UserID
    ) {
      const appointmentDate = new Date(
        `${selectedYear}-${selectedMonth}-${selectedDay}T${selectedTime}`
      );
      const appointmentData = {
        doctorId: doctor.UserID,
        appointmentDate: appointmentDate.toISOString(),
        durationMinutes: 60, // Set duration to 1 hour
      };

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("/appointments", appointmentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Appointment created successfully", response.data);
        setModalContent({
          title: "Appointment Booked",
          message: "Your appointment has been successfully booked.",
          isSuccess: true,
        });
        setModalOpen(true);
        // Reset form
        setSelectedYear("");
        setSelectedMonth("");
        setSelectedDay("");
        setSelectedTime("");
      } catch (error) {
        console.error("Failed to create appointment", error);
        setModalContent({
          title: "Booking Failed",
          message: "Failed to book the appointment. Please try again.",
          isSuccess: false,
        });
        setModalOpen(true);
      }
    } else {
      setModalContent({
        title: "Incomplete Information",
        message: "Please select all required fields",
        isSuccess: false,
      });
      setModalOpen(true);
    }
  };

  // Keep the existing helper functions
  const getUniqueValues = (key: "year" | "month" | "day") => {
    return Array.from(
      new Set(
        availableSlots.map((slot) => {
          const date = new Date(slot.date);
          switch (key) {
            case "year":
              return date.getFullYear().toString();
            case "month":
              return (date.getMonth() + 1).toString().padStart(2, "0");
            case "day":
              return date.getDate().toString().padStart(2, "0");
          }
        })
      )
    ).sort();
  };

  const getFilteredValues = (
    key: "month" | "day",
    filterKey: "year" | "month",
    filterValue: string
  ) => {
    return Array.from(
      new Set(
        availableSlots
          .filter((slot) => {
            const date = new Date(slot.date);
            const filterDate =
              filterKey === "year"
                ? date.getFullYear().toString()
                : (date.getMonth() + 1).toString().padStart(2, "0");
            return filterDate === filterValue;
          })
          .map((slot) => {
            const date = new Date(slot.date);
            return key === "month"
              ? (date.getMonth() + 1).toString().padStart(2, "0")
              : date.getDate().toString().padStart(2, "0");
          })
      )
    ).sort();
  };

  const getAvailableTimesForDate = (
    year: string,
    month: string,
    day: string
  ) => {
    const selectedDate = `${year}-${month}-${day}`;
    const slotsForDate = availableSlots.filter(
      (slot) => slot.date === selectedDate
    );

    const availableTimes: string[] = [];
    slotsForDate.forEach((slot) => {
      const startTime = new Date(`${selectedDate}T${slot.startTime}`);
      const endTime = new Date(`${selectedDate}T${slot.endTime}`);

      while (startTime < endTime) {
        availableTimes.push(startTime.toTimeString().slice(0, 5));
        startTime.setHours(startTime.getHours() + 1);
      }
    });

    return availableTimes;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Book an Appointment with Dr. {doctor.FirstName} {doctor.LastName}
      </Typography>
      {availableSlots.length === 0 ? (
        <Typography variant="body1">
          No available slots for this doctor.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Year"
              value={selectedYear}
              onChange={handleYearChange}
              variant="outlined"
            >
              {getUniqueValues("year").map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Month"
              value={selectedMonth}
              onChange={handleMonthChange}
              variant="outlined"
              disabled={!selectedYear}
            >
              {getFilteredValues("month", "year", selectedYear).map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Day"
              value={selectedDay}
              onChange={handleDayChange}
              variant="outlined"
              disabled={!selectedMonth}
            >
              {getFilteredValues("day", "month", selectedMonth).map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Time"
              value={selectedTime}
              onChange={handleTimeChange}
              variant="outlined"
              disabled={!selectedDay}
            >
              {getAvailableTimesForDate(
                selectedYear,
                selectedMonth,
                selectedDay
              ).map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              sx={{ mt: 2, py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
            >
              BOOK APPOINTMENT
            </Button>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={modalOpen}
        autoHideDuration={6000}
        onClose={() => setModalOpen(false)}
      >
        <Alert
          onClose={() => setModalOpen(false)}
          severity={modalContent.isSuccess ? "success" : "error"}
        >
          {modalContent.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AppointmentBooking;
