"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle, X, Loader2, ImageIcon } from "lucide-react";

async function uploadImage(file: File): Promise<string> {
  // Send to our server-side API route — keeps API_KEY & API_SECRET off the browser
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });

  if (!res.ok) {
    // Cloudinary not configured → use local object URL for demo preview
    console.warn("Upload API not available, using local preview.");
    return URL.createObjectURL(file);
  }

  const data = await res.json();
  return data.url as string;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [created, setCreated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (e) {
      console.error(e);
      alert("Image upload failed. Using local preview for demo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    setCreated(true);
    setTimeout(() => router.push("/seller"), 2500);
  };

  if (created) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Product Published!</h2>
        <p className="text-gray-500">Your sustainable product is now live on EcoMarket.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-in fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Add New Product</h1>
      <p className="text-gray-500 mb-8">List a sustainable product for buyers nearby to discover.</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${
              dragOver ? "border-green-400 bg-green-50 scale-[1.01]" :
              imagePreview ? "border-green-300 bg-green-50/30" :
              "border-gray-200 hover:border-green-400 hover:bg-green-50/30"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />

            {imagePreview ? (
              <div className="relative h-56 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                    <span className="text-white font-bold ml-3">Uploading...</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageUrl(null); }}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                {imageUrl && !uploading && (
                  <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" /> Uploaded
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-bold text-gray-600 text-sm mb-1">Drop image here or click to upload</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                  <UploadCloud className="w-3 h-3" /> Uploads to Cloudinary
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Fields */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Product Title</label>
          <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="e.g. Handmade Beeswax Wrap" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
          <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50 focus:bg-white resize-none" placeholder="Detail the materials, story, and sustainable impact..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
              <input required type="number" step="1" min="0" className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="499" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Stock Quantity</label>
            <input required type="number" min="1" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Eco Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
          <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="e.g. upcycled, plastic-free, handmade" />
          <p className="text-xs text-gray-400 mt-1.5">These tags help buyers find eco-conscious products.</p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-transform active:scale-95 shadow-lg shadow-green-600/20 disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {uploading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Uploading image...</>
            ) : (
              "Publish Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
