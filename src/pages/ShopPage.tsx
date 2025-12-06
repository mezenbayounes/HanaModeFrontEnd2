import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../types/Product";
import BestSellerCard from '../components/BestSellerCard';
import { useTranslation } from "react-i18next";
import React from "react";
import { getProducts } from "../api/productsApi";
import { getCategories } from "../api/CategoryApi";
import FilterPanel from "../components/FilterPanel";
import ProductCard from "../components/ProductCard";

const ITEMS_PER_PAGE = 9;

export default function ShopPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  type Category = string | "all";
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProducts();
        setProducts(productData);

        const categoryData = await getCategories();
        setCategories(categoryData);

      } catch (err) {
        console.error(err);
        setError(t('shop.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, showInStockOnly, searchTerm, sortOrder]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        if (!product.name.toLowerCase().includes(term) && !product.description?.toLowerCase().includes(term)) {
           return false;
        }
      }
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (showInStockOnly && !product.inStock) return false;
      return true;
    });
  }, [products, selectedCategory, showInStockOnly, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categoryOptions = [
    ...categories.map((cat) => ({
      value: cat.name,
      label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
    })),
  ];
  
  const filteredCategories = categoryOptions
    .filter((cat) =>
      cat.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.label.localeCompare(b.label);
      } else {
        return b.label.localeCompare(a.label);
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana px-4">
      {/* Header */}
      <div className="text-center py-6">
        <ShoppingBag className="mx-auto w-10 h-10 text-gray-700 to gray-900" />
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {t('shop.ourProducts')}
        </h2>
        <div className="w-16 h-1 bg-gray-700 to gray-900 rounded-full mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm md:text-base">
          {t('shop.discoverCollection')} {products.length} {t('shop.styles')}
        </p>
      </div>

      {/* Breadcrumb - Above Filter Panel (All Screens) */}
      <nav className="flex items-center gap-1 text-sm mb-4 max-w-7xl mx-auto px-4">
        <Link 
          to="/" 
          className="text-gray-600 hover:text-gray-900 transition-colors uppercase"
        >
          {t('breadcrumb.home', 'Accueil')}
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-900 font-medium uppercase">
          {t('shop.title', 'Shop')}
        </span>
      </nav>

      {/* FILTER PANEL - Top Center */}
      <div className="max-w-7xl mx-auto mb-8">
        <FilterPanel
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortOrder={sortOrder as 'asc' | 'desc'}
          onSortChange={(value) => setSortOrder(value)}
          categories={filteredCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showInStockOnly={showInStockOnly}
          onInStockChange={setShowInStockOnly}
          onResetFilters={() => { setSelectedCategory("all"); setShowInStockOnly(false); }}
        />
      </div>

      {/* PRODUCTS SECTION - Full Width */}
      <div className="max-w-7xl mx-auto">
        {/* Results count */}
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          {t('shop.showing')} <span className="font-bold text-gray-900">{filteredProducts.length}</span> {t('shop.products')}
        </p>

         {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="flex justify-center w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-3 max-w-6xl justify-items-center">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
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
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-gray-600 text-base md:text-lg">
              {t('shop.noProductsMatch')}
            </p>
            <button
              onClick={() => { setSelectedCategory("all"); setShowInStockOnly(false); }}
              className="mt-4 text-red-500 hover:text-red-600 font-medium"
            >
              {t('shop.resetFilters')}
          </button>
          </div>
        )}
        <br></br>
      </div>
      <br></br>
    </div>
    
  );
}
