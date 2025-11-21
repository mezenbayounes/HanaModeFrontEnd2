import { create } from 'zustand';
import { CartItem, Product } from '../types/Product';

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    size: string,
    quantity: number,
    color?: string,
    colorCode?: string
  ) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (product, size, quantity, color, colorCode) => {
    set((state) => {
      const normalizedColor = color ?? '';
      const existingItem = state.items.find(
        item =>
          item.product._id === product._id &&
          item.size === size &&
          (item.color ?? '') === normalizedColor
      );
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product._id === product._id &&
            item.size === size &&
            (item.color ?? '') === normalizedColor
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return {
        items: [
          ...state.items,
          { product, size, quantity, color, colorCode }
        ]
      };
    });
  },
  
  removeItem: (productId, size) => {
    set((state) => ({
      items: state.items.filter(
        item => !(item.product._id === productId && item.size === size)
      )
    }));
  },
  
  updateQuantity: (productId, size, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, size);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.product._id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    }));
  },
  
  clearCart: () => set({ items: [] }),
  
  getTotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }
}));
