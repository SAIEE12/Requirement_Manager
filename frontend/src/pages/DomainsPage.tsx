import React, { useState, useEffect } from 'react';
import {
  Container,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { domainService, Domain } from '../services/domainService';

const DomainsPage: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const fetchedDomains = await domainService.getDomains();
      setDomains(fetchedDomains);
      setError(null);
    } catch (err) {
      setError('Failed to fetch domains');
      console.error('Error fetching domains:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (domain: Domain | null = null) => {
    if (domain) {
      setEditingDomain(domain);
      setFormData({ name: domain.name, description: domain.description || '' });
    } else {
      setEditingDomain(null);
      setFormData({ name: '', description: '' });
    }
    setIsSubmitted(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDomain(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!formData.name.trim()) return;

    try {
      if (editingDomain) {
        await domainService.updateDomain(editingDomain.id, formData);
      } else {
        await domainService.createDomain(formData);
      }
      fetchDomains();
      handleCloseDialog();
    } catch (err: any) {
      setError('Failed to save domain');
      console.error('Error saving domain:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this domain?')) {
      try {
        await domainService.deleteDomain(id);
        fetchDomains();
      } catch (err) {
        setError('Failed to delete domain');
        console.error('Error deleting domain:', err);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Domain Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Add New Domain
      </Button>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map((domain) => (
              <TableRow key={domain.id}>
                <TableCell>{domain.name}</TableCell>
                <TableCell>{domain.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(domain)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(domain.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingDomain ? 'Edit Domain' : 'Add New Domain'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Domain Name"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
              error={isSubmitted && !formData.name.trim()}
              helperText={isSubmitted && !formData.name.trim() ? 'Domain name is required' : ''}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingDomain ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DomainsPage;