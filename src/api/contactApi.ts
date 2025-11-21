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

