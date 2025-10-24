
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  CardHeader,
  IconButton,
  Modal,
  Fab,
  CircularProgress,
} from "@mui/material";
import { Favorite, Comment, MoreVert, Add } from "@mui/icons-material";
import { auth, database } from "../firebase";
import { ref, onValue, update } from "firebase/database";
import PostForm from "../components/PostForm";
import { formatDistanceToNow } from "date-fns";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const user = auth.currentUser;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const postsRef = ref(database, "posts");
    const unsubscribe = onValue(postsRef, (snapshot) => {
        const postsData = [];
        snapshot.forEach((childSnapshot) => {
            postsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setPosts(postsData.sort((a, b) => {
            if (a.timestamp && b.timestamp) {
                return new Date(b.timestamp) - new Date(a.timestamp);
            }
            return 0;
        }));
        setLoading(false);
    });
    return () => unsubscribe();
}, []);

  const handleLike = async (postId) => {
    if (!user) return;
    const post = posts.find((p) => p.id === postId);
    const userId = user.uid;
    const updates = {};
    const currentLikes = post.likes || [];
    if (currentLikes.includes(userId)) {
      updates[`posts/${postId}/likes`] = currentLikes.filter((id) => id !== userId);
    } else {
      updates[`posts/${postId}/likes`] = [...currentLikes, userId];
    }
    await update(ref(database), updates);
  };

  const handleComment = async (postId, comment) => {
    if (!user || !userProfile) return;
    const post = posts.find((p) => p.id === postId);
    const updates = {};
    const currentComments = post.comments || [];
    updates[`posts/${postId}/comments`] = [
      ...currentComments,
      {
        text: comment,
        uid: user.uid,
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL,
        timestamp: new Date().toISOString(),
      },
    ];
    await update(ref(database), updates);
  };


  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {user && userProfile && (
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            Welcome, {userProfile.displayName}!
          </Typography>
        )}
        <Typography variant="h5" component="h2" sx={{ mb: 4, fontWeight: "bold" }}>
          Puppy Feed
        </Typography>

        {user && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={handleOpen}
          >
            <Add />
          </Fab>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <PostForm userProfile={userProfile} handleClose={handleClose} />
          </Box>
        </Modal>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
            No posts yet. Be the first to share a photo of your puppy!
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {posts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <Card sx={{ borderRadius: 4, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)" }}>
                  <CardHeader
                    avatar={<Avatar src={post.photoURL}>{post.displayName?.substring(0, 1)}</Avatar>}
                    title={<Typography sx={{ fontWeight: "bold" }}>{post.displayName}</Typography>}
                    subheader={post.timestamp ? formatDistanceToNow(new Date(post.timestamp), { addSuffix: true }) : "Just now"}
                    action={<IconButton><MoreVert /></IconButton>}
                  />
                  {post.imageUrl && <img src={post.imageUrl} alt={post.caption} style={{ width: "100%", height: "200px", objectFit: "cover" }} />}
                  <CardContent>
                    <Typography variant="body2">{post.caption}</Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton onClick={() => handleLike(post.id)} disabled={!user}>
                      <Favorite color={user && post.likes?.includes(user.uid) ? "error" : "inherit"} />
                      <Typography sx={{ ml: 1, fontSize: "0.8rem" }}>{post.likes?.length || 0}</Typography>
                    </IconButton>
                    <IconButton disabled={!user}>
                      <Comment />
                      <Typography sx={{ ml: 1, fontSize: "0.8rem" }}>{post.comments?.length || 0}</Typography>
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
