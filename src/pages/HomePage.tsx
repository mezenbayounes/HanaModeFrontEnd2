import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Sparkles } from 'lucide-react';
import { getFeaturedProducts, getBestSellers } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { getProducts } from '../api/productsApi';
import { getCategories } from '../api/CategoryApi';
import { Product } from '../types/Product';
import heroImage from '../assets/heroImage1.png'; // adjust the path as needed
import { API_URL } from '../config';

interface Category {
  id: number;
  name: string;
  image?: string;
}

interface CategoryWithStyle extends Category {
  slug: string;
  color: string;
  image: string;
}

export default function HomePage() {
  const { t } = useTranslation();
//////////////////////////////////////
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [categories, setCategories] = useState<CategoryWithStyle[]>([]);
const [categoriesLoading, setCategoriesLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(t('home.loadError'));
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      
      // Filter for specific categories
      const targetCategories = ['casual', 'classic'];
      const filteredData = data.filter((cat: Category) => 
        targetCategories.includes(cat.name.toLowerCase())
      );
      
      // Map category colors and images based on name
      const categoryColorMap: Record<string, string> = {
        'skinny': 'from-rose-400 to-pink-500',
        'straight': 'from-purple-400 to-indigo-500',
        'bootcut': 'from-blue-400 to-cyan-500',
        'wide-leg': 'from-teal-400 to-green-500',
        'wide leg': 'from-teal-400 to-green-500',
        'boyfriend': 'from-amber-400 to-orange-500',
      };

      const categoryImageMap: Record<string, string> = {
        'skinny': 'https://cdn.pixabay.com/photo/2017/08/06/15/09/skinny-2593347_1280.jpg',
        'straight': 'https://cdn.pixabay.com/photo/2022/03/06/03/18/friends-7050708_1280.jpg',
        'bootcut': 'https://cdn.pixabay.com/photo/2018/05/06/03/39/woman-3377839_1280.jpg',
        'wide-leg': 'https://cdn.pixabay.com/photo/2017/03/20/20/36/blue-jeans-2160265_1280.jpg',
        'wide leg': 'https://cdn.pixabay.com/photo/2017/03/20/20/36/blue-jeans-2160265_1280.jpg',
        'boyfriend': 'https://cdn.pixabay.com/photo/2023/10/24/02/01/women-8337216_1280.jpg',
      };

      const defaultColor = 'from-rose-400 to-pink-500';
      const defaultImage = 'https://cdn.pixabay.com/photo/2018/05/06/03/39/woman-3377839_1280.jpg';
      const backendBaseUrl = API_URL;

      const categoriesWithStyle: CategoryWithStyle[] = filteredData.map((cat: Category) => {
        const nameCat = cat.name;
        // Use the category name directly (lowercase) for the slug to match API expectations
        const slug = nameCat.replace(/\s+/g, '-');

        let imageSrc = categoryImageMap[nameCat] || categoryImageMap[slug] || defaultImage;

        if (cat.image && cat.image.trim().length > 0) {
            imageSrc = cat.image.startsWith("http")
              ? cat.image
              : `${backendBaseUrl}${cat.image}`;
        }

        return {
          ...cat,
          slug: slug,
          color: categoryColorMap[nameCat] || categoryColorMap[slug] || defaultColor,
          image: imageSrc,
        };
      });

      setCategories(categoriesWithStyle);
    } catch (err) {
      console.error('Error loading categories', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  fetchCategories();
}, []);

const featured = products.filter(p => p.featured);
const bestSellers = products.filter(p => p.bestSeller);
//////////////////////////////////////

  const heroImages = [
    'https://cdn.pixabay.com/photo/2018/05/06/03/39/woman-3377839_1280.jpg',
    'https://cdn.pixabay.com/photo/2024/11/13/01/47/woman-9193216_1280.jpg',
    'https://cdn.pixabay.com/photo/2023/10/24/02/01/women-8337216_1280.jpg',
    'https://cdn.pixabay.com/photo/2022/03/06/03/18/friends-7050708_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/11/06/11/32/girl-1026246_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/02/16/23/10/smile-2072907_1280.jpg',
    heroImage

  ];


  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen font-hana bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10" />

          {heroImages.map((image, index) => (
            <div key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}>
              <img 
                src={image} 
                alt={`Mode ${index + 1}`} 
                className="w-full h-full object-cover scale-105 transition-transform duration-[10000ms] ease-out"
              />
            </div>
          ))}
        </div>

        {/* Hero Text */}
        <div className="relative z-20 max-w-7xl mx-auto text-center w-full px-4 py-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-red-600 animate-pulse" />
            <span className="text-sm font-semibold text-gray-900 tracking-wide">{t('common.newCollection')} {new Date().getFullYear()}</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight animate-slide-up">
            {t('home.heroTitle')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-500 to-rose-500 drop-shadow-lg mt-2">
              {t('home.heroSubtitle')}
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-10 max-w-3xl mx-auto drop-shadow-lg font-light leading-relaxed">
            {t('home.heroDescription')}
          </p>

          <div className="flex flex-wrap gap-5 justify-center mb-12">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-red-600 via-red-600 to-rose-600 text-white px-10 py-4  font-semibold hover:shadow-2xl transform hover:scale-110 transition-all duration-300 shadow-xl hover:from-red-500 hover:to-pink-500">
              <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {t('common.buyNow')}
            </Link>

            <Link
              to="/categories"
              className="group inline-flex items-center gap-3 bg-white/95 backdrop-blur-md text-gray-900 px-10 py-4  font-semibold hover:shadow-2xl transform hover:scale-110 transition-all duration-300 shadow-xl border-2 border-white/50 hover:bg-white">
              {t('common.exploreStyles')}
            </Link>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {heroImages.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? "bg-white w-10 h-3 shadow-lg" 
                    : "bg-white/40 hover:bg-white/70 w-3 h-3"
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

 {/* Featured */}
<section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
  {/* Decorative background elements */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-red-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
  
  <div className="max-w-7xl mx-auto relative z-10">
    <div className="flex flex-col items-center mb-16 animate-fade-in">
      {/* Icon + Title */}
      <div className="flex items-center gap-4 mb-4 group">
        <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {t('home.featuredTitle')}
        </h2>
      </div>

      {/* Small Red Separator */}
      <div className="w-20 h-1.5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full mb-4 shadow-md"></div>

      {/* Description */}
      <p className="text-gray-600 text-center text-lg max-w-2xl font-light">
        {t('home.featuredDescription')}
      </p>
    </div>

    {/* Flex wrapper to center the grid */}
    <div className="flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">{t('home.loadingProducts')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <p className="text-red-600 font-semibold text-lg">{error}</p>
          </div>
        ) : featured.length === 0 ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <p className="text-gray-500 text-lg">{t('home.noFeaturedProducts')}</p>
          </div>
        ) : (
          featured.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} size="home" />
            </div>
          ))
        )}
      </div>
    </div>
  </div>
</section>


      {/* Best Sellers */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16 animate-fade-in">
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-4 group">
        <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t('home.bestSellersTitle')}
              </h2>
            </div>

            {/* Small gray Separator */}
      <div className="w-20 h-1.5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full mb-4 shadow-md"></div>

            {/* Description */}
            <p className="text-gray-600 text-center text-lg max-w-2xl font-light">
              {t('home.bestSellersDescription')}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {loading ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">{t('home.loadingProducts')}</p>
                  </div>
                </div>
              ) : error ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <p className="text-red-600 font-semibold text-lg">{error}</p>
                </div>
              ) : bestSellers.length === 0 ? (
                <div className="col-span-full flex justify-center items-center py-20">
                  <p className="text-gray-500 text-lg">{t('home.noBestSellers')}</p>
                </div>
              ) : (
                bestSellers.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} size="home" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-24 px-4 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"></div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {t('home.categoriesTitle')}
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-center text-lg md:text-xl max-w-3xl font-light leading-relaxed">
              {t('home.categoriesDescription')}
            </p>
          </div>
          
          {/* Modern Category Grid */}
          {categoriesLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">{t('common.loading')}</p>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">{t('categories.noCategories')}</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl w-full">
                {categories.map((category, index) => {
                  return (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-[1.02] animate-fade-in-up h-[500px] sm:h-[600px]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                    {/* Background Image with Parallax Effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" 
                      />
                      {/* Dark Gradient Overlay for text readability only */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
                    </div>

                    {/* Content Container */}
                    <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
                      {/* Category Badge */}
                      <div className="mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold uppercase tracking-wider border border-white/30">
                          {t('common.categories')}
                        </span>
                      </div>

                      {/* Category Name */}
                      <h3 className="text-white font-extrabold text-4xl lg:text-5xl drop-shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-500 leading-tight">
                        {category.name}
                      </h3>

                      {/* Explore Button */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                        <span className="text-white font-semibold text-lg">
                          {t('common.exploreStyles')}
                        </span>
                        <div className="w-10 h-0.5 bg-white rounded-full group-hover:w-16 transition-all duration-300"></div>
                        <svg 
                          className="w-6 h-6 text-white transform group-hover:translate-x-2 transition-transform duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>

                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* View All Categories Button */}
          <div className="flex justify-center mt-12 animate-fade-in">
            <Link
              to="/categories"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 text-white rounded-full font-semibold hover:shadow-2xl transform hover:scale-110 transition-all duration-300 shadow-lg hover:from-gray-800 hover:to-gray-600"
            >
              <span>{t('common.categories')}</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us 
      
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 relative overflow-hidden">
        {/* Decorative elements 
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {t('home.whyChooseUsTitle')}
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full mb-4 shadow-md"></div>
            <p className="text-gray-600 text-center text-lg max-w-2xl font-light">
              {t('home.whyChooseUsDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            <div 
              className="group bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl text-center transform hover:-translate-y-2 transition-all duration-500 border border-white/50 animate-fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-gray-900 group-hover:text-gray-600 transition-colors">{t('home.whyChooseUs.qualityTitle')}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{t('home.whyChooseUs.qualityDescription')}</p>
            </div>

            <div 
              className="group bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl text-center transform hover:-translate-y-2 transition-all duration-500 border border-white/50 animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-gray-900 group-hover:text-gray-600 transition-colors">{t('home.whyChooseUs.trendyTitle')}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{t('home.whyChooseUs.trendyDescription')}</p>
            </div>

            <div 
              className="group bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-xl hover:shadow-2xl text-center transform hover:-translate-y-2 transition-all duration-500 border border-white/50 animate-fade-in-up"
              style={{ animationDelay: '300ms' }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-gray-900 group-hover:text-gray-600 transition-colors">{t('home.whyChooseUs.perfectFitTitle')}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{t('home.whyChooseUs.perfectFitDescription')}</p>
            </div>
          </div>
        </div>
      </section>
      */}
    </div>
  );
}
