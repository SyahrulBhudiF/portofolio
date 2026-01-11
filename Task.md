# Portfolio Rewrite Task - Simplified Style & Layout

## 🎯 Objective
Complete rewrite of portfolio styles and layouts dengan konsep yang lebih simpel, clean, dan efektif. Menggunakan tema pastel ungu dengan dukungan **Light Mode** (Rosé Pine Dawn) dan **Dark Mode** (Rosé Pine).

---

## 🎨 Color Palette

### Dark Mode (Rosé Pine)
```css
--base: #191724          /* Background utama */
--surface: #1f1d2e       /* Card/surface */
--overlay: #26233a       /* Elevated surfaces */
--muted: #6e6a86         /* Muted text */
--subtle: #908caa        /* Subtle text */
--text: #e0def4          /* Main text */
--love: #eb6f92          /* Accent red/pink */
--gold: #f6c177          /* Accent gold */
--rose: #ebbcba          /* Accent rose */
--pine: #31748f          /* Accent teal */
--foam: #9ccfd8          /* Accent cyan */
--iris: #c4a7e7          /* Primary - Pastel Purple */
--highlight-low: #21202e
--highlight-med: #403d52
--highlight-high: #524f67
```

### Light Mode (Rosé Pine Dawn)
```css
--base: #faf4ed          /* Background utama */
--surface: #fffaf3       /* Card/surface */
--overlay: #f2e9e1       /* Elevated surfaces */
--muted: #9893a5         /* Muted text */
--subtle: #797593        /* Subtle text */
--text: #575279          /* Main text */
--love: #b4637a          /* Accent red/pink */
--gold: #ea9d34          /* Accent gold */
--rose: #d7827e          /* Accent rose */
--pine: #286983          /* Accent teal */
--foam: #56949f          /* Accent cyan */
--iris: #907aa9          /* Primary - Pastel Purple */
--highlight-low: #f4ede8
--highlight-med: #dfdad9
--highlight-high: #cecacd
```

---

## 📋 Tasks

### Phase 1: Setup & Foundation
- [ ] **1.1** Update `globals.css` dengan Rosé Pine color system
- [ ] **1.2** Hapus font VT323 retro, gunakan font modern simpel (Inter/Geist)
- [ ] **1.3** Implementasi dark/light mode toggle dengan localStorage persistence
- [ ] **1.4** Simplify base styles - hapus text-shadow effects

### Phase 2: Remove Heavy Components
- [ ] **2.1** Hapus `ParticlesHome.tsx` - terlalu berat
- [ ] **2.2** Hapus `StarBackground.tsx` - terlalu ramai
- [ ] **2.3** Hapus `CloudParallax.tsx` - tidak perlu
- [ ] **2.4** Hapus `MountainSVG.tsx` - tidak perlu
- [ ] **2.5** Hapus `SplashScreen.tsx` - mengganggu UX
- [ ] **2.6** Hapus semua CSS effects seperti `text-retro`, `shadow-box`, `retro-tech-block`

### Phase 3: Simplify Layout Structure
- [ ] **3.1** Rewrite `Layout.astro` - cleaner structure, tambah theme toggle
- [ ] **3.2** Rewrite `Navbar.astro` - minimal floating navbar, horizontal di desktop
- [ ] **3.3** Update `index.astro` - hapus SplashScreen, simpler structure

### Phase 4: Simplify Content Sections
- [ ] **4.1** Rewrite `Home.astro` - hero section minimalis tanpa particles
- [ ] **4.2** Rewrite `About.astro` - clean layout tanpa star background
- [ ] **4.3** Rewrite `Project.astro` - grid layout simpel tanpa cloud parallax
- [ ] **4.4** Rewrite `Experience.astro` - timeline/list simpel tanpa mountain SVG

### Phase 5: Simplify Components
- [ ] **5.1** Simplify `SliderHome.tsx` - text typing effect sederhana atau static roles
- [ ] **5.2** Simplify `NavbarItem.tsx` - cleaner active state
- [ ] **5.3** Simplify `ProjectCard.tsx` - minimal card design
- [ ] **5.4** Simplify `ExperienceCard.tsx` - cleaner collapsible
- [ ] **5.5** Simplify `TechStackCategory.tsx` - simpler display
- [ ] **5.6** Simplify `AboutMotion.tsx` - reduced motion complexity
- [ ] **5.7** Simplify `Contact.tsx` - inline links, cleaner layout

### Phase 6: Create New Components
- [ ] **6.1** Create `ThemeToggle.tsx` - sun/moon icon toggle
- [ ] **6.2** Create `Section.astro` - reusable section wrapper dengan consistent padding

### Phase 7: Polish & Cleanup
- [ ] **7.1** Update `components.css` - hapus unused styles, add new minimal styles
- [ ] **7.2** Test responsiveness di semua breakpoints
- [ ] **7.3** Test light/dark mode transitions
- [ ] **7.4** Remove unused assets (cloud images, etc.)
- [ ] **7.5** Final cleanup unused dependencies

---

## 🏗️ New Design Principles

### 1. Simplicity
- Minimal decorative elements
- Clean whitespace
- No heavy parallax effects
- No particles/floating elements

### 2. Typography
- Font: Inter atau Geist (system fonts fallback)
- Clear hierarchy: h1 → h2 → h3 → body
- No text shadows atau retro effects

### 3. Layout
- Max-width container: 1200px centered
- Consistent section padding: py-20 px-6
- Card-based content dengan subtle borders
- No gradient backgrounds

### 4. Colors
- Background: solid base color
- Cards: surface color dengan subtle border
- Primary accent: iris (pastel purple)
- Text: proper contrast ratios

### 5. Animation
- Subtle fade-in on scroll
- Hover states: scale(1.02) atau opacity changes
- Theme transition: smooth 200ms
- No complex framer-motion sequences

### 6. Components
- Cards: rounded-xl, subtle shadow, border
- Buttons: filled primary, outline secondary
- Links: underline on hover
- Tags/Badges: rounded-full, muted background

---

## 📁 Files to Modify

### Styles
- `src/styles/globals.css` - Complete rewrite
- `src/styles/components.css` - Complete rewrite

### Layouts
- `src/layouts/Layout.astro` - Major update

### Pages
- `src/pages/index.astro` - Simplify

### Content Components
- `src/components/content/Home.astro`
- `src/components/content/About.astro`
- `src/components/content/Project.astro`
- `src/components/content/Experience.astro`

### UI Components
- `src/components/Navbar.astro`
- `src/components/NavbarItem.tsx`
- `src/components/SliderHome.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ProjectsContainer.tsx`
- `src/components/ExperienceCard.tsx`
- `src/components/TechStackCategory.tsx`
- `src/components/AboutMotion.tsx`
- `src/components/Contact.tsx`

### New Components
- `src/components/ThemeToggle.tsx`
- `src/components/Section.astro`

### Files to Delete
- `src/components/ParticlesHome.tsx`
- `src/components/StarBackground.tsx`
- `src/components/CloudParallax.tsx`
- `src/components/MountainSVG.tsx`
- `src/components/SplashScreen.tsx`
- `src/assets/cloud1.png`
- `src/assets/cloud2.png`
- `src/assets/cloud3.png`
- `src/assets/cloud4.png`

---

## ✅ Expected Result

1. **Cleaner visual** - No clutter, fokus ke konten
2. **Better performance** - No particles, no heavy animations
3. **Proper theming** - Light/Dark mode yang cohesive
4. **Better UX** - No splash screen, instant load
5. **Maintainable** - Less code, simpler components
6. **Unique aesthetic** - Pastel purple Rosé Pine theme

---

## 🚀 Execution Order

1. Phase 1 → Setup foundation dulu
2. Phase 2 → Remove heavy components
3. Phase 3 → Update layouts
4. Phase 4 → Update sections
5. Phase 5 → Simplify existing components
6. Phase 6 → Create new components
7. Phase 7 → Final polish

**Start dengan Phase 1.1** - Update `globals.css` dengan Rosé Pine colors dan theme system.