import React from "react";
import { Box, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import MessageIcon from "@mui/icons-material/Message";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <Box sx={{ height: "100vh", backgroundColor: "#F4F5F7", padding: 2 }}>
      <List>
        {[
          // { text: "Overview", icon: <DashboardIcon /> },
          { text: "Appointment", icon: <CalendarTodayIcon /> },
          { text: "My Patients", icon: <PeopleIcon /> },
          { text: "Payments", icon: <PaymentIcon /> },
          { text: "Message", icon: <MessageIcon /> },
          { text: "Settings", icon: <SettingsIcon /> },
        ].map((item) => (
          <ListItem component={Link} to="/overview" key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
