"use client";

import { fetchAppointmentsByUserId } from "@/features/appointmentSlice";
import { login } from "@/features/authSlice";
import { AppDispatch, RootState } from "@/lib/store";
import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { login } from "@/features/authSlice";
import { fetchAppointmentsByUserId } from "@/features/appointmentSlice";
import { useRouter } from "next/navigation"; // Add this import
import StatCard from "./StatCard";
import AppointmentList from "./AppointmentList";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
// import { AppointmentsState } from "../../features/appointmentSlice";
import ChatRooms from "./ChatRooms";

const Dashboard: React.FC = () => {
  const router = useRouter(); // Add this line
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
        .catch((error) => {
          console.error(error);
          router.push("/login"); // Redirect to login page if authentication fails
        });
    } else if (isAuthenticated) {
      dispatch(fetchAppointmentsByUserId());
    } else if (!loading && !isAuthenticated) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [dispatch, isAuthenticated, loading, router]);

  const getWelcomeMessage = () => {
    if (loading) return "Loading...";
    if (!isAuthenticated || !user) return "Welcome, Doctor";

    const doctorName = user.lastName || "Doctor";
    return `Welcome, Dr. ${doctorName}`;
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflow: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {getWelcomeMessage()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Have a nice day at great work!
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
            <StatCard
              title="Appointments"
              value={appointments.length.toString()}
              color="#8e44ad"
            />
          </Box>
          <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
            <StatCard title="Total Patients" value="N/A" color="#e74c3c" />
          </Box>
          <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
            <StatCard title="Clinic Consulting" value="N/A" color="#f39c12" />
          </Box>
          <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
            <StatCard title="Video Consulting" value="N/A" color="#3498db" />
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "row", gap: 1, flexGrow: 1 }}
        >
          <Paper sx={{ flex: 1, p: 1, overflow: "auto" }}>
            {loadingApp ? (
              <Typography variant="body2">Loading appointments...</Typography>
            ) : errorApp ? (
              <Typography variant="body2" color="error">
                {errorApp}
              </Typography>
            ) : (
              <AppointmentList appointments={appointments} />
            )}
          </Paper>
          <Paper sx={{ flex: 1, p: 1, overflow: "auto" }}>
            <ChatRooms />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
