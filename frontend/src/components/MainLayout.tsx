import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, InputBase, Avatar, Paper, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 240;

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'component' && prop !== 'to'
})<{ component?: React.ElementType; to?: string }>(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#ffffff',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.primary.main,
    },
  },
  '&.Mui-selected': {
    backgroundColor: '#ffffff',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.primary.main,
    },
  },
}));

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Department', icon: <BusinessIcon />, path: '/department' },
    { text: 'Clients', icon: <BusinessIcon />, path: '/clients' },
    { text: 'Employee', icon: <PeopleIcon />, path: '/employee' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'primary.main',
          color: 'white',
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          border: 'none',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
        <Typography variant="h6" noWrap component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
          RManager
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <StyledListItemButton
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

const Header = () => {
// const Header = () => (

const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 2,
      mb: 2
    }}
  >
    <Typography variant="h6" component="div">
      Dashboard Overview
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        borderRadius: 20,
        px: 2,
        mr: 2,
      }}>
        <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <InputBase
          placeholder="Search here"
          inputProps={{ 'aria-label': 'search' }}
        />
      </Box>
      <Avatar sx={{ width: 32, height: 32 }}>U</Avatar>
      <Button
          variant="outlined"
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
    </Box>
  </Paper>
);
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;