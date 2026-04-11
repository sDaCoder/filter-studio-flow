import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getCSSFilter, FilterState } from "@/lib/imageProcessor";
import { Eye, EyeOff, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  imageSrc: string;
  filters: FilterState;
  compareMode: boolean;
  onToggleCompare: () => void;
}

export function ImageCanvas({ imageSrc, filters, compareMode, onToggleCompare }: Props) {
  const [zoom, setZoom] = useState(1);
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const cssFilter = useMemo(() => getCSSFilter(filters), [filters]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compareMode || !isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPos(Math.max(5, Math.min(95, x)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex-1 flex flex-col overflow-hidden"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompare}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium font-mono transition-colors
              ${compareMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            {compareMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {compareMode ? "Exit" : "Compare"}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
            className="p-1 rounded hover:bg-secondary transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(4, z + 0.25))}
            className="p-1 rounded hover:bg-secondary transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center p-4 surface-sunken grain-overlay"
        onMouseMove={handleMouseMove}
        onMouseDown={() => compareMode && setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div
          className="relative select-none"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.2s ease" }}
        >
          {compareMode ? (
            <div className="relative">
              <img src={imageSrc} alt="Original" className="max-w-full max-h-[70vh] rounded" draggable={false} />
              <div
                className="absolute inset-0 overflow-hidden rounded"
                style={{ width: `${splitPos}%` }}
              >
                <img
                  src={imageSrc}
                  alt="Filtered"
                  className="max-h-[70vh] rounded"
                  style={{ filter: cssFilter }}
                  draggable={false}
                />
              </div>
              {/* Amber divider */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary cursor-col-resize"
                style={{ left: `${splitPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg glow-amber-sm">
                  <div className="w-2.5 h-0.5 bg-primary-foreground rounded" />
                </div>
              </div>
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-background/70 backdrop-blur text-[9px] font-mono font-medium text-foreground uppercase tracking-wider">
                Edited
              </div>
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-background/70 backdrop-blur text-[9px] font-mono font-medium text-foreground uppercase tracking-wider">
                Original
              </div>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt="Preview"
              className="max-w-full max-h-[70vh] rounded shadow-lg"
              style={{ filter: cssFilter }}
              draggable={false}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
