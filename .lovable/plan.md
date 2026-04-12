

## Glassmorphic "Liquid Glass" Redesign

Transform PixelLab from the current "Darkroom Editorial" dark theme into an Apple-inspired liquid glass aesthetic — frosted translucent surfaces, soft blurs, light refractions, and luminous borders.

### Design Language

- **Surfaces**: Semi-transparent backgrounds (`rgba(255,255,255,0.6)` light / `rgba(255,255,255,0.08)` dark) with `backdrop-filter: blur(20px) saturate(180%)`
- **Borders**: 1px borders using `rgba(255,255,255,0.3)` — simulating light refraction on glass edges
- **Shadows**: Layered soft shadows with slight color tint for depth
- **Accent**: Keep amber but soften it — use a luminous gradient glow instead of flat color
- **Radius**: Increase to `1rem` / `1.25rem` for that rounded Apple feel
- **Typography**: Keep Space Mono + DM Sans but lighten weights
- **Background**: Subtle animated gradient mesh behind the glass panels

### Files to Modify

**1. `src/index.css`** — Full token overhaul:
- Light mode: warm white/cream base with high-saturation background gradient mesh
- Dark mode: deep blue-gray base (`#0f0f1a`) with subtle purple-blue gradient mesh
- New CSS utility classes: `.glass`, `.glass-dark`, `.glass-border`, `.glass-glow`
- Remove grain overlay, replace with smooth gradient backgrounds
- Add animated gradient mesh keyframes for the page background

**2. `tailwind.config.ts`** — Update:
- Increase `--radius` to `1rem`
- Add `glass` color tokens for border/surface opacity
- Add `gradient-mesh` animation keyframe

**3. `src/components/ui/slider.tsx`** — Glass slider:
- Track: translucent glass with inner shadow
- Range: amber gradient with glow
- Thumb: frosted glass circle with luminous border

**4. `src/components/EditorToolbar.tsx`** — Glass toolbar:
- `backdrop-blur-xl bg-white/60 dark:bg-white/8 border-b border-white/20`
- Buttons get glass hover states with subtle inner glow
- Logo gets a soft gradient text effect

**5. `src/components/ImageUploader.tsx`** — Glass upload zone:
- Frosted glass card with rounded corners and luminous border
- Icon container gets a glass pill shape
- Drop state: intensified glow + brighter glass surface

**6. `src/components/FilterPanel.tsx`** — Glass sidebar:
- Entire panel: frosted glass background, no solid `bg-card`
- Tabs: glass pill selector with sliding indicator
- Tab content area: subtle inner shadow for depth

**7. `src/components/FilterSlider.tsx`** — Glass-styled labels, keep amber accent on modified values

**8. `src/components/ImageCanvas.tsx`** — Glass sub-toolbar and compare badges:
- Canvas toolbar: glass surface matching main toolbar
- Compare/zoom buttons: glass pill buttons
- Labels ("Edited"/"Original"): glass badges

**9. `src/components/PresetFilters.tsx`** — Glass preset cards:
- Cards get glass border + frosted overlay on label area
- Hover: brighten glass surface, glow border

**10. `src/components/DownloadDialog.tsx`** — Glass dialog:
- Dialog content: frosted glass with luminous border
- Inputs/selects: glass-styled with translucent backgrounds
- Download button: gradient amber with glass highlight

**11. `src/pages/Index.tsx`** — Add animated gradient mesh background div behind all content

**12. `src/components/ui/dialog.tsx`** — Update overlay and content styling for glass effect

### No Logic Changes
All hooks, image processing, state management, and functionality remain untouched. Pure visual transformation.

