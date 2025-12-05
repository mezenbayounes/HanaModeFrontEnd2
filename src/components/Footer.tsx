import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin,Facebook ,Instagram} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import hanaLogo from '../assets/hanaModeLogo.png';

export default function Footer() {
  const { t } = useTranslation();
  return (
  
    
    
    <footer className="bg-white text-gray-900 font-hana">

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-start md:justify-items-center w-full">
          
          {/* Brand */}
          <div className="md:justify-self-start">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={hanaLogo} 
                alt="Logo Hana Mode" 
                className="w-15 h-12 object-contain"
              />
              <span className="text-2xl font-serif italic tracking-wider">
                <span className="text-gray-900">Hana</span>
                <span className="text-red-600">Mode</span>
              </span>
            </Link>

            <p className="text-gray-600 text-sm">
              {t('footer.description')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/profile.php?id=100054450641095" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-gray-100 shadow-md hover:bg-gray-200 transition"
              >
                <Facebook className="w-7 h-7 text-gray-700 hover:text-red-600 transition" />
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/_hana_mode_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-gray-100 shadow-md hover:bg-gray-200 transition"
              >
                <Instagram className="w-7 h-7 text-gray-700 hover:text-red-600 transition" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('common.shop')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('common.categories')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors">
                  {t('common.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-gray-600">contact@hanamode.tn</p>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-gray-600">+216 25 524 828</p>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-gray-600">
                  13 Rue de la Kasabah<br />Bab Bhar, Tunis
                </p>
              </li>
            </ul>

            {/* Mini Map */}
            <div className="mt-4 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3192.497!2d10.174758!3d36.799362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzbCsDQ3JzU3LjciTiAxMMKwMTAnMjkuMSJF!5e0!3m2!1sen!2stn!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HanaMode Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-300 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} HanaMode. {t('common.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
   
  );
}
