import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import TestimonialCard from "./TestimonialCard";

const TestimonialsWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(10, 0),
}));

const TitleWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(6),
}));

const GradientTitle = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #1976d2, #2196f3)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: 700,
  fontSize: "3rem",
  marginBottom: theme.spacing(2),
}));

const AllTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: "John Smith",
      testimonial: "Great experience with DocConnect!",
      avatarUrl:
        "https://www.findtherightclick.com/wp-content/uploads/2017/07/Matt-T-Testimonial-pic.jpg",
    },
    {
      name: "Sarah Johnson",
      testimonial: "The doctors are very professional.",
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSKicD_26pEwOIlh5hgyyMg0nP49OBSaXK1A&s",
    },
    {
      name: "Mike Brown",
      testimonial: "Highly recommend their services.",
      avatarUrl:
        "https://simg.nicepng.com/png/small/792-7926701_speakers-men-png-images-testimonial.png",
    },
  ];

  return (
    <TestimonialsWrapper>
      <Container maxWidth="lg">
        <TitleWrapper>
          <GradientTitle variant="h2" align="center">
            What Our Patients Say
          </GradientTitle>
        </TitleWrapper>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <TestimonialCard
                name={testimonial.name}
                testimonial={testimonial.testimonial}
                avatarUrl={testimonial.avatarUrl}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </TestimonialsWrapper>
  );
};

export default AllTestimonials;
