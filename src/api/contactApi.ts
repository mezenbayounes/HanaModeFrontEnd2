import axios from 'axios';

import { API_URL as BASE_URL } from '../config';

const API_URL = `${BASE_URL}/api/contact`;

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const submitContactForm = async (payload: ContactPayload) => {
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export const getContactMessages = async () => {
  const res = await axios.get<ContactMessage[]>(API_URL);
  return res.data;
};

