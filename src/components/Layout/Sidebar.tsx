import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Play,
  Heart,
  ShoppingBag,
  Sparkles,
  Home,
  AppWindow,
  LogOut,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { PLANS } from "../../data/plans";
import { storeEnabled } from "../../lib/config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const planName = PLANS.find((p) => p.id === user?.plan)?.name ?? "Nenhum";

  const menuItems = [
    { icon: Home, label: "Início", path: "/dashboard" },
    { icon: Play, label: "Vídeos", path: "/videos" },
    {
      icon: ShoppingBag,
      label: "Loja",
      path: "/store",
      disabled: !storeEnabled,
    },
    { icon: Sparkles, label: "Planos", path: "/plans" },
    { icon: Heart, label: "Favoritos", path: "/favorites" },
    { icon: TrendingUp, label: "Progresso", path: "/progress" },
    { icon: AppWindow, label: "Apps", path: "/apps" },
    ...(user?.isAdmin
      ? [{ icon: ShieldCheck, label: "Admin", path: "/admin" }]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-screen w-72 max-w-[85vw] sm:max-w-none overflow-y-auto bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-800 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto lg:w-72
      `}
      >
        {/* Logo */}
        <div className="flex items-center px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                Meu Auge
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                Transforme-se
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 sm:mt-8 px-3 sm:px-4">
          <div className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const baseClasses = `
                flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 group text-sm sm:text-base
                ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-lg shadow-primary-dark/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50"
                }
                ${item.disabled ? "pointer-events-none opacity-50" : ""}
              `;

              if (item.disabled) {
                return (
                  <div key={item.path} className={baseClasses}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-auto text-xs text-slate-400">
                      Em breve
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={baseClasses}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 ${isActive(item.path) ? "text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-primary"}`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Plan Badge */}
        <div className="mx-3 sm:mx-4 mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">
                {planName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">
                Plano atual
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all duration-200 group text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 text-slate-600 dark:text-slate-400 group-hover:text-red-400" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
