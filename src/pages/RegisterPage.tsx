import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import bgadminHero from '../assets/bguserlogin.png';
import hanaLogo from '../assets/hanaModeLogo.png';
import { API_URL } from '../config';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.email !== form.confirmEmail) {
      setError(t('auth.emailsDoNotMatch'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name: form.name,
        email: form.email,
        address: form.address,
        password: form.password,
      });
      
      if (data.requiresVerification) {
        navigate('/verify-email', { state: { email: form.email } });
      } else {
        register(data.token, data.user);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Hero Image */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgadminHero})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-8">
          <h1 className="text-white text-5xl font-bold text-center">{t('auth.signUpTitle')}</h1>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        {/* Language Switcher */}
        <div className="w-full flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center mb-4">
            <img src={hanaLogo} alt="Hana Mode Logo" className="h-20 w-auto object-contain" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t('auth.signUpTitle')}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-center">{error}</div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              {/* Name */}
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                placeholder={t('auth.name')}
                value={form.name}
                onChange={handleChange}
              />

              {/* Email */}
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                placeholder={t('auth.email')}
                value={form.email}
                onChange={handleChange}
              />

              {/* Confirm Email */}
              <input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                placeholder={t('auth.confirmEmail')}
                value={form.confirmEmail}
                onChange={handleChange}
              />

              {/* Address */}
              <textarea
                id="address"
                name="address"
                rows={2}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm resize-none"
                placeholder={t('auth.enterAddress')}
                value={form.address}
                onChange={handleChange}
              />

              {/* Password */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  placeholder={t('auth.password')}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  placeholder={t('auth.confirmPassword')}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : null}
              {t('auth.createAccount')}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or sign up with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.location.href = `${API_URL}/api/auth/google`}
              className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="text-center text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/user-login" className="font-medium text-black hover:text-gray-800">
                {t('auth.signIn')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}