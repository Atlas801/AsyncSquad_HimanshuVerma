-- Supabase Schema for Eco-Friendly Web Marketplace

-- 1. Users table (Custom Profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')),
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Sellers Table (Extends Profile)
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  store_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sellers are viewable by everyone." ON public.sellers FOR SELECT USING (true);
CREATE POLICY "Sellers can manage their own store." ON public.sellers FOR ALL USING (auth.uid() = id);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
  eco_tags TEXT[], -- e.g., ['upcycled', 'plastic-free', 'local']
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers can manage own products." ON public.products FOR ALL USING (auth.uid() = seller_id);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers can create orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view their orders." ON public.orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can update their orders." ON public.orders FOR UPDATE USING (auth.uid() = seller_id);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10, 2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view own order items." ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND buyer_id = auth.uid())
);
CREATE POLICY "Sellers can view own order items." ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND seller_id = auth.uid())
);
CREATE POLICY "Buyers can insert order items." ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND buyer_id = auth.uid())
);

-- RPC for stock decrement
CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, qty INTEGER)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity - qty
  WHERE id = p_id AND stock_quantity >= qty;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found';
  END IF;
END;
$$;
