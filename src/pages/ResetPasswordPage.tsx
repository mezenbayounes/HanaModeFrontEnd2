import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { useTranslation } from "react-i18next";
import { FiLock } from "react-icons/fi";
import LanguageSwitcher from "../components/LanguageSwitcher";

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState(() => {
    // If navigated from forgot-password, prefill email
    return (location.state && (location.state as any).email) || "";
  });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await resetPassword({ email, otp, newPassword, confirmPassword });
      setMessage("Password reset successful. You can now log in.");
      setTimeout(() => {
        navigate("/user-login");
      }, 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8 px-2">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-2xl mx-auto">
        <div className="flex justify-end mb-2"><LanguageSwitcher /></div>
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg w-full border border-brown-100">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-brown-100 p-3 rounded-full mb-2"><FiLock className="text-brown-700 text-3xl" /></div>
            <h2 className="text-2xl font-bold text-brown-700 mb-1">{t('auth.resetPassword')}</h2>
            <p className="text-gray-500 text-center text-sm mb-2">{t('auth.otp')}</p>
          </div>
          <label className="block mb-2 text-gray-700 font-medium">{t('auth.email')}</label>
          <input
            type="email"
            className="w-full p-3 border border-brown-200 rounded focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@email.com"
          />
          <label className="block mb-2 text-gray-700 font-medium">{t('auth.otp')}</label>
          <input
            type="text"
            className="w-full p-3 border border-brown-200 rounded focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            placeholder="123456"
          />
          <label className="block mb-2 text-gray-700 font-medium">{t('auth.newPassword')}</label>
          <input
            type="password"
            className="w-full p-3 border border-brown-200 rounded focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <label className="block mb-2 text-gray-700 font-medium">{t('auth.confirmNewPassword')}</label>
          <input
            type="password"
            className="w-full p-3 border border-brown-200 rounded focus:outline-none focus:ring-2 focus:ring-brown-200 mb-4"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          {message && <div className="mb-4 text-green-600 text-center">{t('auth.resetPasswordSuccess')}</div>}
          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 hover:bg-gray-900 transition font-semibold text-lg shadow rounded-none"
            disabled={loading}
          >
            {loading ? t('common.loading') : t('auth.resetPassword')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
