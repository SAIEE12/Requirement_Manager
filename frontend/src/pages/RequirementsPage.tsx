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
import { domainService, Domain } from '../services/domainService';
import { statusService, Status } from '../services/statusService';
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
    domain_id: '',
    status_id: '',
    experience_min: '',
    experience_max: '',
    location_id: '',
    priority: '',
    expected_start_date: '',
    expected_end_date: '',
    required_resources: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [comments, setComments] = useState<RequirementComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [domains, setDomains] = useState<Domain[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);


  useEffect(() => {
    fetchRequirements();
    fetchClients();
    fetchLocations();
    fetchDomains();
    fetchStatuses();
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

  const fetchDomains = async () => {
    try {
      const fetchedDomains = await domainService.getDomains(true);
      setDomains(fetchedDomains);
    } catch (err) {
      console.error('Error fetching domains:', err);
    }
  };
  
  const fetchStatuses = async () => {
    try {
      const fetchedStatuses = await statusService.getStatuses();
      setStatuses(fetchedStatuses);
    } catch (err) {
      console.error('Error fetching statuses:', err);
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
        domain_id: requirement.domain.id.toString(),
        status_id: requirement.status.id.toString(),
        experience_min: requirement.experience_min.toString(),
        experience_max: requirement.experience_max.toString(),
        location_id: requirement.location_id.toString(),
        priority: requirement.priority || '',
        expected_start_date: requirement.expected_start_date || '',
        expected_end_date: requirement.expected_end_date || '',
        required_resources: requirement.required_resources ? requirement.required_resources.toString() : '',
        notes: requirement.notes || '',
      });
    } else {
      setEditingRequirement(null);
      setFormData({
        description: '',
        client_id: '',
        domain_id: '',
        status_id: '',
        experience_min: '',
        experience_max: '',
        location_id: '',
        priority: '',
        expected_start_date: '',
        expected_end_date: '',
        required_resources: '',
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
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!formData.description.trim() || !formData.client_id || !formData.experience_min || !formData.experience_max || !formData.location_id || !formData.domain_id || !formData.status_id) return;
  
    try {
      const submitData: RequirementCreate = {
        description: formData.description,
        client_id: parseInt(formData.client_id),
        domain_id: parseInt(formData.domain_id),
        status_id: parseInt(formData.status_id),
        experience_min: parseInt(formData.experience_min),
        experience_max: parseInt(formData.experience_max),
        location_id: parseInt(formData.location_id),
        priority: formData.priority || undefined,
        expected_start_date: formData.expected_start_date || undefined,
        expected_end_date: formData.expected_end_date || undefined,
        required_resources: formData.required_resources ? parseInt(formData.required_resources) : undefined,
        notes: formData.notes || undefined,
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
        <Grid item xs={12} md={6}>
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
                raised 
                sx={{
                  cursor: 'pointer', 
                  mb: 2,
                  transition: 'all 0.3s',
                  backgroundColor: selectedRequirement?.id === requirement.id ? '#e3f2fd' : 'white',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                  position: 'relative', // Add this to position the action buttons
                }}
                onClick={() => handleRequirementClick(requirement)}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, paddingBottom: '40px !important' }}> {/* Add padding at the bottom for action buttons */}
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Box display="flex" alignItems="center" mb={0.5}>
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
                            height: '20px',
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
                            height: '20px',
                          }}
                        />
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.2,
                        }}
                      >
                        {requirement.description}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box textAlign="right">
                        <Typography variant="body2" fontWeight="bold">
                          {requirement.client.name}
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                          {requirement.location.name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontSize="0.8rem">
                        Exp: {requirement.experience_min} - {requirement.experience_max} yrs
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" align="right" display="block">
                        Open: {requirement.days_open !== null ? `${requirement.days_open} days` : 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 5, 
                    right: 5, 
                    opacity: 0.7, 
                    '&:hover': { opacity: 1 },
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Add a semi-transparent background
                    borderRadius: '4px', // Round the corners
                  }}
                >
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); handleOpenDialog(requirement); }}
                    sx={{ padding: '4px' }} // Reduce padding to make buttons smaller
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(requirement.id); }}
                    sx={{ padding: '4px' }} // Reduce padding to make buttons smaller
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
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
                  <IconButton onClick={() => {/* Close details */}}>
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
              select
              margin="dense"
              name="domain_id"
              label="Domain"
              fullWidth
              required
              value={formData.domain_id}
              onChange={handleInputChange}
              error={isSubmitted && !formData.domain_id}
              helperText={isSubmitted && !formData.domain_id ? 'Domain is required' : ''}
            >
              {domains.map((domain) => (
                <MenuItem key={domain.id} value={domain.id.toString()}>
                  {domain.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              margin="dense"
              name="status_id"
              label="Status"
              fullWidth
              required
              value={formData.status_id}
              onChange={handleInputChange}
              error={isSubmitted && !formData.status_id}
              helperText={isSubmitted && !formData.status_id ? 'Status is required' : ''}
            >
              {statuses.map((status) => (
                <MenuItem key={status.id} value={status.id.toString()}>
                  {status.name}
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
              select
              margin="dense"
              name="priority"
              label="Priority"
              fullWidth
              required
              value={formData.priority}
              onChange={handleInputChange}
              error={isSubmitted && !formData.priority}
              helperText={isSubmitted && !formData.priority ? 'Priority is required' : ''}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              name="expected_start_date"
              label="Expected Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.expected_start_date}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="expected_end_date"
              label="Expected End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.expected_end_date}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="required_resources"
              label="Required Resources"
              type="number"
              fullWidth
              value={formData.required_resources}
              onChange={handleInputChange}
            />
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