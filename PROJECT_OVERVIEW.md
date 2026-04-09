# 🌿 EcoMarket — Hyperlocal Sustainable Marketplace

> **Team:** AsyncSquad | **Built in:** 1-Day Hackathon  
> **Live:** Deployed on Vercel  
> **Tagline:** *Shop small. Live well.*

---

## 📌 What is EcoMarket?

EcoMarket is a **hyperlocal web marketplace** that connects conscious buyers with local artisans selling eco-friendly, handcrafted products. Think of it as an online neighbourhood market — focused on sustainability, zero-waste living, and supporting real makers in your city.

---

## 🛠️ Tech Stack at a Glance

| Layer            | Technology                     | Why We Chose It                                      |
|------------------|--------------------------------|------------------------------------------------------|
| **Framework**    | Next.js 16 (App Router)        | Server-side rendering, file-based routing, API routes |
| **Language**     | TypeScript                     | Type safety, better DX, fewer runtime bugs           |
| **UI Library**   | React 19                       | Component-based architecture, latest features        |
| **Styling**      | Tailwind CSS v4 + Custom CSS   | Rapid styling with design tokens and custom classes  |
| **State Mgmt**   | Zustand                        | Lightweight, simple, persistent client-side stores   |
| **Database**     | Supabase (PostgreSQL)          | Auth, real-time DB, Row Level Security, free tier    |
| **Image Upload** | Cloudinary                     | CDN-backed image hosting for product photos          |
| **Maps**         | Leaflet + React-Leaflet        | Interactive map view of nearby sellers               |
| **Icons**        | Lucide React                   | Beautiful, consistent, tree-shakeable icon set       |
| **Fonts**        | Google Fonts (Inter + Lora)    | Premium typography — sans-serif body + serif headings|
| **Deployment**   | Vercel                         | Zero-config Next.js hosting, instant deploys via Git |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    VERCEL (Hosting)                  │
│  ┌───────────────────────────────────────────────┐  │
│  │            Next.js 16 App Router              │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────┐  │  │
│  │  │  Pages  │  │   API    │  │ Components  │  │  │
│  │  │ (SSR +  │  │  Routes  │  │ (Client +   │  │  │
│  │  │ Static) │  │ /api/*   │  │  Server)    │  │  │
│  │  └────┬────┘  └────┬─────┘  └──────┬──────┘  │  │
│  │       │            │               │          │  │
│  │  ┌────▼────────────▼───────────────▼──────┐   │  │
│  │  │         Zustand State Stores           │   │  │
│  │  │  (Auth · Products · Cart · Orders)     │   │  │
│  │  └────────────────┬───────────────────────┘   │  │
│  └───────────────────┼───────────────────────────┘  │
│                      │                              │
└──────────────────────┼──────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │   Supabase (Backend)    │
          │  ┌──────────────────┐   │
          │  │   PostgreSQL DB  │   │
          │  │   + Auth + RLS   │   │
          │  └──────────────────┘   │
          └─────────────────────────┘
```

---

## 📂 Project Structure

```
marketplace/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # 🏠 Landing page (hero + how-it-works)
│   │   ├── layout.tsx          # Root layout (navbar + footer)
│   │   ├── globals.css         # Design system (tokens, utilities, components)
│   │   ├── buyer/
│   │   │   ├── page.tsx        # 🛒 Product grid + map view + search
│   │   │   └── orders/page.tsx # 📦 Buyer's order history
│   │   ├── product/[id]/
│   │   │   └── page.tsx        # 📄 Product detail page (SSR)
│   │   ├── seller/
│   │   │   ├── page.tsx        # 📊 Seller dashboard (stats + orders)
│   │   │   └── products/new/   # ➕ Add new product form
│   │   ├── checkout/page.tsx   # 💳 Checkout & order placement
│   │   ├── login/page.tsx      # 🔑 Sign-in page
│   │   ├── signup/page.tsx     # 📝 Registration (buyer or seller)
│   │   ├── admin/page.tsx      # 👑 Admin panel
│   │   └── api/upload/         # 🖼️ Cloudinary image upload endpoint
│   │
│   ├── components/
│   │   ├── NavBar.tsx          # Sticky nav with mobile hamburger menu
│   │   ├── AddToCartButton.tsx # Cart button with seller restriction
│   │   └── NearbyMap.tsx       # Leaflet map with product markers
│   │
│   ├── lib/
│   │   ├── authStore.ts        # Zustand: authentication & user state
│   │   ├── productStore.ts     # Zustand: product catalog (persisted)
│   │   ├── cart.ts             # Zustand: shopping cart
│   │   ├── orderStore.ts       # Zustand: order history (persisted)
│   │   ├── supabase.ts         # Supabase client initialization
│   │   └── services/
│   │       └── products.ts     # Product data fetching service
│   │
│   └── types/
│       └── index.ts            # TypeScript interfaces (Product, Order, User…)
│
├── database_schema.sql         # Complete Supabase SQL schema
├── next.config.ts              # Next.js config (image domains, dev origins)
├── package.json                # Dependencies & scripts
└── tsconfig.json               # TypeScript configuration
```

---

## 🔑 Key Features

### 👤 Role-Based Access (3 Roles)

| Feature              | Buyer ✅ | Seller ✅ | Admin ✅ |
|----------------------|---------|----------|---------|
| Browse products      | ✅      | ✅       | ✅      |
| Search & filter      | ✅      | ✅       | ✅      |
| View on map          | ✅      | ✅       | ✅      |
| Add to cart          | ✅      | ❌       | ❌      |
| Place orders         | ✅      | ❌       | ❌      |
| View order history   | ✅      | ❌       | ❌      |
| Seller dashboard     | ❌      | ✅       | ❌      |
| Add/manage products  | ❌      | ✅       | ❌      |
| View all stats       | ❌      | ❌       | ✅      |

> **Sellers are blocked** from purchasing at 3 levels: Add-to-Cart button, Cart icon in navbar, and Checkout page.

---

### 🛒 Core User Flows

**Buyer Journey:**
```
Landing Page → Browse Market → Search/Filter → View Product → Add to Cart → Checkout → Order Confirmed → Order History
```

**Seller Journey:**
```
Sign Up (as Seller) → Seller Dashboard → Add New Product → View Orders → Update Order Status
```

---

## 🎨 Design System

### Typography
- **Headings:** Lora (Serif) — gives a warm, artisan feel
- **Body:** Inter (Sans-serif) — clean, highly readable

### Color Palette
| Token          | Color    | Usage                          |
|----------------|----------|--------------------------------|
| `cream`        | `#FAF6F0`| Page background                |
| `forest-700`   | `#2A5F1E`| Primary actions, eco elements  |
| `terra-600`    | `#B85C38`| Prices, accent, seller theme   |
| `bark-500`     | `#6B5747`| Body text, descriptions        |
| `dark`         | `#252535`| Hero sections, buttons         |

### Component Classes
- `.card` — Elevated white cards with hover lift  
- `.eco-tag` — Rounded pill badges for eco labels  
- `.product-card` — Product cards with image zoom on hover  
- `.btn-primary` / `.btn-secondary` / `.btn-terra` — Button variants  
- `.field` — Styled form inputs with focus ring  

---

## 🗄️ Database Design (Supabase / PostgreSQL)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   profiles   │       │   products   │       │    orders     │
│──────────────│       │──────────────│       │──────────────│
│ id (PK, UUID)│◄──┐   │ id (PK, UUID)│   ┌──►│ id (PK, UUID)│
│ email        │   │   │ seller_id(FK)│───┘   │ buyer_id(FK) │
│ name         │   │   │ title        │       │ seller_id(FK)│
│ role         │   └───│ description  │       │ total_amount │
│ created_at   │       │ price        │       │ status       │
└──────────────┘       │ stock_qty    │       │ created_at   │
       │               │ eco_tags[]   │       └──────┬───────┘
       ▼               │ image_url    │              │
┌──────────────┐       │ created_at   │       ┌──────▼───────┐
│   sellers    │       └──────────────┘       │ order_items  │
│──────────────│                              │──────────────│
│ id (FK → prof)│                              │ id (PK, UUID)│
│ store_name   │                              │ order_id(FK) │
│ description  │                              │ product_id   │
│ logo_url     │                              │ quantity     │
│ created_at   │                              │ price_at_time│
└──────────────┘                              └──────────────┘
```

### Security: Row Level Security (RLS)
- **Products:** Public read, only the seller who created them can edit/delete  
- **Orders:** Buyers can read/create their own; sellers can read/update orders sent to them  
- **Profiles:** Public read, users can only update their own profile  
- **Stock:** Decremented atomically via a PostgreSQL function (`decrement_stock`)

---

## 🧠 State Management — Zustand Stores

| Store           | Persisted? | Purpose                                            |
|-----------------|------------|-----------------------------------------------------|
| `authStore`     | ✅ Yes     | Current user session (id, name, email, role)        |
| `productStore`  | ✅ Yes     | Product catalog with Supabase sync + local fallback |
| `cartStore`     | ❌ No      | Shopping cart (resets on page refresh by design)     |
| `orderStore`    | ✅ Yes     | Order history surviving page reloads                |

> **Why Zustand?** It's ~1KB, zero boilerplate, supports persistence out of the box.  
> **Offline-first:** The app works completely without Supabase using mock data.

---

## 📱 Responsive Design

The app is fully responsive across all devices:

| Breakpoint | Width    | Layout                                     |
|------------|----------|--------------------------------------------|
| **xs**     | ≥ 480px  | 2-column product grid                      |
| **sm**     | ≥ 640px  | 2-column grid, side-by-side search + toggle|
| **md**     | ≥ 768px  | 3-column grid, desktop navbar              |
| **lg**     | ≥ 1024px | 4-column grid                              |
| **xl**     | ≥ 1280px | 5-column grid                              |

**Mobile-specific features:**
- Hamburger menu with slide-down navigation
- Full-width product cards on small phones (< 480px)
- Touch-friendly buttons and tap targets
- Optimized image loading with `loading="lazy"`

---

## 🚀 Deployment (Vercel)

### Steps to Deploy
1. Push code to GitHub
2. Connect repo on [vercel.com](https://vercel.com)
3. Set environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```
4. Deploy — Vercel auto-detects Next.js and builds

### Works Without Backend Too
The app ships with **10 built-in demo products** and a **local auth system**, so it runs fully even without Supabase configured:
- Demo buyer: `buyer@demo.com` / `demo123`
- Demo seller: `seller@demo.com` / `demo123`
- Demo admin: `admin@demo.com` / `demo123`

---

## 🌟 Highlights for Judges

| Area              | What We Did                                                    |
|-------------------|----------------------------------------------------------------|
| **UX**            | Clean, premium design with micro-animations and hover effects  |
| **Role Security** | 3-level seller purchase blocking (button → cart → checkout)    |
| **Offline-First** | Works with zero backend — mock data + localStorage persistence |
| **Responsive**    | Custom xs breakpoint, hamburger nav, adaptive grids            |
| **Eco-Friendly**  | Colour-coded eco-tags, sustainability-first product catalog    |
| **Map View**      | Leaflet-powered interactive map showing nearby sellers         |
| **Performance**   | Lazy-loaded images, static page generation, optimized bundle   |
| **Type Safety**   | Full TypeScript across all components and stores               |
| **Database**      | Production-grade schema with RLS, triggers, and atomic stock   |

---

## 🏃‍♂️ Quick Start (Local Dev)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build (what Vercel runs)
npm run build

# Start production server
npm start
```

---

*Built with 💚 by Team AsyncSquad*
