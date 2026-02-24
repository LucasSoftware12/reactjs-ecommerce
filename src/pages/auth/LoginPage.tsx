import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useAppDispatch } from '../../hooks/useRedux';
import { setCredentials } from '../../store/slices/auth.slice';
import { login } from '../../api/auth.api';
import { getProfile } from '../../api/user.api';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await login({ email, password });
      
      const token = data?.data?.accessToken || data?.accessToken || data?.token || data?.access_token;

      if (!token) throw new Error('No token received');

      localStorage.setItem('token', token);

      const profileRes = await getProfile();
      const userProfile = profileRes.data?.data || profileRes.data;

      dispatch(
        setCredentials({
          token,
          user: userProfile, 
        })
      );
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Provide valid credentials.');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '80vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" mb={1} fontWeight="bold" textAlign="center">
          Welcome Back
        </Typography>
        <Typography variant="body2" mb={3} color="textSecondary" textAlign="center">
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 4 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Button color="secondary" onClick={() => navigate('/register')} sx={{ p: 0 }}>
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
