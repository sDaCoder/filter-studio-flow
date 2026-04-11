export interface FilterState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  redChannel: number;
  greenChannel: number;
  blueChannel: number;
  sharpen: number;
  edgeDetection: number;
}

export const DEFAULT_FILTERS: FilterState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  redChannel: 100,
  greenChannel: 100,
  blueChannel: 100,
  sharpen: 0,
  edgeDetection: 0,
};

export interface Preset {
  id: string;
  name: string;
  filters: FilterState;
  custom?: boolean;
}

export const BUILT_IN_PRESETS: Preset[] = [
  { id: "clarendon", name: "Clarendon", filters: { ...DEFAULT_FILTERS, brightness: 115, contrast: 120, saturation: 130 } },
  { id: "gingham", name: "Gingham", filters: { ...DEFAULT_FILTERS, brightness: 105, sepia: 10, contrast: 90 } },
  { id: "moon", name: "Moon", filters: { ...DEFAULT_FILTERS, grayscale: 100, brightness: 110, contrast: 110 } },
  { id: "lark", name: "Lark", filters: { ...DEFAULT_FILTERS, brightness: 110, contrast: 90, saturation: 115 } },
  { id: "reyes", name: "Reyes", filters: { ...DEFAULT_FILTERS, brightness: 110, contrast: 85, saturation: 75, sepia: 22 } },
  { id: "juno", name: "Juno", filters: { ...DEFAULT_FILTERS, brightness: 105, contrast: 115, saturation: 140, hueRotate: -10 } },
  { id: "slumber", name: "Slumber", filters: { ...DEFAULT_FILTERS, brightness: 95, saturation: 66, contrast: 88, sepia: 15 } },
  { id: "aden", name: "Aden", filters: { ...DEFAULT_FILTERS, brightness: 115, contrast: 90, saturation: 85, hueRotate: 20 } },
  { id: "perpetua", name: "Perpetua", filters: { ...DEFAULT_FILTERS, brightness: 105, saturation: 110, contrast: 105, hueRotate: 5 } },
  { id: "noir", name: "Noir", filters: { ...DEFAULT_FILTERS, grayscale: 100, contrast: 140, brightness: 95 } },
  { id: "vintage", name: "Vintage", filters: { ...DEFAULT_FILTERS, sepia: 40, contrast: 85, brightness: 105, saturation: 70 } },
  { id: "cyberpunk", name: "Cyberpunk", filters: { ...DEFAULT_FILTERS, contrast: 130, saturation: 150, hueRotate: 180, brightness: 110 } },
];

export function getCSSFilter(filters: FilterState): string {
  return [
    `brightness(${filters.brightness}%)`,
    `contrast(${filters.contrast}%)`,
    `saturate(${filters.saturation}%)`,
    `blur(${filters.blur}px)`,
    `grayscale(${filters.grayscale}%)`,
    `sepia(${filters.sepia}%)`,
    `hue-rotate(${filters.hueRotate}deg)`,
  ].join(" ");
}

export function applyFiltersToCanvas(
  sourceImage: HTMLImageElement,
  filters: FilterState,
  targetWidth?: number,
  targetHeight?: number
): HTMLCanvasElement {
  const w = targetWidth || sourceImage.naturalWidth;
  const h = targetHeight || sourceImage.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Apply CSS filters
  ctx.filter = getCSSFilter(filters);
  ctx.drawImage(sourceImage, 0, 0, w, h);
  ctx.filter = "none";

  // Apply RGB channel manipulation
  if (filters.redChannel !== 100 || filters.greenChannel !== 100 || filters.blueChannel !== 100) {
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;
    const rMul = filters.redChannel / 100;
    const gMul = filters.greenChannel / 100;
    const bMul = filters.blueChannel / 100;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] * rMul);
      d[i + 1] = Math.min(255, d[i + 1] * gMul);
      d[i + 2] = Math.min(255, d[i + 2] * bMul);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Apply sharpen
  if (filters.sharpen > 0) {
    applySharpen(ctx, w, h, filters.sharpen / 100);
  }

  // Apply edge detection
  if (filters.edgeDetection > 0) {
    applyEdgeDetection(ctx, w, h, filters.edgeDetection / 100);
  }

  return canvas;
}

function applySharpen(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const copy = new Uint8ClampedArray(d);
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            val += copy[((y + ky) * w + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        const idx = (y * w + x) * 4 + c;
        d[idx] = Math.min(255, Math.max(0, copy[idx] + (val - copy[idx]) * amount));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function applyEdgeDetection(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const copy = new Uint8ClampedArray(d);
  const kernel = [-1, -1, -1, -1, 8, -1, -1, -1, -1];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let val = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            val += copy[((y + ky) * w + (x + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
          }
        }
        const idx = (y * w + x) * 4 + c;
        d[idx] = Math.min(255, Math.max(0, copy[idx] * (1 - amount) + val * amount));
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

export function exportCanvas(
  canvas: HTMLCanvasElement,
  format: "png" | "jpeg" | "webp",
  quality: number = 0.92
): string {
  return canvas.toDataURL(`image/${format}`, quality);
}
