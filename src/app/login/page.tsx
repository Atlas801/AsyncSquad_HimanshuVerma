"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth lag
    setTimeout(() => {
      router.push("/seller"); // Mock routing for demo
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 animate-in fade-in">
      <div className="max-w-md w-full glass bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl shadow-green-900/10 text-center">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
          <Leaf className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Sign in to continue making an impact.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input required type="email" placeholder="Email address" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-left" />
          </div>
          <div>
            <input required type="password" placeholder="Password" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-left" />
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-green-600/20 disabled:opacity-70 disabled:cursor-wait">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Don't have an account? <Link href="/buyer" className="text-green-600 font-bold hover:underline">Start exploring</Link>
        </p>
      </div>
    </div>
  );
}
