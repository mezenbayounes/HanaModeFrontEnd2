import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types/Product';
import ProductCard from '../components/ProductCard';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { getProductsByCategory } from '../api/productsApi';
import ProductFilter, { SortOption, ViewMode } from '../components/ProductFilter';
import ProductListItem from '../components/ProductListItem';

export default function CategoryPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryColor, setCategoryColor] = useState<string>('from-gray-800 to-gray-900');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();



  const toSlug = (value: string) =>
    value
      .trim()
      .replace(/\s+/g, '-');

  useEffect(() => {
    const fetchData = async () => {
      if (!category) return;

      try {
        setLoading(true);
        setError(null);

        const rawCategory = decodeURIComponent(category);
        setCategoryName(rawCategory);
        
        const productsData = await getProductsByCategory(rawCategory);
        setProducts(productsData);
      } catch (err: any) {
        console.error('Error fetching category data:', err);
        // Check if it's a 400 or 404 error from backend
        if (err.response?.status === 400 || err.response?.status === 404) {
          setError(err.response?.data?.message || t('category.notFound'));
        } else {
          setError(t('category.notFound'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, t]);

  const processedProducts = useMemo(() => {
    let result = [...products];

    if (onlyInStock) {
      result = result.filter(product => product.inStock);
    }

    if (onlyDiscounted) {
      result = result.filter(
        product =>
          typeof product.discountPrice === 'number' &&
          product.discountPrice < product.price
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }

    switch (sortOption) {
      case 'priceAsc':
        result.sort(
          (a, b) =>
            (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price)
        );
        break;
      case 'priceDesc':
        result.sort(
          (a, b) =>
            (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price)
        );
        break;
      case 'discount':
        result.sort((a, b) => {
          const discountA = a.discountPrice ? a.price - a.discountPrice : 0;
          const discountB = b.discountPrice ? b.price - b.discountPrice : 0;
          return discountB - discountA;
        });
        break;
      default:
        result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }

    return result;
  }, [products, onlyInStock, onlyDiscounted, searchTerm, sortOption]);

  const priceStats = useMemo(() => {
    if (products.length === 0) return null;
    const prices = products.map(product => product.discountPrice ?? product.price);
    return {
      min: Math.min(...prices).toFixed(2),
      max: Math.max(...prices).toFixed(2)
    };
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-48 rounded-3xl bg-white/70" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="h-48 rounded-xl bg-gray-200" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center font-hana">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('category.notFound')}</h2>
          <button
            onClick={() => navigate('/')}
            className="text-gray-900 hover:text-gray-700 font-medium"
          >
            {t('category.returnHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
      <div className={`bg-gradient-to-r ${categoryColor} py-16 px-4`}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-white">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('category.back')}
            </button>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{t('category.curatedLooks', 'Looks sélectionnés pour vous')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-white/80 uppercase tracking-[0.3em] text-sm">
              {t('category.curated', 'Collection exclusive')}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {categoryName || category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {t(
                'category.heroSubtitle',
                'Découvrez notre sélection soigneusement élaborée pour mettre en valeur votre silhouette avec des pièces iconiques.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('category.stylesAvailable')}</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('category.inStock')}</p>
              <p className="text-2xl font-bold">
                {products.filter(product => product.inStock).length}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur  px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('category.bestDeals',)}</p>
              <p className="text-2xl font-bold">
                {products.filter(product => product.discountPrice && product.discountPrice < product.price).length}
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('category.priceRange')}</p>
              <p className="text-xl font-semibold">
                {priceStats ? `${priceStats.min} - ${priceStats.max} DNT` : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <ProductFilter
          onlyInStock={onlyInStock}
          setOnlyInStock={setOnlyInStock}
          onlyDiscounted={onlyDiscounted}
          setOnlyDiscounted={setOnlyDiscounted}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onReset={() => {
            setOnlyInStock(false);
            setOnlyDiscounted(false);
            setSortOption('popular');
            setSearchTerm('');
          }}
        />

        {processedProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7' : 'space-y-6'}>
            {processedProducts.map(product =>
              viewMode === 'grid' ? (
                <ProductCard key={product._id} product={product} />
              ) : (
                <ProductListItem
                  key={product._id}
                  product={product}
                  onClick={() => navigate(`/product/${product._id}`)}
                  actions={
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product._id}`);
                      }}
                      className="px-6 py-3  bg-gray-900 text-white font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                    >
                      {t('common.viewDetails')}
                    </button>
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <p className="text-gray-600 text-lg mb-4">{t('category.noProducts')}</p>
            <p className="text-gray-500 mb-6">
              {t(
                'category.noProductsDetail',
                'Essayez d’assouplir vos filtres ou découvrez nos autres collections.'
              )}
            </p>
            <button
              onClick={() => {
                setOnlyInStock(false);
                setOnlyDiscounted(false);
                setSortOption('popular');
                setSearchTerm('');
              }}
              className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
            >
              {t('filters.reset', 'Réinitialiser les filtres')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
