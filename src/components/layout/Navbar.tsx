import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/slices/auth.slice';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();

  const isAdmin = user && (
    user.roles?.some((r: any) => [2, 3].includes(r.id)) ||
    [2, 3].includes((user as any).roleId)
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            STORE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated && (
              <>
                <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
                <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate('/profile')}>
                  Profile
                </Button>
                {isAdmin && (
                  <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate('/products')}>
                    Products (Admin)
                  </Button>
                )}
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <Button color="error" variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
