import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import { updateField, resetForm } from "../../features/contactFormSlice";
import { RootState } from "../../store/store";
import { SelectChangeEvent } from "@mui/material";
import ContactImage from "../../assets/images/ielts-listening-form-completion_1.webp";

const ContactForm: React.FC = () => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.contactForm);

  const [errors, setErrors] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    topic: "",
    message: "",
  });

  const validate = () => {
    let tempErrors = { ...errors };
    tempErrors.firstName = formState.firstName ? "" : "First name is required.";
    tempErrors.lastName = formState.lastName ? "" : "Last name is required.";
    tempErrors.email = /.+@.+..+/.test(formState.email)
      ? ""
      : "Enter a valid email.";
    tempErrors.phoneNumber = formState.phoneNumber
      ? ""
      : "Phone number is required.";
    tempErrors.topic = formState.topic ? "" : "Please select a topic.";
    tempErrors.message = formState.message ? "" : "Message cannot be empty.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    dispatch(updateField({ [name]: value }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateField({ acceptTerms: event.target.checked }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) {
      console.log("Form submitted:", formState);
      dispatch(resetForm());
    }
  };

  return (
    <>
      <Paper elevation={6} sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 600,
            margin: "auto",
            padding: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Avatar
              alt="Contact Us"
              src={ContactImage}
              sx={{ width: 100, height: 100 }}
            />
          </Box>
          <Typography variant="h4" gutterBottom textAlign="center">
            Contact Us
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="First name"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last name"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone number"
            name="phoneNumber"
            type="tel"
            value={formState.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
          <FormControl fullWidth margin="normal" error={!!errors.topic}>
            <InputLabel>Choose a topic</InputLabel>
            <Select
              value={formState.topic}
              label="Choose a topic"
              name="topic"
              onChange={handleChange}
            >
              <MenuItem value="general">General Inquiry</MenuItem>
              <MenuItem value="support">Technical Support</MenuItem>
              <MenuItem value="billing">Billing Question</MenuItem>
            </Select>
            {errors.topic && (
              <Typography variant="caption" color="error">
                {errors.topic}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Message"
            name="message"
            multiline
            rows={4}
            value={formState.message}
            onChange={handleChange}
            error={!!errors.message}
            helperText={errors.message}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.acceptTerms}
                onChange={handleCheckboxChange}
                name="acceptTerms"
              />
            }
            label="I accept the terms"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!formState.acceptTerms}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default ContactForm;
