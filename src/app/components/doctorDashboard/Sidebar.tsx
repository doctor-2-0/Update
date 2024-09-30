import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import PeopleIcon from '@mui/icons-material/People';
import EventIcon from "@mui/icons-material/Event";
import PaymentIcon from "@mui/icons-material/Payment";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import ChatRooms from "./ChatRooms";

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
      text: "Overview",
      icon: <DashboardIcon />,
      onClick: () => router.push("/dashboard"),
    },
    {
      text: "Appointment",
      icon: <EventIcon />,
      onClick: () => router.push("/appointments"),
    },
    {
      text: "My Patients",
      icon: <PersonIcon />,
      onClick: () => router.push("/patients"),
    },
    {
      text: "Schedule Timings",
      icon: <EventIcon />,
      onClick: () => router.push("/schedule"),
    },
    {
      text: "Payments",
      icon: <PaymentIcon />,
      onClick: () => router.push("/payments"),
    },
    { text: "Messages", icon: <MessageIcon />, onClick: handleMessagesClick },
    {
      text: "Blog",
      icon: <ArticleIcon />,
      onClick: () => router.push("/blog"),
    },
    {
      text: "Settings",
      icon: <SettingsIcon />,
      onClick: () => router.push("/settings"),
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
          <img
            src="https://www.clipartmax.com/png/small/54-545682_doctor-logo-doctor-logo-png.png"
            alt="Doct Logo"
            style={{ width: "30px", marginRight: "10px" }}
          />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Doct.
          </Typography>
        </Box>

        {/* Menu Items */}
        <List>
          {[
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
              onClick: () => router.push("/appointments"),
            },
            { text: "My Patients", icon: <PersonIcon /> },
            {
              text: "Schedule Timings",
              icon: <EventIcon />,
              onClick: () => router.push("/doctor/availability"),
            },
            { text: "Payments", icon: <PaymentIcon /> },
            {
              text: "Message",
              icon: <MessageIcon />,
              onClick: () => router.push("/chat"),
            },
            { text: "Blog", icon: <ArticleIcon /> }, // New Blog item
            {
              text: "Settings",
              icon: <SettingsIcon />,
              onClick: () => router.push("/settings"),
            },
          ].map((item, index) => (
            <ListItemButton
              key={item.text}
              sx={{
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                "&:hover": {
                  backgroundColor: "#000", // Black background on hover
                  color: "#fff", // White text on hover
                },
                "&.Mui-selected": {
                  backgroundColor: "#000", // Black background for selected item
                  color: "#fff", // White text for selected item
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
