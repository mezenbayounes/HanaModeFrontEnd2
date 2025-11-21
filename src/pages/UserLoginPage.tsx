import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import bgadminHero from '../assets/bguserlogin.png';
import hanaLogo from '../assets/HanaModeLogo.png';
import { API_URL } from '../config';

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Only allow regular users (not admins) to login here
      if (user.role === 'admin') {
        setError('Admin users should use the admin login page');
        return;
      }
      
      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.loginFailed'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Hero Image */}
<div
  className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
  style={{ backgroundImage: `url(${bgadminHero})`, minHeight: '100vh' }} // Increase height as needed
>
  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
    <h1 className="text-white text-5xl font-bold px-6 text-center">
      {t('auth.signInTitle')}
    </h1>
  </div>
</div>
      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-gray-50">
        {/* Language Switcher */}
        <div className="w-full flex justify-end mb-6">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center mb-2">
  <img src={hanaLogo} alt="Hana Mode Logo" className="h-40 w-auto object-contain" />
</div>
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
             
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {t('auth.LoginToYourAccount')}
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  {t('auth.email')}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {t('auth.password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {t('auth.signIn')}
            </button>

            <div className="text-center space-y-2">
              <div>
                <span className="text-sm text-gray-600">
                  {t('auth.dontHaveAccount')}{' '}
                  <Link to="/register" className="font-medium text-black hover:text-gray-800">
                    {t('auth.signUp')}
                  </Link>
                </span>
              </div>
              <div>
                <Link to="/forgot-password" className="text-sm text-brown-700 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
