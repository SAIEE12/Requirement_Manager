import React from 'react';
import { Typography, Container } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to the Dashboard
      </Typography>
    </Container>
  );
};

export default DashboardPage;