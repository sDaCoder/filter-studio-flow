import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useImageEditor } from "@/hooks/useImageEditor";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageCanvas } from "@/components/ImageCanvas";
import { FilterPanel } from "@/components/FilterPanel";
import { EditorToolbar } from "@/components/EditorToolbar";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { PanelRight } from "lucide-react";
import { useGallery, getGalleryItem } from "@/hooks/useGallery";
import { applyFiltersToCanvas } from "@/lib/imageProcessor";
import { toast } from "sonner";

export default function Index() {
  const editor = useImageEditor();
  const isMobile = useIsMobile();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const handleSliderDragStart = useCallback(() => setIsDraggingSlider(true), []);
  const handleSliderDragEnd = useCallback(() => setIsDraggingSlider(false), []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) editor.redo();
        else editor.undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editor.undo, editor.redo]);

  const filterPanel = (
    <FilterPanel
      filters={editor.filters}
      imageSrc={editor.imageSrc}
      customPresets={editor.customPresets}
      onUpdateFilter={editor.updateFilter}
      onCommit={editor.commitFilter}
      onApplyPreset={editor.applyPreset}
      onSavePreset={editor.saveCustomPreset}
      onDeletePreset={editor.deleteCustomPreset}
      onDragStart={handleSliderDragStart}
      onDragEnd={handleSliderDragEnd}
    />
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <EditorToolbar
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          onUndo={editor.undo}
          onRedo={editor.redo}
          onReset={editor.resetFilters}
          image={editor.image}
          filters={editor.filters}
          fileName={editor.fileName}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          showSidebarToggle={!!editor.imageSrc}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewImage={editor.clearImage}
        />

        <div className="flex flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {editor.imageSrc ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-1 overflow-hidden"
              >
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ImageCanvas
                    imageSrc={editor.imageSrc}
                    filters={editor.filters}
                    compareMode={editor.compareMode}
                    onToggleCompare={() => editor.setCompareMode(!editor.compareMode)}
                  />
                </div>

                {/* Desktop: inline sidebar */}
                {!isMobile && (
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: isDraggingSlider ? 0.04 : 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden pointer-events-auto"
                        style={{ pointerEvents: isDraggingSlider ? 'auto' : undefined }}
                      >
                        {filterPanel}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="uploader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <ImageUploader onImageLoad={editor.loadImage} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile: floating sidebar toggle FAB */}
          {isMobile && editor.imageSrc && !sidebarOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSidebarOpen(true)}
              className="absolute top-12 right-3 z-30 w-9 h-9 rounded-full glass shadow-lg flex items-center justify-center text-foreground hover:text-primary active:scale-95 transition-transform mr-[2px] mt-[9px]"
              aria-label="Open filters"
            >
              <PanelRight className="w-4 h-4" />
            </motion.button>
          )}

          {/* Mobile: floating glass panel */}
          {isMobile && editor.imageSrc && (
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-[2px] z-40"
                    onClick={() => setSidebarOpen(false)}
                  />
                  <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: isDraggingSlider ? 0.04 : 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-2 right-2 z-50 max-h-[calc(100%-1rem)] w-72 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    {filterPanel}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
