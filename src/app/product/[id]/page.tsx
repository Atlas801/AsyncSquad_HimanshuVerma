import { getProductById } from "@/lib/services/products";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { Leaf, Store, Package } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col md:flex-row border border-gray-100">

        {/* Image */}
        <div className="md:w-1/2 h-[360px] md:h-auto relative bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            {product.eco_tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100">
                <Leaf className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4">{product.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-1.5 font-medium">
              <Store className="w-4 h-4 text-gray-400" />
              {product.seller?.store_name || "Unknown Seller"}
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-gray-400" />
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
            </div>
          </div>

          <div className="mb-8 text-gray-600 leading-relaxed">
            <p>{product.description}</p>
          </div>

          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-extrabold text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
            <span className="text-sm text-gray-400 mb-1">incl. all taxes</span>
          </div>

          <AddToCartButton product={product} />
        </div>

      </div>
    </div>
  );
}
