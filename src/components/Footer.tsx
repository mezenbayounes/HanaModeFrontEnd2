import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin,Facebook ,Instagram} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import hanaLogo from '../assets/hanaModeLogoWhite.png';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white font-hana">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-center">
          {/* Brand */}
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
                <img 
                                src={hanaLogo} 
                                alt="Logo Hana Mode" 
                                className="w-15 h-12 object-contain"
                              />
                           
                           <span className="text-2xl font-serif italic tracking-wider">
                  <span className="text-white">Hana</span>
                  <span className="text-red-600">Mode</span>
                </span>
            </Link>
            <p className="text-gray-400 text-sm">
             {t('footer.description')}
            </p>
{/* Social Icons */}
<div className="flex items-center gap-4 mt-4">

  {/* Facebook */}
  <a 
    href="https://www.facebook.com/profile.php?id=100054450641095" 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-3 rounded-xl bg-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition"
  >
    <Facebook className="w-7 h-7 text-gray-200 hover:text-red-500 transition" />
  </a>

  {/* Instagram */}
  <a 
    href="https://www.instagram.com/_hana_mode_" 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-3 rounded-xl bg-white/10 backdrop-blur-md shadow-md hover:shadow-lg transition"
  >
    <Instagram className="w-7 h-7 text-gray-200 hover:text-red-500 transition" />
  </a>

</div>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors ">
                  {t('common.home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white transition-colors">
                  {t('common.shop')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors">
                  {t('common.categories')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('common.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories 
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.styles')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/skinny" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.skinnyJeans')}
                </Link>
              </li>
              <li>
                <Link to="/category/straight" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.straightJeans')}
                </Link>
              </li>
              <li>
                <Link to="/category/bootcut" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.bootcutJeans')}
                </Link>
              </li>
              <li>
                <Link to="/category/wide-leg" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.wideLegJeans')}
                </Link>
              </li>
              <li>
                <Link to="/category/boyfriend" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.boyfriendJeans')}
                </Link>
              </li>
            </ul>
          </div>
*/}
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">contact@hanamode.tn</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">+216 25 524 828</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400">
                    13 Rue de la kasabah<br />Bab Bhar, tunis
                  </p>
                </div>
              </li>
            </ul>
            {/* Mini Map */}
            <div className="mt-4 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg">
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

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} HanaMode. {t('common.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
