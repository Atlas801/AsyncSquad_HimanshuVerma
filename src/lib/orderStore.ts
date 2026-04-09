import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LocalOrder = {
  id: string;
  buyer_id: string;
  date: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  items: { title: string; qty: number; price: number }[];
  total: number;
};

interface OrderStore {
  orders: LocalOrder[];
  hydrated: boolean;
  addOrder: (order: Omit<LocalOrder, 'id' | 'date' | 'status'>) => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      orders: [],
      hydrated: false,
      addOrder: (orderData) => {
        const newOrder: LocalOrder = {
          ...orderData,
          id: `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'pending',
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
      },
    }),
    {
      name: 'ecomarket-orders',
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
