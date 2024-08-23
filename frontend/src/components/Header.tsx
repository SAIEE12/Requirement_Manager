import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Avatar, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Requirements Manager
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
          <SearchIcon />
          <InputBase
            placeholder="Search…"
            sx={{ ml: 1, color: 'inherit' }}
          />
        </Box>
        <Avatar alt="User Name" src="/static/images/avatar/1.jpg" />
      </Toolbar>
    </AppBar>
  );
};

export default Header;