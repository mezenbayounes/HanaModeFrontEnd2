import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { useTranslation } from "react-i18next";
import { FiMail } from "react-icons/fi";
import LanguageSwitcher from "../components/LanguageSwitcher";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await forgotPassword(email);
      setMessage("OTP sent to your email. Please check your inbox.");
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
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
            <div className="bg-brown-100 p-3 rounded-full mb-2"><FiMail className="text-brown-700 text-3xl" /></div>
            <h2 className="text-2xl font-bold text-brown-700 mb-1">{t('auth.forgotPasswordTitle')}</h2>
            <p className="text-gray-500 text-center text-sm mb-2">{t('auth.forgotPasswordDesc')}</p>
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
          {message && <div className="mb-4 text-green-600 text-center">{t('auth.otpSent')}</div>}
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

export default ForgotPasswordPage;
