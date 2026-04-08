"use client";

import Link from "next/link";
import { ShoppingCart, Leaf } from "lucide-react";
import { useCartStore } from "@/lib/cart";

export default function NavBar() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.cartQuantity, 0);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2 text-green-600 hover:opacity-80 transition">
            <Leaf className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-gray-900">EcoMarket</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/buyer" className="text-gray-600 hover:text-green-600 transition font-medium">Explore</Link>
            <Link href="/seller" className="text-gray-600 hover:text-green-600 transition font-medium">Sell</Link>
            
            <Link href="/checkout" className="relative p-2 text-gray-600 hover:text-green-600 transition">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-green-500 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
