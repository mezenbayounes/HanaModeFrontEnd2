import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import React from 'react';

const languages = [
  { code: 'fr', name: 'Français', flag: '' },
 //{ code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // Update document direction for RTL support
    if (langCode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', langCode);
    }
  };

  // Set initial direction on mount
  useEffect(() => {
    if (i18n.language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', i18n.language);
    }
  }, [i18n.language]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 text-gray-700 font-medium group border border-transparent hover:border-gray-200"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 group-hover:text-red-600 transition-colors" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-sm font-medium">{currentLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:text-red-600`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 overflow-hidden animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-all duration-200 ${
                i18n.language === lang.code 
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-600 font-semibold border-l-4 border-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm font-medium flex-1">{lang.name}</span>
              {i18n.language === lang.code && (
                <span className="text-red-600 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

