
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ref as dbRef, get, set } from "firebase/database";
import { database, auth } from "../firebase";

const ProfilePage = () => {
  const [displayName, setDisplayName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userRef = dbRef(database, `users/${user.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setDisplayName(data.displayName || user.displayName || "");
          setAddress(data.address || "");
          setContact(data.contact || "");
          setPhotoURL(data.photoURL || user.photoURL || "");
        } else {
          setDisplayName(user.displayName || "");
          setPhotoURL(user.photoURL || "");
        }
      });
    }
  }, [user]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let finalPhotoURL = photoURL;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=9a28589d8dc8606ec4f21b400882bc11`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.success) {
          finalPhotoURL = data.data.url; // Correctly assign the new URL
        } else {
          throw new Error("Image upload failed. Please try again.");
        }
      }

      const userRef = dbRef(database, `users/${user.uid}`);
      await set(userRef, {
        displayName,
        email: user.email,
        address,
        contact,
        photoURL: finalPhotoURL,
      });

      setPhotoURL(finalPhotoURL);
      setImage(null);
      setSuccess("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h6">Please log in to view your profile.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: "bold" }}>
          Edit Profile
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar src={photoURL} sx={{ width: 80, height: 80, mr: 2 }} />
          <Button variant="contained" component="label">
            Upload Photo
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </Box>
        {image && <Typography sx={{ mb: 2 }}>{image.name}</Typography>}
        <TextField
          fullWidth
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          value={user.email}
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Profile"}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      </Box>
    </Container>
  );
};

export default ProfilePage;
