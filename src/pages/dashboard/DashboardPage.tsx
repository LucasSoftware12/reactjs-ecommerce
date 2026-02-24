import { useEffect, useState } from 'react';
import { Typography, Box, Paper, Grid, Button, Chip, Alert, Snackbar } from '@mui/material';
import { io } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { getAllProducts, getProduct } from '../../api/product.api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isAdmin = user && (
    user.roles?.some((r: any) => [2, 3].includes(r.id)) ||
    [2, 3].includes((user as any).roleId)
  );

  const [pendingToastProductId, setPendingToastProductId] = useState<string | number | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      const responseData = response.data?.data || response.data;
      const all = Array.isArray(responseData) ? responseData : responseData?.data || [];
      setProducts(all.filter((p: any) => p.isActive));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server:', socket.id);
    });

    socket.on('newProductActivated', (data) => {
      console.log('New product activated event received:', data);
      
      const title = data?.title || data?.name || data?.detail?.title;
      const pid = data?.productId || data?.detail?.productId;

      if (title) {
        setToastMessage(`Nuevo producto activado en la tienda: ${title}`);
        setToastOpen(true);
        fetchProducts();
      } else if (pid) {
        setPendingToastProductId(pid);
        fetchProducts();
      }
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchTitleForToast = async () => {
      if (!pendingToastProductId) return;
      
      let discoveredTitle = `Product ID #${pendingToastProductId}`;
      try {
        const res = await getProduct(Number(pendingToastProductId));
        const pData = res.data?.data || res.data;
        if (pData?.title) {
          discoveredTitle = pData.title;
        }
      } catch (err) {
        console.error('Could not fetch product details for toast', err);
      }
      
      setToastMessage(`Nuevo producto activado en la tienda: ${discoveredTitle}`);
      setToastOpen(true);
      setPendingToastProductId(null);
    };

    fetchTitleForToast();
  }, [pendingToastProductId]);

  return (
    <Box>
      <Typography variant="h4" mb={1} fontWeight="bold">
        Dashboard
      </Typography>
      <Typography color="textSecondary" mb={4}>
        Welcome back, <strong>{user?.email}</strong>
      </Typography>

      {isAdmin && (
        <Paper sx={{ p: 3, mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body1" fontWeight="bold" sx={{ flexGrow: 1 }}>Admin Panel</Typography>
          <Button variant="contained" color="secondary" onClick={() => navigate('/products')}>
            Manage Products
          </Button>
          <Button variant="outlined" onClick={() => navigate('/products/create')}>
            + New Product
          </Button>
          <Button variant="outlined" onClick={() => navigate('/roles/assign')}>
            Assign Roles
          </Button>
        </Paper>
      )}

      <Typography variant="h5" fontWeight="bold" mb={3}>
        Available Products
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loadingProducts ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="textSecondary">No active products available at the moment.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    height: 160,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" color="textSecondary">No Image</Typography>
                </Box>

                <Chip label="Active" color="success" size="small" sx={{ alignSelf: 'flex-start' }} />

                <Typography variant="h6" fontWeight="bold" noWrap>
                  {product.title || 'Untitled Product'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flexGrow: 1,
                }}>
                  {product.description || 'No description available.'}
                </Typography>

                <Typography variant="caption" color="textSecondary">
                  Code: {product.code || 'N/A'}
                </Typography>

                <Box display="flex" gap={1} mt={1}>
                  <Button variant="contained" color="secondary" fullWidth size="small">
                    Add to Cart
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate(`/products/${product.id}`)}>
                    View
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="info"
          sx={{ width: '100%', fontSize: '1rem', fontWeight: 'bold' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardPage;
