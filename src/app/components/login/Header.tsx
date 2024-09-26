import React from "react";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";

const Header: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding={2}
    >
      <Typography variant="h5">Welcome, Dr. Stephen</Typography>
      <Box display="flex" alignItems="center">
        <IconButton>
          {/* <NotificationsIcon /> */}
        </IconButton>
        <Avatar alt="Dr. Stephen Conley" src="/static/images/avatar/1.jpg" />
      </Box>
    </Box>
  );
};

export default Header;
