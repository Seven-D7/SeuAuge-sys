import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Cart from '../Cart/Cart';
import ProfileModal from '../Profile/ProfileModal';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Cart sidebar */}
      <Cart />
      <ProfileModal />
    </div>
  );
};

export default Layout;