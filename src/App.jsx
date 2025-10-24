import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import MyAccountPage from "./pages/MyAccountPage";
import WelcomePage from "./pages/WelcomePage";
import Sidebar from "./components/Sidebar";
import SimpleNavbar from "./components/SimpleNavbar";
import { auth } from "./firebase";
import { Link } from "react-router-dom";

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

const drawerWidth = 240;

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    handleClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {!user ? (
          <SimpleNavbar />
        ) : (
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Home
              </Typography>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar src={user.photoURL}>
                  {user.displayName?.substring(0, 1)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  to="/my-account"
                >
                  My Account
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ display: "flex" }}>
          {user && (
            <Sidebar
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
              user={user}
              onLogout={handleLogout}
            />
          )}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: user ? `calc(100% - ${drawerWidth}px)` : "100%" },
              marginTop: user ? "64px" : "0",
            }}
          >
            <Routes>
              <Route
                path="/"
                element={!user ? <WelcomePage /> : <Navigate to="/home" />}
              />
              <Route
                path="/home"
                element={user ? <HomePage /> : <Navigate to="/login" />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route
                path="/profile"
                element={user ? <ProfilePage /> : <Navigate to="/login" />}
              />
              <Route
                path="/my-account"
                element={user ? <MyAccountPage /> : <Navigate to="/login" />}
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
