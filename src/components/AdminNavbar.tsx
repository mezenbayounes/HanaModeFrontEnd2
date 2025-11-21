import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, PlusCircle, Package, LogOut } from 'lucide-react';
import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login-admin-console');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/add-category', label: t('admin.manageCategories'), icon: LayoutGrid },
    { path: '/admin/products', label: t('adminProduct.title'), icon: Package },
    { path: '/admin/products/add', label: t('adminProduct.addProduct'), icon: PlusCircle },
    
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    active
                      ? 'border-rose-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-2 ${active ? 'text-rose-500' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Language Switcher & Logout */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button 
              onClick={handleLogout} 
              className="p-2 text-gray-500 hover:text-rose-600 transition-colors"
              title={t('auth.logout', 'Logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
