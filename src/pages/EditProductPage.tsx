import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Image as ImageIcon, AlertCircle, Check, ArrowLeft, Plus } from 'lucide-react';
import { getProduct, updateProduct, ProductPayload, ProductSize, ProductColor } from '../api/ProductApi';
import { getCategories, Category } from '../api/CategoryApi';
import AdminNavbar from '../components/AdminNavbar';
import { API_URL } from '../config';

export default function EditProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const initialFormState: ProductPayload = {
    name: '',
    category: '',
    description: '',
    price: 0,
    discountPrice: 0,
    inStock: true,
    images: [],
    sizes: [],
    featured: false,
    bestSeller: false
  };

  const [formData, setFormData] = useState<ProductPayload>(initialFormState);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [productData, categoriesData] = await Promise.all([
          getProduct(Number(id)),
          getCategories(true)
        ]);
        
        setCategories(categoriesData);
        
        // Populate form
        setFormData({
          name: productData.name,
          category: productData.category,
          description: productData.description,
          price: productData.price,
          discountPrice: productData.discountPrice,
          inStock: productData.inStock,
          sizes: productData.sizes,
          color: productData.color,
          featured: productData.featured,
          bestSeller: productData.bestSeller,
          images: [] // Start with empty array for new uploads
        });
        
        setExistingImages(productData.images);
        setImagePreview(productData.images.map((img: string) => `${API_URL}${img}`));
      } catch (err) {
        setError(t('adminProduct.errorLoad'));
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentImages = formData.images || [];
      const updatedImages = [...currentImages, ...newFiles];
      setFormData({ ...formData, images: updatedImages });
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreview([...imagePreview, ...newPreviews]);
      
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    // Check if this is an existing image or a new upload
    if (index < existingImages.length) {
      // Removing an existing image
      const updatedExisting = existingImages.filter((_, idx) => idx !== index);
      setExistingImages(updatedExisting);
    } else {
      // Removing a new upload
      const newImageIndex = index - existingImages.length;
      const updatedImages = (formData.images || []).filter((_, idx) => idx !== newImageIndex);
      setFormData({ ...formData, images: updatedImages });
    }
    // Always update preview
    const updatedPreviews = imagePreview.filter((_, idx) => idx !== index);
    setImagePreview(updatedPreviews);
  };

  const handleAddSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: '', inStock: true, colors: [] }]
    });
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = [...formData.sizes];
    newSizes.splice(index, 1);
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleSizeChange = (index: number, field: keyof ProductSize, value: any) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleAddColorToSize = (sizeIndex: number) => {
    const newSizes = [...formData.sizes];
    newSizes[sizeIndex].colors.push({ name: '', code: '#000000' });
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleRemoveColorFromSize = (sizeIndex: number, colorIndex: number) => {
    const newSizes = [...formData.sizes];
    newSizes[sizeIndex].colors.splice(colorIndex, 1);
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleColorChange = (sizeIndex: number, colorIndex: number, field: keyof ProductColor, value: string) => {
    const newSizes = [...formData.sizes];
    newSizes[sizeIndex].colors[colorIndex] = { ...newSizes[sizeIndex].colors[colorIndex], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };

  const handleAddProductColor = () => {
    const newColor: ProductColor = { name: '', code: '#000000' };
    setFormData({ 
      ...formData, 
      color: [...(formData.color || []), newColor] 
    });
  };

  const handleRemoveProductColor = (index: number) => {
    const newColors = [...(formData.color || [])];
    newColors.splice(index, 1);
    setFormData({ ...formData, color: newColors });
  };

  const handleProductColorChange = (index: number, field: keyof ProductColor, value: string) => {
    const newColors = [...(formData.color || [])];
    newColors[index] = { ...newColors[index], [field]: value };
    setFormData({ ...formData, color: newColors });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const updatePayload = {
        ...formData,
        existingImages: existingImages
      };
      await updateProduct(Number(id), updatePayload);
      setSuccess(t('adminProduct.successUpdated'));
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      setError(t('adminProduct.errorSave'));
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center font-hana">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
              {t('adminProduct.editProduct')}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {t('adminProduct.editProductSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('adminProduct.availableCategories')}</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('admin.status')}</p>
              <p className="text-lg font-semibold">{t('adminProduct.updatingProduct')}</p>
            </div>
          </div>
        </div>
      </div>
      <AdminNavbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('adminProduct.productName')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('adminProduct.category')}</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">{t('adminProduct.selectCategory')}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('adminProduct.description')}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={4}
                required
              />
            </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('adminProduct.price')}</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('adminProduct.discountPrice')} <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.discountPrice || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    discountPrice: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  min="0"
                  placeholder="Leave empty for no discount"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('adminProduct.images')}</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50 group relative">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                />
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <div className="flex text-sm text-gray-600">
                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      {t('admin.clickToUpload')}
                    </span>
                  </div>
                </div>
              </div>
              {imagePreview.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">
                    {imagePreview.length} image{imagePreview.length > 1 ? 's' : ''} selected (in order)
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {imagePreview.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={src} 
                          alt={`Preview ${idx + 1}`} 
                          className="h-24 w-full object-cover rounded-lg border-2 border-gray-200" 
                        />
                        <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                          {idx + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Colors (Global Palette) */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-semibold text-gray-800">{t('adminProduct.productColorsPalette')}</label>
                <button 
                  type="button" 
                  onClick={handleAddProductColor} 
                  className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> {t('adminProduct.customColor')}
                </button>
              </div>

              {/* Predefined Color Suggestions */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600 mb-2">{t('adminProduct.quickAddColors')}</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { nameKey: 'black', code: '#000000' },
                    { nameKey: 'white', code: '#FFFFFF' },
                    { nameKey: 'red', code: '#DC2626' },
                    { nameKey: 'blue', code: '#2563EB' },
                    { nameKey: 'green', code: '#059669' },
                    { nameKey: 'navy', code: '#1E3A8A' },
                    { nameKey: 'beige', code: '#D4C5B9' },
                    { nameKey: 'gray', code: '#6B7280' },
                    { nameKey: 'pink', code: '#EC4899' },
                    { nameKey: 'brown', code: '#92400E' }
                  ].map((presetColor) => {
                    const translatedName = t(`adminProduct.colors.${presetColor.nameKey}`);
                    const alreadyAdded = (formData.color || []).some(c => c.name === translatedName);
                    return (
                      <button
                        key={presetColor.nameKey}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            color: [...(formData.color || []), { name: translatedName, code: presetColor.code }] 
                          });
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${
                          alreadyAdded 
                            ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' 
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500 hover:shadow-sm'
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300" 
                          style={{ backgroundColor: presetColor.code }}
                        />
                        {translatedName}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Added Colors */}
              {(formData.color && formData.color.length > 0) ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600 mb-2">{t('adminProduct.selectedColors')} ({formData.color.length}):</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {formData.color.map((color, cIdx) => (
                      <div key={cIdx} className="flex gap-2 items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div 
                          className="w-10 h-10 rounded-lg border-2 border-gray-300 flex-shrink-0" 
                          style={{ backgroundColor: color.code }}
                        />
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            placeholder={t('adminProduct.colorNamePlaceholder')}
                            value={color.name}
                            onChange={(e) => handleProductColorChange(cIdx, 'name', e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-300 text-sm font-medium mb-1"
                            required
                          />
                          <div className="flex gap-1 items-center">
                            <input
                              type="color"
                              value={color.code}
                              onChange={(e) => handleProductColorChange(cIdx, 'code', e.target.value)}
                              className="w-8 h-6 rounded cursor-pointer border border-gray-300"
                            />
                            <span className="text-xs text-gray-500 font-mono">{color.code}</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveProductColor(cIdx)} 
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">{t('adminProduct.noColorsAdded')}</p>
              )}
            </div>

            {/* Sizes & Colors */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">{t('adminProduct.sizesAndColors')}</label>
                <button type="button" onClick={handleAddSize} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <Plus className="w-4 h-4" /> {t('adminProduct.addSize')}
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.sizes.map((size, sIdx) => (
                  <div key={sIdx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          type="text"
                          placeholder={t('adminProduct.sizeName')}
                          value={size.size}
                          onChange={(e) => handleSizeChange(sIdx, 'size', e.target.value)}
                          className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          required
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={size.inStock}
                            onChange={(e) => handleSizeChange(sIdx, 'inStock', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-700">{t('adminProduct.inStock')}</span>
                        </label>
                      </div>
                      <button type="button" onClick={() => handleRemoveSize(sIdx)} className="text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Colors for this size */}
                    <div className="pl-4 border-l-2 border-blue-200 bg-blue-50/30 rounded p-3">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-semibold text-gray-700">{t('adminProduct.availableColorsForSize')}</span>
                      </div>
                      
                      {/* Quick-select from product colors */}
                      {formData.color && formData.color.length > 0 ? (
                        <div className="mb-3">
                          <p className="text-xs text-gray-600 mb-2">{t('adminProduct.selectFromProductColors')}</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.color.map((productColor, pIdx) => {
                              const isSelected = size.colors.some(c => c.name === productColor.name && c.code === productColor.code);
                              return (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      // Remove color
                                      const colorIdx = size.colors.findIndex(c => c.name === productColor.name && c.code === productColor.code);
                                      if (colorIdx !== -1) {
                                        handleRemoveColorFromSize(sIdx, colorIdx);
                                      }
                                    } else {
                                      // Add color
                                      const newSizes = [...formData.sizes];
                                      newSizes[sIdx].colors.push({ name: productColor.name, code: productColor.code });
                                      setFormData({ ...formData, sizes: newSizes });
                                    }
                                  }}
                                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${
                                    isSelected 
                                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                                  }`}
                                >
                                  <div 
                                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                                    style={{ backgroundColor: productColor.code }}
                                  />
                                  {productColor.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2">
                          {t('adminProduct.addColorsFirstWarning')}
                        </p>
                      )}

                      {/* Manual color entry option */}
                      <div>
                        <button 
                          type="button" 
                          onClick={() => handleAddColorToSize(sIdx)} 
                          className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 mb-2"
                        >
                          <Plus className="w-3 h-3" /> {t('adminProduct.addCustomColorManually')}
                        </button>
                        
                        {size.colors.filter(c => !formData.color?.some(pc => pc.name === c.name && pc.code === c.code)).length > 0 && (
                          <div className="space-y-1.5">
                            {size.colors.map((color, cIdx) => {
                              const isFromProductColors = formData.color?.some(pc => pc.name === color.name && pc.code === color.code);
                              if (isFromProductColors) return null;
                              
                              return (
                                <div key={cIdx} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200">
                                  <div 
                                    className="w-6 h-6 rounded border border-gray-300" 
                                    style={{ backgroundColor: color.code }}
                                  />
                                  <input
                                    type="text"
                                    placeholder={t('adminProduct.colorName')}
                                    value={color.name}
                                    onChange={(e) => handleColorChange(sIdx, cIdx, 'name', e.target.value)}
                                    className="flex-1 px-2 py-1 rounded border border-gray-300 text-xs"
                                    required
                                  />
                                  <input
                                    type="color"
                                    value={color.code}
                                    onChange={(e) => handleColorChange(sIdx, cIdx, 'code', e.target.value)}
                                    className="w-8 h-6 rounded cursor-pointer border border-gray-300"
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveColorFromSize(sIdx, cIdx)} 
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      
                      {size.colors.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-2">No colors selected for this size</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t('adminProduct.inStock')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t('adminProduct.featured')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.bestSeller}
                  onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{t('adminProduct.bestSeller')}</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                {t('adminProduct.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {t('adminProduct.update')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
