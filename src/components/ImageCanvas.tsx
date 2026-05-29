import { useMemo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { getCSSFilter, FilterState } from "@/lib/imageProcessor";
import { Eye, EyeOff, ImagePlus, Save, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  imageSrc: string;
  filters: FilterState;
  compareMode: boolean;
  onToggleCompare: () => void;
  onNewImage: () => void;
  onSaveToGallery: () => void;
}

export function ImageCanvas({ imageSrc, filters, compareMode, onToggleCompare, onNewImage, onSaveToGallery }: Props) {
  const [zoom, setZoom] = useState(1);
  const [splitPos, setSplitPos] = useState(50);
  const [isCompareDragging, setIsCompareDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const cssFilter = useMemo(() => getCSSFilter(filters), [filters]);

  const canPan = zoom > 1 && !compareMode;

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (compareMode) {
      setIsCompareDragging(true);
      return;
    }
    if (zoom > 1 && containerRef.current) {
      setIsPanning(true);
      panStart.current = {
        x: e.clientX,
        y: e.clientY,
        scrollLeft: containerRef.current.scrollLeft,
        scrollTop: containerRef.current.scrollTop,
      };
      e.preventDefault();
    }
  }, [compareMode, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (compareMode && isCompareDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.max(5, Math.min(95, x)));
      return;
    }
    if (isPanning && containerRef.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      containerRef.current.scrollLeft = panStart.current.scrollLeft - dx;
      containerRef.current.scrollTop = panStart.current.scrollTop - dy;
    }
  }, [compareMode, isCompareDragging, isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsCompareDragging(false);
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.01;
      setZoom(z => Math.min(4, Math.max(0.25, z + delta)));
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex-1 flex flex-col overflow-hidden"
    >
      {/* Sub-toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b glass">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleCompare}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium font-mono transition-all
              ${compareMode
                ? "bg-primary/90 text-primary-foreground shadow-sm"
                : "glass-subtle glass-hover text-foreground/70 hover:text-foreground"
              }`}
          >
            {compareMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {compareMode ? "Exit" : "Compare"}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
            className="p-1.5 rounded-xl glass-subtle glass-hover transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(4, z + 0.25))}
            className="p-1.5 rounded-xl glass-subtle glass-hover transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-auto p-4 bg-background/50 ${zoom <= 1 ? 'flex items-center justify-center' : ''}`}
        style={{ cursor: canPan ? (isPanning ? 'grabbing' : 'grab') : undefined }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative select-none inline-block"
          style={{
            minWidth: zoom > 1 ? `${zoom * 100}%` : undefined,
            minHeight: zoom > 1 ? `${zoom * 100}%` : undefined,
            display: zoom > 1 ? 'flex' : undefined,
            alignItems: zoom > 1 ? 'center' : undefined,
            justifyContent: zoom > 1 ? 'center' : undefined,
          }}
        >
          {compareMode ? (
            <div className="relative">
              <img src={imageSrc} alt="Original" className="rounded-xl" style={{ maxWidth: zoom <= 1 ? '100%' : 'none', maxHeight: zoom <= 1 ? '70vh' : 'none', width: zoom > 1 ? `${zoom * 100}%` : undefined, transition: 'width 0.3s ease, max-width 0.3s ease, max-height 0.3s ease' }} draggable={false} />
              <div
                className="absolute inset-0 overflow-hidden rounded-xl"
                style={{ width: `${splitPos}%` }}
              >
                <img
                  src={imageSrc}
                  alt="Filtered"
                  className="rounded-xl"
                  style={{ filter: cssFilter, maxHeight: zoom <= 1 ? '70vh' : 'none', width: zoom > 1 ? `${zoom * 100}%` : undefined, transition: 'width 0.3s ease, max-height 0.3s ease' }}
                  draggable={false}
                />
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary cursor-col-resize"
                style={{ left: `${splitPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg glow-amber-sm">
                  <div className="w-2.5 h-0.5 bg-primary-foreground rounded" />
                </div>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg glass text-[9px] font-mono font-medium text-foreground uppercase tracking-wider">
                Edited
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg glass text-[9px] font-mono font-medium text-foreground uppercase tracking-wider">
                Original
              </div>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt="Preview"
              className="rounded-xl shadow-2xl"
              style={{
                filter: cssFilter,
                maxWidth: zoom <= 1 ? '100%' : 'none',
                maxHeight: zoom <= 1 ? '70vh' : 'none',
                width: zoom > 1 ? `${zoom * 100}%` : undefined,
                transition: 'width 0.3s ease, max-width 0.3s ease, max-height 0.3s ease',
              }}
              draggable={false}
            />
          )}
        </div>
      </div>
      <div className="flex justify-center gap-3 px-4 pb-3 pt-1 -mt-3 bg-background/50 sm:-mt-2">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          onClick={onNewImage}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover border border-foreground/10 text-sm font-medium text-foreground hover:scale-[1.02] transition-all"
        >
          <ImagePlus className="w-4 h-4 text-primary" />
          New Image
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={onSaveToGallery}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover border border-foreground/10 text-sm font-medium text-foreground hover:scale-[1.02] transition-all"
        >
          <Save className="w-4 h-4 text-primary" />
          Save
        </motion.button>
      </div>
    </motion.div>
  );
}
