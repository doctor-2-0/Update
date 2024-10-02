import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { AppDispatch } from "@/lib/store";
import { updateStatus } from "@/features/userSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MessageIcon from "@mui/icons-material/Message";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

const statusOptions = ["rejected", "confirmed", "pending"];

interface AppointmentListProps {
  appointments: any[];
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "CONFIRMED":
      return "success";
    case "PENDING":
      return "warning";
    case "REJECTED":
      return "error";
    case "COMPLETED":
      return "info";
    default:
      return "default";
  }
};

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  const dispatch = useDispatch<AppDispatch>();
  const now = dayjs();

  const [localAppointments, setLocalAppointments] = useState(appointments);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    appointment: any
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
    setSelectedStatus(appointment.Status || "");
  };

  const handleClose = () => setAnchorEl(null);

  const handleChangeStatus = async (status: string) => {
    if (selectedAppointment) {
      if (status === "confirmed") {
        setOpenDialog(true);
      } else {
        const result = await dispatch(
          updateStatus({ id: selectedAppointment.id, status })
        );
        if (result.meta.requestStatus === "fulfilled") {
          updateLocalAppointment(selectedAppointment.id, status);
          setSelectedStatus(status);
          handleClose();
        }
      }
    }
  };

  const handleConfirmAppointment = async () => {
    if (selectedAppointment) {
      const result = await dispatch(
        updateStatus({
          id: selectedAppointment.id,
          status: "confirmed",
        })
      );
      if (result.meta.requestStatus === "fulfilled") {
        updateLocalAppointment(selectedAppointment.id, "confirmed");
        setSelectedStatus("confirmed");
        setOpenDialog(false);
        handleClose();
      }
    }
  };

  const updateLocalAppointment = (appointmentId: number, newStatus: string) => {
    setLocalAppointments((prevAppointments) =>
      prevAppointments.map((app) =>
        app.AppointmentID === appointmentId
          ? { ...app, Status: newStatus }
          : app
      )
    );
  };

  const handleMessageClick = (appointment: any) => {
    // Here you can implement the logic to open a chat or messaging interface
    console.log(
      `Opening chat with patient: ${appointment.patient.firstName} ${appointment.patient.lastName}`
    );
    // You might want to navigate to a chat page or open a chat modal
    // For example:
    // router.push(`/chat/${appointment.id}`);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Appointment Requests
      </Typography>
      <List>
        {localAppointments.length ? (
          localAppointments.map((appointment: any, index: number) => {
            const { status = "", createdAt, patient } = appointment;
            return (
              <ListItem key={appointment.id} divider>
                <ListItemAvatar>
                  <Avatar src={`https://i.pravatar.cc/150?img=${index + 1}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${patient.firstName} ${patient.lastName}`}
                  secondary={createdAt ? now.from(createdAt) : null}
                />
                <Chip
                  label={status}
                  color={getStatusColor(status)}
                  size="small"
                  onClick={(event) => handleClick(event, appointment)}
                  style={{ marginRight: "10px" }}
                />
                <IconButton onClick={() => handleMessageClick(appointment)}>
                  <MessageIcon />
                </IconButton>
              </ListItem>
            );
          })
        ) : (
          <Typography>No appointments found</Typography>
        )}
      </List>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {statusOptions.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleChangeStatus(status)}
            selected={status === selectedStatus}
          >
            {status}
          </MenuItem>
        ))}
      </Menu>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Typography>
              Are you sure you want to confirm the appointment for{" "}
              {selectedAppointment.patient.firstName}{" "}
              {selectedAppointment.patient.lastName}?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmAppointment} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentList;
