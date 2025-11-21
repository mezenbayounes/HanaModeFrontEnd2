import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Category {
  label: string;
  value: string;
}

interface Props {
 categories: { label: string; value: Category }[];
  selectedCategory: Category;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
}

export default function StylishDropdown({ categories, selectedCategory, setSelectedCategory }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-64">
      {/* Selected button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-all focus:outline-none"
      >
        {selectedCategory
          ? categories.find((c) => c.value === selectedCategory)?.label
          : "Select Category"}
        <ChevronDown className="w-5 h-5 text-gray-500" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {categories.map((cat,index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedCategory(cat.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gradient-to-r from-rose-500 to-pink-600 hover:text-white transition-all ${
                selectedCategory === cat.value ? "bg-rose-100 font-semibold" : ""
              }`}
            >
              {cat.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
