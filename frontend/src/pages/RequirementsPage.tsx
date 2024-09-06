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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { requirementService, Requirement, RequirementCreate, RequirementUpdate } from '../services/requirementService';
import { Client, Location } from '../types/types';

const RequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    client_id: '',
    experience_min: '',
    experience_max: '',
    location_id: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');

  useEffect(() => {
    fetchRequirements();
    fetchClients();
    fetchLocations();
  }, []);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const fetchedRequirements = await requirementService.getRequirements();
      setRequirements(fetchedRequirements);
      setError(null);
    } catch (err) {
      setError('Failed to fetch requirements');
      console.error('Error fetching requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const fetchedClients = await requirementService.getClients();
      setClients(fetchedClients);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchLocations = async () => {
    try {
      const fetchedLocations = await requirementService.getLocations();
      setLocations(fetchedLocations);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleOpenDialog = (requirement: Requirement | null = null) => {
    if (requirement) {
      setEditingRequirement(requirement);
      setFormData({
        description: requirement.description,
        client_id: requirement.client_id.toString(),
        experience_min: requirement.experience_min.toString(),
        experience_max: requirement.experience_max.toString(),
        location_id: requirement.location_id.toString(),
        notes: requirement.notes || '',
      });
    } else {
      setEditingRequirement(null);
      setFormData({
        description: '',
        client_id: '',
        experience_min: '',
        experience_max: '',
        location_id: '',
        notes: '',
      });
    }
    setIsSubmitted(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRequirement(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!formData.description.trim() || !formData.client_id || !formData.experience_min || !formData.experience_max || !formData.location_id) return;

    try {
      const submitData = {
        description: formData.description,
        client_id: parseInt(formData.client_id),
        experience_min: parseInt(formData.experience_min),
        experience_max: parseInt(formData.experience_max),
        location_id: parseInt(formData.location_id),
        notes: formData.notes,
      };

      if (editingRequirement) {
        await requirementService.updateRequirement(editingRequirement.id, submitData);
      } else {
        await requirementService.createRequirement(submitData);
      }
      fetchRequirements();
      handleCloseDialog();
    } catch (err: any) {
      setError('Failed to save requirement');
      console.error('Error saving requirement:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      try {
        await requirementService.deleteRequirement(id);
        fetchRequirements();
      } catch (err) {
        setError('Failed to delete requirement');
        console.error('Error deleting requirement:', err);
      }
    }
  };

  const handleRequirementClick = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
  };

  const handleBackToList = () => {
    setSelectedRequirement(null);
  };

  const filteredRequirements = requirements.filter((req) => {
    return (
      (!filterClient || req.client_id.toString() === filterClient) &&
      (!filterLocation || req.location_id.toString() === filterLocation)
    );
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (selectedRequirement) {
    return (
      <Container>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackToList} style={{ marginBottom: '20px' }}>
          Back to Requirements List
        </Button>
        <Typography variant="h4" gutterBottom>
          Requirement Details
        </Typography>
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h6">ID: {selectedRequirement.id}</Typography>
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {selectedRequirement.description}
          </Typography>
          <Typography variant="body1">
            <strong>Client:</strong> {selectedRequirement.client.name}
          </Typography>
          <Typography variant="body1">
            <strong>Experience:</strong> {selectedRequirement.experience_min} - {selectedRequirement.experience_max} years
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {selectedRequirement.location.name}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Notes:</strong> {selectedRequirement.notes || 'N/A'}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Requirement Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Add New Requirement
      </Button>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Filter by Client</InputLabel>
          <Select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value as string)}
          >
            <MenuItem value="">All Clients</MenuItem>
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id.toString()}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Filter by Location</InputLabel>
          <Select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value as string)}
          >
            <MenuItem value="">All Locations</MenuItem>
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id.toString()}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Experience (Years)</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequirements.map((requirement) => (
              <TableRow key={requirement.id} onClick={() => handleRequirementClick(requirement)} style={{ cursor: 'pointer' }}>
                <TableCell>{requirement.id}</TableCell>
                <TableCell>{requirement.description.length > 50 ? `${requirement.description.substring(0, 50)}...` : requirement.description}</TableCell>
                <TableCell>{requirement.client.name}</TableCell>
                <TableCell>{`${requirement.experience_min} - ${requirement.experience_max}`}</TableCell>
                <TableCell>{requirement.location.name}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleOpenDialog(requirement); }} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(requirement.id); }} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingRequirement ? 'Edit Requirement' : 'Add New Requirement'}</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              required
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              error={isSubmitted && !formData.description.trim()}
              helperText={isSubmitted && !formData.description.trim() ? 'Description is required' : ''}
            />
            <TextField
              select
              margin="dense"
              name="client_id"
              label="Client"
              fullWidth
              required
              value={formData.client_id}
              onChange={handleInputChange}
              error={isSubmitted && !formData.client_id}
              helperText={isSubmitted && !formData.client_id ? 'Client is required' : ''}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id.toString()}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="experience_min"
              label="Minimum Experience"
              type="number"
              fullWidth
              required
              value={formData.experience_min}
              onChange={handleInputChange}
              error={isSubmitted && !formData.experience_min}
              helperText={isSubmitted && !formData.experience_min ? 'Minimum experience is required' : ''}
            />
            <TextField
              margin="dense"
              name="experience_max"
              label="Maximum Experience"
              type="number"
              fullWidth
              required
              value={formData.experience_max}
              onChange={handleInputChange}
              error={isSubmitted && !formData.experience_max}
              helperText={isSubmitted && !formData.experience_max ? 'Maximum experience is required' : ''}
            />
            <TextField
              select
              margin="dense"
              name="location_id"
              label="Location"
              fullWidth
              required
              value={formData.location_id}
              onChange={handleInputChange}
              error={isSubmitted && !formData.location_id}
              helperText={isSubmitted && !formData.location_id ? 'Location is required' : ''}
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id.toString()}>
                  {location.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="notes"
              label="Notes"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingRequirement ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RequirementsPage;