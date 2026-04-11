import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";

interface Props {
  onImageLoad: (file: File) => void;
}

export function ImageUploader({ onImageLoad }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith("image/")) {
      onImageLoad(file);
    }
  }, [onImageLoad]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-8"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full max-w-lg aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group
          ${isDragging
            ? "border-primary bg-primary/5 glow-primary scale-[1.02]"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDragging ? "dragging" : "idle"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {isDragging ? (
                <ImageIcon className="w-8 h-8 text-primary" />
              ) : (
                <Upload className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                {isDragging ? "Drop your image here" : "Drop an image or click to upload"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports JPG, PNG, WebP
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </motion.div>
  );
}
