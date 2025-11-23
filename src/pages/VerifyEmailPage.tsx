import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import hanaLogo from '../assets/hanaModeLogo.png';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useTranslation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/user-login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-email`, {
        email,
        otp,
      });

      const { token, user } = response.data;
      login(token, user);
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center mb-6">
          <img src={hanaLogo} alt="Hana Mode Logo" className="h-16 w-auto object-contain" />
        </div>
        
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-8">
          We sent a verification code to <span className="font-medium text-gray-900">{email}</span>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-center mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm text-center tracking-widest text-lg"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    </div>
  );
}
