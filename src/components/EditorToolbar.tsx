import { Button } from "@/components/ui/button";
import { Undo2, Redo2, RotateCcw, Sun, Moon, Images } from "lucide-react";
import { DownloadDialog } from "./DownloadDialog";
import { FilterState } from "@/lib/imageProcessor";
import { Link } from "react-router-dom";

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
    <header className="flex items-center justify-between px-2.5 py-2.5 border-b glass sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link to="/" aria-label="PixelLab Studio home" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <img src={isDark ? "/favicon-dark.svg" : "/favicon.svg"} alt="" className="h-7 w-7" />
          <h1 className="text-sm font-display font-bold tracking-tight sm:text-base">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Pixel</span>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Lab</span>
          </h1>
        </Link>
        <div className="hidden sm:block w-px h-4 bg-foreground/10" />
        <span className="hidden sm:block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Studio
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="gap-0.5 h-7 px-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/10 sm:gap-1 sm:px-2">
          <Undo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Undo</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="gap-0.5 h-7 px-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/10 sm:gap-1 sm:px-2">
          <Redo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Redo</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-0.5 h-7 px-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/10 sm:gap-1 sm:px-2">
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Reset</span>
        </Button>
        <div className="w-px h-4 bg-foreground/10 mx-0.5" />
        <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-primary rounded-xl hover:bg-white/10" onClick={onToggleTheme}>
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
        <Button asChild variant="ghost" size="sm" className="gap-0.5 h-7 px-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/10 sm:gap-1 sm:px-2">
          <Link to="/gallery">
            <Images className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Gallery</span>
          </Link>
        </Button>
        {image && (
          <>
            <div className="w-px h-4 bg-foreground/10 mx-0.5" />
            <DownloadDialog image={image} filters={filters} fileName={fileName} />
          </>
        )}
      </div>
    </header>
  );
}
