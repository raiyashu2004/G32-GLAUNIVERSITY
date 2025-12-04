import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/CustomTheme';
import Layout from './layout/Layout';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Billing from './components/Billing';
import Bills from './components/Bills';
import Purchases from './components/Purchases';
import Returns from './components/Returns';
import ExpiryNotification from './components/ExpiryNotification';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/expiry-notification" element={<ExpiryNotification />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
