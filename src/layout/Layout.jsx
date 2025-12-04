import React from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography, Box, Switch } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCustomTheme } from '../theme/CustomTheme';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products',  path: '/products' },
  // add more nav items
];

const Layout = ({ children }) => {
  const { darkMode, toggleTheme } = useCustomTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            ☰
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Inventory App
          </Typography>
          <Switch checked={darkMode} onChange={toggleTheme} />
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={toggleDrawer}>
        <List>
          {navItems.map(item => (
            <ListItem button key={item.path} component={Link} to={item.path} onClick={toggleDrawer}>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow:1, p:3, mt:8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
