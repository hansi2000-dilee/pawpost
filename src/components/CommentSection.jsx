
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { database, auth } from "../firebase";
import { ref, onValue, push, serverTimestamp, update } from "firebase/database";
import { formatDistanceToNow } from "date-fns";
import { Reply } from "@mui/icons-material";

const CommentSection = ({ postId, userProfile, postOwnerId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const commentsRef = ref(database, `comments/${postId}`);
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const commentsData = [];
      snapshot.forEach((childSnapshot) => {
        commentsData.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    const commentsRef = ref(database, `comments/${postId}`);
    await push(commentsRef, {
      text: newComment,
      uid: user.uid,
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL,
      timestamp: serverTimestamp(),
    });
    setNewComment("");
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim() || !user) return;
    const commentRef = ref(database, `comments/${postId}/${commentId}/replies`);
    await push(commentRef, {
      text: replyText,
      uid: user.uid,
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL,
      timestamp: serverTimestamp(),
    });
    setReplyTo(null);
    setReplyText("");
  };


  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments
      </Typography>
      <List>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={comment.photoURL}>
                  {comment.displayName?.substring(0, 1)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={comment.displayName}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {comment.text}
                    </Typography>
                    {" — "}
                    {comment.timestamp
                      ? formatDistanceToNow(new Date(comment.timestamp), {
                          addSuffix: true,
                        })
                      : "Just now"}
                  </>
                }
              />
              {user && user.uid === postOwnerId && (
                <IconButton onClick={() => setReplyTo(comment.id)}>
                  <Reply />
                </IconButton>
              )}
            </ListItem>
            {comment.replies &&
              Object.values(comment.replies).map((reply, i) => (
                <ListItem key={i} sx={{ pl: 4 }}>
                  <ListItemAvatar>
                    <Avatar src={reply.photoURL}>
                      {reply.displayName?.substring(0, 1)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={reply.displayName}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {reply.text}
                        </Typography>
                        {" — "}
                        {reply.timestamp
                          ? formatDistanceToNow(new Date(reply.timestamp), {
                              addSuffix: true,
                            })
                          : "Just now"}
                      </>
                    }
                  />
                </ListItem>
              ))}
            {replyTo === comment.id && (
              <Box sx={{ pl: 4, mt: 1, display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Add a reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button onClick={() => handleReply(comment.id)} sx={{ ml: 1 }}>
                  Reply
                </Button>
              </Box>
            )}
            {index < comments.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment} sx={{ ml: 1 }}>
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;
