import React, { useState } from "react";
import { Search, ShoppingCart, Bell, Menu, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCartStore } from "../../stores/cartStore";
import { PLANS } from "../../data/plans";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { getTotalItems, toggleCart, showAddedAnimation } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");

  const planName = PLANS.find((p) => p.id === user?.plan)?.name ?? "Nenhum";

  const totalCartItems = getTotalItems();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left section */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Search bar */}
          <div className="relative max-w-sm lg:max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              value={searchQuery}
              onChange={
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value.slice(0, 100)) // Limit input length
              }
              maxLength={100}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
          {/* Search button for mobile */}
          <button className="md:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className={`relative p-1.5 sm:p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 ${
              showAddedAnimation ? "animate-bounce bg-primary text-white" : ""
            }`}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {totalCartItems > 0 && (
              <span
                className={`absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center transition-all duration-200 ${
                  showAddedAnimation ? "animate-pulse scale-110" : ""
                }`}
              >
                {totalCartItems > 9 ? '9+' : totalCartItems}
              </span>
            )}
          </button>

          {/* User profile */}
          <Link
            to="/profile"
            className="flex items-center space-x-2 sm:space-x-3 focus:outline-none ml-1 sm:ml-2"
          >
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-24">
                {user?.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {planName}
              </p>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header;
