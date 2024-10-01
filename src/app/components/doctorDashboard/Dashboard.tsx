"use client";

import { fetchAppointmentsByUserId } from "@/features/appointmentSlice";
import { login } from "@/features/authSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppointmentList from "./AppointmentList";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
// import { AppointmentsState } from "../../features/appointmentSlice";
import ChatRooms from "./ChatRooms";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, isAuthenticated } = useSelector(
    (state: RootState) => state.Auth
  );
  const { appointments, loadingApp, errorApp } = useSelector(
    (state: RootState) => state.appointments
  );

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !isAuthenticated && !loading) {
      dispatch(login({ token }))
        .unwrap()
        .then(() => {
          dispatch(fetchAppointmentsByUserId());
        })
        .catch(console.error);
    } else if (isAuthenticated) {
      dispatch(fetchAppointmentsByUserId());
    }
  }, [dispatch, isAuthenticated, loading]);

  const getWelcomeMessage = () => {
    if (loading) return "Loading...";
    if (!isAuthenticated || !user) return "Welcome, Doctor";

    const doctorName = user.LastName || "Doctor";
    return `Welcome, Dr. ${doctorName}`;
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <Sidebar /> {/* Render the Sidebar on the left */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h4" gutterBottom>
          {getWelcomeMessage()}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Have a nice day at great work!
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
            <StatCard
              title="Appointments"
              value={appointments.length.toString()}
              color="#8e44ad"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="Total Patients" value="N/A" color="#e74c3c" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="Clinic Consulting" value="N/A" color="#f39c12" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <StatCard title="Video Consulting" value="N/A" color="#3498db" />
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 2 }}>
              {loadingApp ? (
                <Typography>Loading appointments...</Typography>
              ) : errorApp ? (
                <Typography color="error">{errorApp}</Typography>
              ) : (
                <AppointmentList appointments={appointments} />
              )}
            </Paper>
          </Box>
          <Box>
            <Paper sx={{ p: 2 }}>
              <ChatRooms />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
