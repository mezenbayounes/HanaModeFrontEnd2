import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, AlertCircle, CheckCircle, LayoutGrid, List, Eye, EyeOff, X } from 'lucide-react';
import { getProducts, deleteProduct, Product, toggleProductVisibility } from '../api/ProductApi';
import AdminNavbar from '../components/AdminNavbar';
import ProductListItem from '../components/ProductListItem';
import { API_URL } from '../config';

export default function ManageProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorPopup, setErrorPopup] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError(t('adminProduct.errorLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('adminProduct.deleteConfirm'))) {
      try {
        await deleteProduct(id);
        setSuccess(t('adminProduct.successDeleted'));
        fetchProducts();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err: any) {
        // Show error in popup
        const errorMessage = err?.response?.data?.message || t('adminProduct.errorDelete');
        setErrorPopup(errorMessage);
      }
    }
  };

  const handleToggleVisibility = async (id: number) => {
    try {
      const result = await toggleProductVisibility(id);
      setSuccess(result.message);
      fetchProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(t('adminProduct.errorToggleVisibility'));
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inStockProducts = products.filter(p => p.inStock);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-hana">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-3">
            <p className="text-white/80 uppercase tracking-[0.3em] text-sm">
              {t('admin.panel')}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {t('adminProduct.title')}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {t('adminProduct.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur  px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('adminProduct.existingProducts')}</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <div className="bg-white/15 backdrop-blur px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('admin.status')}</p>
              <p className="text-lg font-semibold">
                {t('admin.active')} ({inStockProducts.length})
              </p>
            </div>
          </div>
        </div>
      </div>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200  px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200  px-4 py-3 mb-6">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        <div className="bg-white  p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('adminProduct.existingProducts')} ({filteredProducts.length})
            </h2>
            <div className="flex gap-3 items-center">
              <div className="flex bg-gray-100 rounded-lg p-1 gap-1 mr-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  title={t('category.viewGrid', 'Grid View')}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  title={t('category.viewList', 'List View')}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => navigate('/admin/products/add')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white  font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                {t('adminProduct.addProduct')}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder= {t('adminProduct.searchProduct')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3  border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? t('admin.noMatches') : 'No products found'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                viewMode === 'grid' ? (
                  <div 
                    key={product.id} 
                    className="border border-gray-200  hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div 
                      className="relative h-48 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/admin/product/${product.id}`)}
                    >
                      <img
                        src={product.images[0] ? `${API_URL}${product.images[0]}` : 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      {!product.inStock && (
                        <div className="absolute bottom-2 left-2 px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold ">
                          Out of Stock
                        </div>
                      )}
                      {product.isHidden && (
                        <div className="absolute bottom-2 right-2 px-3 py-1 bg-gray-800/90 backdrop-blur-sm text-white text-xs font-bold ">
                          {t('adminProduct.hidden')}
                        </div>
                      )}
                      {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (
                        <div className="absolute top-2 left-2 px-3 py-1 bg-red-500 text-white text-xs font-bold ">
                          -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{product.category}</span>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mb-3">
                        {product.discountPrice && product.discountPrice > 0 ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">{product.discountPrice} DNT</span>
                            <span className="text-sm text-gray-400 line-through">{product.price} DNT</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">{product.price} DNT</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.sizes.slice(0, 5).map((s, i) => (
                          <span 
                            key={i} 
                            className={`px-2 py-1 text-xs  font-medium ${
                              s.inStock 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200 line-through'
                            }`}
                          >
                            {s.size}
                          </span>
                        ))}
                        {product.sizes.length > 5 && (
                          <span className="px-2 py-1 text-xs  font-medium bg-gray-100 text-gray-600">
                            +{product.sizes.length - 5}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="flex items-center gap-2 px-4 py-2  bg-gray-200 text-gray-600 font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t('admin.edit')}
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(product.id)}
                          className={`flex items-center gap-2 px-4 py-2  font-semibold transition-colors ${
                            product.isHidden 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                          title={product.isHidden ? t('adminProduct.showProduct') : t('adminProduct.hideProduct')}
                        >
                          {product.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600  hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ProductListItem
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/admin/product/${product.id}`)}
                    actions={
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/products/edit/${product.id}`);
                          }}
                          className="flex items-center gap-2 px-4 py-2  bg-gray-200 text-gray-600 font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t('admin.edit')}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVisibility(product.id);
                          }}
                          className={`flex items-center gap-2 px-4 py-2  font-semibold transition-colors ${
                            product.isHidden 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                          title={product.isHidden ? t('adminProduct.showProduct') : t('adminProduct.hideProduct')}
                        >
                          {product.isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600  hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    }
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Popup Modal */}
      {errorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {t('common.error')}
                </h3>
              </div>
              <button
                onClick={() => setErrorPopup(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {errorPopup}
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setErrorPopup(null)}
                className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
              >
                {t('admin.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
