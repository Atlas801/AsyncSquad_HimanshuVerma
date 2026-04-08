"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/authStore";
import { useCartStore } from "@/lib/cart";
import { ShoppingBasket, Leaf, LogOut, User, Store, LayoutDashboard, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function NavBar() {
  const { user, logout } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((t, i) => t + i.cartQuantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const roleLabel: Record<string, string> = {
    buyer: "Buyer",
    seller: "Seller",
    admin: "Admin",
  };

  return (
    <header style={{ backgroundColor: "#FAF6F0", borderBottom: "1px solid #E5DDD5" }} className="sticky top-0 z-50">
      <nav className="section flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#2A5F1E" }}>
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-bold text-xl" style={{ color: "#1C1208" }}>EcoMarket</span>
        </Link>

        {/* Centre nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/buyer" className="browse-btn text-sm font-semibold px-4 py-2 rounded-lg">
            Browse Market
          </Link>
          {user?.role === "seller" && (
            <Link href="/seller" className="store-btn text-sm font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> My Store
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="nav-link-item text-sm font-medium">Admin</Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link href="/checkout" className="relative p-2 rounded-lg hover:bg-amber-50 transition">
            <ShoppingBasket className="w-5 h-5" style={{ color: "#3D2B1F" }} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: "#B85C38" }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 transition"
                style={{ border: "1px solid #E5DDD5" }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "#2A5F1E" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold" style={{ color: "#1C1208" }}>{user.name}</p>
                  <p className="text-[10px]" style={{ color: "#9E8B7D" }}>{roleLabel[user.role]}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9E8B7D" }} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl border overflow-hidden z-50 bg-white" style={{ borderColor: "#E5DDD5" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid #E5DDD5", backgroundColor: "#FAF6F0" }}>
                    <p className="font-semibold text-sm" style={{ color: "#1C1208" }}>{user.name}</p>
                    <p className="text-xs" style={{ color: "#9E8B7D" }}>{user.email}</p>
                  </div>
                  <div className="py-1">
                    {user.role === "buyer" && (
                      <Link href="/buyer/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-amber-50 transition" style={{ color: "#3D2B1F" }}>
                        <User className="w-4 h-4" /> My Orders
                      </Link>
                    )}
                    {user.role === "seller" && (
                      <Link href="/seller" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-amber-50 transition" style={{ color: "#3D2B1F" }}>
                        <Store className="w-4 h-4" /> Dashboard
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-amber-50 transition" style={{ color: "#3D2B1F" }}>
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-red-50 transition text-left"
                      style={{ color: "#B85C38", borderTop: "1px solid #E5DDD5" }}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="nav-signin text-sm font-semibold px-4 py-2">
                Sign In
              </Link>
              <Link href="/signup" className="nav-join text-sm font-semibold px-4 py-2">
                Join
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
