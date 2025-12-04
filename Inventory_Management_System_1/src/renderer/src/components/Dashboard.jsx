import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import {
  TrendingUp as SalesIcon,
  Inventory as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { purchasesAPI, billsAPI } from '../services/api';
import * as localdb from '../services/localdb';
import { format } from 'date-fns';

const Dashboard = ({ onNotification }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalPurchases: 0,
    expiringItems: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch purchases and expiring items first (these should work)
      const [purchasesResponse, expiringResponse] = await Promise.all([
        purchasesAPI.getAll(),
        purchasesAPI.getExpiring(),
      ]);

      const purchases = purchasesResponse.data;
      const expiring = expiringResponse.data;

      // Calculate basic stats
      const uniqueProducts = [...new Set(purchases.map(p => p.productName))];

      // Try to fetch bills for sales data, but don't break if it fails
      let totalSales;
      try {
        const billsResponse = await billsAPI.getAll();
        const bills = billsResponse.data;
        totalSales = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
      } catch (billsError) {
        console.warn('Could not fetch bills data:', billsError);
        // Set sales to 0 if bills API fails
        totalSales = 0;
      }

      setStats({
        totalSales,
        totalProducts: uniqueProducts.length,
        totalPurchases: purchases.length,
        expiringItems: expiring.length,
      });

      setRecentPurchases(purchases.slice(0, 10));
      setExpiringItems(expiring.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      onNotification('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearLocalDB = async () => {
    try {
      if (window.confirm('Are you sure you want to clear all local database data? This action cannot be undone.')) {
        await localdb.clearAllData();
        onNotification('Local database cleared successfully', 'success');
        // Refresh dashboard data after clearing
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error clearing local database:', error);
      onNotification('Error clearing local database', 'error');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card sx={{
      height: '140px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: 'none',
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      }
    }}>
      <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            color, 
            fontSize: '2.5rem',
            p: 1,
            borderRadius: 2,
            bgcolor: `${color}20`
          }}>
            {icon}
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h3" component="div" color={color} sx={{ fontWeight: 700, lineHeight: 1 }}>
              {title.includes('Sales') ? `₹${value.toLocaleString()}` : value}
            </Typography>
            {trend && (
              <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'} sx={{ fontWeight: 600 }}>
                {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
              </Typography>
            )}
          </Box>
        </Box>
        <Typography variant="body1" color="text.primary" sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryChipColor = (days) => {
    if (days <= 7) return 'error';
    if (days <= 14) return 'warning';
    return 'info';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Modern Header Section */}
      <Box sx={{
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              Dashboard Overview
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Welcome to One Smart Inc Inventory Management System
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClearLocalDB}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              Clear LocalDB
            </Button>
            <IconButton
              onClick={fetchDashboardData}
              sx={{ 
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards - Enhanced layout */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 3,
        mb: 4,
        maxWidth: '1200px',
        mx: 'auto',
      }}>
        <Box sx={{ flex: '1 1 240px', minWidth: '240px', maxWidth: '280px' }}>
          <StatCard
            title="Total Sales"
            value={stats.totalSales}
            icon={<SalesIcon />}
            color="#2E7D32"
            trend={12.5}
          />
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: '240px', maxWidth: '280px' }}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<InventoryIcon />}
            color="#1976D2"
            trend={8.2}
          />
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: '240px', maxWidth: '280px' }}>
          <StatCard
            title="Purchase Batches"
            value={stats.totalPurchases}
            icon={<PurchaseIcon />}
            color="#7B1FA2"
            trend={-2.1}
          />
        </Box>
        <Box sx={{ flex: '1 1 240px', minWidth: '240px', maxWidth: '280px' }}>
          <StatCard
            title="Expiring Soon"
            value={stats.expiringItems}
            icon={<WarningIcon />}
            color="#F57C00"
            trend={stats.expiringItems > 5 ? 15.3 : -5.2}
          />
        </Box>
      </Box>

      {/* Bottom Section - Flex layout */}
      <Box sx={{
        display: 'flex',
        gap: 3,
        flexWrap: 'wrap',
        alignItems: 'flex-start'
      }}>
        {/* Recent Purchases */}
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Paper sx={{ p: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              Recent Purchases
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Remaining</TableCell>
                    <TableCell align="right">MRP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentPurchases.map((purchase) => (
                    <TableRow key={purchase._id}>
                      <TableCell>{purchase.productName}</TableCell>
                      <TableCell>
                        {format(new Date(purchase.purchaseDate), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell align="right">{purchase.quantity}</TableCell>
                      <TableCell align="right">
                        <Typography
                          color={purchase.remainingQty <= 10 ? 'error' : 'inherit'}
                          fontWeight={purchase.remainingQty <= 10 ? 'bold' : 'normal'}
                        >
                          {purchase.remainingQty}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">₹{purchase.mrp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Expiring Items */}
        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Paper sx={{ p: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" gutterBottom>
              Items Expiring Soon
            </Typography>
            {expiringItems.length === 0 ? (
              <Typography color="text.secondary">
                No items expiring in the next 30 days
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                {expiringItems.map((item) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  return (
                    <Box
                      key={item._id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">
                          {item.productName}
                        </Typography>
                        <Chip
                          label={`${daysLeft} days`}
                          color={getExpiryChipColor(daysLeft)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.remainingQty} | Expires: {format(new Date(item.expiryDate), 'dd/MM/yyyy')}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
