"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/types";
import Link from "next/link";

interface NearbyMapProps {
  products: Product[];
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      import("leaflet/dist/leaflet.css");

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current).setView([20.5937, 78.9629], 5);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>',
      }).addTo(map);

      const sellers = getSellerLocations(products);
      const markers: L.LatLngExpression[] = [];

      sellers.forEach((product) => {
        if (!product.lat || !product.lng) return;

        const pin = L.divIcon({
          className: "",
          html: `
            <div style="
              background: #252535;
              color: white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              width: 36px; height: 36px;
              display: flex; align-items: center; justify-content: center;
              box-shadow: 0 4px 14px rgba(37,37,53,0.45);
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
          <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 4px 0;">
            <p style="font-weight: 700; font-size: 14px; color: #252535; margin: 0 0 2px;">${product.seller?.store_name}</p>
            <p style="color: #9E8B7D; font-size: 11px; margin: 0 0 10px;">${sellerProducts.length} product${sellerProducts.length > 1 ? "s" : ""} available</p>
            ${sellerProducts.map(p => `<p style="font-size: 12px; margin: 3px 0; color:#3D2B1F;">• ${p.title} — <b style="color:#B85C38;">₹${p.price.toLocaleString("en-IN")}</b></p>`).join("")}
            <a href="/buyer" style="display:block; margin-top: 10px; text-align: center; background: #252535; color: white; padding: 7px 0; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 700;">Shop Products</a>
          </div>
        `;

        const marker = L.marker([product.lat, product.lng], { icon: pin }).addTo(map);
        marker.bindPopup(popupContent);
        marker.on("click", () => setSelectedProduct(product));
        markers.push([product.lat, product.lng]);
      });

      if (markers.length > 0) {
        const bounds = L.latLngBounds(markers);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [products]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E5EE" }}>
      <div
        className="absolute top-4 left-4 z-[999] px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold"
        style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", color: "#252535" }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#B85C38"}} />
        {getSellerLocations(products).length} Sellers Near You
      </div>

      <div ref={containerRef} className="w-full h-[480px] z-0" />

      {selectedProduct && (
        <div
          className="absolute bottom-4 left-4 right-4 z-[999] rounded-2xl p-4 shadow-2xl flex items-center gap-4"
          style={{ backgroundColor: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", border: "1px solid #E5E5EE" }}
        >
          {selectedProduct.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selectedProduct.image_url} alt={selectedProduct.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate" style={{ color: "#252535" }}>{selectedProduct.seller?.store_name}</p>
            <p className="text-xs truncate" style={{ color: "#9E8B7D" }}>
              {products.filter(p => p.seller_id === selectedProduct.seller_id).length} products available
            </p>
          </div>
          <Link
            href={`/product/${selectedProduct.id}`}
            className="flex-shrink-0 px-4 py-2 text-white rounded-xl text-sm font-bold"
            style={{ backgroundColor: "#252535", transition: "background-color 0.2s" }}
          >
            View
          </Link>
          <button onClick={() => setSelectedProduct(null)} className="text-gray-300 hover:text-gray-600 transition text-xl leading-none">×</button>
        </div>
      )}
    </div>
  );
}
