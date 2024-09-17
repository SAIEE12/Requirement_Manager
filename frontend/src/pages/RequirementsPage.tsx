import React, { useState, useEffect, useCallback, memo } from 'react';
import { debounce } from 'lodash';
import {
  Container, Typography, Paper, Grid, Card, CardContent, Box, Button,
  TextField, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, Divider,
  DialogActions, Chip, FormControl, InputLabel, Select, Alert, List, ListItem, ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { requirementService, Requirement, RequirementCreate, RequirementUpdate } from '../services/requirementService';
import { Client, Location, Skill, Domain, Status } from '../types/types';
import { getDomainIcon, getDomainColor } from '../utils/domainIcons';
import { getStatusIcon, getStatusColor } from '../utils/statusIcons';


interface CommentInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

const CommentInput = memo(({ value, onChange, onSubmit }: CommentInputProps) => (
  <Box component="form" onSubmit={onSubmit} sx={{ mt: 2, display: 'flex' }}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Add a comment..."
      value={value}
      onChange={onChange}
      sx={{ mr: 1 }}
    />
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={!value.trim()}
    >
      Add
    </Button>
  </Box>
));

const RequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
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
    skill_ids: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchRequirements();
    fetchClients();
    fetchLocations();
    fetchSkills();
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

  const fetchSkills = async () => {
    try {
      const fetchedSkills = await requirementService.getSkills();
      setSkills(fetchedSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const fetchDomains = async () => {
    try {
      const fetchedDomains = await requirementService.getDomains();
      setDomains(fetchedDomains);
    } catch (err) {
      console.error('Error fetching domains:', err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const fetchedStatuses = await requirementService.getStatuses();
      setStatuses(fetchedStatuses);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  const debouncedSetNewComment = useCallback(
    debounce((value: string) => {
      setNewComment(value);
    }, 100),
    []
  );
  
  const handleCommentChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetNewComment(event.target.value);
  }, [debouncedSetNewComment]);

  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequirement || !newComment.trim()) return;
    try {
      const addedComment = await requirementService.addComment(selectedRequirement.id, newComment);
      const updatedRequirement = {
        ...selectedRequirement,
        comments: [...(selectedRequirement.comments || []), addedComment]
      };
      setSelectedRequirement(updatedRequirement);
      setRequirements(prevRequirements =>
        prevRequirements.map(req =>
          req.id === selectedRequirement.id ? updatedRequirement : req
        )
      );
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment');
    }
  }, [selectedRequirement, newComment, requirementService, setError, setRequirements, setSelectedRequirement]);

  const refreshRequirements = async () => {
    try {
      const fetchedRequirements = await requirementService.getRequirements();
      setRequirements(fetchedRequirements);
      if (selectedRequirement) {
        const updatedSelectedRequirement = fetchedRequirements.find(req => req.id === selectedRequirement.id);
        if (updatedSelectedRequirement) {
          setSelectedRequirement(updatedSelectedRequirement);
        }
      }
    } catch (err) {
      console.error('Error refreshing requirements:', err);
      setError('Failed to refresh requirements');
    }
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
        skill_ids: requirement.skills.map(skill => skill.id),
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
        skill_ids: [],
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
    if (name === 'skill_ids') {
      setFormData(prev => ({
        ...prev,
        [name]: typeof value === 'string' ? value.split(',').map(Number) : value
      }));
    } else if (name === 'required_resources') {
      const numValue = parseInt(value);
      if (numValue > 0 || value === '') {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!formData.description.trim() || !formData.client_id || !formData.experience_min || 
        !formData.experience_max || !formData.location_id || !formData.domain_id || 
        !formData.status_id || formData.skill_ids.length === 0) return;

    try {
      const submitData: RequirementCreate = {
        description: formData.description,
        client_id: parseInt(formData.client_id),
        domain_id: parseInt(formData.domain_id),
        status_id: parseInt(formData.status_id),
        experience_min: parseInt(formData.experience_min),
        experience_max: parseInt(formData.experience_max),
        location_id: parseInt(formData.location_id),
        priority: formData.priority,
        expected_start_date: formData.expected_start_date || undefined,
        expected_end_date: formData.expected_end_date || undefined,
        required_resources: formData.required_resources ? parseInt(formData.required_resources) : undefined,
        notes: formData.notes || undefined,
        skill_ids: formData.skill_ids,
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

  const filteredRequirements = requirements.filter((req) => {
    return (
      (!filterClient || req.client_id.toString() === filterClient) &&
      (!filterLocation || req.location_id.toString() === filterLocation)
    );
  });

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
                    position: 'relative',
                  }}
                  onClick={() => handleRequirementClick(requirement)}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, paddingBottom: '40px !important' }}>
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
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontSize="0.8rem">
                            Exp: {requirement.experience_min} - {requirement.experience_max} yrs
                          </Typography>
                          {requirement.status.name.toLowerCase() === 'active' && (
                            <Typography variant="caption" color="text.secondary">
                              Open: {requirement.days_open !== null ? `${requirement.days_open} days` : 'N/A'}
                            </Typography>
                          )}
                        </Box>
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
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '4px',
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleOpenDialog(requirement); }}
                      sx={{ padding: '4px' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); handleDelete(requirement.id); }}
                      sx={{ padding: '4px' }}
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
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {selectedRequirement ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Requirement Details
                </Typography>
                <Typography variant="h6">ID: {selectedRequirement.id}</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Chip
                    icon={React.createElement(getDomainIcon(selectedRequirement.domain.name))}
                    label={selectedRequirement.domain.name}
                    sx={{
                      backgroundColor: getDomainColor(selectedRequirement.domain.name),
                      color: 'white',
                      fontWeight: 'bold',
                      mr: 1,
                    }}
                  />
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
                <Typography variant="body1">
                  <strong>Client:</strong> {selectedRequirement.client.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Experience:</strong> {selectedRequirement.experience_min} - {selectedRequirement.experience_max} years
                </Typography>
                <Typography variant="body1">
                  <strong>Location:</strong> {selectedRequirement.location.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Priority:</strong> {selectedRequirement.priority}
                </Typography>
                <Typography variant="body1">
                  <strong>Required Resources:</strong> {selectedRequirement.required_resources || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Expected Start Date:</strong> {selectedRequirement.expected_start_date || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Expected End Date:</strong> {selectedRequirement.expected_end_date || 'N/A'}
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>Notes:</strong> {selectedRequirement.notes || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  <strong>Skills:</strong>
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {selectedRequirement.skills.map((skill) => (
                    <Chip key={skill.id} label={skill.name} size="small" />
                  ))}
                </Box>
                {selectedRequirement.status.name.toLowerCase() === 'active' && (
                  <Typography variant="body1">
                    <strong>Days Open:</strong> {selectedRequirement.days_open}
                  </Typography>
                )}
                {/* Comments Section */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Comments
                </Typography>
                <List>
                  {selectedRequirement.comments && selectedRequirement.comments.length > 0 ? (
                    selectedRequirement.comments.map((comment, index, array) => (
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
                        {index < array.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No comments yet." />
                    </ListItem>
                  )}
                </List>
                
                {/* Add New Comment */}
                <CommentInput
                  value={newComment}
                  onChange={handleCommentChange}
                  onSubmit={handleAddComment}
                />
              </>
            ) : (
              <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 3 }}>
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
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  error={isSubmitted && !formData.description.trim()}
                  helperText={isSubmitted && !formData.description.trim() ? 'Description is required' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="required_resources"
                  label="Required Resources"
                  type="number"
                  fullWidth
                  value={formData.required_resources}
                  onChange={handleInputChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="expected_start_date"
                  label="Expected Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.expected_start_date}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="expected_end_date"
                  label="Expected End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.expected_end_date}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  name="skill_ids"
                  label="Skills"
                  fullWidth
                  required
                  value={formData.skill_ids}
                  onChange={handleInputChange}
                  error={isSubmitted && formData.skill_ids.length === 0}
                  helperText={isSubmitted && formData.skill_ids.length === 0 ? 'At least one skill is required' : ''}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as number[]).map((value) => (
                          <Chip key={value} label={skills.find(skill => skill.id === value)?.name} />
                        ))}
                      </Box>
                    ),
                  }}
                >
                  {skills.map((skill) => (
                    <MenuItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
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