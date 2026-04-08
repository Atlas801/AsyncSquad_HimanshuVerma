"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/services/products";
import { Product } from "@/types";
import Link from "next/link";
import { LayoutGrid, Map, Search, Leaf } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR for Leaflet
const NearbyMap = dynamic(() => import("@/components/NearbyMap"), { ssr: false });

export default function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts(products);
    } else {
      const q = search.toLowerCase();
      setFilteredProducts(
        products.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.eco_tags.some((t) => t.toLowerCase().includes(q)) ||
            p.seller?.store_name?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, products]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
          Discover Local Goods
        </h1>
        <p className="text-gray-500 mt-2">Support sustainable products in your neighborhood.</p>
      </div>

      {/* Search + View Toggle Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, stores, eco-tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex gap-2 bg-gray-100 rounded-2xl p-1.5 self-start sm:self-auto">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              view === "grid"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              view === "map"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Map className="w-4 h-4" /> Nearby Map
          </button>
        </div>
      </div>

      {/* Map View */}
      {view === "map" && (
        <div className="mb-10">
          <NearbyMap products={products} />
        </div>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🌿</p>
              <h3 className="text-xl font-bold text-gray-700">No products found</h3>
              <p className="text-gray-400 mt-2">Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"}
                        alt={product.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1 max-w-[80%]">
                        {product.eco_tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-green-700 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <Leaf className="w-2.5 h-2.5" />{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-gray-900 leading-tight group-hover:text-green-600 transition line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                        <span className="font-extrabold text-xl text-gray-900">₹{product.price.toLocaleString("en-IN")}</span>
                        {product.seller && (
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md truncate max-w-[55%]">
                            {product.seller.store_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
