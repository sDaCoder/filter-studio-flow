

## Design Overhaul Plan for PixelLab

### Current State
The app uses Outfit + JetBrains Mono fonts, a generic purple/teal color scheme, and a standard SaaS layout. It's functional but visually generic — exactly the kind of "cookie-cutter" design the workspace knowledge warns against.

### Aesthetic Direction: **Darkroom Editorial**
Inspired by analog darkrooms and high-end photo editing tools like Capture One. Deep, warm blacks with a single sharp accent color (amber/orange — like a darkroom safelight). Typography that feels like a professional tool, not a SaaS product. Subtle grain texture on backgrounds. Tight, utilitarian spacing with moments of refinement.

**What makes it unforgettable**: The amber safelight glow on interactive elements against near-black surfaces — it feels like editing photos in a real darkroom.

### Changes (design-only, all functionality preserved)

**1. Typography** — Replace Outfit with **Space Mono** (display/mono) + **DM Sans** (body). A monospaced display font gives it a technical, tool-like character. DM Sans is clean and legible for UI labels.

**2. Color Palette** — Dark-first, warm blacks:
- Background: `#0c0a09` (warm near-black)
- Card/surface: `#1c1917` (stone-900)
- Border: `#292524` (stone-800)
- Primary accent: `#f59e0b` (amber-500) — the "safelight"
- Muted text: `#a8a29e` (stone-400)
- Foreground: `#e7e5e4` (stone-200)
- Light mode: warm stone tones (`#fafaf9`, `#f5f5f4`, `#44403c`)

**3. Visual Texture** — Add a subtle CSS noise/grain overlay on the main background via a pseudo-element. Add a faint amber glow on hover/focus states.

**4. Component Styling Refinements**:
- **EditorToolbar**: Tighter, more utilitarian. Logo in Space Mono. Amber accent on "PixelLab" wordmark.
- **ImageUploader**: Dashed border with amber accent on drag. Grain texture background. More dramatic entrance animation with staggered reveals.
- **FilterPanel**: Darker card surface. Amber slider tracks. Sharper tab styling with bottom-border indicator instead of pill.
- **FilterSlider**: Amber track color. Modified values glow amber.
- **ImageCanvas**: Deeper sunken background. Amber compare divider.
- **PresetFilters**: Darker preset cards with amber border on hover.
- **DownloadDialog**: Consistent dark styling with amber CTA.

**5. Animations** — Add a page-load shimmer on the toolbar. Staggered fade-in on filter sliders. Subtle scale on preset hover.

**6. Custom CSS utilities** — Grain overlay class, amber glow utility, updated glow vars.

### Files to Modify
1. `src/index.css` — New font import, full color token overhaul, grain overlay, new utilities
2. `tailwind.config.ts` — New font families, updated animation keyframes
3. `src/components/EditorToolbar.tsx` — Styling updates
4. `src/components/ImageUploader.tsx` — Grain bg, amber accents, staggered animation
5. `src/components/ImageCanvas.tsx` — Amber compare divider, deeper bg
6. `src/components/FilterPanel.tsx` — Tab styling, darker surface
7. `src/components/FilterSlider.tsx` — Amber accent on modified values
8. `src/components/PresetFilters.tsx` — Card hover styling
9. `src/components/DownloadDialog.tsx` — Amber CTA button
10. `src/pages/Index.tsx` — Minor layout tweaks

No logic, hooks, or processor changes. Pure visual transformation.

