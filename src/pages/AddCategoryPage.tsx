import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Upload, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory 
} from '../api/CategoryApi';
import CategorySearchInput from '../components/CategorySearchInput';
import AdminNavbar from '../components/AdminNavbar';
import { API_URL } from '../config';

interface Category {
  _id: string;
  name: string;
  image?: string;
  isHidden?: boolean;
}

export default function AddCategoryPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    image: null as File | null,
    isHidden: false
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories(true);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('isHidden', String(formData.isHidden));
      if (formData.image) {
        payload.append('image', formData.image);
      }

      if (editingId) {
        await updateCategory(editingId, payload);
        setSuccess(t('admin.successUpdated'));
      } else {
        await createCategory(payload);
        setSuccess(t('admin.successCreated'));
      }

      // Reset form
      setFormData({ name: '', image: null, isHidden: false });
      setImagePreview('');
      setEditingId(null);
      
      // Refresh categories
      await fetchCategories();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('admin.errorSave'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name, image: null, isHidden: category.isHidden || false });
    setImagePreview(category.image ? `${API_URL}${category.image}` : '');
    setEditingId(category._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('alerte.delete'))) return;

    try {
      await deleteCategory(id);
      setSuccess(t('admin.successDeleted'));
      await fetchCategories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || t('admin.errorDelete'));
    }
  };

  const cancelEdit = () => {
    setFormData({ name: '', image: null, isHidden: false });
    setImagePreview('');
    setEditingId(null);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {t('admin.manageCategories')}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl">
              {t('admin.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('admin.totalCategories')}</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="bg-white/15 backdrop-blur  px-5 py-4 text-white">
              <p className="text-sm text-white/70">{t('admin.status')}</p>
              <p className="text-lg font-semibold">
                {t('admin.active')} ({categories.filter(c => !c.isHidden).length})
              </p>
            </div>
          </div>
        </div>
      </div>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white  p-8 shadow-md sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? t('admin.editCategory') : t('admin.addNewCategory')}
              </h2>

              {success && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200  px-4 py-3 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{success}</span>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200  px-4 py-3 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.categoryName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3  border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder={t('admin.categoryNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.categoryImage')}
                  </label>
                  <div className="space-y-3">
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover "
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: null }));
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2  hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">{t('admin.clickToUpload')}</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isHidden}
                      onChange={(e) => setFormData(prev => ({ ...prev, isHidden: e.target.checked }))}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {t('admin.hideCategory')}
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3  font-bold flex items-center justify-center gap-2 transition-all ${
                      submitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    <Plus className={`w-5 h-5 ${submitting ? 'animate-pulse' : ''}`} />
                    {submitting ? t('admin.saving') : editingId ? t('admin.update') : t('admin.addCategory')}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                    >
                      {t('admin.cancel')}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('admin.existingCategories')} ({filteredCategories.length})
                </h2>
                <div className="w-full md:w-64">
                  <CategorySearchInput 
                    value={searchTerm} 
                    onChange={setSearchTerm}
                    className="mb-0"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 animate-spin mx-auto"></div>
                  <p className="text-gray-600 mt-4">{t('admin.loadingCategories')}</p>
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? t('admin.noMatches') : t('admin.noCategories')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCategories.map((category) => (
                    <div
                      key={category._id}
                      className="border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      {category.image && (
                        <img
                          src={`${API_URL}${category.image}`}
                          alt={category.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                        {category.isHidden && (
                          <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 ">
                           {t('admin.hidden')}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="flex items-center gap-2 px-6 py-3  bg-gray-200 text-gray-600 font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t('admin.edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600  hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t('admin.delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
