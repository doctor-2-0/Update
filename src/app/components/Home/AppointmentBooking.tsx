import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import { SelectedDoctor } from '../../features/HomeSlices/selectedDoctorSlice';

interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface AppointmentBookingProps {
  doctor: SelectedDoctor;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ doctor }) => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (doctor.UserID) {
        try {
          const response = await axios.get<AvailableSlot[]>(`http://localhost:5000/api/availability/slots/${doctor.UserID}`);
          console.log('Available slots:', response.data);
          setAvailableSlots(response.data);

        } catch (error) {
          console.error('Failed to fetch available slots', error);
        }
      }
    };

    fetchAvailableSlots();
  }, [doctor.UserID]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('');
    setSelectedDay('');
    setSelectedTime('');
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
    setSelectedDay('');
    setSelectedTime('');
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDay(event.target.value);
    setSelectedTime('');
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedYear && selectedMonth && selectedDay && selectedTime && doctor.UserID) {
      const appointmentDate = new Date(`${selectedYear}-${selectedMonth}-${selectedDay}T${selectedTime}`);
      const appointmentData = {
        DoctorID: doctor.UserID,
        AppointmentDate: appointmentDate.toISOString(),
        DurationMinutes: 60, // Set duration to 1 hour
      };
  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Appointment created successfully', response.data);
        // Add success handling here (e.g., show a success message, clear form, etc.)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Failed to create appointment', error.response?.data || error.message);
          alert(`Failed to create appointment: ${error.response?.data?.message || error.message}`);
        } else {
          console.error('Failed to create appointment', error);
          alert('Failed to create appointment: An unexpected error occurred');
        }
      }
    } else {
      alert('Please select all required fields');
    }
  };

  const getUniqueValues = (key: 'year' | 'month' | 'day') => {
    return Array.from(new Set(availableSlots.map(slot => {
      const date = new Date(slot.date);
      switch(key) {
        case 'year': return date.getFullYear().toString();
        case 'month': return (date.getMonth() + 1).toString().padStart(2, '0');
        case 'day': return date.getDate().toString().padStart(2, '0');
      }
    }))).sort();
  };
  
  const getFilteredValues = (key: 'month' | 'day', filterKey: 'year' | 'month', filterValue: string) => {
    return Array.from(new Set(availableSlots.filter(slot => {
      const date = new Date(slot.date);
      const filterDate = filterKey === 'year' ? date.getFullYear().toString() : (date.getMonth() + 1).toString().padStart(2, '0');
      return filterDate === filterValue;
    }).map(slot => {
      const date = new Date(slot.date);
      return key === 'month' ? (date.getMonth() + 1).toString().padStart(2, '0') : date.getDate().toString().padStart(2, '0');
    }))).sort();
  };
  
  const getAvailableTimesForDate = (year: string, month: string, day: string) => {
    const selectedDate = `${year}-${month}-${day}`;
    const slotsForDate = availableSlots.filter(slot => slot.date === selectedDate);
    
    const availableTimes: string[] = [];
    slotsForDate.forEach(slot => {
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
    <>
      <Typography variant="h5" gutterBottom>
        Book Appointment
      </Typography>
      {availableSlots.length === 0 ? (
        <Typography variant="body1">No available slots for this doctor.</Typography>
      ) : (
        <>
          <TextField
            select
            fullWidth
            label="Year"
            value={selectedYear}
            onChange={handleYearChange}
            margin="normal"
            variant="outlined"
          >
            {getUniqueValues('year').map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Month"
            value={selectedMonth}
            onChange={handleMonthChange}
            margin="normal"
            variant="outlined"
            disabled={!selectedYear}
          >
            {getFilteredValues('month', 'year', selectedYear).map(month => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Day"
            value={selectedDay}
            onChange={handleDayChange}
            margin="normal"
            variant="outlined"
            disabled={!selectedMonth}
          >
            {getFilteredValues('day', 'month', selectedMonth).map(day => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Time"
            value={selectedTime}
            onChange={handleTimeChange}
            margin="normal"
            variant="outlined"
            disabled={!selectedDay}
          >
            {getAvailableTimesForDate(selectedYear, selectedMonth, selectedDay).map(time => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            BOOK APPOINTMENT
          </Button>
        </>
      )}
    </>
  );
};

export default AppointmentBooking;