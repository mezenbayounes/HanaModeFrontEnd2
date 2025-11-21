import axios from "axios";
import { Product } from "../types/Product";

import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/products`;

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Get one product by ID
export const getProductById = async (id: string): Promise<Product> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Create a new product (with file upload)
export const createProduct = async (formData: FormData) => {
  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const res = await axios.get(`${API_URL}/category/${category}`);
  return res.data;
};

