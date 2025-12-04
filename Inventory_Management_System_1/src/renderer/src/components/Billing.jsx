import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { billsAPI, productsAPI } from '../services/api';

const Billing = ({ onNotification }) => {
  const [products, setProducts] = useState([]);
  const [billData, setBillData] = useState({
    billNo: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    totalAmount: 0,
    paidAmount: 0,
    paymentMethod: 'Cash',
    discount: 0,
    tax: 0,
    items: [],
  });
  const [savedCustomers] = useState([
    { name: 'John Doe', phone: '+91 9876543210', email: 'john@example.com' },
    { name: 'Jane Smith', phone: '+91 8765432109', email: 'jane@example.com' },
    { name: 'Mike Johnson', phone: '+91 7654321098', email: 'mike@example.com' },
  ]);
  const [currentItem, setCurrentItem] = useState({
    productName: '',
    quantity: '',
    pricePerUnit: '',
    discount: 0,
    discountedPrice: '',
    total: 0,
  });

  useEffect(() => {
    fetchProducts();
    generateBillNumber();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.map(p => p.name));
    } catch (error) {
      console.error('Error fetching products:', error);
      onNotification('Error loading products', 'error');
    }
  };

  const generateBillNumber = () => {
    const timestamp = Date.now();
    const billNo = `INV-${timestamp}`;
    setBillData(prev => ({ ...prev, billNo }));
  };

  const handleItemChange = (field, value) => {
    const updatedItem = { ...currentItem, [field]: value };

    // Calculate discounted price when discount or price changes
    if (field === 'discount' || field === 'pricePerUnit') {
      const originalPrice = parseFloat(updatedItem.pricePerUnit) || 0;
      const discountPercent = parseFloat(updatedItem.discount) || 0;
      const discountAmount = (originalPrice * discountPercent) / 100;
      updatedItem.discountedPrice = originalPrice - discountAmount;
    }

    // Ensure discountedPrice is set even when no discount is applied
    if (field === 'pricePerUnit' && (!updatedItem.discount || updatedItem.discount === 0)) {
      updatedItem.discountedPrice = parseFloat(updatedItem.pricePerUnit) || 0;
    }

    // Calculate total when quantity or discounted price changes
    if (field === 'quantity' || field === 'discount' || field === 'pricePerUnit') {
      const qty = parseFloat(updatedItem.quantity) || 0;
      const finalPrice = parseFloat(updatedItem.discountedPrice) || parseFloat(updatedItem.pricePerUnit) || 0;
      updatedItem.total = qty * finalPrice;
    }

    setCurrentItem(updatedItem);
  };

  const addItemToBill = () => {
    if (!currentItem.productName || !currentItem.quantity || !currentItem.pricePerUnit) {
      onNotification('Please fill in all item details', 'error');
      return;
    }

    const newItems = [...billData.items, { ...currentItem }];
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * billData.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * billData.tax) / 100;
    const totalAmount = subtotal - discountAmount + taxAmount;

    setBillData(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      paidAmount: totalAmount, // Auto-set paid amount to total
    }));

    // Reset current item
    setCurrentItem({
      productName: '',
      quantity: '',
      pricePerUnit: '',
      discount: 0,
      discountedPrice: '',
      total: 0,
    });
  };

  const removeItem = (index) => {
    const newItems = billData.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * billData.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * billData.tax) / 100;
    const totalAmount = subtotal - discountAmount + taxAmount;

    setBillData(prev => ({
      ...prev,
      items: newItems,
      totalAmount,
      paidAmount: totalAmount,
    }));
  };

  const handleDiscountTaxChange = (field, value) => {
    const updatedBillData = { ...billData, [field]: parseFloat(value) || 0 };
    const subtotal = updatedBillData.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (subtotal * updatedBillData.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * updatedBillData.tax) / 100;
    const totalAmount = subtotal - discountAmount + taxAmount;
    
    setBillData({
      ...updatedBillData,
      totalAmount,
      paidAmount: totalAmount,
    });
  };

  const handleBillDataChange = (field, value) => {
    setBillData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitBill = async () => {
    try {
      if (billData.items.length === 0) {
        onNotification('Please add at least one item to the bill', 'error');
        return;
      }

      await billsAPI.create(billData);
      onNotification('Bill created successfully', 'success');

      // Auto-prompt to print the bill after successful creation
      const shouldPrint = window.confirm('Bill created successfully! Would you like to print the invoice now?');
      if (shouldPrint) {
        handlePrintBill();
      }

      // Reset form
      setBillData({
        billNo: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        totalAmount: 0,
        paidAmount: 0,
        paymentMethod: 'Cash',
        discount: 0,
        tax: 0,
        items: [],
      });
      generateBillNumber();
    } catch (error) {
      console.error('Error creating bill:', error);
      onNotification('Error creating bill', 'error');
    }
  };

  const handlePrintBill = () => {
    // Create print content
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2>One Smart Inc</h2>
          <p>Inventory Management System</p>
          <hr>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong>Bill No:</strong> ${billData.billNo}<br>
          <strong>Customer:</strong> ${billData.customerName || 'Walk-in Customer'}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
          <strong>Time:</strong> ${new Date().toLocaleTimeString()}
        </div>
        
        <hr>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="border-bottom: 1px solid #ccc;">
              <th style="text-align: left; padding: 4px; border-right: 1px solid #eee;">Item</th>
              <th style="text-align: right; padding: 4px; border-right: 1px solid #eee;">Qty</th>
              <th style="text-align: right; padding: 4px; border-right: 1px solid #eee;">MRP</th>
              <th style="text-align: right; padding: 4px; border-right: 1px solid #eee;">Disc%</th>
              <th style="text-align: right; padding: 4px; border-right: 1px solid #eee;">Final Price</th>
              <th style="text-align: right; padding: 4px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${billData.items.map(item => `
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 4px; border-right: 1px solid #eee;">${item.productName}</td>
                <td style="text-align: right; padding: 4px; border-right: 1px solid #eee;">${item.quantity}</td>
                <td style="text-align: right; padding: 4px; border-right: 1px solid #eee;">₹${item.pricePerUnit}</td>
                <td style="text-align: right; padding: 4px; border-right: 1px solid #eee;">${item.discount || 0}%</td>
                <td style="text-align: right; padding: 4px; border-right: 1px solid #eee;">₹${(item.discountedPrice || item.pricePerUnit).toFixed(2)}</td>
                <td style="text-align: right; padding: 4px;">₹${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <hr>
        
        <div style="text-align: right; margin-top: 15px;">
          <div style="margin-bottom: 10px;">
            <strong style="font-size: 14px;">Subtotal: ₹${billData.totalAmount.toFixed(2)}</strong>
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Paid Amount: ₹${billData.paidAmount.toFixed(2)}</strong>
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Payment Method: ${billData.paymentMethod}</strong>
          </div>
          ${billData.totalAmount - billData.paidAmount !== 0 ? 
            `<div style="margin-top: 10px; padding: 5px; background-color: #fff3cd; border: 1px solid #ffeaa7;">
              <strong>Balance Due: ₹${(billData.totalAmount - billData.paidAmount).toFixed(2)}</strong>
            </div>` : 
            `<div style="margin-top: 10px; padding: 5px; background-color: #d4edda; border: 1px solid #c3e6cb;">
              <strong>✓ Fully Paid</strong>
            </div>`}
        </div>
        
        ${billData.items.some(item => item.discount > 0) ? 
          `<div style="margin-top: 15px; padding: 10px; background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 4px;">
            <small><strong>Discount Applied:</strong> You saved ₹${billData.items.reduce((savings, item) => {
              const originalTotal = item.quantity * item.pricePerUnit;
              return savings + (originalTotal - item.total);
            }, 0).toFixed(2)} on this purchase!</small>
          </div>` : ''}
        
        <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 15px;">
          <p style="margin: 5px 0;"><strong>Thank you for your business!</strong></p>
          <p style="margin: 5px 0; font-size: 11px;">Visit us again soon</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${billData.billNo}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { margin: 0.5in; }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Box sx={{
      display: 'flex',
      gap: 3,
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Bill Details - Scrollable */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        pr: 1,
        marginRight: '370px' // Reserve space for the fixed summary
      }}>
        <Paper sx={{
          p: 3,
          boxShadow: 'none',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" gutterBottom>
            Bill Details
          </Typography>

          <Grid container spacing={2} sx={{ my: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bill Number"
                value={billData.billNo}
                onChange={(e) => handleBillDataChange('billNo', e.target.value)}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                freeSolo
                options={savedCustomers}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                value={billData.customerName}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'object' && newValue !== null) {
                    handleBillDataChange('customerName', newValue.name);
                    handleBillDataChange('customerPhone', newValue.phone);
                    handleBillDataChange('customerEmail', newValue.email);
                  } else {
                    handleBillDataChange('customerName', newValue || '');
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer Name"
                    placeholder="Select or enter customer name"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Phone"
                value={billData.customerPhone}
                onChange={(e) => handleBillDataChange('customerPhone', e.target.value)}
                placeholder="Optional"
              />
            </Grid>
          </Grid>

          {/* Customer Details Section */}
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer Email"
                value={billData.customerEmail}
                onChange={(e) => handleBillDataChange('customerEmail', e.target.value)}
                placeholder="Optional"
                type="email"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Add Item Section */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            Add Items to Bill
          </Typography>

          <Box sx={{
            display: 'flex',
            gap: 2,
            my: 2,
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Autocomplete
                options={products}
                value={currentItem.productName}
                onChange={(event, newValue) => {
                  handleItemChange('productName', newValue || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product Name"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box sx={{ minWidth: 100 }}>
              <TextField
                label="Quantity"
                type="number"
                value={currentItem.quantity}
                onChange={(e) => handleItemChange('quantity', e.target.value)}
                sx={{ width: 100 }}
              />
            </Box>

            <Box sx={{ minWidth: 120 }}>
              <TextField
                label="MRP"
                type="number"
                step="0.01"
                value={currentItem.pricePerUnit}
                onChange={(e) => handleItemChange('pricePerUnit', e.target.value)}
                InputProps={{ startAdornment: '₹' }}
                sx={{ width: 120 }}
              />
            </Box>

            <Box sx={{ minWidth: 100 }}>
              <TextField
                label="Discount %"
                type="number"
                step="0.01"
                value={currentItem.discount}
                onChange={(e) => handleItemChange('discount', e.target.value)}
                InputProps={{ endAdornment: '%' }}
                sx={{ width: 100 }}
              />
            </Box>

            <Box sx={{ minWidth: 120 }}>
              <TextField
                label="Final Price"
                value={`₹${(currentItem.discountedPrice || 0).toFixed(2)}`}
                disabled
                sx={{ width: 120 }}
              />
            </Box>

            <Box sx={{ minWidth: 100 }}>
              <TextField
                label="Total"
                value={`₹${currentItem.total.toFixed(2)}`}
                disabled
                sx={{ width: 100 }}
              />
            </Box>

            <Box>
              <Button
                variant="contained"
                onClick={addItemToBill}
                sx={{
                  height: '56px',
                  minWidth: '56px',
                  px: 2
                }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>

          {/* Items Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">MRP</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Final Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">₹{item.pricePerUnit}</TableCell>
                    <TableCell align="right">{item.discount}%</TableCell>
                    <TableCell align="right">₹{(item.discountedPrice || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">₹{item.total.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeItem(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {billData.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">
                        No items added yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Bill Summary - Fixed/Sticky to the right */}
      <Box sx={{
        position: 'fixed',
        right: 20,
        top: 110,
        width: '350px',
        height: '57vh',
        zIndex: 1000,
        overflow: 'auto'
      }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: 1, overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              Bill Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                ₹{billData.totalAmount.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              
              {/* Subtotal breakdown */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>₹{billData.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</span>
                </Typography>
                {billData.discount > 0 && (
                  <Typography variant="body2" color="success.main" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Discount ({billData.discount}%):</span>
                    <span>-₹{((billData.items.reduce((sum, item) => sum + item.total, 0) * billData.discount) / 100).toFixed(2)}</span>
                  </Typography>
                )}
                {billData.tax > 0 && (
                  <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tax ({billData.tax}%):</span>
                    <span>+₹{(((billData.items.reduce((sum, item) => sum + item.total, 0) - (billData.items.reduce((sum, item) => sum + item.total, 0) * billData.discount) / 100) * billData.tax) / 100).toFixed(2)}</span>
                  </Typography>
                )}
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ my: 3 }}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: 300 }}
                  label="Bill Discount (%)"
                  type="number"
                  step="0.01"
                  value={billData.discount}
                  onChange={(e) => handleDiscountTaxChange('discount', e.target.value)}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: 300 }}
                  label="Tax (%)"
                  type="number"
                  step="0.01"
                  value={billData.tax}
                  onChange={(e) => handleDiscountTaxChange('tax', e.target.value)}
                  InputProps={{ endAdornment: '%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: 300 }}
                  label="Paid Amount"
                  type="number"
                  step="0.01"
                  value={billData.paidAmount}
                  onChange={(e) => handleBillDataChange('paidAmount', parseFloat(e.target.value) || 0)}
                  InputProps={{ startAdornment: '₹' }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: 300 }}>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={billData.paymentMethod}
                    onChange={(e) => handleBillDataChange('paymentMethod', e.target.value)}
                    label="Payment Method"
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Card">Card</MenuItem>
                    <MenuItem value="Net Banking">Net Banking</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {billData.totalAmount !== billData.paidAmount && (
              <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2">
                  Balance: ₹{(billData.totalAmount - billData.paidAmount).toFixed(2)}
                </Typography>
              </Box>
            )}
          </CardContent>

          <Box sx={{ p: 2, pt: 0 }}>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <Button
                variant="contained"
                onClick={handleSubmitBill}
                disabled={billData.items.length === 0}
                fullWidth
              >
                Create Bill
              </Button>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={handlePrintBill}
                disabled={billData.items.length === 0}
                fullWidth
              >
                Print Invoice
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Billing;
