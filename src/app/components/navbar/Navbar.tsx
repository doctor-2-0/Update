"use client";
import logo from "../../../assets/images/Logo.png";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/system";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [showChatRooms, setShowChatRooms] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  React.useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleMessagesClick = () => {
    setShowChatRooms(true);
    router.push("/chat");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  };

  const StyledAppBar = styled(AppBar)({
    backgroundColor: "#3f51b5",
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
  });

  const StyledLink = styled("a")({
    textDecoration: "none",
    color: "inherit",
  });

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            style={{ marginRight: 16 }}
          />
          <Link href="/" passHref legacyBehavior>
            <StyledLink>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  color: "#fff",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  padding: "6px 8px",
                  borderRadius: "4px",
                }}
              >
                Home
              </Typography>
            </StyledLink>
          </Link>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Link href="/services" passHref>
            <Button
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Services
            </Button>
          </Link>
          <Link href="/contact" passHref>
            <Button
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Contact Us
            </Button>
          </Link>
          {!token && (
            <>
              <Link href="/register" passHref>
                <Button
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Register
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Login
                </Button>
              </Link>
            </>
          )}
          {token && (
            <>
              <Button
                onClick={handleLogout}
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Logout
              </Button>
              <Button
                onClick={handleMessagesClick}
                sx={{
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Messages
              </Button>
              <Link href="/account-profile" passHref>
                <Button
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Profile
                </Button>
              </Link>
            </>
          )}
        </Box>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
