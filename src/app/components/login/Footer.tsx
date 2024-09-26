import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "primary.main",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Box>
        <Typography variant="body2">
          <Link href="#" color="blue">
            About Us
          </Link>
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2">Open Hours: Mon-Fri 9am - 5pm</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
