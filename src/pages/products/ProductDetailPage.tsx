import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Grid, Button, Divider, Alert,
  TextField, FormControl, InputLabel, Select, MenuItem, Chip, Collapse,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { getProduct, deleteProduct, addProductDetails, activateProduct } from '../../api/product.api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

type ConfirmAction = 'delete' | 'activate' | null;

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [variationType, setVariationType] = useState('NONE');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await getProduct(Number(id));
      const productData = response.data?.data || response.data;
      setProduct(productData);
      setTitle(productData?.title || '');
      setCode(productData?.code || '');
      setVariationType(productData?.variationType || 'NONE');
      setDescription(productData?.description || '');
      setAbout((productData?.about || []).join('\n'));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const handleConfirm = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      if (confirmAction === 'delete') {
        await deleteProduct(Number(id));
        navigate('/products');
      } else if (confirmAction === 'activate') {
        await activateProduct(Number(id));
        setActionMessage({ type: 'success', text: 'Product activated successfully!' });
        await fetchProduct();
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || `Failed to ${confirmAction} product`,
      });
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
    }
  };

  const handleAddDetails = async () => {
    setDetailsLoading(true);
    setActionMessage(null);
    try {
      const detailsData = {
        title,
        code,
        variationType,
        description,
        about: about.split('\n').filter((line) => line.trim() !== ''),
        details: {
          category: 'Computers',
          capacity: 512,
          capacityUnit: 'GB',
          capacityType: 'SSD',
          brand: 'Logitech',
          series: 'MX Master',
        },
      };
      await addProductDetails(Number(id), detailsData);
      setActionMessage({ type: 'success', text: 'Product details updated successfully!' });
      setShowDetailsForm(false);
      await fetchProduct();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update details' });
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Typography color="error" mt={4} textAlign="center">{error}</Typography>;

  const hasAdminRights = user && (
    user.roles?.some((r: any) => [2, 3].includes(r.id)) ||
    [2, 3].includes((user as any).roleId)
  );

  const confirmDialogConfig = {
    delete: {
      title: 'Delete Product',
      description: 'Are you sure you want to permanently delete this product? This action cannot be undone.',
      confirmLabel: 'Delete',
      confirmColor: 'error' as const,
    },
    activate: {
      title: 'Activate Product',
      description: 'This will make the product visible to customers in the store. Continue?',
      confirmLabel: 'Activate',
      confirmColor: 'success' as const,
    },
  };

  const dialogConfig = confirmAction ? confirmDialogConfig[confirmAction] : null;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
      <Dialog open={!!confirmAction} onClose={() => setConfirmAction(null)}>
        <DialogTitle>{dialogConfig?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogConfig?.description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={dialogConfig?.confirmColor}
            onClick={handleConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : dialogConfig?.confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>

      {actionMessage && (
        <Alert severity={actionMessage.type} sx={{ mb: 3 }} onClose={() => setActionMessage(null)}>
          {actionMessage.text}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
            <Typography color="textSecondary">No Image Available</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="caption" color="primary" fontWeight="bold">
              CATEGORY ID: {product?.categoryId}
            </Typography>
            <Chip
              label={product?.isActive ? 'Active' : 'Pending'}
              color={product?.isActive ? 'success' : 'warning'}
              size="small"
            />
          </Box>

          <Typography variant="h3" fontWeight="bold" mt={1} mb={2}>
            {product?.title || 'Untitled Product'}
          </Typography>
          <Typography variant="h5" color="secondary" mb={3}>
            Code: {product?.code || 'N/A'}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" mb={2}>Description</Typography>
          <Typography color="textSecondary" mb={4}>
            {product?.description || 'No description provided.'}
          </Typography>

          <Typography variant="h6" mb={2}>About this item</Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            {product?.about?.map((point: string, idx: number) => (
              <li key={idx}><Typography mb={0.5}>{point}</Typography></li>
            ))}
          </Box>

          <Box mt={4} display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" color="secondary" size="large">
              Add to Cart
            </Button>

            {hasAdminRights && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => setShowDetailsForm((v) => !v)}
                >
                  {showDetailsForm ? 'Cancel' : 'Edit Details'}
                </Button>

                {!product?.isActive && (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => setConfirmAction('activate')}
                  >
                    Activate Product
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  onClick={() => setConfirmAction('delete')}
                >
                  Delete Product
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      {hasAdminRights && (
        <Collapse in={showDetailsForm}>
          <Paper sx={{ p: 4, mt: 4 }}>
            <Typography variant="h6" mb={3} fontWeight="bold">Edit Product Details</Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
              <TextField label="Product Code" fullWidth value={code} onChange={(e) => setCode(e.target.value)} />
              <FormControl fullWidth>
                <InputLabel>Variation Type</InputLabel>
                <Select value={variationType} label="Variation Type" onChange={(e) => setVariationType(e.target.value)}>
                  <MenuItem value="NONE">None</MenuItem>
                  <MenuItem value="OnlySize">Only Size</MenuItem>
                  <MenuItem value="OnlyColor">Only Color</MenuItem>
                  <MenuItem value="SizeAndColor">Size &amp; Color</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Description" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              <TextField
                label="About (one per line)"
                fullWidth
                multiline
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder={"Fast CPU\nGreat battery\nCompact size"}
              />
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={() => setShowDetailsForm(false)}>Cancel</Button>
                <Button variant="contained" disabled={detailsLoading} onClick={handleAddDetails}>
                  {detailsLoading ? 'Saving...' : 'Save Details'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Collapse>
      )}
    </Box>
  );
};

export default ProductDetailPage;
