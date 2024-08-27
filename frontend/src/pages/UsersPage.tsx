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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { userService, User, Role } from '../services/userService';
import { roleService } from '../services/roleService';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    email: '',
    role_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const fetchedRoles = await roleService.getRoles();
      setRoles(fetchedRoles);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const handleOpenDialog = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username,
        password: '', // Password is empty for editing
        email: user.email,
        role_id: user.role_id.toString(),
      });
    } else {
      setEditingUser(null);
      setFormData({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        email: '',
        role_id: '',
      });
    }
    setValidationErrors({});
    setIsSubmitted(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setValidationErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: '' });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.first_name.trim()) errors.first_name = 'First name is required';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!editingUser && !formData.password.trim()) errors.password = 'Password is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    // Use a more robust email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.role_id) errors.role_id = 'Role is required';
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!validateForm()) return;
  
    try {
      const userData = {
        ...formData,
        role_id: parseInt(formData.role_id, 10),
      };
  
      if (editingUser) {
        const updateData: Partial<typeof userData> = { ...userData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await userService.updateUser(editingUser.id, updateData);
      } else {
        await userService.createUser(userData as Required<typeof userData>);
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          setValidationErrors(err.response.data);
        } else {
          setError(err.response.data || 'An error occurred while saving the user');
        }
      } else {
        setError('Failed to save user');
      }
      console.error('Error saving user:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        style={{ marginBottom: '20px' }}
      >
        Add New User
      </Button>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{roles.find(role => role.id === user.role_id)?.name || 'Unknown'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {isSubmitted && (error || Object.keys(validationErrors).length > 0) && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
              {error || 'Please correct the errors below.'}
            </Alert>
          )}
          <Box component="form" noValidate autoComplete="off">
            <TextField
              autoFocus
              margin="dense"
              name="first_name"
              label="First Name"
              type="text"
              fullWidth
              required
              value={formData.first_name}
              onChange={handleInputChange}
              error={isSubmitted && !!validationErrors.first_name}
              helperText={isSubmitted && validationErrors.first_name}
            />
            <TextField
              margin="dense"
              name="last_name"
              label="Last Name"
              type="text"
              fullWidth
              required
              value={formData.last_name}
              onChange={handleInputChange}
              error={isSubmitted && !!validationErrors.last_name}
              helperText={isSubmitted && validationErrors.last_name}
            />
            <TextField
              margin="dense"
              name="username"
              label="Username"
              type="text"
              fullWidth
              required
              value={formData.username}
              onChange={handleInputChange}
              error={isSubmitted && !!validationErrors.username}
              helperText={isSubmitted && validationErrors.username}
            />
            <TextField
              margin="dense"
              name="password"
              label={editingUser ? "Password (leave blank to keep unchanged)" : "Password"}
              type="password"
              fullWidth
              required={!editingUser}
              value={formData.password}
              onChange={handleInputChange}
              error={isSubmitted && !!validationErrors.password}
              helperText={isSubmitted && validationErrors.password}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleInputChange}
              error={isSubmitted && !!validationErrors.email}
              helperText={isSubmitted && validationErrors.email}
            />
            <FormControl fullWidth margin="dense" error={!!validationErrors.role_id} required>
              <InputLabel>Role</InputLabel>
              <Select
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5,
                      width: 250,
                    },
                  },
                  autoFocus: true,
                }}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id.toString()}>{role.name}</MenuItem>
                ))}
              </Select>
              {validationErrors.role_id && (
                <Typography color="error" variant="caption">
                  {validationErrors.role_id}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersPage;