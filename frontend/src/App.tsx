import React from 'react';
import { Typography, Container, Box } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hello World
        </Typography>
      </Box>
    </Container>
  );
}

export default App;