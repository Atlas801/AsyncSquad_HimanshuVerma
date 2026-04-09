import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { supabase } from './supabase';
import { MOCK_PRODUCTS } from './services/products';

interface ProductStore {
  products: Product[];
  hydrated: boolean;
  usingMock: boolean;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product>;
  fetchFromDB: () => Promise<void>;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      hydrated: false,
      usingMock: false,

      addProduct: async (productData) => {
        const { product_materials, ...rest } = productData;

        // 1. Verify active Supabase session (zustand user can be stale)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Your session has expired. Please log out and log back in.');
        }

        // 2. Ensure the sellers row exists (FK constraint on products.seller_id)
        const { error: sellerCheckError } = await supabase
          .from('sellers')
          .upsert(
            { id: rest.seller_id, store_name: rest.seller?.name ? rest.seller.name + "'s Store" : 'My Store' },
            { onConflict: 'id', ignoreDuplicates: true }
          );
        if (sellerCheckError) {
          console.warn('Seller upsert warning:', sellerCheckError.message);
          // Non-fatal — the row may already exist; continue with insert
        }

        // 3. Insert product
        const { data, error } = await supabase.from('products').insert([{
          seller_id: rest.seller_id,
          title: rest.title,
          description: rest.description,
          price: rest.price,
          stock_quantity: rest.stock_quantity,
          eco_tags: rest.eco_tags,
          eco_score: rest.eco_score,
          tier_eco_tag: rest.tier_eco_tag,
          specific_eco_tags: rest.specific_eco_tags,
          image_url: rest.image_url,
          lat: rest.lat,
          lng: rest.lng,
        }]).select('*, seller:sellers(*)').single();

        if (error) throw new Error(error.message);

        const newProduct: Product = {
          ...data,
          seller: data.seller ?? rest.seller,
        } as Product;

        // 4. Insert product_materials
        if (product_materials && product_materials.length > 0) {
          const pmInserts = product_materials.map((pm: any) => ({
            product_id: newProduct.id,
            material_id: pm.material_id,
            percentage: pm.percentage,
          }));
          const { error: pmError } = await supabase.from('product_materials').insert(pmInserts);
          if (pmError) console.error('Failed to insert product_materials:', pmError.message);
        }

        set((state) => ({ products: [newProduct, ...state.products] }));
        return newProduct;
      },

      fetchFromDB: async () => {
        try {
          const { data, error } = await supabase
            .from('products').select('*, seller:sellers(*), product_materials(*, material:materials(*))');
          if (error) {
            console.error('Failed to fetch products:', error.message);
            set({ products: MOCK_PRODUCTS, hydrated: true, usingMock: true });
            return;
          }
          const loadedProducts = (data as Product[]) ?? [];
          if (loadedProducts.length === 0) {
              set({ products: MOCK_PRODUCTS, hydrated: true, usingMock: true });
          } else {
              set({ products: loadedProducts, hydrated: true, usingMock: false });
          }
        } catch (e) {
          console.error('Failed to fetch products:', e);
          set({ products: MOCK_PRODUCTS, hydrated: true, usingMock: true });
        }
      },
    }),
    {
      name: 'ecomarket-products',
      version: 4,
      migrate: (_persistedState, _version) => ({
        products: [] as Product[],
        hydrated: false,
        usingMock: false,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
