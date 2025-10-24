import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import { auth, database } from "../firebase";
import { ref as dbRef, get } from "firebase/database";

const ProfileDisplay = () => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userRef = dbRef(database, `users/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            // Fallback to auth data if no DB entry
            setUserData({
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              address: "Not provided",
              contact: "Not provided",
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return <Typography>User data not found.</Typography>;
  }

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center', alignSelf: 'center' }}>
                <Avatar
                    src={userData.photoURL}
                    sx={{ width: 120, height: 120, border: "2px solid #ccc", margin: 'auto' }}
                >
                    {userData.displayName?.substring(0, 1)}
                </Avatar>
            </Grid>
            <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{userData.displayName}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{userData.email}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Address:</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{userData.address}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Contact:</Typography>
                <Typography variant="body1" color="text.secondary">{userData.contact}</Typography>
            </Grid>
        </Grid>
    </Paper>
  );
};

export default ProfileDisplay;
