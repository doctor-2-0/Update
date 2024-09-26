import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../src/store/store";
import { useNavigate } from "react-router-dom";
import {
  setFirstName,
  setEmailOrUsername,
  setPassword,
  setConfirmPassword,
  setUserType,
  resetForm,
} from "../../src/features/formSlice";
import {
  TextField,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  Link,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import LocationSearch, { SearchResult } from './user/LocationSearch';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [meetingPrice, setMeetingPrice] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formState.password !== formState.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          FirstName: formState.firstName,
          LastName: "",
          Username: formState.Username,
          Password: formState.password,
          Email: formState.Username,
          Role: formState.userType === "doctor" ? "Doctor" : "Patient",
          Specialty: formState.userType === "doctor" ? specialty : "",
          Bio: formState.userType === "doctor" ? bio : "",
          MeetingPrice: formState.userType === "doctor" ? meetingPrice : "",
          Latitude: selectedLocation ? selectedLocation.lat : "",
          Longitude: selectedLocation ? selectedLocation.lon : "",
        }
      );

      if (response.status === 201) {
        console.log("Registration successful");
        navigate("/login");
        dispatch(resetForm());
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(
          error.response.data.message || "An error occurred during registration"
        );
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 3,
      }}
    >
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          backgroundColor: "white",
          maxWidth: 900,
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
          <img
            src="https://medikit-nextjs.vercel.app/_next/static/media/signup-bg.9daac4a8.jpg"
            alt="Side Image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Register Here
          </Typography>

          <Typography variant="body1" align="center" color="textSecondary">
            Already have an account?{" "}
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate("/login")}
              sx={{ ml: 1, color: "#1976d2" }}
            >
              Login Here
            </Link>
          </Typography>

          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          <TextField
            label="First Name"
            value={formState.firstName}
            onChange={(e) => dispatch(setFirstName(e.target.value))}
            fullWidth
            required
          />

          <TextField
            label="Email"
            type="email"
            value={formState.Username}
            onChange={(e) => dispatch(setEmailOrUsername(e.target.value))}
            fullWidth
            required
          />

          <Box display="flex" gap={2}>
            <TextField
              label="Password"
              type="password"
              value={formState.password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
              fullWidth
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={formState.confirmPassword}
              onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
              fullWidth
              required
            />
          </Box>

          <FormControl fullWidth required>
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="user-type-select"
              value={formState.userType}
              onChange={(e) => dispatch(setUserType(e.target.value))}
              label="User Type"
            >
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="doctor">Doctor</MenuItem>
            </Select>
          </FormControl>

          {formState.userType === "doctor" && (
            <>
              <TextField
                label="Specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                fullWidth
                required
              />

              <TextField
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />

              <TextField
                label="Meeting Price"
                type="number"
                value={meetingPrice}
                onChange={(e) => setMeetingPrice(e.target.value)}
                fullWidth
              />
            </>
          )}

          <LocationSearch
            onSelectLocation={(result) => {
              setSelectedLocation(result);
              console.log('Selected location:', result);
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                required
                name="terms"
              />
            }
            label={
              <Typography variant="body2">
                Yes, I agree with all{" "}
                <Link href="#" target="_blank">
                  Terms & Conditions
                </Link>
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;