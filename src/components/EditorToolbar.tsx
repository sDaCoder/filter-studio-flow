import { Button } from "@/components/ui/button";
import { Undo2, Redo2, RotateCcw, Sun, Moon, PanelRight, PanelRightClose } from "lucide-react";
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
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function EditorToolbar({
  canUndo, canRedo, onUndo, onRedo, onReset,
  image, filters, fileName, isDark, onToggleTheme,
  showSidebarToggle, sidebarOpen, onToggleSidebar,
}: Props) {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-display font-bold text-foreground tracking-tight">
          Pixel<span className="text-primary">Lab</span>
        </h1>
        <div className="hidden sm:block w-px h-4 bg-border" />
        <span className="hidden sm:block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
          Darkroom
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo} className="gap-1 h-7 px-2 text-muted-foreground hover:text-foreground">
          <Undo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Undo</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo} className="gap-1 h-7 px-2 text-muted-foreground hover:text-foreground">
          <Redo2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Redo</span>
        </Button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1 h-7 px-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">Reset</span>
        </Button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-primary" onClick={onToggleTheme}>
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
        {showSidebarToggle && (
          <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-primary" onClick={onToggleSidebar}>
            {sidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRight className="w-3.5 h-3.5" />}
          </Button>
        )}
        {image && (
          <DownloadDialog image={image} filters={filters} fileName={fileName} />
        )}
      </div>
    </header>
  );
}
