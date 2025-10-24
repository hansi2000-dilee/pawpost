import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { database, auth } from '../firebase';
import { ref, query, orderByChild, equalTo, onValue, remove } from 'firebase/database';

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const postsRef = ref(database, 'posts');
    const userPostsQuery = query(postsRef, orderByChild('uid'), equalTo(user.uid));

    const unsubscribe = onValue(userPostsQuery, (snapshot) => {
      const userPosts = [];
      snapshot.forEach((childSnapshot) => {
        userPosts.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setPosts(userPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleDelete = async () => {
    if (selectedPostId) {
      const postRef = ref(database, `posts/${selectedPostId}`);
      await remove(postRef);
      handleMenuClose();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return <Typography>You have not created any posts yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {posts.map((post) => (
        <Grid item key={post.id} xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
            <CardHeader
              avatar={<Avatar src={post.photoURL}>{post.displayName?.substring(0, 1)}</Avatar>}
              action={
                <IconButton aria-label="settings" onClick={(e) => handleMenuOpen(e, post.id)}>
                  <MoreVertIcon />
                </IconButton>
              }
              title={<Typography variant="subtitle2" sx={{ fontWeight: 'bold'}}>{post.displayName}</Typography>}
              subheader={new Date(post.timestamp).toLocaleString()}
            />
            {post.imageUrl && (
              <CardMedia component="img" height="200" image={post.imageUrl} alt={post.caption} />
            )}
            <CardContent>
              <Typography variant="body2">{post.caption}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</MenuItem>
      </Menu>
    </Grid>
  );
};

export default UserPosts;
