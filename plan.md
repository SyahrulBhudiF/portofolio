# Plan: Standarisasi Padding Horizontal Semua Section

## Masalah

Padding kiri-kanan inkonsisten antar section, menyebabkan konten tidak selalu centered/rapih.

| Section | Base px | Responsive | Masalah |
|---------|---------|------------|---------|
| Home (inner) | `p-16` | `max-lg:p-8` | Pakai `p-` (all sides) bukan `px-` |
| About | `px-16` | `max-md:px-4`, `max-sm:px-8` | Responsive terbalik (sm > md) |
| Project | none | `max-xl:p-16`, `max-md:p-4` | No base px, pakai `p-` bukan `px-` |
| Experience | `px-16` | `max-md:px-8` | OK tapi beda value dari target |
| ProjectCard.tsx | — | `max-md:p-4` | Double padding dengan parent |

## Target Pattern

Semua section pakai:
```
px-16 max-md:px-4
```
Dengan `pb-*` terpisah sesuai kebutuhan masing-masing section.

## Steps

### 1. `src/components/content/About.astro`
- Ganti: `px-16 max-md:px-4 max-sm:px-8`
- Jadi: `px-16 max-md:px-4`
- Hapus `max-sm:px-8` (bug — responsive terbalik)

### 2. `src/components/content/Project.astro`
- Ganti: `max-xl:p-16 max-md:p-4 pb-26`
- Jadi: `px-16 max-md:px-4 pb-26`
- Alasan: tambah base `px-16`, ganti `p-` ke `px-` agar tidak override padding vertical

### 3. `src/components/ProjectCard.tsx`
- Hapus: `max-md:p-4` dari wrapper div
- Alasan: parent section sudah handle horizontal padding, ini bikin double padding

### 4. `src/components/content/Home.astro` (inner div)
- Ganti: `p-16 max-lg:p-8`
- Jadi: `px-16 max-md:px-4 py-16 max-lg:py-8`
- Alasan: pisah horizontal dan vertical padding, samakan breakpoint

### 5. `src/components/content/Experience.astro`
- Ganti: `px-16 max-md:px-8`
- Jadi: `px-16 max-md:px-4`
- Alasan: samakan mobile padding dengan section lain

## Hasil Akhir

Semua section punya horizontal padding konsisten:
- Desktop (>md): `px-16` (64px kiri-kanan)
- Mobile (<=md): `px-4` (16px kiri-kanan)

Konten selalu centered dan rapih di semua breakpoint.
