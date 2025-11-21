export interface Product {
  _id: string;
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
}

export interface Order {
  id: string;
  items: CartItem[];
  customerDetails: OrderDetails;
  total: number;
  orderDate: Date;
}
