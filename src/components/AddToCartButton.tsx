"use client";

import { useCartStore } from "@/lib/cart";
import { Product } from "@/types";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

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
