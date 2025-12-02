import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { createPortal } from 'react-dom';
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close User Dropdown if clicked outside
      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }

      // Close Mobile Menu if clicked outside
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        // Don't close if clicking the toggle button itself (handled by its own onClick)
        !(event.target as Element).closest('button[aria-label="Toggle menu"]')
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (userDropdownOpen || mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen, mobileMenuOpen]);

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
        <div className="flex items-center justify-between h-24">
          
          {/* Left Section: Mobile Menu & Desktop Nav */}
          <div className="flex items-center justify-start flex-1 lg:gap-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 mr-2"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Desktop Logo */}
            <Link to="/" className="hidden lg:flex flex-row items-center gap-2 group transition-transform hover:scale-105 lg:-ml-4">
              <img
                src={hanaLogo}
                alt="Logo Hana Mode"
                className="h-10 w-auto object-contain"
              />
              <span className="text-lg sm:text-xl font-serif italic tracking-wider leading-none">
                <span className="text-gray-900 group-hover:text-gray-700 transition-colors">HANA</span> {''}
                <span className="text-red-600 group-hover:text-red-500 transition-colors">MODE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 font-medium text-sm uppercase tracking-wide transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-300 origin-left ${
                    isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Center Section: Logo (Mobile Only) */}
          <div className="flex-shrink-0 flex justify-center lg:hidden">
            <Link to="/" className="flex flex-col items-center group transition-transform hover:scale-105">
              <img
                src={hanaLogo}
                alt="Logo Hana Mode"
                className="h-10 w-auto object-contain mb-1"
              />
              <span className="text-lg sm:text-xl font-serif italic tracking-wider leading-none">
                <span className="text-gray-900 group-hover:text-gray-700 transition-colors">HANA</span> {''}
                <span className="text-red-600 group-hover:text-red-500 transition-colors">MODE</span>
              </span>
            </Link>
          </div>

          {/* Right Section: Language, User, Cart */}
          <div className="flex items-center justify-end flex-1 gap-2 sm:gap-3">
            {/* Language Switcher - Visible on desktop only */}
            <div className="hidden lg:flex items-center">
              <LanguageSwitcher />
            </div>

            {/* User Account Dropdown - Hidden on mobile, visible on desktop */}
            <div className="relative hidden lg:block" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
                <User className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 uppercase">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      {/* Favorites */}
                      <Link
                        to="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-black transition-colors group"
                      >
                        <Heart className="w-5 h-5 group-hover:text-black" />
                        <span className="text-sm font-medium uppercase relative">
                          {t('favorites.favorites')}
                          <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                      </Link>

                      {/* Order History */}
                      <Link
                        to="/order-history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-black transition-colors group"
                      >
                        <ShoppingCart className="w-5 h-5 group-hover:text-black" />
                        <span className="text-sm font-medium uppercase relative">
                          {t('orderHistory.title')}
                          <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-black transition-colors w-full text-left group"
                      >
                        <LogOut className="w-5 h-5 group-hover:text-black" />
                        <span className="text-sm font-medium uppercase relative">
                          {t('auth.logout')}
                          <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Login */}
                      <Link
                        to="/user-login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-black transition-colors group"
                      >
                        <User className="w-5 h-5 group-hover:text-black" />
                        <span className="text-sm font-medium uppercase relative">
                          {t('auth.signIn')}
                          <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                      </Link>

                      {/* Register */}
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-black transition-colors group"
                      >
                        <User className="w-5 h-5 group-hover:text-black" />
                        <span className="text-sm font-medium uppercase relative">
                          {t('auth.register')}
                          <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer - Rendered via Portal */}
        {createPortal(
          <>
            {/* Overlay */}
            <div 
              className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 lg:hidden ${
                mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
              ref={mobileMenuRef}
              className={`fixed top-0 left-0 h-full w-[300px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out lg:hidden ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="flex flex-col h-full overflow-y-auto bg-white">
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <span className="text-xl font-serif italic tracking-wider">
                    <span className="text-gray-900">HANA</span> <span className="text-red-600">MODE</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                {/* Drawer Content */}
                <nav className="flex flex-col p-4 gap-2">
                  {navLinks.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl font-medium uppercase text-sm transition-all duration-300 relative group ${
                        isActive(link.path)
                          ? 'text-black bg-gray-50'
                          : 'text-gray-700 hover:text-black hover:bg-gray-50'
                      }`}
                    >
                      <span className="relative">
                        {link.label}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-300 origin-left ${
                          isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}></span>
                      </span>
                    </Link>
                  ))}
                  
                  {/* Mobile Language Switcher */}
                  <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-4 flex justify-between items-center">
                    <span className="text-gray-700 font-medium uppercase text-sm">Language</span>
                    <LanguageSwitcher />
                  </div>

                  {/* Mobile User Links */}
                  <div className="border-t border-gray-200 mt-2 pt-4">
                    {isAuthenticated ? (
                      <>
                        {/* User Email Display in Mobile Menu */}
                        <div className="px-4 py-2 mb-2">
                          <p className="text-sm font-semibold text-gray-900 uppercase">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>

                        <Link
                          to="/favorites"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-black group"
                        >
                          <Heart className="w-5 h-5" />
                          <span className="uppercase text-sm font-medium relative">
                            {t('favorites.favorites')}
                            <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                          </span>
                        </Link>
                        <Link
                          to="/order-history"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-black group"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span className="uppercase text-sm font-medium relative">
                            {t('orderHistory.title')}
                            <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-black w-full text-left group"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="uppercase text-sm font-medium relative">
                            {t('auth.logout')}
                            <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                          </span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/user-login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-black group"
                        >
                          <User className="w-5 h-5" />
                          <span className="uppercase text-sm font-medium relative">
                            {t('auth.signIn')}
                            <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                          </span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-black group"
                        >
                          <User className="w-5 h-5" />
                          <span className="uppercase text-sm font-medium relative">
                            {t('auth.register')}
                            <span className="absolute bottom-0 left-0 w-full h-px bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </>,
          document.body
        )}
      </div>
    </header>
  );
}
