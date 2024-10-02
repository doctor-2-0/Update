"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import signupBg from "@/assets/images/Signup.jpg";
import { useAuth } from "@/hooks/useAuth";
import UserLocation from "../user/UserLocation";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Facebook, LinkedIn, Twitter } from "@mui/icons-material";
import Image from "next/image";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const { auth, handleLogin } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocationUpdated, setIsLocationUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationUpdateComplete = () => {
    setIsLocationUpdated(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await handleLogin({
        email: emailOrUsername,
        username: emailOrUsername,
        password,
      });
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && isLocationUpdated) {
      if (auth.user?.role === "Patient") {
        router.push("/");
      } else if (auth.user?.role === "Doctor") {
        router.push("/dashboard");
      }
    }
  }, [auth.isAuthenticated, isLocationUpdated, auth.user?.role, router]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          boxShadow: 3,
          borderRadius: 2,
          width: "75%",
          maxWidth: "1200px",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" },
            position: "relative",
          }}
        >
          <Image
            src={signupBg}
            alt="Login background"
            layout="fill"
            objectFit="cover"
          />
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Login to Your Account
          </Typography>
          <TextField
            label="Email or Username"
            variant="outlined"
            margin="normal"
            fullWidth
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
          {errorMessage && (
            <Typography color="error" align="center">
              {errorMessage}
            </Typography>
          )}
          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link href="/register">
              <Typography component="span" color="primary">
                Sign up
              </Typography>
            </Link>
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <IconButton>
              <Facebook />
            </IconButton>
            <IconButton>
              <Twitter />
            </IconButton>
            <IconButton>
              <LinkedIn />
            </IconButton>
          </Stack>
        </Box>
      </Box>
      <UserLocation onComplete={handleLocationUpdateComplete} />
    </Box>
  );
};

export default LoginForm;
