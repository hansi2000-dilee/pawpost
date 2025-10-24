import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import ProfileDisplay from "../components/ProfileDisplay"; // Corrected import
import UserPosts from "../components/UserPosts";

const MyAccountPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>My Account</Typography>
        <Divider sx={{ mb: 3 }} />
        
        {/* Read-only Profile Display */}
        <ProfileDisplay />
        
        {/* User Posts Section */}
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>My Posts</Typography>
          <Divider sx={{ mb: 3 }} />
          <UserPosts />
        </Paper>
      </Box>
    </Container>
  );
};

export default MyAccountPage;
