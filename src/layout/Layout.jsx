import React from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography, Box, Switch } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCustomTheme } from '../theme/CustomTheme';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Products',  path: '/products' },
  { label: 'Billing', path: '/billing' },
  { label: 'Bills', path: '/bills' },
  { label: 'Purchases', path: '/purchases' },
  { label: 'Returns', path: '/returns' },
  { label: 'Expiry Notification', path: '/expiry-notification' },
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

      <Drawer 
        open={drawerOpen} 
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: 250 }
        }}
      >
        <Box sx={{ width: 250, pt: 8, height: '100%', overflow: 'auto' }}>
          <List>
            {navItems.map(item => (
              <ListItem 
                key={item.path} 
                component={Link} 
                to={item.path} 
                onClick={toggleDrawer}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow:1, p:3, mt:8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
