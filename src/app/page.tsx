import Link from "next/link";
import { ArrowRight, Leaf, MapPin, ShoppingBag, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative flex items-center min-h-[90vh] overflow-hidden"
        style={{ background: "linear-gradient(135deg, #111118 0%, #1c1c27 55%, #252535 100%)" }}
      >
        {/* Dot-grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        {/* Glow blobs */}
        <div className="absolute top-[-100px] right-[-80px] w-[520px] h-[520px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(180,180,210,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-80px] left-[-60px] w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(160,160,200,0.08) 0%, transparent 70%)" }} />

        <div className="section relative z-10 py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full text-sm font-semibold tracking-wide"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#c8c8d8" }}
            >
              <Leaf className="w-3.5 h-3.5" />
              India&apos;s Hyperlocal Eco Marketplace
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl md:text-[72px] font-bold leading-[1.08] mb-7 text-white">
              Shop small.
              <br />
              <span className="italic" style={{ background: "linear-gradient(90deg, #d4d4e8, #a0a0c0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Live&nbsp;well.
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style={{ color: "rgba(255,255,255,0.6)" }}>
              Handcrafted, sustainable goods from artisans right in your neighborhood. Every purchase supports a real person and a healthier planet.
            </p>

            {/* CTA buttons — CSS-only hover via .hero-btn-primary / .hero-btn-ghost */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/buyer"
                className="hero-btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base"
              >
                Browse Market <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/signup"
                className="hero-btn-ghost inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ backgroundColor: "#0e0e18", borderBottom: "1px solid #2a2a3a" }}>
        <div className="section py-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { num: "500+",    label: "Local Artisans" },
              { num: "2,000+", label: "Eco Products"   },
              { num: "15,000+",label: "Happy Buyers"   },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white font-serif">{stat.num}</p>
                <p className="text-xs mt-1" style={{ color: "#6b6b8a" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28" style={{ backgroundColor: "#FAF6F0" }}>
        <div className="section">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: "#EDEDF5", color: "#4a4a6a" }}
            >
              <Sparkles className="w-3.5 h-3.5" /> How It Works
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: "#111118" }}>
              Your neighbourhood market, <em style={{ color: "#6b6b8a" }}>online.</em>
            </h2>
            <p className="text-lg max-w-md mx-auto" style={{ color: "#6B5747" }}>
              Three simple steps from discovery to doorstep.
            </p>
          </div>

          {/* step-card uses CSS :hover in globals.css */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin,      step: "01", title: "Discover Nearby",  desc: "Browse products from sellers in your city. Filter by eco-tag or view them on a live map." },
              { icon: ShoppingBag, step: "02", title: "Add to Basket",    desc: "Pick your favorites, review your order, and checkout securely in seconds." },
              { icon: Users,       step: "03", title: "Support Artisans", desc: "Your money goes directly to the maker. Track your order and see your eco-impact." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="step-card p-8 relative">
                <div
                  className="absolute -top-3.5 left-7 text-[10px] font-bold tracking-widest px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: "#252535" }}
                >
                  STEP {step}
                </div>
                <div className="mt-4 mb-5 w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#F0F0F8" }}>
                  <Icon className="w-6 h-6" style={{ color: "#4a4a6a" }} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3" style={{ color: "#111118" }}>{title}</h3>
                <p className="leading-relaxed text-sm" style={{ color: "#6B5747" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER CTA ── */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #1c1c27 0%, #252535 100%)" }}>
        <div className="section text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-5 text-white">
            Are you a maker or artisan?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
            List your products for free and reach conscious buyers in your city today.
          </p>
          {/* dark-cta-btn uses CSS :hover */}
          <Link href="/signup" className="dark-cta-btn">
            Open Your Store — It&apos;s Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
