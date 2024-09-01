import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, InputBase, Avatar, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DomainIcon from '@mui/icons-material/Domain';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 240;

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: '6px 14px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white,
    },
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.common.white,
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
}));


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Clients', icon: <BusinessIcon />, path: '/clients' },
    { text: 'Roles', icon: <AssignmentIcon />, path: '/roles' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Domains', icon: <DomainIcon />, path: '/domains' },
    { text: 'Locations', icon: <LocationOnIcon />, path: '/locations' },
    { text: 'Status', icon: <ListAltIcon />, path: '/status'},
    { text: 'Requirements', icon: <AssignmentIcon />, path: '/requirements' }, // New menu item
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
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Function to get the title based on the current path
  const getTitle = () => {
    const path = location.pathname.split('/')[1];
    if (path === '') return 'Dashboard Overview';
    return path.charAt(0).toUpperCase() + path.slice(1);
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
        {getTitle()}
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
        <Avatar sx={{ width: 32, height: 32, mr: 2 }}>U</Avatar>
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