import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";

const WelcomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)", // Adjust for navbar height
        background: "linear-gradient(to right, #ffafbd, #ffc3a0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            padding: 4,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(5px)",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx5F6VdGETcWRSCY0v9O-JdFDKyogwgAqoEpRi5o472IiXUXxvszZ9ThqSjdC5LJo1Ns0&usqp=CAU"
            alt="Cute puppy"
            style={{
              width: "200px",
              borderRadius: "15px",
              marginBottom: "16px",
            }}
          />
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Pappiespaw
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Your one-stop solution for all your pet needs. Share, connect, and
            have fun with a community of fellow puppy lovers.
          </Typography>
          <Box sx={{ mt: 4, mb: 4 }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2, mb: { xs: 2, md: 0 } }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              size="large"
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomePage;
