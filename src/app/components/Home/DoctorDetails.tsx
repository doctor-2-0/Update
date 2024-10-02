"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { RootState } from "@/lib/store";
import { SelectedDoctor } from "@/features/HomeSlices/selectedDoctorSlice";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Rating,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import AppointmentBooking from "./AppointmentBooking";
import { isAxiosError } from "axios";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MessageIcon from "@mui/icons-material/Message";

interface Review {
  id: number;
  patientName: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
}

const HeroWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(5, 0),
}));

const DoctorImage = styled("img")({
  width: "100%",
  height: "400px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "20px",
});

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
}));

const DoctorDetails: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, reviewText: "" });
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedDoctor = useSelector<RootState, SelectedDoctor | null>(
    (state) => state.selectedDoctor
  );

  useEffect(() => {
    const fetchReviews = async () => {
      if (selectedDoctor) {
        try {
          const response = await axios.get(
            `/doctorReview/${selectedDoctor.UserID}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setReviews(response.data);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [selectedDoctor]);

  const handleReviewSubmit = async () => {
    if (selectedDoctor) {
      try {
        const response = await axios.post(
          `/doctorReview/${selectedDoctor.UserID}`,
          {
            rating: newReview.rating,
            reviewText: newReview.reviewText,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReviews([...reviews, response.data]);
        setOpenReviewDialog(false);
        setNewReview({ rating: 0, reviewText: "" });
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  const handleMessageClick = async () => {
    try {
      const response = await axios.post(
        `/chatroom/${selectedDoctor?.FirstName ?? "unknown"}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const chatroomId = response.data.chatRoom.id;
      router.push(`/chat?chatroomId=${chatroomId}`);
    } catch (error) {
      console.error("Error creating chatroom:", error);
      if (isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
      }
    }
  };

  if (!selectedDoctor) {
    return <Typography>No doctor selected</Typography>;
  }

  return (
    <HeroWrapper>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <InfoCard elevation={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <DoctorImage
                    src={selectedDoctor.imageUrl}
                    alt={`${selectedDoctor.FirstName} ${selectedDoctor.LastName}`}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h4" gutterBottom>
                    Dr. {selectedDoctor.FirstName} {selectedDoctor.LastName}
                  </Typography>
                  <Chip
                    label={selectedDoctor.Speciality}
                    color="primary"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body1" paragraph>
                    {selectedDoctor.Bio}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <EmailIcon sx={{ mr: 1 }} />
                    <Typography>{selectedDoctor.Email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Typography>(123) 456-7890</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography>123 Medical St, City, State 12345</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMessageClick}
                    startIcon={<MessageIcon />}
                  >
                    Message
                  </Button>
                </Grid>
              </Grid>
            </InfoCard>

            <InfoCard elevation={3}>
              <Typography variant="h5" gutterBottom>
                Patient Reviews
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenReviewDialog(true)}
                startIcon={<MessageIcon />}
                sx={{ mb: 2 }}
              >
                Write a Review
              </Button>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <ReviewCard key={review.id}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar sx={{ mr: 2 }}>{review.patientName[0]}</Avatar>
                      <Typography variant="subtitle1">
                        {review.patientName}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                      {review.reviewText}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </Typography>
                  </ReviewCard>
                ))
              ) : (
                <Typography>No reviews yet.</Typography>
              )}
            </InfoCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoCard elevation={3}>
              <Typography variant="h5" gutterBottom>
                Book an Appointment
              </Typography>
              <AppointmentBooking doctor={selectedDoctor} />
            </InfoCard>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box mb={2}>
            <Typography gutterBottom>Your Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) =>
                setNewReview({ ...newReview, rating: newValue || 0 })
              }
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Your Review"
            value={newReview.reviewText}
            onChange={(e) =>
              setNewReview({ ...newReview, reviewText: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color="primary"
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </HeroWrapper>
  );
};

export default DoctorDetails;
