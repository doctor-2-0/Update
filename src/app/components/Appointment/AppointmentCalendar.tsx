// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { useDispatch } from 'react-redux';
// import { setSelectedDate, setAvailableSlots } from '../../Actions/appointmentActions';
// import axios from 'axios';
// import { Card, Box, Typography, Grid, Divider } from '@mui/material';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import { styled } from '@mui/material/styles';

// const StyledCalendar = styled(Calendar)`
//   width: 100%;
//   max-width: 400px;
//   background: white;
//   border: 1px solid #a0a096;
//   font-family: Arial, Helvetica, sans-serif;
//   line-height: 1.125em;

//   .react-calendar__tile--now {
//     background: #ffff76;
//   }

//   .react-calendar__tile--active {
//     background: #006edc;
//     color: white;
//   }
// `;

// const AppointmentCalendar: React.FC<{ DoctorID: string }> = ({ DoctorID }) => {
//     const dispatch = useDispatch();
//     const [date, setDate] = useState<Date | null>(new Date());
//     const [appointments, setAppointments] = useState<any[]>([]);

//     const handleDateChange = (value: Date | Date[] | [Date, Date] | null, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
//     if (value instanceof Date) {
//     const serializedDate = value.toISOString().split('T')[0];
//     setDate(value);
//     dispatch(setSelectedDate(serializedDate));

//     axios
//         .get(`/api/appointments/doctor/${DoctorID}/date/${serializedDate}`)
//         .then((response) => {
//             dispatch(setAvailableSlots(response.data));
//         })
//         .catch((error) => {
//             console.error('Error fetching available slots:', error);
//             dispatch(setAvailableSlots([]));
//         });
//     } else {
//     setDate(null);
//     dispatch(setSelectedDate(null));
//     }
// };

//     useEffect(() => {
//     const fetchAppointments = async () => {
//     try {
//         const response = await axios.get(`/api/appointments`);
//         setAppointments(response.data);
//     } catch (error) {
//         console.error('Error fetching appointments:', error);
//         setAppointments([]);
//     }
//     };

//     fetchAppointments();
// }, [DoctorID]);

//     return (
//     <Box sx={{ p: 4 }}>
//         <Typography variant="h4" gutterBottom>
//         Appointment Calendar
//         </Typography>
//         <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//         <Card sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//             <CalendarTodayIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//             Select a Date
//             </Typography>
//             <StyledCalendar onChange={(value, event) => handleDateChange(value as Date | Date[] | [Date, Date] | null, event)} value={date} />
//         </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//         <Card sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom>
//                 Upcoming Appointments
//             </Typography>
//             <Divider sx={{ mb: 2 }} />
//             {appointments.length > 0 ? (
//             appointments.map((appointment, index) => (
//                 <Box key={index} mb={2}>
//                     <Typography variant="body1">
//                     {appointment.title} - {appointment.time}
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                     {appointment.description}
//                 </Typography>
//                 </Box>
//             ))
//             ) : (
//             <Typography variant="body2" color="textSecondary">
//                 No upcoming appointments.
//             </Typography>
//             )}
//         </Card>
//         </Grid>
//     </Grid>
//     </Box>
// );
// };

// export default AppointmentCalendar;

export {};