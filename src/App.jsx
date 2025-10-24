import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import MyAccountPage from "./pages/MyAccountPage";
import WelcomePage from "./pages/WelcomePage";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { auth } from "./firebase";

const theme = createTheme({
  palette: {
    primary: {
      main: pink[400],
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar user={user} onLogout={handleLogout} />
        <Box sx={{ display: "flex" }}>
          {user && <Sidebar />}
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
          >
            <Routes>
              <Route path="/" element={!user ? <WelcomePage /> : <Navigate to="/home" />} />
              <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
              <Route path="/my-account" element={user ? <MyAccountPage /> : <Navigate to="/login" />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
