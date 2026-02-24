import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { assignRole } from '../../api/role.api';

const AssignRolePage = () => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await assignRole({ email, roleId: Number(roleId) });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" mb={2} fontWeight="bold">Assign User Role</Typography>
        <Typography color="textSecondary" mb={4}>
          Elevate user permissions (Admin Restricted)
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 3 }}>Role assigned successfully.</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="User Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <FormControl fullWidth sx={{ mb: 4 }} required>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleId}
              label="Role"
              onChange={(e) => setRoleId(e.target.value)}
            >
              <MenuItem value={1}>Customer</MenuItem>
              <MenuItem value={2}>Merchant</MenuItem>
              <MenuItem value={3}>Admin</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" fullWidth size="large" disabled={loading || !email || !roleId}>
            {loading ? 'Assigning...' : 'Assign Role'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AssignRolePage;
