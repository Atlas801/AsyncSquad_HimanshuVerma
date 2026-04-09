import { supabase } from '../supabase';
import { Product } from '@/types';

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, seller:sellers(*), product_materials(*, material:materials(*))');

  if (error) throw new Error(error.message);
  return data as Product[];
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-1",
    seller_id: "mock-seller",
    title: "Eco-Friendly Bamboo Toothbrush",
    description: "100% biodegradable bamboo toothbrush. Perfect for a sustainable lifestyle.",
    price: 150,
    stock_quantity: 50,
    eco_tags: ["biodegradable", "plastic-free"],
    image_url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
    created_at: new Date().toISOString(),
    seller: { store_name: "Green Life" }
  },
  {
    id: "mock-2",
    seller_id: "mock-seller",
    title: "Handmade Avocado Soap",
    description: "Organic handmade soap made with avocado oil and shea butter.",
    price: 350,
    stock_quantity: 20,
    eco_tags: ["handmade", "organic"],
    image_url: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=400&q=80",
    created_at: new Date().toISOString(),
    seller: { store_name: "Nature's Touch" }
  }
];

export const getProductById = async (id: string): Promise<Product | null> => {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (isUUID) {
    const { data, error } = await supabase
      .from('products')
      .select('*, seller:sellers(*), product_materials(*, material:materials(*))')
      .eq('id', id)
      .single();

    if (!error && data) return data as Product;
  }
  
  // Fallback to mock data
  const mockProduct = MOCK_PRODUCTS.find(p => p.id === id || p.id === `mock-${id}` || p.id === `${id}`);
  return mockProduct || null;
};

export const getProductsBySeller = async (sellerId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, seller:sellers(*), product_materials(*, material:materials(*))')
    .eq('seller_id', sellerId);

  if (error) return [];
  return data as Product[];
};

export const createProduct = async (product: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select('*, seller:sellers(*)')
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

import { analyzeEcoImpact } from '../ecoScoring';

export const recalculateAllProductsEcoScores = async () => {
  const products = await getProducts();
  
  for (const product of products) {
    if (!product.product_materials) continue;
    
    const { score, tierTag, specificTags } = analyzeEcoImpact(product.product_materials);
    
    await supabase.from('products').update({
      eco_score: score,
      tier_eco_tag: tierTag,
      specific_eco_tags: specificTags,
    }).eq('id', product.id);
  }
};
