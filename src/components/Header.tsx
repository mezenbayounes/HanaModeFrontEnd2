import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from 'react-i18next';
import React from 'react';
import hanaLogo from '../assets/hanaModeLogo.png';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userDropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);
  const items = useCartStore(state => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('common.home') },
    { path: '/shop', label: t('common.shop') },
    { path: '/categories', label: t('common.categories') },
    { path: '/contact', label: t('common.contact') },
  ];

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 font-hana border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <img
              src={hanaLogo}
              alt="Logo Hana Mode"
              className="h-12 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
            <span className="text-2xl sm:text-3xl font-serif italic tracking-wider">
              <span className="text-gray-900 group-hover:text-gray-700 transition-colors">Hana</span>
              <span className="text-red-600 group-hover:text-red-500 transition-colors">Mori</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2.5 rounded-lg font-medium text-base transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side: Language, User, Cart & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Language Switcher - Visible on desktop only */}
            <div className="hidden lg:flex items-center">
              <LanguageSwitcher />
            </div>

            {/* User Account Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
                <User className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || user?.email}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {/* Favorites */}
                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{t('favorites.favorites')}</span>
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{t('auth.logout')}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Login */}
                      <Link
                        to="/user-login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{t('auth.signIn')}</span>
                      </Link>

                      {/* Register */}
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{t('auth.register')}</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-red-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Language Switcher */}
            <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Language</span>
              <LanguageSwitcher />
            </div>

            {/* Mobile User Links */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{t('favorites.favorites')}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-gray-50 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('auth.logout')}</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/user-login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('auth.signIn')}</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  >
                    <User className="w-5 h-5" />
                    <span>{t('auth.register')}</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
