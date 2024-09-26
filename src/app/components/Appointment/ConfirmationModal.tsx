import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    appointmentDetails: {
        doctorId: string;
        patientId: string;
        slot: string;
    };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onClose, onConfirm, appointmentDetails }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    Are you sure you want to book this appointment?
                </Typography>
                <Typography variant="body2">
                    Doctor ID: {appointmentDetails.doctorId}
                </Typography>
                <Typography variant="body2">
                    Patient ID: {appointmentDetails.patientId}
                </Typography>
                <Typography variant="body2">
                    Time Slot: {appointmentDetails.slot}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary" variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;


