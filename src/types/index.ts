export type Role = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  role: Role;
  email: string;
  name: string;
  created_at: string;
}

export interface Seller extends User {
  store_name: string;
  description?: string;
  logo_url?: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  is_biodegradable: boolean;
  is_recyclable: boolean;
  is_organically_sourced: boolean;
  is_animal_derived: boolean;
  is_plant_based: boolean;
  is_synthetic: boolean;
  is_ocean_safe: boolean;
  is_water_intensive: boolean;
  has_harmful_chemicals: boolean;
  has_high_carbon_footprint: boolean;
  eco_score: number;
  created_at?: string;
}

export interface ProductMaterial {
  id: string;
  product_id: string;
  material_id: string;
  percentage?: number;
  created_at?: string;
  material?: Material;
}

export interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  eco_tags: string[];
  eco_score?: number;
  tier_eco_tag?: string;
  specific_eco_tags?: string[];
  product_materials?: ProductMaterial[];
  image_url?: string;
  created_at: string;
  seller?: Partial<Seller>;
  lat?: number;
  lng?: number;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  product?: Product;
}

export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}
