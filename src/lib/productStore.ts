import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

// Fixed, reliable Unsplash images for all 10 mock products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1', seller_id: 'demo-seller-1',
    title: 'Upcycled Denim Tote Bag',
    description: 'Beautiful tote bag crafted from 100% recycled denim. Roomy, durable, and completely plastic-free. Made by artisans in Delhi.',
    price: 2999, stock_quantity: 10,
    eco_tags: ['upcycled', 'handmade'],
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1595252129934-5e7168b61e70?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4fb2?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
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
    image_url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80',
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

        // Save to Supabase if configured
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
            // Merge DB products with any locally-added products
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
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
