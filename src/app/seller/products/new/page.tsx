"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { useProductStore } from "@/lib/productStore";
import { UploadCloud, CheckCircle, X, Loader2, ImageIcon, Lock } from "lucide-react";
import Link from "next/link";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) return URL.createObjectURL(file); // local preview fallback
  const data = await res.json();
  return data.url as string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addProduct } = useProductStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ title: "", description: "", price: "", stock: "", tags: "" });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  // Route guard – only sellers can access
  if (!user) {
    return (
      <div className="section py-24 text-center">
        <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: "#9E8B7D" }} />
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#1C1208" }}>Sign in required</h2>
        <p className="mb-6" style={{ color: "#6B5747" }}>You need to be logged in as a seller to add products.</p>
        <Link href="/login" className="btn-primary">Go to Login</Link>
      </div>
    );
  }

  if (user.role !== "seller" && user.role !== "admin") {
    return (
      <div className="section py-24 text-center">
        <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#1C1208" }}>Seller access only</h2>
        <p className="mb-6" style={{ color: "#6B5747" }}>You need a seller account to list products.</p>
        <Link href="/signup" className="btn-primary">Create Seller Account</Link>
      </div>
    );
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try { setImageUrl(await uploadImage(file)); }
    catch { alert("Upload failed. Using local preview."); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    const tags = form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    await addProduct({
      seller_id: user.id,
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      stock_quantity: parseInt(form.stock) || 0,
      eco_tags: tags,
      image_url: imageUrl ?? undefined,
      seller: { id: user.id, name: user.name, store_name: user.name + "'s Store" },
    });
    setDone(true);
    setTimeout(() => router.push("/seller"), 2000);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: "#E8F5E3" }}>
          <CheckCircle className="w-10 h-10" style={{ color: "#2A5F1E" }} />
        </div>
        <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: "#1C1208" }}>Product Published!</h2>
        <p style={{ color: "#6B5747" }}>Visible on the marketplace now. Redirecting…</p>
      </div>
    );
  }

  return (
    <div className="section py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold" style={{ color: "#1C1208" }}>Add a New Product</h1>
        <p className="mt-1" style={{ color: "#6B5747" }}>List your sustainable creation for buyers nearby.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {/* Image drop zone */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Product Photo</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            className="relative rounded-2xl overflow-hidden cursor-pointer transition-all"
            style={{
              border: `2px dashed ${dragOver ? "#2A5F1E" : imagePreview ? "#B85C38" : "#E5DDD5"}`,
              backgroundColor: dragOver ? "#E8F5E3" : "#FAF6F0",
            }}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

            {imagePreview ? (
              <div className="relative h-56">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}
                {!uploading && imageUrl && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: "#2A5F1E" }}>
                    <CheckCircle className="w-3 h-3" /> Uploaded
                  </div>
                )}
                <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageUrl(null); }} className="absolute top-3 right-3 rounded-full p-1.5 text-white" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center gap-2" style={{ color: "#9E8B7D" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1" style={{ backgroundColor: "#E5DDD5" }}>
                  <ImageIcon className="w-7 h-7" />
                </div>
                <p className="font-semibold text-sm" style={{ color: "#6B5747" }}>Drop image here or click to upload</p>
                <p className="text-xs flex items-center gap-1"><UploadCloud className="w-3 h-3" /> PNG, JPG, WEBP up to 10MB · Saved to Cloudinary</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Product Title</label>
          <input required type="text" className="field" placeholder="e.g. Handmade Beeswax Candle" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Description</label>
          <textarea required rows={4} className="field resize-none" placeholder="Tell the story of your product — materials, process, eco impact…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Price (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: "#9E8B7D" }}>₹</span>
              <input required type="number" min="1" step="1" className="field pl-8" placeholder="499" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Stock Qty</label>
            <input required type="number" min="1" className="field" placeholder="10" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#3D2B1F" }}>Eco Tags <span className="font-normal text-xs" style={{ color: "#9E8B7D" }}>(comma separated)</span></label>
          <input type="text" className="field" placeholder="e.g. handmade, plastic-free, upcycled" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        </div>

        <button type="submit" disabled={uploading} className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-wait">
          {uploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading…</> : "Publish Product"}
        </button>
      </form>
    </div>
  );
}
