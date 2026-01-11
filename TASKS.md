# 📋 Portfolio Best Practice Improvement Tasks

Dokumen ini berisi daftar task yang perlu dikerjakan untuk memperbaiki kode portfolio agar sesuai dengan best practices.

---

## 🔴 Priority 1 - Critical (Harus Segera)

| # | Task | File/Lokasi | Status |
|---|------|-------------|--------|
| 1 | Perbaiki nama project di `package.json` dari "tailwind" menjadi nama yang deskriptif | `package.json` | ✅ |
| 2 | Hapus duplikasi dependency animasi - pilih `framer-motion` ATAU `motion`, jangan keduanya | `package.json` | ✅ |
| 3 | Pindahkan `@types/react` dan `@types/react-dom` ke `devDependencies` | `package.json` | ✅ |
| 4 | Hapus unused dependencies: `styled-components`, `react-typing-animation`, `tailwind` | `package.json` | ✅ |
| 5 | Standarisasi import animation library di semua komponen (pilih satu: `framer-motion` atau `motion/react`) | Semua komponen | ✅ |
| 6 | Fix TypeScript errors di `carousel.tsx` (2 errors) | `src/components/ui/carousel.tsx` | ✅ |
| 7 | Fix TypeScript errors di `ProjectCard.tsx` (4 errors) | `src/components/ProjectCard.tsx` | ✅ |
| 8 | Fix TypeScript errors di `ExperienceCard.tsx` (3 errors) | `src/components/ExperienceCard.tsx` | ✅ |
| 9 | Fix TypeScript errors di `RotatingText.tsx` (3 errors, 1 warning) | `src/components/ui/RotatingText.tsx` | ✅ |

---

## 🟠 Priority 2 - Medium (Sebaiknya Dilakukan)

| # | Task | File/Lokasi | Status |
|---|------|-------------|--------|
| 10 | Buat content collections untuk experiences, education, techstack (MDX) | `src/content/experiences/`, `src/content/education/`, `src/content/techstack/` | ✅ |
| 11 | Buat custom hook `useIsMobile()` untuk mengganti logic yang berulang di banyak komponen | `src/hooks/useIsMobile.ts` | ✅ |
| 12 | Hapus duplikasi function `cn()` di `RotatingText.tsx`, gunakan import dari `@/lib/utils` | `src/components/ui/RotatingText.tsx` | ✅ |
| 13 | Hapus unused import `React` di `SliderHome.tsx` (React 17+ tidak perlu explicit import) | `src/components/SliderHome.tsx` | ✅ |
| 14 | Fix unused variable `index` di `ProjectsContainer.tsx` (gunakan `_index` atau hapus) | `src/components/ProjectsContainer.tsx` | ✅ |
| 15 | Review dan optimalkan penggunaan `willChange` CSS property - hapus yang tidak perlu | Semua komponen dengan animasi | ✅ |
| 16 | Tambahkan Error Boundary untuk React components | `src/components/ErrorBoundary.tsx` | ✅ |
| 17 | Fix warnings di `SplashScreen.tsx` (2 warnings) | `src/components/SplashScreen.tsx` | ✅ |
| 18 | Fix warnings di file `.astro` (total 29 warnings) | Semua file `.astro` | ✅ (false positives - Astro syntax) |

---

## 🟡 Priority 3 - Low (Nice to Have)

| # | Task | File/Lokasi | Status |
|---|------|-------------|--------|
| 19 | Rename folder project dari `portofolio` → `portfolio` (typo fix) | Root folder | ⬜ (manual) |
| 20 | Pindahkan `src/assets/logo.tsx` ke `src/components/icons/Logo.tsx` | `src/components/icons/Logo.tsx` | ✅ |
| 21 | Verifikasi dan hapus file yang tidak digunakan: `RotatingHome.tsx`, `ProjectSlider.tsx` | `src/components/` | ✅ |
| 22 | Tambahkan "Skip to main content" link untuk accessibility | `src/layouts/Layout.astro` | ✅ |
| 23 | Standarisasi export style - pilih antara default exports atau named exports | Semua komponen | ⬜ |
| 24 | Pisahkan custom CSS classes (`.text-retro`, `.retro-tech-block`, dll) ke file terpisah | `src/styles/components.css` | ✅ |
| 25 | Tambahkan loading states/skeleton untuk komponen async | `src/components/` | ⬜ |
| 26 | Optimasi Particles effect untuk mobile (reduce particle count atau disable) | `src/components/ParticlesHome.tsx` | ✅ |
| 27 | Tambahkan unit tests untuk utility functions | `src/lib/__tests__/utils.test.ts` | ⬜ (skipped) |
| 28 | Tambahkan Biome config untuk linting dan formatting | `biome.json` | ✅ |
| 29 | Tambahkan pre-commit hooks dengan Husky untuk linting | `package.json`, `.husky/` | ⬜ |
| 30 | Improve alt text untuk images agar lebih deskriptif | Semua komponen dengan images | ✅ |

---

## 🆕 Priority 4 - Code Review Terbaru (Session 2)

| # | Task | File/Lokasi | Status |
|---|------|-------------|--------|
| 31 | Hapus `TechStackItem.tsx` yang tidak digunakan (duplikasi dengan inline di TechStackCategory) | `src/components/TechStackItem.tsx` | ✅ |
| 32 | Hapus `TechStack.astro` yang tidak digunakan | `src/components/TechStack.astro` | ✅ |
| 33 | Hapus folder `src/data` yang kosong | `src/data/` | ✅ |
| 34 | Fix Tailwind class warning: `min-h-[200px]` → `min-h-50` | `src/components/ErrorBoundary.tsx` | ✅ |
| 35 | Pindahkan inline CSS keyframes `starTwinkle` ke `components.css` | `src/components/StarBackground.tsx`, `src/styles/components.css` | ✅ |
| 36 | Optimasi client directive: `SliderHome` dari `client:load` → `client:idle` | `src/components/content/Home.astro` | ✅ |
| 37 | Fix `forEach` → `for...of` di IntersectionObserver | `src/components/NavbarItem.tsx` | ✅ |
| 38 | Fix array index keys → gunakan nilai unik sebagai key | `ExperienceCard.tsx`, `ProjectCard.tsx` | ✅ |
| 39 | Fix self-closing elements untuk div kosong | `src/components/SplashScreen.tsx` | ✅ |
| 40 | Fix exhaustive dependencies: wrap `splitIntoCharacters` dalam useCallback | `src/components/ui/RotatingText.tsx` | ✅ |
| 41 | Update `@types/react` ke versi compatible dengan React 19 | `package.json` | ✅ |
| 42 | Pertimbangkan migrasi content config ke `src/content.config.ts` (Astro 5 pattern) | `src/content/config.ts` | ⬜ (optional) |
| 43 | Optimasi `NavbarItem` client directive (4x `client:load` agak heavy) | `src/components/Navbar.astro` | ⬜ |

---

## 📝 Catatan

### Dependencies yang Sudah Dihapus ✅
```
- styled-components (tidak digunakan - menggunakan Tailwind)
- react-typing-animation (tidak terlihat digunakan)
- tailwind (package berbeda dari tailwindcss, tidak perlu)
- motion (duplikasi dengan framer-motion)
```

### File yang Sudah Dibuat/Dipindahkan ✅
```
src/
├── content/
│   ├── experiences/        # Work experience MDX files ✅
│   │   ├── sinergi-informatika.mdx
│   │   ├── oranji.mdx
│   │   └── sthira-teknik.mdx
│   ├── education/          # Education MDX files ✅
│   │   ├── polinema.mdx
│   │   └── sman1-balongpanggang.mdx
│   └── techstack/          # Tech stack MDX files ✅
│       ├── languages.mdx
│       ├── frameworks.mdx
│       ├── databases.mdx
│       └── devops.mdx
├── hooks/
│   └── useIsMobile.ts      # Custom hook untuk deteksi mobile ✅
├── components/
│   ├── ErrorBoundary.tsx   # Error boundary component ✅
│   └── icons/
│       └── Logo.tsx        # Pindahan dari assets/logo.tsx ✅
└── styles/
    └── components.css      # Custom component styles ✅

Root files:
├── biome.json              # Biome linter/formatter config ✅
```

### File yang Sudah Dihapus ✅
```
- src/assets/logo.tsx (dipindahkan ke src/components/icons/Logo.tsx)
- src/components/RotatingHome.tsx (unused)
- src/components/ProjectSlider.tsx (unused)
- src/components/TechStackItem.tsx (duplikasi - sudah ada inline di TechStackCategory)
- src/components/TechStack.astro (unused)
- src/data/ (folder kosong)
```

### Improvement yang Dilakukan ✅
```
- Skip to main content link untuk accessibility
- Particles effect dioptimasi untuk mobile (reduced count, disabled hover)
- Alt text untuk images diperbaiki agar lebih deskriptif
- CSS classes dipisahkan ke components.css
- Biome config untuk consistent linting/formatting
- StarBackground inline CSS dipindahkan ke components.css
- SliderHome client directive dioptimasi (client:load → client:idle)
- ErrorBoundary Tailwind class diperbaiki (min-h-[200px] → min-h-50)
- forEach → for...of di NavbarItem (performance improvement)
- Array index keys diganti dengan nilai unik (React best practice)
- Self-closing elements untuk div kosong (JSX best practice)
- splitIntoCharacters di-wrap dalam useCallback (exhaustive deps fix)
```

### Client Directive Recommendations 🚀
```
Berdasarkan Astro best practices:
- client:load   → Untuk komponen yang HARUS interaktif segera (SplashScreen, NavbarItem)
- client:idle   → Untuk komponen yang bisa delay sampai browser idle (Particles, SliderHome, TechStack)
- client:visible → Untuk komponen below the fold (AboutMotion, ProjectsContainer, ExperienceCard)

Current optimizations:
✅ ParticlesHome: client:idle (correct - tidak critical untuk first render)
✅ SliderHome: client:idle (optimized - text carousel bisa delay)
✅ TechStackCategory: client:idle (correct)
✅ ProjectsContainer: client:idle (correct)
✅ ExperienceCard: client:idle (correct)
⚠️ NavbarItem: client:load (4x) - bisa dipertimbangkan client:idle
```

### Remaining Warnings (Acceptable) ⚠️
```
Total: 7 warnings (semua adalah false positives atau acceptable)

1. Astro file warnings (5x) - False positives karena Biome tidak memahami Astro syntax:
   - Variables di .astro dianggap "unused" padahal digunakan di template
   - Ini normal dan tidak mempengaruhi build

2. RotatingText.tsx array index key (2x) - Acceptable karena:
   - Digunakan untuk animasi karakter yang tidak akan di-reorder
   - Index + charIndex kombinasi sudah cukup unik untuk use case ini
```

### Statistik Build
- **Build Status**: ✅ Success
- **Total Errors**: 0
- **Total Warnings**: 7 (false positives/acceptable)
- **Build Time**: ~5.07s

---

## ✅ Checklist Sebelum Deploy

- [x] Semua TypeScript errors sudah di-fix
- [x] Tidak ada unused imports/variables
- [x] Dependencies sudah di-optimize
- [x] Accessibility sudah ditambahkan (skip link)
- [x] Performance sudah dioptimasi untuk mobile (particles)
- [x] SEO meta tags sudah lengkap
- [x] Build berhasil tanpa error
- [x] Unused files sudah dihapus
- [x] Inline CSS sudah dipindahkan ke file terpisah
- [x] Client directives sudah dioptimasi
- [x] Biome lint/format issues sudah di-fix
- [x] React best practices (keys, hooks) sudah diperbaiki
- [x] Update @types/react untuk React 19 compatibility
- [ ] Test di production environment
- [ ] Lighthouse audit

---

## 🚀 Scripts yang Tersedia

```bash
# Development
bun run dev

# Build
bun run build

# Preview production build
bun run preview

# Linting dengan Biome
bun run lint          # Check lint errors
bun run lint:fix      # Fix lint errors

# Formatting dengan Biome
bun run format        # Format all files

# Check (lint + format)
bun run check         # Check all
bun run check:fix     # Fix all
```

---

## 📚 Referensi Best Practices

- [Astro Best Practices](https://docs.astro.build/en/guides/)
- [Astro Client Directives](https://docs.astro.build/en/reference/directives-reference/#client-directives)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs)
- [Web Accessibility (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Biome Documentation](https://biomejs.dev/guides/getting-started/)

---

*Last Updated: Session 2 - @types/react updated to v19.2.8*
*Build: ✅ Success | Errors: 0 | Warnings: 7 (acceptable)*
*Status Legend: ⬜ Todo | 🔄 In Progress | ✅ Done*