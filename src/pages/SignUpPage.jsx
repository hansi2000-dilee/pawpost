
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import Swal from "sweetalert2";

const theme = createTheme({
  palette: {
    primary: {
      main: pink[400],
    },
    secondary: {
      main: pink[600],
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      const user = userCredential.user;
      await set(ref(database, 'users/' + user.uid), {
        name: name,
        email: email,
      });

      Swal.fire({
        icon: 'success',
        title: 'Signed Up!',
        text: 'You have successfully signed up. Please log in to continue.',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        navigate("/login");
      });

    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email address is already in use by another account.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = "Something went wrong. Please try again.";
      }
      Swal.fire({
        icon: 'error',
        title: 'Sign-Up Failed',
        text: errorMessage,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)", // Full height minus navbar
          bgcolor: pink[50],
          p: 2,
        }}
      >
        <Box
          sx={{
            p: 4,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
            maxWidth: "550px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: "bold", color: "primary.main" }}>
            Join ForeverPaws!
          </Typography>
          <Typography component="h2" variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
            Create your account
          </Typography>
          <Box component="form" onSubmit={handleSignUp} noValidate>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              label="Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Button onClick={() => navigate("/login")} sx={{ textTransform: "none" }}>
                  Already have an account? Sign in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignUpPage;
