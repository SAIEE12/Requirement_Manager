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
import { locationService, Location } from '../services/locationService';

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const fetchedLocations = await locationService.getLocations();
      setLocations(fetchedLocations);
      setError(null);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (location: Location | null = null) => {
    if (location) {
      setEditingLocation(location);
      setFormData({ 
        name: location.name, 
        country: location.country, 
        description: location.description || '' 
      });
    } else {
      setEditingLocation(null);
      setFormData({ name: '', country: '', description: '' });
    }
    setIsSubmitted(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLocation(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!formData.name.trim() || !formData.country.trim()) return;

    try {
      if (editingLocation) {
        await locationService.updateLocation(editingLocation.id, formData);
      } else {
        await locationService.createLocation(formData);
      }
      fetchLocations();
      handleCloseDialog();
    } catch (err: any) {
      setError('Failed to save location');
      console.error('Error saving location:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await locationService.deleteLocation(id);
        fetchLocations();
      } catch (err) {
        setError('Failed to delete location');
        console.error('Error deleting location:', err);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Location Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Add New Location
      </Button>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.country}</TableCell>
                <TableCell>{location.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(location)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(location.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Location Name"
              type="text"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
              error={isSubmitted && !formData.name.trim()}
              helperText={isSubmitted && !formData.name.trim() ? 'Location name is required' : ''}
            />
            <TextField
              margin="dense"
              name="country"
              label="Country"
              type="text"
              fullWidth
              required
              value={formData.country}
              onChange={handleInputChange}
              error={isSubmitted && !formData.country.trim()}
              helperText={isSubmitted && !formData.country.trim() ? 'Country is required' : ''}
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
            {editingLocation ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LocationsPage;