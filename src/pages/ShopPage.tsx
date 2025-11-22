import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";
import React from "react";
import { getProducts } from "../api/productsApi";
import { getCategories } from "../api/CategoryApi";
import FilterPanel from "../components/FilterPanel";


export default function ShopPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError(t('shop.loadError'));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
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




type Category = string | "all";
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);


  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    if (showInStockOnly && !product.inStock) return false;
    return true;
  });

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
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{t('shop.ourProducts')}</h2>
        <div className="w-16 h-1 bg-gray-700 to gray-900 rounded-full mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm md:text-base">
          {t('shop.discoverCollection')} {products.length} {t('shop.styles')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-20">
        {/* LEFT FILTER PANEL */}
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

        {/* RIGHT SIDE: PRODUCTS */}
        <div className="lg:col-span-3">
          {/* Results count */}
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            {t('shop.showing')} <span className="font-bold text-gray-900">{filteredProducts.length}</span> {t('shop.products')}
          </p>

         {/* Products Grid */}
{filteredProducts.length > 0 ? (
  <div className="grid grid-cols-1 min-[678px]:grid-cols-2 min-[1319px]:grid-cols-3 gap-6 md:gap-10 justify-items-center">
    {filteredProducts.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
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
        
      </div>
      <br></br>
    </div>
    
  );
}
