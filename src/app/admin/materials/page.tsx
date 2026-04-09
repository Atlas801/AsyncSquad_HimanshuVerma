"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Pencil, Trash, Save, X } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { getMaterials, upsertMaterial, deleteMaterial } from "@/lib/services/materials";
import { Material } from "@/types";

export default function MaterialsAdmin() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Material>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/buyer"); return; }
    loadMaterials();
  }, [user, router]);

  const loadMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (m: Material) => {
    setEditingId(m.id);
    setEditForm(m);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setEditForm({
      name: "",
      category: "Fiber",
      eco_score: 0,
      is_biodegradable: false,
      is_recyclable: false,
      is_organically_sourced: false,
      is_animal_derived: false,
      is_plant_based: false,
      is_synthetic: false,
      is_ocean_safe: false,
      is_water_intensive: false,
      has_harmful_chemicals: false,
      has_high_carbon_footprint: false,
    });
  };

  const handleSave = async () => {
    try {
      if (!editForm.name || !editForm.category) {
        alert("Name and category are required");
        return;
      }
      await upsertMaterial(editForm);
      await loadMaterials();
      setIsAdding(false);
      setEditingId(null);
    } catch (e) {
      console.error(e);
      alert("Failed to save material");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this material?")) return;
    try {
      await deleteMaterial(id);
      await loadMaterials();
    } catch (e) {
      console.error(e);
      alert("Failed to delete material");
    }
  };

  if (!mounted) return null;

  return (
    <div className="py-8 animate-in fade-in max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600" /> Material Database
          </h1>
          <p className="text-gray-500 mt-2">Manage raw materials and their eco properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (!confirm("Recalculate eco scores for all products? This may take a while.")) return;
              try {
                const { recalculateAllProductsEcoScores } = await import('@/lib/services/products');
                await recalculateAllProductsEcoScores();
                alert("Recalculation complete!");
              } catch (e) {
                console.error(e);
                alert("Failed to recalculate scores");
              }
            }}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-4 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            Recalculate Scores
          </button>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" /> Add Material
          </button>
        </div>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-4">{isAdding ? "New Material" : "Edit Material"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full border-gray-200 rounded-xl bg-gray-50 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={editForm.category || "Fiber"}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full border-gray-200 rounded-xl bg-gray-50 p-2"
              >
                <option>Fiber</option>
                <option>Metal</option>
                <option>Plastic</option>
                <option>Chemical</option>
                <option>Natural Resin</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Eco Score (0-100)</label>
              <input
                type="number"
                value={editForm.eco_score ?? 0}
                onChange={(e) => setEditForm({ ...editForm, eco_score: Number(e.target.value) })}
                className="w-full border-gray-200 rounded-xl bg-gray-50 p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {[
              { key: "is_biodegradable", label: "Biodegradable" },
              { key: "is_recyclable", label: "Recyclable" },
              { key: "is_organically_sourced", label: "Organic" },
              { key: "is_animal_derived", label: "Animal Derived" },
              { key: "is_plant_based", label: "Plant Based" },
              { key: "is_synthetic", label: "Synthetic" },
              { key: "is_ocean_safe", label: "Ocean Safe" },
              { key: "is_water_intensive", label: "Water Intensive" },
              { key: "has_harmful_chemicals", label: "Harmful Chemicals" },
              { key: "has_high_carbon_footprint", label: "High Carbon" },
            ].map((prop) => (
              <label key={prop.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!editForm[prop.key as keyof Material]}
                  onChange={(e) => setEditForm({ ...editForm, [prop.key]: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <span className="text-sm text-gray-700">{prop.label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Eco Score</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {materials.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/30 transition">
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">{m.name}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{m.category}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">{m.eco_score}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(m)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400 text-sm">No materials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
