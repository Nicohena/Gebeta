# 🐼 Panda Menu

> A modern digital menu platform for restaurants — crafted with Next.js, TypeScript, and Supabase. Serves real-time updates, multi-language support, customer feedback, and a powerful admin dashboard.  
> *Built to eliminate the paper-based menu chaos at my local restaurant. Every price change meant reprinting stacks of paper. Every new dish meant confusion. I built this to make menus digital, dynamic, and delightful.*

> 🚧 **Ongoing Project** — Currently building **QR-based menu access system**. Customers scan, view the digital menu instantly on their phones. No paper. No outdated prices. Just the menu.

---

## ✨ Technologies

| Category | Tools |
|----------|-------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL), SSR authentication |
| Styling | Tailwind CSS, Playfair Display font, DM Sans |
| Internationalization | Custom i18n implementation (multi-language support) |
| Architecture | React Context API, Server Components, Client-side rendering |
| **Coming Soon** | QR Code Generation, Table Mapping |

---

## 🎯 Features

### Current Features

- **📱 Responsive Menu Display** — Beautiful, modern UI that works seamlessly on mobile, tablet, and desktop with real-time menu visibility
- **🔐 Admin Dashboard** — Full-featured admin panel to manage menu items, drinks, pricing, and customer feedback from a single interface
- **🌍 Multi-Language Support** — Serve international customers with built-in i18n context for multiple languages
- **💬 Customer Feedback System** — Collect, track, and respond to customer feedback directly from the dashboard with unread counters
- **💰 Pricing & Exchange Rates** — Manage dynamic pricing and real-time currency conversion for international menus
- **🎨 Dark Mode Support** — Full dark/light theme toggle with system preference detection and smooth transitions
- **🔄 Real-Time Updates** — Live menu sync powered by Supabase, keeping the public view always in sync with admin changes
- **🐼 Intuitive UX** — Sidebar navigation, featured sections, hero imagery, and bottom navigation on mobile for delightful browsing

### 🚧 Ongoing Development — QR-Based Menu Access

- **📲 QR Code Generation** — QR codes for each table. Scan to view the digital menu instantly.
- **🪑 Table Mapping** — Admin dashboard to add, remove, and assign QR codes to tables.
- **📱 Scan to View** — Customers scan the QR code and the menu opens on their phone — no app download needed.
- **🔄 Real-Time Menu** — Any admin update (price change, new dish, out of stock) reflects instantly when scanned.
- **📊 QR Analytics** — Track which tables scan most often, peak viewing times, and popular menu categories.

---

## 🧠 The Process

### The Problem That Started It All

I was helping manage a local restaurant and realized something infuriating: **paper menus everywhere**.

- Every price change meant reprinting stacks of paper — expensive and wasteful
- Every new dish meant confusion — customers couldn't find it, staff had to explain
- Every menu update meant running around replacing old menus across tables
- Customers would arrive expecting dishes we no longer served because the website and paper menus never matched

It was chaos. And it happened **every single week**.

I thought: *What if the restaurant could just update their menu in one place, and everything — website, QR codes, everything — just... updated instantly?*

That's when Panda Menu was born.

### The Architecture Decision

I knew I needed to build this fast, so I chose a modern stack:

- **Next.js 16** — Server-side rendering + static generation = performance + flexibility
- **React 19** — Smooth, responsive UI with Context API for global state
- **Supabase** — PostgreSQL with real-time subscriptions = no backend to reinvent
- **Tailwind CSS v4** — Rapid UI iteration without component library overhead

The key insight: separate concerns. An admin interface for restaurant staff, and a clean, fast public-facing menu for customers. Two experiences, one unified data source.

### The Building Journey

**Phase 1: The Foundation** — I started with the public menu display. Building components for the Hero section, FeaturedSection, and FoodSection took about a week. The hardest part? Figuring out how to structure menu data so it could scale for any restaurant size.

**Phase 2: The Admin Dashboard** — This humbled me. Building an admin interface sounds simple until you realize it needs CRUD operations, notifications, authentication guards, and real-time feedback. The moment I added the unread feedback counter that updates in real-time, everything clicked.

**Phase 3: Real-Time Magic** — The turning point was implementing Supabase's real-time subscriptions. I watched the public menu update instantly as I changed prices in the admin panel. No page refresh. No stale data. That moment made me realize this was the solution the restaurant needed.

**Phase 4: Polish & Scale** — Multi-language support, exchange rates, dark mode, mobile optimization. Each feature solved a real problem the restaurant faced daily.

### 🚧 Currently Building — QR Menu Access

I realized the restaurant still had one paper-based bottleneck: **accessing the menu**. Customers still grabbed physical menus that were often outdated or dirty.

So I started building the QR-based system. Each table gets a unique QR code. Customers scan, and the digital menu opens instantly on their phone — clean, updated, and in their preferred language.

**The challenge?** Generating unique, scannable QR codes per table and making sure the menu loads instantly on any device.

**The goal?** A restaurant where the only thing on paper is the napkin.

---

## 📚 What I Learned

| Concept | Lesson |
|---------|--------|
| **Real-Time Databases** | Supabase's real-time subscriptions eliminated polling. UX became instant and delightful. |
| **Context API at Scale** | React Context requires careful structuring to avoid prop drilling and unnecessary re-renders. |
| **Admin Design** | Admin interfaces are about efficiency, not polish. Dark themes matter for long work sessions. |
| **Internationalization** | i18n isn't just translation — it's about cultural context. Dates, currencies, text direction all matter. |
| **Responsive Design** | Mobile-first isn't optional. The bottom nav, sidebar, and hero behave differently on phones. Test on real devices. |
| **Type Safety** | TypeScript caught bugs before production. It transformed the codebase from "might break" to "confident to deploy." |
| **QR Code Systems (Ongoing)** | Generating scannable, unique QR codes per table is easy. Making sure the menu loads instantly on any device? That's the real challenge. |

---

## 🚀 How Can It Be Improved?

- [ ] **QR Analytics Dashboard** — Planned
- [ ] **Image Optimization** — Automatic WebP conversion for faster loading
- [ ] **Email Notifications** — Send admin alerts for important feedback
- [ ] **Multi-Restaurant Support** — Serve multiple restaurants from one instance
- [ ] **Offline Mode** — Cache menu for customers with poor internet connection

---

## 🛠️ Running the Project

```bash
# 1. Clone the repository
git clone https://github.com/Nicohena/Panda-menu.git
cd Panda-menu

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create a .env.local file and add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 4. Start the development server
npm run dev
# Frontend running on http://localhost:3000

# 5. Open your browser and visit:
# http://localhost:3000 — Public menu
# http://localhost:3000/admin — Admin dashboard (requires authentication)

# 6. Build for production
npm run build
npm start
