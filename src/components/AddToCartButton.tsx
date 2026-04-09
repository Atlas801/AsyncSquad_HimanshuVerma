"use client";

import { useCartStore } from "@/lib/cart";
import { useAuthStore } from "@/lib/authStore";
import { Product } from "@/types";
import { ShoppingCart, Check, Store } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const user = useAuthStore((state) => state.user);
  const [added, setAdded] = useState(false);

  const isSeller = user?.role === "seller";

  const handleAdd = () => {
    if (isSeller) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isSeller) {
    return (
      <div className="w-full py-4 rounded-xl font-bold flex flex-col justify-center items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 cursor-not-allowed">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          <span>Sellers cannot purchase products</span>
        </div>
        <span className="text-xs font-normal text-amber-500">Switch to a buyer account to shop</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock_quantity === 0}
      className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-300 ${
        product.stock_quantity === 0
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : added
          ? "bg-green-600 text-white shadow-lg shadow-green-600/30 ring-2 ring-green-600 ring-offset-2"
          : "bg-gray-900 text-white hover:bg-green-600 hover:shadow-xl hover:shadow-green-600/20 active:scale-95"
      }`}
    >
      {product.stock_quantity === 0 ? (
        "Out of Stock"
      ) : added ? (
        <>
          <Check className="w-5 h-5" /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" /> Add to Cart — ₹{product.price.toLocaleString("en-IN")}
        </>
      )}
    </button>
  );
}
