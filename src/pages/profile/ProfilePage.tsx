import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, Avatar } from '@mui/material';
import { getProfile } from '../../api/user.api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to open profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}>
            {profile?.email?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              My Profile
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage your personal information
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box mb={2}>
          <Typography variant="caption" color="textSecondary" textTransform="uppercase">
            Email Address
          </Typography>
          <Typography variant="h6">{profile?.email}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="textSecondary" textTransform="uppercase">
            User ID
          </Typography>
          <Typography variant="h6">#{profile?.id}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
