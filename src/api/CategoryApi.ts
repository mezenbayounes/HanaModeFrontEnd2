import axios from "axios";

import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/categories`;

export type Category = {
  id: number;
  name: string;
  image: string;
  isHidden: boolean;
  slug?: string;
};

type CategoryPayload = {
  name?: string;
  image?: File | string | null;
  isHidden?: boolean;
};

const buildFormData = (payload: FormData | CategoryPayload) => {
  if (payload instanceof FormData) {
    return payload;
  }

  const formData = new FormData();
  if (payload.name !== undefined) {
    formData.append("name", payload.name);
  }

  if (payload.image !== undefined && payload.image !== null) {
    if (payload.image instanceof File) {
      formData.append("image", payload.image);
    } else if (payload.image.length > 0) {
      formData.append("image", payload.image);
    }
  }

  if (payload.isHidden !== undefined) {
    formData.append("isHidden", String(payload.isHidden));
  }

  return formData;
};

export const createCategory = async (payload: FormData | CategoryPayload) => {
  const formData = buildFormData(payload);
  const res = await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const getCategories = async (isAdmin: boolean = false) => {
  const res = await axios.get(`${API_URL}${isAdmin ? '?isAdmin=true' : ''}`);
  return res.data;
};

export const getCategoryById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const updateCategory = async (id: number, payload: FormData | CategoryPayload) => {
  const formData = buildFormData(payload);
  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

export const deleteCategory = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
