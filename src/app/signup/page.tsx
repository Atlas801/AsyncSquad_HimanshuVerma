"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { Leaf, Eye, EyeOff, ShoppingBag, Store } from "lucide-react";

export default function SignupPage() {
  const { signup, isLoading } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" as "buyer" | "seller" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    const result = await signup(form.name, form.email, form.password, form.role);
    if (result.error) { setError(result.error); return; }
    router.push(form.role === "seller" ? "/seller" : "/buyer");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ backgroundColor: "#2A5F1E" }}>
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: "#1C1208" }}>Join EcoMarket</h1>
          <p className="mt-2 text-sm" style={{ color: "#6B5747" }}>Be part of the sustainable local movement</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          {/* Role picker */}
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "#3D2B1F" }}>I want to…</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { role: "buyer" as const, label: "Shop & Discover", sub: "Find sustainable products", Icon: ShoppingBag },
                { role: "seller" as const, label: "Sell My Craft", sub: "List handmade products", Icon: Store },
              ].map(({ role, label, sub, Icon }) => (
                <button
                  key={role} type="button"
                  onClick={() => setForm({ ...form, role })}
                  className="p-4 rounded-xl text-left transition border-2"
                  style={{
                    borderColor: form.role === role ? "#2A5F1E" : "#E5DDD5",
                    backgroundColor: form.role === role ? "#E8F5E3" : "#FFFFFF",
                  }}
                >
                  <Icon className="w-5 h-5 mb-2" style={{ color: form.role === role ? "#2A5F1E" : "#9E8B7D" }} />
                  <p className="text-sm font-bold" style={{ color: form.role === role ? "#2A5F1E" : "#3D2B1F" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#9E8B7D" }}>{sub}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field" placeholder="Priya Sharma" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Email address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"} required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field pr-11" placeholder="Min. 6 characters"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#9E8B7D" }}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg p-3 text-sm font-medium" style={{ backgroundColor: "#FBE9E2", color: "#9A4A2C" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-wait">
            {isLoading ? "Creating account…" : `Create ${form.role === "seller" ? "Seller" : "Buyer"} Account`}
          </button>
        </form>

        <p className="text-center mt-6 text-sm" style={{ color: "#6B5747" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: "#2A5F1E" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
