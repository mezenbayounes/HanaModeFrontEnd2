import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCategories } from "../api/CategoryApi";
import { API_URL } from "../config";

const backendBaseUrl = API_URL;

const SkeletonCategoryCard = () => (
  <div className="animate-pulse bg-gray-200 rounded-3xl overflow-hidden h-[300px]">
    <div className="bg-gray-300 h-2/3 w-full" />
    <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
    </div>
  </div>
);

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<{ id: number; name: string; image?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  const defaultImage =
    "https://cdn.pixabay.com/photo/2018/05/06/03/39/woman-3377839_1280.jpg";

  return (
    <div className="min-h-screen bg-gray-50 font-hana">
      {/* Header */}
      <div className="bg-white shadow-sm py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {t("categories.title")}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("categories.description")}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCategoryCard key={index} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            {t("categories.noCategories")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((cat) => {
              const routeParam = encodeURIComponent(cat.name);
              const imageSrc =
                cat.image && cat.image.trim().length > 0
                  ? cat.image.startsWith("http")
                    ? cat.image
                    : `${backendBaseUrl}${cat.image}`
                  : defaultImage;

              return (
                <Link
                  key={cat.id}
                  to={`/category/${routeParam}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/25 transition-colors" />
                    <div className="absolute inset-0 flex items-end p-6">
                      <h2 className="text-3xl font-bold text-white drop-shadow-md">
                        {cat.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-sm">
                      {t("categories.exploreCategory")} "{cat.name}".
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
