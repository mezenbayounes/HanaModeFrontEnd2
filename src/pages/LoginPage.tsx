import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import bgadminHero from '../assets/bgadmin.png';
import { Link } from 'react-router-dom';
import hanaLogo from '../assets/hanaModeLogo.png';
import { API_URL } from '../config';

export default function LoginPage() {
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
      const response = await axios.post(`${API_URL}/api/auth/login-admin`, {
        email,
        password,
      });

      const { token, user } = response.data;
      login(token, user);
      navigate('/admin/products');
    } catch (err: any) {
      if (err.response?.data?.requiresVerification) {
        navigate('/verify-email', { state: { email: err.response.data.email || email } });
      } else {
        setError(err.response?.data?.message || t('auth.loginFailed'));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Hero Image */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bgadminHero})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-16">
          <h1 className="text-white text-4xl font-bold px-6 text-center">
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
            <img src={hanaLogo} alt="Hana Mode Logo" className="h-20 w-auto object-contain" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {t('auth.signInTitle')}
          </h2>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-t-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-b-md focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black rounded-none"
            >
              {t('auth.signIn')}
            </button>


          </form>
          <div className="text-center mt-4">
            <Link to="/add-admin" className="text-sm text-brown-700 hover:underline">
             {t('auth.addNewAdmin')}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
