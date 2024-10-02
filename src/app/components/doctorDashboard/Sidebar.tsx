"use client";

import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import HomeIcon from "@mui/icons-material/Home";
import MessageIcon from "@mui/icons-material/Message";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { Drawer, List, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Box, IconButton, ListItemButton, Typography } from "@mui/material";
import Image from "next/image";
import ChatRooms from "./ChatRooms"; // Ensure this component exists

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [showChatRooms, setShowChatRooms] = useState(false);

  const handleMessagesClick = () => {
    setShowChatRooms(true);
    router.push("/chatrooms");
  };

  const menuItems = [
    {
      text: "Home",
      icon: <HomeIcon />,
      onClick: () => router.push("/"),
    },
    {
      text: "Overview",
      icon: <DashboardIcon />,
      onClick: () => router.push("/dashboard"),
    },
    {
      text: "Appointment",
      icon: <EventIcon />,
    
      onClick: () => router.push("/api/appointments/route"),
    },
    {
      text: "My Patients",
      icon: <PersonIcon />,
      onClick: () => router.push("/doctorDashboard/PatientChat"),
    },
    {
      text: "Schedule Timings",
      icon: <EventIcon />,
      onClick: () => router.push("/doctor/schedule"),
    },
    {
      text: "Payments",
      icon: <PaymentIcon />,
      onClick: () => router.push("/doctor/payments"),
    },
    {
      text: "Messages",
      icon: <MessageIcon />,
      onClick: handleMessagesClick,
    },
    {
      text: "Blog",
      icon: <ArticleIcon />,
      onClick: () => router.push("/blog"),
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      onClick: () => router.push("/api/settings/route"),
    },
  ];

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#f8f8f8",
            padding: "16px",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", paddingBottom: "20px" }}
        >
          <Image
            src="https://www.clipartmax.com/png/small/54-545682_doctor-logo-doctor-logo-png.png"
            alt="Doctor Logo"
            width={100}
            height={100}
            loader={({ src }) => src}
            unoptimized
          />
          <Typography variant="h6" sx={{ fontWeight: "bold", marginLeft: 1 }}>
            Doct.
          </Typography>
        </Box>

        {/* Menu Items */}
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              sx={{
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                "&:hover": {
                  backgroundColor: "#000",
                  color: "#fff",
                },
                "&.Mui-selected": {
                  backgroundColor: "#000",
                  color: "#fff",
                },
              }}
              onClick={item.onClick}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* ChatRooms Section */}
      {showChatRooms && (
        <Box
          sx={{
            position: "fixed",
            left: drawerWidth,
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            zIndex: 1200,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography variant="h6">Chat Rooms</Typography>
            <IconButton onClick={() => setShowChatRooms(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <ChatRooms onClose={() => setShowChatRooms(false)} />
        </Box>
      )}
    </>
  );
};

export default Sidebar;