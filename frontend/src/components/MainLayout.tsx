import React from 'react';
import { Box, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, InputBase, Avatar, AppBar, Toolbar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 240;

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
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
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

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
        {[
          { text: 'Dashboard', icon: <DashboardIcon /> },
          { text: 'Department', icon: <BusinessIcon /> },
          { text: 'Employee', icon: <PeopleIcon /> },
          { text: 'Settings', icon: <SettingsIcon /> },
        ].map((item, index) => (
          <StyledListItemButton
            key={item.text}
            selected={selectedIndex === index}
            onClick={() => handleListItemClick(index)}
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

const Header = () => (
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
    </Box>
  </Paper>
);

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