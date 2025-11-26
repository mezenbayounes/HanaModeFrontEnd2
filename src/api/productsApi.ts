import axios from "axios";
import { Product } from "../types/Product";

import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/products`;

const parseProduct = (product: any): Product => {
  return {
    ...product,
    price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
    discountPrice: product.discountPrice ? (typeof product.discountPrice === 'string' ? parseFloat(product.discountPrice) : product.discountPrice) : undefined,
    images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images,
    sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes,
    color: typeof product.color === 'string' ? JSON.parse(product.color) : product.color,
  };
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get(API_URL);
  return res.data.map(parseProduct);
};

// Get one product by ID
export const getProductById = async (id: number): Promise<Product> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return parseProduct(res.data);
};

// Create a new product (with file upload)
export const createProduct = async (formData: FormData) => {
  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return parseProduct(res.data);
};


export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const res = await axios.get(`${API_URL}/category/${category}`);
  return res.data.map(parseProduct);
};

