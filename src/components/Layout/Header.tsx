import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Bell, Menu, User, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCartStore } from "../../stores/cartStore";
import { useLevelStore } from "../../stores/levelStore";
import { PLANS } from "../../data/plans";
import LanguageSelector from "../LanguageSelector";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { getTotalItems, toggleCart, showAddedAnimation } = useCartStore();
  const { levelSystem } = useLevelStore();
  const [searchQuery, setSearchQuery] = useState("");

  const planName = PLANS.find((p) => p.id === user?.plan)?.name ?? "Iniciante";
  const totalCartItems = getTotalItems();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar - hidden on mobile, shown on desktop */}
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar vídeos, apps, produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.slice(0, 100))}
              maxLength={100}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile search button */}
          <button className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </motion.button>

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCart}
            className={`relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 ${
              showAddedAnimation ? "animate-bounce bg-primary text-white" : ""
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium"
              >
                {totalCartItems > 9 ? '9+' : totalCartItems}
              </motion.span>
            )}
          </motion.button>

          {/* User Profile */}
          <Link
            to="/profile"
            className="flex items-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg p-2 transition-all duration-200 group"
          >
            {/* User info - hidden on mobile */}
            <div className="hidden sm:block text-right">
              <div className="flex items-center space-x-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {user?.name || 'Usuário'}
                </p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    {levelSystem.currentLevel}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {planName}
              </p>
            </div>

            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-primary/50 transition-all duration-200">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || 'Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              {/* Online status indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
