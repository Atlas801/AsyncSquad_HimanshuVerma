import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-green-50/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-200/40 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 mx-auto">
            <Leaf className="w-4 h-4" />
            <span>Sustainable & Local</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Shop small.<br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
               Impact big.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover eco-friendly products crafted by passionate local artisans in your community. Reduce your carbon footprint with every purchase.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/buyer" className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/30 flex items-center justify-center gap-2">
              Start Exploring <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/seller" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-bold text-lg transition-transform hover:-translate-y-1 shadow-sm">
              Open a Store
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
               <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-green-600 transform transition hover:rotate-6">
                 <Leaf className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">100% Sustainable</h3>
               <p className="text-gray-500">Every product is vetted for eco-friendly practices and materials.</p>
            </div>
            <div className="text-center space-y-4">
               <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-green-600 transform transition hover:-rotate-6">
                 <MapPin className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">Hyper-Local</h3>
               <p className="text-gray-500">Find sellers right in your neighborhood. Support your local economy.</p>
            </div>
            <div className="text-center space-y-4">
               <div className="w-16 h-16 mx-auto bg-green-50 rounded-2xl flex items-center justify-center text-green-600 transform transition hover:rotate-6">
                 <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold">Verified Quality</h3>
               <p className="text-gray-500">Secure payments and community-reviewed sellers you can trust.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
