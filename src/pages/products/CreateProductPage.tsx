import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProduct, addProductDetails } from '../../api/product.api';

const steps = ['Basic Info', 'Details & Specs'];

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [productId, setProductId] = useState<number | null>(null);

  const [categoryId, setCategoryId] = useState<number | string>('');
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [variationType, setVariationType] = useState('NONE');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setError(null);
    try {
      if (activeStep === 0) {
        const res = await createProduct(Number(categoryId));
        console.log('Create Product API Response:', res);

        const newProduct = res.data?.data || res.data;
        const newId = newProduct?.id || newProduct?.product?.id;
        console.log('Extracted Product ID:', newId);

        if (!newId || typeof newId === 'object') {
          console.error('Failed to extract a valid numeric ID', { res, newProduct, newId });
          throw new Error('Could not extract a numeric Product ID from response.');
        }

        setProductId(newId);
        setActiveStep(1);
      } else if (activeStep === 1) {
        if (!productId) throw new Error('No product ID found');
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
        await addProductDetails(productId, detailsData);
        navigate(`/products/${productId}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error processing step');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" mb={4} fontWeight="bold">Create New Product</Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {activeStep === 0 && (
          <Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category ID</InputLabel>
              <Select
                value={categoryId}
                label="Category ID"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((id) => (
                  <MenuItem key={id} value={id}>Category {id}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {activeStep === 1 && (
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Product Code" fullWidth value={code} onChange={(e) => setCode(e.target.value)} />
            <FormControl fullWidth>
              <InputLabel>Variation Type</InputLabel>
              <Select
                value={variationType}
                label="Variation Type"
                onChange={(e) => setVariationType(e.target.value)}
              >
                <MenuItem value="NONE">None</MenuItem>
                <MenuItem value="OnlySize">Only Size</MenuItem>
                <MenuItem value="OnlyColor">Only Color</MenuItem>
                <MenuItem value="SizeAndColor">Size &amp; Color</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Description" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            <TextField
              label="About (One per line)"
              fullWidth
              multiline
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder={"Fast CPU\nGreat battery\nCompact size"}
            />
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            disabled={!categoryId && activeStep === 0}
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Save & Continue to Product' : 'Next Step'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateProductPage;
