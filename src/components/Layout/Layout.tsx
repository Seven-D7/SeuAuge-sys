import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import Cart from '../Cart/Cart';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="flex">
        {/* Sidebar - Fixed positioning for desktop, overlay for mobile */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
          {/* Header with menu toggle */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Main content */}
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden"
          >
            <div className="max-w-full">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>

      {/* Cart sidebar - appears on top when needed */}
      <Cart />
    </div>
  );
};

export default Layout;
