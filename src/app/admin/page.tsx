import { BarChart, Users, ShoppingBag, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="py-8 animate-in fade-in max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-600" /> Platform Admin
        </h1>
        <p className="text-gray-500 mt-2">Monitor marketplace activity and verify sellers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
        <div className="glass bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-600/5 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-3xl font-extrabold text-gray-900">2,481</h3>
            </div>
          </div>
        </div>
        
        <div className="glass bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-green-600/5 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-green-50 text-green-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Eco Products</p>
              <h3 className="text-3xl font-extrabold text-gray-900">142</h3>
            </div>
          </div>
        </div>
        
        <div className="glass bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-blue-600/5 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
              <BarChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total GMV</p>
              <h3 className="text-3xl font-extrabold text-gray-900">$18.2k</h3>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Seller Applications</h2>
      <div className="glass bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="p-8 text-center bg-gray-50 border-b border-gray-100">
          <p className="text-gray-500 font-medium">No pending seller applications require approval right now.</p>
        </div>
      </div>
    </div>
  );
}
