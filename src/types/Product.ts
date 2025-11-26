export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;

  color?: { name: string; code: string }[];

  price: number;
  discountPrice?: number;
  inStock: boolean;
  images: string[];

  sizes: {
    size: string;
    inStock?: boolean;
    colors: { name: string; code: string }[];
  }[];

  featured?: boolean;
  bestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;

  size: string;
  color?: string;
  colorCode?: string;
}

export interface OrderDetails {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
}

export interface Order {
  id: number;
  items: CartItem[];
  customerDetails: OrderDetails;
  total: number;
  orderDate: Date;
}
