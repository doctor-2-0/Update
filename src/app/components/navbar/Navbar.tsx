import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../assets/images/removal.ai_c197b374-cfae-4464-aa0c-9d7d5eb3a11f-screenshot-from-2024-09-20-14-28-18.png";
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/system';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showChatRooms, setShowChatRooms] = useState(false);
  const token = localStorage.getItem('token');

  const handleMessagesClick = () => {
    setShowChatRooms(true);
    navigate("/chat");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const StyledAppBar = styled(AppBar)({
    backgroundColor: '#3f51b5',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  });

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Home
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button
            component={Link}
            to="/services"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Services
          </Button>
          <Button
            component={Link}
            to="/contact"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Contact Us
          </Button>
          {!token && (
            <>
              <Button
                component={Link}
                to="/register"
                sx={{
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Register
              </Button>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Login
              </Button>
            </>
          )}
          {token && (
            <>
              <Button
                onClick={handleLogout}
                sx={{
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Logout
              </Button>
              <Button
                onClick={handleMessagesClick}
                sx={{
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Messages
              </Button>
              <Button
                component={Link}
                to="/account-profile"
                sx={{
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Profile
              </Button>
            </>
          )}
        </Box>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;