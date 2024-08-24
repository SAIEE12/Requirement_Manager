import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// This would come from your API in a real application
const mockClients = [
  { id: 1, name: 'Qualcomm', industry: 'Semiconductors', contactPerson: 'John Doe', email: 'john@qualcomm.com' },
  { id: 2, name: 'NXP', industry: 'Semiconductors', contactPerson: 'Jane Smith', email: 'jane@nxp.com' },
  { id: 3, name: 'AMD', industry: 'Semiconductors', contactPerson: 'Bob Johnson', email: 'bob@amd.com' },
  { id: 4, name: 'Samsung', industry: 'Electronics', contactPerson: 'Alice Brown', email: 'alice@samsung.com' },
  { id: 5, name: 'LG', industry: 'Electronics', contactPerson: 'Charlie Davis', email: 'charlie@lg.com' },
];

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState(mockClients);

  // In a real application, you would fetch clients from an API here
  useEffect(() => {
    // fetchClients();
  }, []);

  const handleAddClient = () => {
    // Implement add client functionality
    console.log('Add client');
  };

  const handleEditClient = (id: number) => {
    // Implement edit client functionality
    console.log('Edit client', id);
  };

  const handleDeleteClient = (id: number) => {
    // Implement delete client functionality
    console.log('Delete client', id);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Clients
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClient}>
          Add Client
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>{client.contactPerson}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClient(client.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClient(client.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClientsPage;