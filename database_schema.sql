
CREATE TABLE IF NOT EXISTS public.profiles (
  id      UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email   TEXT NOT NULL,
  name    TEXT NOT NULL DEFAULT '',
  role    TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')) DEFAULT 'buyer',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: public read"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles: self insert"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: self update"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'buyer')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


CREATE TABLE IF NOT EXISTS public.sellers (
  id          UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  store_name  TEXT NOT NULL,
  description TEXT,
  logo_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sellers: public read"  ON public.sellers FOR SELECT USING (true);
CREATE POLICY "sellers: self manage"  ON public.sellers FOR ALL USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS public.products (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  price          DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  eco_tags       TEXT[] DEFAULT '{}',
  image_url      TEXT,
  created_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products: public read"    ON public.products FOR SELECT USING (true);
CREATE POLICY "products: seller manage"  ON public.products FOR ALL USING (auth.uid() = seller_id);


CREATE TABLE IF NOT EXISTS public.orders (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('pending','processing','completed','cancelled')) DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders: buyer read"    ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "orders: buyer insert"  ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "orders: seller read"   ON public.orders FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "orders: seller update" ON public.orders FOR UPDATE USING (auth.uid() = seller_id);

CREATE TABLE IF NOT EXISTS public.order_items (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id       UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id     UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity       INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time  DECIMAL(10,2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items: buyer read"   ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND buyer_id = auth.uid())
);
CREATE POLICY "order_items: seller read"  ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND seller_id = auth.uid())
);
CREATE POLICY "order_items: buyer insert" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND buyer_id = auth.uid())
);

CREATE OR REPLACE FUNCTION decrement_stock(p_id UUID, qty INTEGER)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity - qty
  WHERE id = p_id AND stock_quantity >= qty;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found for id %', p_id;
  END IF;
END;
$$;
