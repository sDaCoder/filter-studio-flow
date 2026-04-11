import { Slider } from "@/components/ui/slider";
import { FilterState } from "@/lib/imageProcessor";

interface FilterConfig {
  key: keyof FilterState;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultVal: number;
}

export const FILTER_CONFIGS: FilterConfig[] = [
  { key: "brightness", label: "Brightness", min: 0, max: 200, step: 1, unit: "%", defaultVal: 100 },
  { key: "contrast", label: "Contrast", min: 0, max: 200, step: 1, unit: "%", defaultVal: 100 },
  { key: "saturation", label: "Saturation", min: 0, max: 200, step: 1, unit: "%", defaultVal: 100 },
  { key: "blur", label: "Blur", min: 0, max: 20, step: 0.1, unit: "px", defaultVal: 0 },
  { key: "grayscale", label: "Grayscale", min: 0, max: 100, step: 1, unit: "%", defaultVal: 0 },
  { key: "sepia", label: "Sepia", min: 0, max: 100, step: 1, unit: "%", defaultVal: 0 },
  { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, step: 1, unit: "°", defaultVal: 0 },
  { key: "sharpen", label: "Sharpen", min: 0, max: 100, step: 1, unit: "%", defaultVal: 0 },
  { key: "edgeDetection", label: "Edge Detect", min: 0, max: 100, step: 1, unit: "%", defaultVal: 0 },
];

export const RGB_CONFIGS: FilterConfig[] = [
  { key: "redChannel", label: "Red", min: 0, max: 200, step: 1, unit: "%", defaultVal: 100 },
  { key: "greenChannel", label: "Green", min: 0, max: 200, step: 1, unit: "%", defaultVal: 100 },
  { key: "blueChannel", label: "Blue", min: 0, max: 200, step: 1, unit: "%", defaultVal: 100 },
];

interface Props {
  config: FilterConfig;
  value: number;
  onChange: (key: keyof FilterState, value: number) => void;
  onCommit: () => void;
}

export function FilterSliderItem({ config, value, onChange, onCommit }: Props) {
  const isModified = value !== config.defaultVal;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {config.label}
        </label>
        <span className={`text-xs font-mono tabular-nums ${isModified ? "text-primary" : "text-muted-foreground"}`}>
          {Math.round(value * 10) / 10}{config.unit}
        </span>
      </div>
      <Slider
        min={config.min}
        max={config.max}
        step={config.step}
        value={[value]}
        onValueChange={([v]) => onChange(config.key, v)}
        onValueCommit={() => onCommit()}
        className="cursor-pointer"
      />
    </div>
  );
}
