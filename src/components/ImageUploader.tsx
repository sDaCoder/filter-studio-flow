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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 grain-overlay">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full max-w-lg aspect-[4/3] rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer group px-[20px] py-0 pr-[20px] pb-0
            ${isDragging
              ? "border-primary bg-primary/5 glow-primary scale-[1.02]"
              : "border-border hover:border-primary/40"
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
              <motion.div
                className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {isDragging ? (
                  <ImageIcon className="w-7 h-7 text-primary" />
                ) : (
                  <Upload className="w-7 h-7 text-primary" />
                )}
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-base font-medium text-foreground">
                  {isDragging ? "Drop your image here" : "Drop an image or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                  JPG · PNG · WebP
                </p>
              </motion.div>
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
    </div>
  );
}
