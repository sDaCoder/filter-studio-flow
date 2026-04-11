import { Button } from "@/components/ui/button";
import { Undo2, Redo2, RotateCcw, Sun, Moon } from "lucide-react";
import { DownloadDialog } from "./DownloadDialog";
import { FilterState } from "@/lib/imageProcessor";

interface Props {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  image: HTMLImageElement | null;
  filters: FilterState;
  fileName: string;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function EditorToolbar({
  canUndo, canRedo, onUndo, onRedo, onReset,
  image, filters, fileName, isDark, onToggleTheme,
}: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-display font-bold text-foreground tracking-tight">
          Pixel<span className="text-primary">Lab</span>
        </h1>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="gap-1">
          <Undo2 className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Undo</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="gap-1">
          <Redo2 className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Redo</span>
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1">
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Reset</span>
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={onToggleTheme}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        {image && (
          <DownloadDialog image={image} filters={filters} fileName={fileName} />
        )}
      </div>
    </header>
  );
}
