import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, Alert, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../api/product.api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const ProductListPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        const responseData = response.data?.data || response.data;
        setProducts(Array.isArray(responseData) ? responseData : responseData?.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Product Management
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => navigate('/products/create')}>
          + New Product
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box py={10}><LoadingSpinner /></Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Category ID</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      No products found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow hover key={product.id}>
                      <TableCell>#{product.id}</TableCell>
                      <TableCell>{product.title || <Typography variant="caption" color="textSecondary">No details yet</Typography>}</TableCell>
                      <TableCell>{product.categoryId || product.category?.id || '—'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={product.isActive ? 'Active' : 'Pending'} 
                          color={product.isActive ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" onClick={() => navigate(`/products/${product.id}`)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ProductListPage;
