import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types/Product';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { getProductsByCategory } from '../api/productsApi';
import ProductFilter, { SortOption, ViewMode } from '../components/ProductFilter';
import BestSellerCard from '../components/BestSellerCard';
import ProductListItem from '../components/ProductListItem';
import ProductCard from '../components/ProductCard';

const ITEMS_PER_PAGE = 9;

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
  const [currentPage, setCurrentPage] = useState(1);
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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [onlyInStock, onlyDiscounted, searchTerm, sortOption]);

  const processedProducts = useMemo(() => {
    let result = [...products];

    if (onlyInStock) {
      result = result.filter(product => product.inStock);
    }

    if (onlyDiscounted) {
      result = result.filter(
        product =>
          typeof product.discountPrice === 'number' &&
          product.discountPrice > 0 &&
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

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedProducts, currentPage]);

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);

  const priceStats = useMemo(() => {
    if (products.length === 0) return null;
    const prices = products.map(product => product.discountPrice ?? product.price);
    return {
      min: Math.min(...prices).toFixed(2),
      max: Math.max(...prices).toFixed(2)
    };
  }, [products]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana px-4">
      {/* Category Title - Centered */}
      <div className="text-center py-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 uppercase">
          {categoryName || category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h1>
      </div>

      {/* Breadcrumb Navigation - Above Filter */}
      <nav className="flex items-center gap-1 text-sm mb-4 max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="text-gray-600 hover:text-gray-900 transition-colors uppercase"
        >
          {t('breadcrumb.home', 'Accueil')}
        </Link>
        <span className="text-gray-400">›</span>
        <Link 
          to="/categories" 
          className="text-gray-600 hover:text-gray-900 transition-colors uppercase"
        >
          {t('breadcrumb.categories', 'Categories')}
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-900 font-medium uppercase">
          {categoryName || category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </nav>

      {/* FILTER PANEL - Top Center (Using ProductFilter for now) */}
      <div className="max-w-7xl mx-auto mb-8">
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
      </div>

      {/* PRODUCTS SECTION - Full Width */}
      <div className="max-w-7xl mx-auto">

        {processedProducts.length > 0 ? (
          <>
            <div className={viewMode === 'grid' ? 'flex justify-center w-full' : ''}>
              <div className={viewMode === 'grid' ? 'grid grid-cols-2     md:grid-cols-3    lg:grid-cols-4    gap-x-4 gap-y-6 md:gap--4 md:gap-y-8w-fullmax-w-full px-0 md:px-0  md:px-0 ' : 'space-y-6'}>
              {paginatedProducts.map(product =>
                viewMode === 'grid' ? (
               <ProductCard key={product.id} product={product} />
                ) : (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                    actions={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
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
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-black text-white'
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
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
      <br></br>
    </div>
    
  );
}
