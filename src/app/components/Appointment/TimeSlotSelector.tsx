// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { bookAppointment } from '../../Actions/appointmentActions';
// import axios from 'axios';
// import { Button, Typography, Grid, Snackbar } from '@mui/material';
// import MuiAlert, { AlertProps } from '@mui/material/Alert';
// import ConfirmationModal from './ConfirmationModal';

// interface TimeSlotSelectorProps {
//     doctorId: string;
//     patientId: string;
// }

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//     props,
//     ref,
// ) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ doctorId, patientId }) => {
//     const dispatch = useDispatch();
//     const availableSlots = useSelector((state: { appointments: { availableSlots: string[] } }) => state.appointments.availableSlots);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
//     const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
//     const [selectedSlot, setSelectedSlot] = useState('');

//     const handleSlotSelection = (slot: string) => {
//         setSelectedSlot(slot);
//         setOpenConfirmationModal(true);
//     };

//     const handleConfirmAppointment = async () => {
//         try {
//             const response = await axios.post('/api/appointments', {
//                 doctorId,
//                 patientId,
//                 appointmentDate: new Date(),
//                 startTime: selectedSlot
//             });
//             if (response.status === 201) {
//                 dispatch(bookAppointment(doctorId, patientId, selectedSlot));
//                 setSnackbarMessage('Appointment booked successfully!');
//                 setSnackbarSeverity('success');
//                 setOpenSnackbar(true);
//             }
//         } catch (error) {
//             console.error('Error booking appointment:', error);
//             setSnackbarMessage('Error booking appointment. Please try again.');
//             setSnackbarSeverity('error');
//             setOpenSnackbar(true);
//         }
//         setOpenConfirmationModal(false);
//     };

//     const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
//         if (reason === 'clickaway') {
//             return;
//         }
//         setOpenSnackbar(false);
//     };

//     return (
//         <div>
//             <Typography variant="h6" gutterBottom>Available Slots</Typography>
//             <Grid container spacing={2}>
//                 {availableSlots.length > 0 ? (
//                     availableSlots.map((slot, index) => (
//                         <Grid item key={index}>
//                             <Button
//                                 variant="contained"
//                                 color="primary"
//                                 onClick={() => handleSlotSelection(slot)}
//                             >
//                                 {slot}
//                             </Button>
//                         </Grid>
//                     ))
//                 ) : (
//                     <Typography variant="body1">No available slots for the selected date.</Typography>
//                 )}
//             </Grid>
//             <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//                 <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
//                     {snackbarMessage}
//                 </Alert>
//             </Snackbar>
//             <ConfirmationModal
//                 open={openConfirmationModal}
//                 onClose={() => setOpenConfirmationModal(false)}
//                 onConfirm={handleConfirmAppointment}
//                 appointmentDetails={{ doctorId, patientId, slot: selectedSlot }}
//             />
//         </div>
//     );
// };

// export default TimeSlotSelector;

export {};