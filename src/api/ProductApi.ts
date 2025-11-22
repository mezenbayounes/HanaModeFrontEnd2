import axios from 'axios';

import { API_URL as BASE_URL } from '../config';

const API_URL = `${BASE_URL}/api/products`;

export type ProductColor = {
    name: string;
    code: string;
};

export type ProductSize = {
    size: string;
    inStock: boolean;
    colors: ProductColor[];
};

export type Product = {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    discountPrice?: number;
    inStock: boolean;
    images: string[];
    sizes: ProductSize[];
    color?: ProductColor[];
    featured?: boolean;
    bestSeller?: boolean;
    isHidden?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type ProductPayload = {
    name: string;
    category: string;
    description: string;
    price: number;
    discountPrice?: number;
    inStock: boolean;
    images?: File[];
    existingImages?: string[]; // For updates: track which existing images to keep
    sizes: ProductSize[];
    color?: ProductColor[];
    featured?: boolean;
    bestSeller?: boolean;
};

const buildFormData = (payload: ProductPayload) => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('category', payload.category);
    formData.append('description', payload.description);
    formData.append('price', String(payload.price));
    // Always send discountPrice, use 0 to clear it
    formData.append('discountPrice', String(payload.discountPrice || 0));
    formData.append('inStock', String(payload.inStock));
    formData.append('featured', String(payload.featured || false));
    formData.append('bestSeller', String(payload.bestSeller || false));

    // Complex objects need to be stringified
    formData.append('sizes', JSON.stringify(payload.sizes));
    if (payload.color) formData.append('color', JSON.stringify(payload.color));

    // Send existing images to keep (for updates)
    if (payload.existingImages) {
        formData.append('existingImages', JSON.stringify(payload.existingImages));
    }

    if (payload.images) {
        payload.images.forEach((file) => {
            formData.append('images', file);
        });
    }

    return formData;
};

export const getProducts = async () => {
    const token = localStorage.getItem('token');
    const headers: any = {};

    // Include auth token if user is logged in (admin)
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await axios.get(API_URL, { headers });
    return res.data;
};

export const getProduct = async (id: string) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

export const createProduct = async (payload: ProductPayload) => {
    const formData = buildFormData(payload);
    const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const updateProduct = async (id: string, payload: ProductPayload) => {
    const formData = buildFormData(payload);
    const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const deleteProduct = async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

export const toggleProductVisibility = async (id: string) => {
    const res = await axios.patch(`${API_URL}/${id}/toggle-visibility`);
    return res.data;
};
