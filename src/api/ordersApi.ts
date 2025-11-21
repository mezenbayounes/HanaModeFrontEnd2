import axios from "axios";
import { OrderDetails, CartItem } from "../types/Product";

import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api/orders`;

export interface CreateOrderDTO {
  items: {
    product: string;   // product._id
    quantity: number;
    size: CartItem["size"];
    color?: string;
  }[];
  customerDetails: OrderDetails;
  total: number;
}

export const createOrder = async (orderData: CreateOrderDTO) => {
  const res = await axios.post(API_URL, orderData, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
