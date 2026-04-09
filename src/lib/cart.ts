import { create } from 'zustand';
import { Product } from '@/types';

interface CartItem extends Product {
  cartQuantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        // Prevent adding more than available stock
        if (existing.cartQuantity >= product.stock_quantity) {
          return state; // No change — already at max
        }
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, cartQuantity: Math.min(i.cartQuantity + 1, product.stock_quantity) } : i
          ),
        };
      }
      if (product.stock_quantity <= 0) return state; // Out of stock
      return { items: [...state.items, { ...product, cartQuantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== productId),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  },
}));
