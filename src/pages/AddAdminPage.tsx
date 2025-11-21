import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import bgadminHero from '../assets/bgadmin.png';
import hanaLogo from '../assets/hanaModeLogo.png';

const AddAdminPage: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login-admin-console" replace />;
  }
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        role: "admin"
      });
      setMessage(t('admin.addAdminSuccess', 'Admin created successfully!'));
      setTimeout(() => {
        navigate('/login-admin-console');
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setFormLoading(false);
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
            {t('auth.addNewAdmin')}
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
          <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg w-full border border-brown-100">
            <h2 className="text-2xl font-bold text-brown-700 mb-6 text-center"> {t('auth.addNewAdmin')}</h2>
            <label className="block mb-2 text-gray-700 font-medium">{t('auth.email')}</label>
            <input
              type="email"
              className="w-full p-3 border border-brown-200 rounded focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@email.com"
            />
            <label className="block mb-2 text-gray-700 font-medium">{t('auth.name')}</label>
            <input
              type="text"
              className="w-full p-3 border border-brown-200 rounded focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Admin Name"
            />
            <label className="block mb-2 text-gray-700 font-medium">{t('auth.password')}</label>
            <input
              type="password"
              className="w-full p-3 border border-brown-200 rounded focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
            {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-black text-white py-2.5 hover:bg-gray-900 transition font-semibold text-lg shadow rounded-none"
              disabled={formLoading}
            >
              {formLoading ? t('common.loading') :  t('auth.createAccount')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdminPage;
