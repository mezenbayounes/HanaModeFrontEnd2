import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, PlusCircle, Package, LogOut, UserPlus, ListOrdered, Menu, X, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login-admin-console');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
     { path: '/admin/orders', label: t('orders.adminTitle', 'Orders'), icon: ListOrdered },
      { path: '/admin/products', label: t('adminProduct.title'), icon: Package },
   
    { path: '/add-category', label: t('admin.manageCategories'), icon: LayoutGrid },
      { path: '/admin/messages', label: t('admin.messages', 'Messages'), icon: MessageSquare },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-4 md:mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand (optional) */}
          <div className="flex items-center lg:hidden">
            <span className="text-lg font-bold text-gray-900">{t('admin.panel', 'Admin')}</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex lg:space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    active
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-2 ${active ? 'text-gray-900' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side - Language Switcher & Logout */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            
            <button 
              onClick={handleLogout} 
              className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
              title={t('auth.logout', 'Logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>

            <Link
              to="/add-admin"
              className={`p-2 transition-colors ${isActive('/add-admin') ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              title={t('admin.addAdminTitle', 'Add Admin')}
            >
              <UserPlus className="w-5 h-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-3 space-y-1 border-t border-gray-200">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${active ? 'text-gray-900' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
