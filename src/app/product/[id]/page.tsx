import { INITIAL_PRODUCTS } from "@/lib/productStore";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { Leaf, Store, Package } from "lucide-react";

// We read from the shared INITIAL_PRODUCTS so the page works without Supabase
// When Supabase is connected, Supabase data will be in productStore via fetchFromDB
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Try to get product from initial list (works for static + mock products)
  const product = INITIAL_PRODUCTS.find(p => p.id === id) ?? null;

  if (!product) notFound();

  return (
    <div className="section py-10 max-w-5xl mx-auto">
      <div className="card overflow-hidden flex flex-col md:flex-row" style={{ borderRadius: "24px" }}>
        {/* Image */}
        <div className="md:w-1/2 h-72 md:h-auto bg-gray-50 overflow-hidden" style={{ minHeight: "320px" }}>
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#E8F5E3" }}>
              <Leaf className="w-16 h-16" style={{ color: "#2A5F1E", opacity: 0.3 }} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          {/* Store */}
          {product.seller?.store_name && (
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-4 h-4" style={{ color: "#9E8B7D" }} />
              <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#9E8B7D" }}>
                {product.seller.store_name}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-5" style={{ color: "#1C1208" }}>
            {product.title}
          </h1>

          {/* Eco tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {product.eco_tags.map((tag) => (
              <span key={tag} className="eco-tag">
                <Leaf className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="leading-relaxed mb-8" style={{ color: "#6B5747" }}>{product.description}</p>

          {/* Meta */}
          <div className="flex items-center gap-6 mb-8 pb-8" style={{ borderBottom: "1px solid #E5DDD5" }}>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" style={{ color: "#9E8B7D" }} />
              <span className="text-sm font-medium" style={{ color: product.stock_quantity > 0 ? "#2A5F1E" : "#B85C38" }}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-serif text-4xl font-bold" style={{ color: "#B85C38" }}>
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm" style={{ color: "#9E8B7D" }}>incl. all taxes</span>
            </div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
