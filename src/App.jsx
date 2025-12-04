import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'inventory':
      case 'analytics':
      case 'customers':
      case 'reports':
      case 'alerts':
      case 'settings':
        return (
          <div className="p-6 flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                {currentPage} Page
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                This section is coming soon. Stay tuned!
              </p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 lg:ml-0">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
