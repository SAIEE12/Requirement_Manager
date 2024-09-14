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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { requirementService, Requirement, RequirementCreate, RequirementUpdate, RequirementComment } from '../services/requirementService';
import { Client, Location } from '../types/types';
import { differenceInDays } from 'date-fns';

const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'on hold':
      return 'warning';
    case 'closed':
      return 'default';
    case 'filled':
      return 'primary';
    case 'cancelled':
      return 'error';
    case 'priority':
      return 'secondary';
    case 'archived':
      return 'info';
    case 'depricated': // Note: This might be a typo. Did you mean "Deprecated"?
      return 'error';
    default:
      return 'default';
  }
};

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
      
      <Grid container spacing={3}>
        {/* Left side - Requirements List */}
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
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
  
            <Box flexGrow={1} overflow="auto">
            {filteredRequirements.map((requirement) => (
              <Card 
                key={requirement.id}
                raised 
                style={{ 
                  cursor: 'pointer', 
                  marginBottom: '10px',
                  transition: 'box-shadow 0.3s',
                  backgroundColor: selectedRequirement?.id === requirement.id ? '#e3f2fd' : 'white',
                  height: '150px',
                  position: 'relative',
                }}
                onClick={() => handleRequirementClick(requirement)}
                sx={{
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent style={{ height: '100%', overflow: 'hidden', display: 'flex' }}>
                  {/* Left side */}
                  <Box flexGrow={1} pr={1}>
                    <Typography variant="body2" color="textSecondary">
                      ID: {requirement.id}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      style={{
                        marginTop: '5px',
                        marginBottom: '5px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {requirement.description.length > 70 
                        ? `${requirement.description.substring(0, 70)}...` 
                        : requirement.description}
                    </Typography>
                    <Typography variant="body2">
                      Experience: {requirement.experience_min} - {requirement.experience_max} years
                    </Typography>
                    <Typography variant="body2" >
                      Since: {requirement.days_open || calculateDaysOpen(requirement.created_at)} days
                    </Typography>
                  </Box>
              
                  {/* Right side */}
                  <Box minWidth="120px" textAlign="right">
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      style={{ 
                        fontWeight: 'bold',
                        marginBottom: '5px',
                      }}
                    >
                      {requirement.client.name}
                    </Typography>
                    <Typography variant="body2">
                      {requirement.location.name}
                    </Typography>
                    <Chip
                      label={requirement.status.name}
                      size="small"
                      style={{ marginTop: '5px' }}
                      color={getStatusColor(requirement.status.name)}
                    />
                  </Box>
                </CardContent>
                <CardActions style={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleOpenDialog(requirement); }} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(requirement.id); }} size="small">
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
          </Paper>
        </Grid>
  
        {/* Right side - Requirement Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {selectedRequirement ? (
              <>
               <Typography variant="h5" gutterBottom>
                Requirement Details
              </Typography>
              <Typography variant="h6">ID: {selectedRequirement.id}</Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body1">
                  <strong>Created:</strong> {new Date(selectedRequirement.created_at).toLocaleString()}
                </Typography>
                <Chip
                  label={selectedRequirement.status.name}
                  size="small"
                  style={{ marginTop: '5px' }}
                  color={getStatusColor(selectedRequirement.status.name)}
                />
              </Box>
              <Typography variant="body1" paragraph>
                <strong>Description:</strong> {selectedRequirement.description}
              </Typography>
              <Paper elevation={1} style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '10px' }}>
                <Typography variant="body1">
                  <strong>Notes:</strong> {selectedRequirement.notes || 'N/A'}
                </Typography>
              </Paper>
              <Typography variant="body1">
                <strong>Client:</strong> {selectedRequirement.client.name}
              </Typography>
              <Typography variant="body1">
                <strong>Experience:</strong> {selectedRequirement.experience_min} - {selectedRequirement.experience_max} years
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {selectedRequirement.location.name}
              </Typography>
  
                <Typography variant="h6" gutterBottom>
                  Comments
                </Typography>
                <List>
                  {comments.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                      <ListItem>
                        <ListItemText
                          primary={comment.content}
                          secondary={`${comment.username} | ${new Date(comment.created_at).toLocaleString()}`}
                        />
                      </ListItem>
                      {index < comments.length - 1 && <Divider />}
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
                    style={{ marginLeft: '10px' }}
                  >
                    Add Comment
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="h6" color="textSecondary" style={{ textAlign: 'center', marginTop: '20px' }}>
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