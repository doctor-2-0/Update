"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import signupBg from "@/assets/images/Signup.jpg";
import {
  setEmailOrUsername,
  setPassword,
  resetForm,
} from "@/features/formSlice";
import { login } from "@/features/authSlice";
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
import axios from "@/lib/axios";
import Image from "next/image";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const formState = useSelector((state: RootState) => state.form);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formState.Username) {
      errors.Username = "Username is required";
    }
    if (!formState.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [isLocationUpdated, setIsLocationUpdated] = useState(false);

  const handleLocationUpdateComplete = () => {
    setIsLocationUpdated(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrorMessage(null);
    setLoading(true);

    try {
      const result = await dispatch(
        login({
          Email: formState.Username,
          Password: formState.password,
        })
      ).unwrap();

      if (result.token) {
        localStorage.setItem("token", result.token);

        try {
          const response = await axios.get("/auth/check-doctor", {
            headers: { Authorization: `Bearer ${result.token}` },
          });
          const response2 = await axios.get("/auth/check-patient", {
            headers: { Authorization: `Bearer ${result.token}` },
          });

          const isDoctor = response.data.isDoctor;
          const isPatient = response2.data.isPatient;

          setIsLoggedIn(true);
          setUserRole(isDoctor ? "Doctor" : "Patient");
        } catch (error) {
          setErrorMessage("Error determining user type");
        }

        dispatch(resetForm());
      } else {
        setErrorMessage("Login failed: No token received");
      }
    } catch (error) {
      setErrorMessage(
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && isLocationUpdated) {
      if (userRole === "Patient") {
        router.push("/");
      } else if (userRole === "Doctor") {
        router.push("/dashboard");
      }
    }
  }, [isLoggedIn, isLocationUpdated, userRole, router]);

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
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Login Here
          </Typography>

          {errorMessage && (
            <Typography variant="body2" color="error" align="center">
              {errorMessage}
            </Typography>
          )}

          <TextField
            label="Your Email"
            value={formState.Username}
            onChange={(e) => dispatch(setEmailOrUsername(e.target.value))}
            fullWidth
            margin="normal"
            error={!!formErrors.Username}
            helperText={formErrors.Username}
          />

          <TextField
            label="Password"
            type="password"
            value={formState.password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            fullWidth
            margin="normal"
            error={!!formErrors.password}
            helperText={formErrors.password}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? "Logging In..." : "Login"}
          </Button>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControlLabel
              control={<Checkbox name="remember" color="primary" />}
              label="Remember me"
            />
            <Typography variant="body2">
              <Link href="#">Lost your password?</Link>
            </Typography>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              Don't have an account yet?
              <Link href="/register" passHref>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ ml: 1, cursor: "pointer" }}
                >
                  Register Here
                </Typography>
              </Link>
            </Typography>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Or sign in with:
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2}>
            <IconButton
              aria-label="Sign in with Facebook"
              href="https://www.facebook.com"
            >
              <Facebook sx={{ color: "#3b5998" }} />
            </IconButton>
            <IconButton
              aria-label="Sign in with LinkedIn"
              href="https://www.linkedin.com"
            >
              <LinkedIn sx={{ color: "#0077b5" }} />
            </IconButton>
            <IconButton
              aria-label="Sign in with Twitter"
              href="https://www.twitter.com"
            >
              <Twitter sx={{ color: "#1da1f2" }} />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {isLoggedIn && <UserLocation onComplete={handleLocationUpdateComplete} />}
    </Box>
  );
};

export default LoginForm;
