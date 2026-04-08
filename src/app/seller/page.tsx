"use client";

import { Package, TrendingUp, Users, IndianRupee, Plus, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

const MOCK_PRODUCTS = [
  { id: "p1", title: "Upcycled Denim Tote Bag", price: 2999, stock: 10, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=100&auto=format&fit=crop" },
  { id: "p2", title: "Bamboo Toothbrush Pack", price: 499, stock: 50, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=100&auto=format&fit=crop" },
  { id: "p6", title: "Khadi Cotton Tote", price: 1199, stock: 40, image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4fb2?q=80&w=100&auto=format&fit=crop" },
];

const MOCK_ORDERS = [
  { id: "#ORD-1092", item: "Bamboo Toothbrush (×2)", total: 998, status: "pending" },
  { id: "#ORD-1091", item: "Upcycled Denim Tote (×1)", total: 2999, status: "processing" },
  { id: "#ORD-1090", item: "Khadi Cotton Tote (×3)", total: 3597, status: "completed" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  processing: "bg-orange-50 text-orange-700 border border-orange-200",
  completed: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

export default function SellerDashboard() {
  return (
    <div className="py-8 animate-in fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your store and fulfill orders.</p>
        </div>
        <Link
          href="/seller/products/new"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 active:scale-95 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Revenue", value: "₹1,24,050", icon: IndianRupee, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active Products", value: "12", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending Orders", value: "3", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Store Views", value: "842", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Active Products - responsive card grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" /> Active Products
              </h2>
              <Link href="/seller/products/new" className="text-green-600 hover:text-green-700 transition">
                <Plus className="w-5 h-5" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_PRODUCTS.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.stock} in stock</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-gray-900 text-sm">₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 group-hover:text-gray-500 transition" />
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-50">
              <button className="w-full text-center text-sm text-green-600 font-semibold hover:text-green-700 transition py-1">
                View all 12 products →
              </button>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" /> Recent Orders
              </h2>
              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
                {MOCK_ORDERS.filter(o => o.status === "pending").length} pending
              </span>
            </div>

            {/* Mobile: card stack */}
            <div className="sm:hidden divide-y divide-gray-50">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.item}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">₹{order.total.toLocaleString("en-IN")}</span>
                    {order.status !== "completed" && (
                      <button className="text-xs text-green-600 font-bold hover:underline">Update Status →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/30 transition">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">{order.id}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm max-w-[200px] truncate">{order.item}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{order.total.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status !== "completed" ? (
                          <button className="text-green-600 font-bold text-sm hover:underline">Update</button>
                        ) : (
                          <span className="text-gray-300 text-sm font-bold">Done ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
