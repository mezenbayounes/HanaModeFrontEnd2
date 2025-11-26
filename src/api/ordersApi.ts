import axios from "axios";
import { OrderDetails, CartItem } from "../types/Product";

import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/orders`;

export interface CreateOrderDTO {
  items: {
    product: number;   // product.id
    quantity: number;
    size: CartItem["size"];
    color?: string;
  }[];
  customerDetails: OrderDetails;
  total: number;
}

export const createOrder = async (orderData: CreateOrderDTO, token?: string) => {
  const headers: any = { "Content-Type": "application/json" };

  // Include auth token if user is logged in
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await axios.post(API_URL, orderData, { headers });
  return res.data;
};
