import React from 'react';
import { Drawer, Box, Avatar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Person, AccountBox } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const drawerWidth = 240;

const Sidebar = () => {
  const user = auth.currentUser;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Avatar src={user?.photoURL} sx={{ width: 80, height: 80, mb: 1 }}>
          {user?.displayName?.substring(0, 1)}
        </Avatar>
        <Typography variant="h6">Welcome,</Typography>
        <Typography variant="body1" sx={{fontWeight: 'bold'}}>{user?.displayName || 'User'}</Typography>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/home">
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/profile">
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="User Profile" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/my-account">
            <ListItemIcon>
              <AccountBox />
            </ListItemIcon>
            <ListItemText primary="My Account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
