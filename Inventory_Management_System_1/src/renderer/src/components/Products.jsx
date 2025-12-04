import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  Skeleton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { productsAPI } from '../services/api';

const Products = ({ onNotification }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    barcode: '',
    specific: {
      flavor: '',
      color: '',
      weight: '',
      volume: '',
    },
  });
  const [categories] = useState([
    'Food & Beverages',
    'Electronics',
    'Clothing',
    'Health & Beauty',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Other'
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      onNotification('Error loading products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        onNotification('Product name is required', 'error');
        return;
      }

      await productsAPI.create(formData);
      onNotification('Product created successfully', 'success');
      setDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      onNotification('Error creating product', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      barcode: '',
      specific: {
        flavor: '',
        color: '',
        weight: '',
        volume: '',
      },
    });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetForm();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLoadingSkeletons = () => (
    Array(5).fill(0).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton variant="text" width="100%" height={30} /></TableCell>
        <TableCell><Skeleton variant="text" width="100%" height={30} /></TableCell>
        <TableCell><Skeleton variant="text" width="100%" height={30} /></TableCell>
        <TableCell><Skeleton variant="text" width="100%" height={30} /></TableCell>
        <TableCell><Skeleton variant="text" width="100%" height={30} /></TableCell>
        <TableCell align="center"><Skeleton variant="circular" width={30} height={30} /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Box>
      {/* Modern Header Section */}
      <Box sx={{
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        borderRadius: 3,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Product Management
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Manage your inventory products and categories
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 4, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <CardContent sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          '&:last-child': { pb: 2 },
        }}>
          <TextField
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh products">
              <IconButton onClick={fetchProducts} color="primary" size="large">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
              size="large"
            >
              Add Product
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: 'none',
        border: '1px solid #e0e0e0',
        borderRadius: 3,
      }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.925rem' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.925rem' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.925rem' }}>Barcode</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.925rem' }}>Specifications</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.925rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                renderLoadingSkeletons()
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {product.name}
                        </Typography>
                        {product.description && (
                          <Typography variant="caption" color="text.secondary">
                            {product.description}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category || 'Uncategorized'} 
                        size="small" 
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {product.barcode || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {product.specific.flavor && (
                          <Chip label={`Flavor: ${product.specific.flavor}`} size="small" variant="outlined" />
                        )}
                        {product.specific.color && (
                          <Chip label={`Color: ${product.specific.color}`} size="small" variant="outlined" />
                        )}
                        {product.specific.weight && (
                          <Chip label={`Weight: ${product.specific.weight}`} size="small" variant="outlined" />
                        )}
                        {product.specific.volume && (
                          <Chip label={`Volume: ${product.specific.volume}`} size="small" variant="outlined" />
                        )}
                        {!product.specific.flavor && !product.specific.color && !product.specific.weight && !product.specific.volume && '—'}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit product">
                        <IconButton size="small" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {!loading && filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'No products match your search' : 'No products found. Click "Add Product" to create your first product.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Product Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            boxShadow: 'none',
            border: '1px solid #e0e0e0'
          }
        }}
      >
        <DialogTitle>Add New Product</DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, m: 2 }}>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              autoFocus
            />

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="Barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  placeholder="e.g., 1234567890123"
                />
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief product description"
              multiline
              rows={2}
            />

            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Product Specifications</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="Flavor"
                  value={formData.specific.flavor}
                  onChange={(e) => handleInputChange('specific.flavor', e.target.value)}
                  placeholder="e.g., Mango, Vanilla"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="Color"
                  value={formData.specific.color}
                  onChange={(e) => handleInputChange('specific.color', e.target.value)}
                  placeholder="e.g., Red, Blue"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="Weight"
                  value={formData.specific.weight}
                  onChange={(e) => handleInputChange('specific.weight', e.target.value)}
                  placeholder="e.g., 500g, 1kg"
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  fullWidth
                  label="Volume"
                  value={formData.specific.volume}
                  onChange={(e) => handleInputChange('specific.volume', e.target.value)}
                  placeholder="e.g., 500ml, 1L"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleDialogClose} color="inherit" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;

