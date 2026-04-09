import { supabase } from '../supabase';
import { Product } from '@/types';

export const getProducts = async (): Promise<Product[]> => {
  if (!supabase) return MOCK_PRODUCTS;

  const { data, error } = await supabase
    .from('products')
    .select('*, seller:sellers(*)');

  if (error) return MOCK_PRODUCTS;
  return data as Product[];
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (!supabase) return MOCK_PRODUCTS.find(p => p.id === id) || null;

  const { data, error } = await supabase
    .from('products')
    .select('*, seller:sellers(*)')
    .eq('id', id)
    .single();

  if (error) return MOCK_PRODUCTS.find(p => p.id === id) || null;
  return data as Product;
};

export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  if (!supabase) return MOCK_PRODUCTS.filter(p => p.seller_id === sellerId);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', sellerId);

  if (error) return MOCK_PRODUCTS.filter(p => p.seller_id === sellerId);
  return data as Product[];
};

export const createProduct = async (product: Partial<Product>) => {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    seller_id: 's1',
    title: 'Upcycled Denim Tote Bag',
    description: 'Beautiful tote bag crafted from 100% recycled denim. Roomy, durable, and completely plastic-free.',
    price: 2999,
    stock_quantity: 10,
    eco_tags: ['upcycled', 'handmade'],
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's1', role: 'seller', email: 'seller@test.com', store_name: 'Eco Threads Co.', created_at: '' },
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    id: 'p2',
    seller_id: 's2',
    title: 'Bamboo Toothbrush (Pack of 4)',
    description: 'Biodegradable bamboo toothbrushes with charcoal infused bristles. Dentist recommended.',
    price: 499,
    stock_quantity: 50,
    eco_tags: ['plastic-free', 'biodegradable'],
    image_url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's2', role: 'seller', email: 's2@test.com', store_name: 'Green Smile', created_at: '' },
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    id: 'p3',
    seller_id: 's3',
    title: 'Handwoven Jute Bag',
    description: 'Traditional handwoven jute shopping bag. Supports local weavers and replaces 300+ plastic bags.',
    price: 849,
    stock_quantity: 30,
    eco_tags: ['local', 'handmade', 'plastic-free'],
    image_url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's3', role: 'seller', email: 's3@test.com', store_name: 'Jute Wala', created_at: '' },
    lat: 22.5726,
    lng: 88.3639,
  },
  {
    id: 'p4',
    seller_id: 's4',
    title: 'Organic Tulsi & Ginger Tea (100g)',
    description: 'Farm-fresh organic Tulsi and Ginger tea. Grown pesticide-free in the Nilgiri hills.',
    price: 349,
    stock_quantity: 75,
    eco_tags: ['organic', 'local', 'pesticide-free'],
    image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's4', role: 'seller', email: 's4@test.com', store_name: 'Nilgiri Naturals', created_at: '' },
    lat: 11.4064,
    lng: 76.6932,
  },
  {
    id: 'p5',
    seller_id: 's5',
    title: 'Terracotta Plant Pot Set (3 pcs)',
    description: 'Hand-thrown terracotta pots by Rajasthani artisans. Natural clay, zero chemical finish.',
    price: 1499,
    stock_quantity: 20,
    eco_tags: ['artisan', 'zero-waste', 'local'],
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's5', role: 'seller', email: 's5@test.com', store_name: 'Mitti Kala', created_at: '' },
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    id: 'p6',
    seller_id: 's1',
    title: 'Khadi Cotton Tote',
    description: 'Certified Khadi cotton carry bag. Supports Khadi artisans and is 100% compostable.',
    price: 1199,
    stock_quantity: 40,
    eco_tags: ['khadi', 'compostable', 'handspun'],
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's1', role: 'seller', email: 'seller@test.com', store_name: 'Eco Threads Co.', created_at: '' },
    lat: 28.6139,
    lng: 77.2090,
  },
  {
    id: 'p7',
    seller_id: 's6',
    title: 'Beeswax Food Wrap Set (3 sizes)',
    description: 'Reusable beeswax wraps made with organic cotton and locally sourced beeswax. Replace cling films.',
    price: 749,
    stock_quantity: 60,
    eco_tags: ['reusable', 'plastic-free', 'beeswax'],
    image_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0eb2?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's6', role: 'seller', email: 's6@test.com', store_name: 'Bee & Bloom', created_at: '' },
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'p8',
    seller_id: 's6',
    title: 'Natural Neem Wood Comb',
    description: 'Anti-static neem wood fine-tooth comb. Balances scalp oils naturally and is fully biodegradable.',
    price: 199,
    stock_quantity: 100,
    eco_tags: ['natural', 'biodegradable', 'ayurvedic'],
    image_url: 'https://images.unsplash.com/photo-1590159983013-d4ff5fc71c1d?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's6', role: 'seller', email: 's6@test.com', store_name: 'Bee & Bloom', created_at: '' },
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'p9',
    seller_id: 's7',
    title: 'Recycled Newspaper Seed Notebook',
    description: 'Notebook made from recycled newspaper pulp. The cover contains wildflower seeds — plant it when done!',
    price: 449,
    stock_quantity: 35,
    eco_tags: ['recycled', 'zero-waste', 'plantable'],
    image_url: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's7', role: 'seller', email: 's7@test.com', store_name: 'Kaagaz Studio', created_at: '' },
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: 'p10',
    seller_id: 's7',
    title: 'Bamboo Cutlery Travel Kit',
    description: 'Complete travel cutlery set (fork, knife, spoon, straw, brush) in a reusable cotton pouch.',
    price: 599,
    stock_quantity: 45,
    eco_tags: ['bamboo', 'plastic-free', 'travel'],
    image_url: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?q=80&w=600&auto=format&fit=crop',
    created_at: new Date().toISOString(),
    seller: { id: 's7', role: 'seller', email: 's7@test.com', store_name: 'Kaagaz Studio', created_at: '' },
    lat: 18.5204,
    lng: 73.8567,
  },
];
