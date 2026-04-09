import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1', seller_id: 'demo-seller-1',
    title: 'Upcycled Denim Tote Bag',
    description: 'Beautiful tote bag crafted from 100% recycled denim. Roomy, durable, and completely plastic-free. Made by artisans in Delhi.',
    price: 2999, stock_quantity: 10,
    eco_tags: ['upcycled', 'handmade'],
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 28.6139, lng: 77.2090,
  },
  {
    id: 'p2', seller_id: 'demo-seller-1',
    title: 'Bamboo Toothbrush (Pack of 4)',
    description: 'Biodegradable bamboo toothbrushes with charcoal infused bristles. Dentist recommended and fully compostable.',
    price: 499, stock_quantity: 50,
    eco_tags: ['plastic-free', 'biodegradable'],
    image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 19.0760, lng: 72.8777,
  },
  {
    id: 'p3', seller_id: 'demo-seller-1',
    title: 'Handwoven Jute Shopping Bag',
    description: 'Traditional handwoven jute bag from Bengal. Supports local weavers and replaces 300+ plastic bags. Extra sturdy.',
    price: 849, stock_quantity: 30,
    eco_tags: ['local', 'handmade', 'plastic-free'],
    image_url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 22.5726, lng: 88.3639,
  },
  {
    id: 'p4', seller_id: 'demo-seller-1',
    title: 'Organic Tulsi & Ginger Tea (100g)',
    description: 'Farm-fresh organic Tulsi and Ginger tea from Nilgiri hills. Pesticide-free, hand-picked, sun-dried.',
    price: 349, stock_quantity: 75,
    eco_tags: ['organic', 'local', 'pesticide-free'],
    image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 11.4064, lng: 76.6932,
  },
  {
    id: 'p5', seller_id: 'demo-seller-1',
    title: 'Terracotta Plant Pot Set (3 pcs)',
    description: 'Hand-thrown terracotta pots by Rajasthani artisans. Natural clay, no chemical finish. Perfect for herbs.',
    price: 1499, stock_quantity: 20,
    eco_tags: ['artisan', 'zero-waste', 'local'],
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 26.9124, lng: 75.7873,
  },
  {
    id: 'p6', seller_id: 'demo-seller-1',
    title: 'Khadi Cotton Kurta (Men)',
    description: 'Certified Khadi handspun cotton kurta. Supports rural artisans, 100% breathable, naturally antibacterial.',
    price: 1799, stock_quantity: 15,
    eco_tags: ['khadi', 'compostable', 'handspun'],
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 28.6139, lng: 77.2090,
  },
  {
    id: 'p7', seller_id: 'demo-seller-1',
    title: 'Beeswax Food Wrap Set (3 sizes)',
    description: 'Reusable beeswax wraps with organic cotton and local beeswax. Say goodbye to plastic cling film forever.',
    price: 749, stock_quantity: 60,
    eco_tags: ['reusable', 'plastic-free', 'beeswax'],
    image_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0eb2?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 12.9716, lng: 77.5946,
  },
  {
    id: 'p8', seller_id: 'demo-seller-1',
    title: 'Natural Neem Wood Comb',
    description: 'Anti-static neem wood comb. Balances scalp oils naturally, prevents dandruff, fully biodegradable.',
    price: 199, stock_quantity: 100,
    eco_tags: ['natural', 'biodegradable', 'ayurvedic'],
    image_url: 'https://images.unsplash.com/photo-1590159983013-d4ff5fc71c1d?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 12.9716, lng: 77.5946,
  },
  {
    id: 'p9', seller_id: 'demo-seller-1',
    title: 'Plantable Seed Notebook',
    description: 'Recycled newspaper notebook. The wildflower seed cover can be planted in soil when you finish — watch it bloom!',
    price: 449, stock_quantity: 35,
    eco_tags: ['recycled', 'zero-waste', 'plantable'],
    image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 18.5204, lng: 73.8567,
  },
  {
    id: 'p10', seller_id: 'demo-seller-1',
    title: 'Bamboo Cutlery Travel Kit',
    description: 'Complete travel cutlery (fork, knife, spoon, straw, cleaning brush) in a handstitched cotton pouch. Zero plastic.',
    price: 599, stock_quantity: 45,
    eco_tags: ['bamboo', 'plastic-free', 'travel'],
    image_url: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    seller: { id: 'demo-seller-1', name: 'Ravi Kumar', store_name: 'Eco Threads Co.' },
    lat: 18.5204, lng: 73.8567,
  },
];

interface ProductStore {
  products: Product[];
  hydrated: boolean;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  fetchFromDB: () => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      hydrated: false,

      addProduct: async (productData) => {
        const newProduct: Product = {
          ...productData,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
        };

        if (isSupabaseConfigured && supabase) {
          try {
            const { data } = await supabase.from('products').insert([{
              seller_id: productData.seller_id,
              title: productData.title,
              description: productData.description,
              price: productData.price,
              stock_quantity: productData.stock_quantity,
              eco_tags: productData.eco_tags,
              image_url: productData.image_url,
            }]).select().single();
            if (data) newProduct.id = data.id;
          } catch (e) {
            console.warn('Supabase insert failed, saved locally:', e);
          }
        }

        set((state) => ({ products: [newProduct, ...state.products] }));
        return newProduct;
      },

      fetchFromDB: async () => {
        if (!isSupabaseConfigured || !supabase) return;
        try {
          const { data, error } = await supabase
            .from('products').select('*, seller:sellers(*)');
          if (!error && data && data.length > 0) {
            const dbIds = new Set(data.map((p: Product) => p.id));
            const localOnly = get().products.filter(p => !dbIds.has(p.id));
            set({ products: [...(data as Product[]), ...localOnly] });
          }
        } catch { /* keep local data */ }
        set({ hydrated: true });
      },
    }),
    {
      name: 'ecomarket-products',
      version: 2,
      migrate: () => ({
        products: INITIAL_PRODUCTS,
        hydrated: false,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
