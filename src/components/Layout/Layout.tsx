import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Cart from '../Cart/Cart';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Container principal do layout
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 lg:ml-72">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-3 sm:p-4 lg:p-6 max-w-full">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Cart sidebar */}
      <Cart />
    </div>
  );
};

export default Layout;
// Este componente Layout serve como um contêiner para todas as páginas protegidas da aplicação.
// Ele inclui a sidebar, o cabeçalho e os componentes de carrinho e perfil,
