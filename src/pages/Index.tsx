import { useEffect, useState } from "react";
import { useImageEditor } from "@/hooks/useImageEditor";
import { ImageUploader } from "@/components/ImageUploader";
import { ImageCanvas } from "@/components/ImageCanvas";
import { FilterPanel } from "@/components/FilterPanel";
import { EditorToolbar } from "@/components/EditorToolbar";
import { AnimatePresence, motion } from "framer-motion";

export default function Index() {
  const editor = useImageEditor();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Keyboard shortcuts
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

  return (
    <div className="flex flex-col h-screen overflow-hidden grain-overlay">
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
      />

      <div className="flex flex-1 overflow-hidden">
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
              <FilterPanel
                filters={editor.filters}
                imageSrc={editor.imageSrc}
                customPresets={editor.customPresets}
                onUpdateFilter={editor.updateFilter}
                onCommit={editor.commitFilter}
                onApplyPreset={editor.applyPreset}
                onSavePreset={editor.saveCustomPreset}
                onDeletePreset={editor.deleteCustomPreset}
              />
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
      </div>
    </div>
  );
}
