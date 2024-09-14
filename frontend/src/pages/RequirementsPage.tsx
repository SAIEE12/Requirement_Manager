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
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { requirementService, Requirement, RequirementCreate, RequirementUpdate, RequirementComment } from '../services/requirementService';
import { Client, Location } from '../types/types';
import { differenceInDays } from 'date-fns';
import { getDomainIcon, getDomainColor } from '../utils/domainIcons';
import { getStatusIcon, getStatusColor } from '../utils/statusIcons';

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
  const [comments, setComments] = useState<RequirementComment[]>([]);
  const [newComment, setNewComment] = useState('');


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

  const calculateDaysOpen = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return differenceInDays(now, created);
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

  const handleRequirementClick = async (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setComments([]); // Reset comments when selecting a new requirement
    setNewComment(''); // Reset new comment input
    try {
      const fetchedComments = await requirementService.getComments(requirement.id);
      setComments(fetchedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!selectedRequirement || !newComment.trim()) return;
    try {
      console.log('Adding comment from Page, ', newComment);
      const addedComment = await requirementService.addComment(selectedRequirement.id, newComment);
      setComments(prevComments => [...prevComments, addedComment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
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

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Requirement Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Requirement
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
      {/* Left side - Requirements List */}
      <Grid item xs={12} md={7}>
        <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <FormControl sx={{ minWidth: 200 }}>
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
            <FormControl sx={{ minWidth: 200 }}>
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
          
          <Box flexGrow={1} overflow="auto">
            {filteredRequirements.map((requirement) => (
              <Card 
                key={requirement.id}
                raised={selectedRequirement?.id === requirement.id}
                onClick={() => handleRequirementClick(requirement)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
                  mb: 2,
                }}
              >
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box flexGrow={1}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight="bold" mr={1}>
                        ID: {requirement.id}
                      </Typography>
                      <Chip
                        icon={React.createElement(getDomainIcon(requirement.domain.name))}
                        label={requirement.domain.name}
                        size="small"
                        sx={{
                          backgroundColor: getDomainColor(requirement.domain.name),
                          color: 'white',
                          fontWeight: 'bold',
                          mr: 1,
                        }}
                      />
                      <Chip
                        icon={React.createElement(getStatusIcon(requirement.status.name))}
                        label={requirement.status.name}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(requirement.status.name),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {requirement.description}
                    </Typography>
                    <Typography variant="body2">
                      Experience: {requirement.experience_min} - {requirement.experience_max} years
                    </Typography>
                  </Box>
                  <Box textAlign="right" ml={2}>
                    <Typography variant="body2" fontWeight="bold">
                      {requirement.client.name}
                    </Typography>
                    <Typography variant="body2">
                      {requirement.location.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Open for {requirement.days_open || calculateDaysOpen(requirement.created_at)} days
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDialog(requirement); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(requirement.id); }}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Right side - Requirement Details */}
      <Grid item xs={12} md={5}>
        <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {selectedRequirement ? (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Requirement Details</Typography>
                <IconButton onClick={() => setSelectedRequirement(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">ID: {selectedRequirement.id}</Typography>
                <Chip
                  icon={React.createElement(getStatusIcon(selectedRequirement.status.name))}
                  label={selectedRequirement.status.name}
                  sx={{
                    backgroundColor: getStatusColor(selectedRequirement.status.name),
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                />
              </Box>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {selectedRequirement.description}
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Paper elevation={1} sx={{ p: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="body2">
                      <strong>Client:</strong> {selectedRequirement.client.name}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={1} sx={{ p: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="body2">
                      <strong>Location:</strong> {selectedRequirement.location.name}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={1} sx={{ p: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="body2">
                      <strong>Experience:</strong> {selectedRequirement.experience_min} - {selectedRequirement.experience_max} years
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={1} sx={{ p: 1, bgcolor: 'grey.100' }}>
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(selectedRequirement.created_at).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.100', mb: 2 }}>
                <Typography variant="body2">
                  <strong>Notes:</strong> {selectedRequirement.notes || 'N/A'}
                </Typography>
              </Paper>
                <Typography variant="h6" gutterBottom>Comments</Typography>
                <List>
                  {comments.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={comment.content}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {comment.username}
                              </Typography>
                              {` — ${new Date(comment.created_at).toLocaleString()}`}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
                <Box display="flex" mt={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                Select a requirement to view details
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
  
      {/* Dialog for adding/editing requirements */}
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