"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/types";
import Link from "next/link";

interface NearbyMapProps {
  products: Product[];
}

// Group products by seller location to get unique seller pins
function getSellerLocations(products: Product[]) {
  const seen = new Set<string>();
  return products.filter(p => {
    if (p.lat && p.lng && !seen.has(p.seller_id)) {
      seen.add(p.seller_id);
      return true;
    }
    return false;
  });
}

export default function NearbyMap({ products }: NearbyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import — Leaflet needs browser APIs
    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");

      // Fix default marker icon paths broken by webpack
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([20.5937, 78.9629], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(map);

      const sellers = getSellerLocations(products);

      sellers.forEach((product) => {
        if (!product.lat || !product.lng) return;

        // Custom green marker
        const greenIcon = L.divIcon({
          className: "",
          html: `
            <div style="
              background: #16a34a;
              color: white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              width: 36px; height: 36px;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 4px 12px rgba(22,163,74,0.4);
              border: 3px solid white;
            ">
              <span style="transform: rotate(45deg); font-size: 14px;">🌿</span>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const sellerProducts = products.filter(p => p.seller_id === product.seller_id);
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px;">
            <p style="font-weight: 700; font-size: 14px; color: #15803d; margin: 0 0 4px;">${product.seller?.store_name}</p>
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px;">${sellerProducts.length} product${sellerProducts.length > 1 ? 's' : ''} available</p>
            ${sellerProducts.map(p => `<p style="font-size: 12px; margin: 2px 0; color:#111;">• ${p.title} — ₹${p.price}</p>`).join('')}
            <a href="/buyer" style="display:block; margin-top: 8px; text-align: center; background: #16a34a; color: white; padding: 6px 0; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 700;">Shop Products</a>
          </div>
        `;

        const marker = L.marker([product.lat, product.lng], { icon: greenIcon }).addTo(map);
        marker.bindPopup(popupContent);
        marker.on("click", () => setSelectedProduct(product));
      });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [products]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-gray-100 shadow-2xl shadow-green-900/10">
      {/* Header badge */}
      <div className="absolute top-4 left-4 z-[999] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold text-gray-700">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {getSellerLocations(products).length} Sellers Near You
      </div>

      {/* Leaflet map container */}
      <div ref={mapRef} className="w-full h-[480px] z-0" />

      {/* Selected product card */}
      {selectedProduct && (
        <div className="absolute bottom-4 left-4 right-4 z-[999] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex items-center gap-4 border border-gray-100">
          {selectedProduct.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedProduct.image_url} alt={selectedProduct.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 truncate">{selectedProduct.seller?.store_name}</p>
            <p className="text-xs text-gray-500 truncate">{products.filter(p => p.seller_id === selectedProduct.seller_id).length} products available</p>
          </div>
          <Link href={`/product/${selectedProduct.id}`} className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition">
            View
          </Link>
          <button onClick={() => setSelectedProduct(null)} className="text-gray-300 hover:text-gray-600 transition text-xl leading-none">×</button>
        </div>
      )}
    </div>
  );
}
