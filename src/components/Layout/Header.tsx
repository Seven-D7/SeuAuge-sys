import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Bell, Menu, User, Star, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/SupabaseAuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useCartStore } from "../../stores/cartStore";
import { useLevelStore } from "../../stores/levelStore";
import { PLANS } from "../../data/plans";
import LanguageSelector from "../LanguageSelector";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDebouncedCallback } from "../../hooks/useDebounce";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { getTotalItems, toggleCart, showAddedAnimation } = useCartStore();
  const { levelSystem } = useLevelStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "Nova conquista desbloqueada!", type: "achievement" },
    { id: 2, message: "Sequência de 7 dias!", type: "streak" },
    { id: 3, message: "Novo vídeo disponível", type: "content" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const planName = PLANS.find((p) => p.id === user?.plan)?.name ?? "Iniciante";
  const totalCartItems = getTotalItems();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/videos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowMobileSearch(false);
    }
  }, [searchQuery, navigate]);

  const handleMobileSearchToggle = useCallback(() => {
    setShowMobileSearch(prev => !prev);
    if (showMobileSearch) {
      setSearchQuery("");
    }
  }, [showMobileSearch]);

  const handleNotificationsToggle = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  // Debounced search input handler
  const debouncedSearchHandler = useDebouncedCallback((value: string) => {
    // Aqui poderia fazer uma busca em tempo real se necessário
    console.log('Searching for:', value);
  }, 300);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 sticky top-0 z-40 backdrop-blur-sm bg-slate-900/95"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t('navigation.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.slice(0, 100))}
              maxLength={100}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-200"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile search button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMobileSearchToggle}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {showMobileSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotificationsToggle}
              className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50"
                >
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-white font-semibold">Notificações</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-3 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50 transition-colors">
                          <p className="text-white text-sm">{notification.message}</p>
                          <span className="text-xs text-slate-400 capitalize">{notification.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Selector */}
          <LanguageSelector variant="discrete" />

          {/* Cart */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleCart}
            className={`relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 ${
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
            className="flex items-center space-x-3 hover:bg-slate-800 rounded-lg p-2 transition-all duration-200 group"
          >
            {/* User info - hidden on mobile */}
            <div className="hidden sm:block text-right">
              <div className="flex items-center space-x-1">
                <p className="text-sm font-medium text-white">
                  {user?.name || 'Usuário'}
                </p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-400">
                    {levelSystem.currentLevel}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {planName}
              </p>
            </div>

            {/* Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-r from-primary to-emerald-500 flex items-center justify-center ring-2 ring-slate-700 group-hover:ring-primary/50 transition-all duration-200">
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
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800 border-t border-slate-700 px-4 py-3"
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('navigation.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.slice(0, 100))}
                maxLength={100}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all duration-200"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
