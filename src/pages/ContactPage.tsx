import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { submitContactForm } from '../api/contactApi';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await submitContactForm(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t('contact.submitError', 'Impossible d\'envoyer votre message. Veuillez réessayer.') ||
        'Une erreur est survenue';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-3">
            <p className="text-white/80 uppercase tracking-[0.3em] text-sm">
              {t('contact.getInTouch', 'Contactez-nous')}
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              {t('contact.title')}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {t('contact.haveQuestions')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('contact.emailUs')}</h3>
              <p className="text-gray-600">contact@hanamode.tn</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('contact.callUs')}</h3>
              <p className="text-gray-600">+216 25 524 828</p>
              <p className="text-gray-600 whitespace-pre-line">{t('contact.hours')}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t('contact.visitUs')}</h3>
              <p className="text-gray-600">13 Rue de la kasabah</p>
              <p className="text-gray-600">Bab Bhar, Tunis</p>
            </div>

            {/* Mini Map */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-4">{t('contact.ourLocation', 'Our Location')}</h3>
              <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3192.497!2d10.174758!3d36.799362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDQ3JzU3LjciTiAxMMKwMTAnMjkuMSJF!5e0!3m2!1sen!2stn!4v1234567890"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="HanaMode Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('contact.sendMessage')}</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact.thankYou')}</h3>
                  <p className="text-gray-600">{t('contact.messageReceived')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.yourName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange('name')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder={t('contact.enterName')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.emailAddress')} ({t('common.optional', 'Optional')})
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder={t('contact.enterEmail')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact.phoneNumber')}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder={t('contact.enterPhone')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={handleChange('message')}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder={t('contact.tellUs')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4  font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                      submitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    <Send className={`w-5 h-5 ${submitting ? 'animate-pulse' : ''}`} />
                    {submitting ? t('contact.sending', 'Envoi en cours...') : t('contact.sendMessageButton')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
