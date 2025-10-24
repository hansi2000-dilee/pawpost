
import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { database, auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, TextField, Typography } from "@mui/material";

const PostForm = ({ userProfile, handleClose }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handlePost = async () => {
    if (!image) {
      alert("Please select an image to post.");
      return;
    }

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
      const newPostId = uuidv4();
      const user = auth.currentUser;
      const postRef = ref(database, `posts/${newPostId}`);
      await set(postRef, {
        caption: caption,
        imageUrl: data.data.url,
        timestamp: new Date().toISOString(),
        uid: user.uid,
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL,
        likes: [],
        comments: [],
      });
      setCaption("");
      setImage(null);
      handleClose();
    } else {
      alert("Image upload failed. Please try again.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create a New Post
      </Typography>
      <TextField
        fullWidth
        label="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
        Upload Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </Button>
      {image && <Typography sx={{ mb: 2 }}>{image.name}</Typography>}
      <Button variant="contained" onClick={handlePost} fullWidth>
        Post
      </Button>
    </Box>
  );
};

export default PostForm;
