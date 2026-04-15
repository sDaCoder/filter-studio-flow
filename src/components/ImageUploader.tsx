import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Camera, X } from "lucide-react";

interface Props {
  onImageLoad: (file: File) => void;
}

export function ImageUploader({ onImageLoad }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 50);
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        stopCamera();
        onImageLoad(file);
      }
    }, "image/jpeg", 0.95);
  }, [onImageLoad, stopCamera]);

  if (cameraActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden glass border border-foreground/10"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full aspect-[4/3] object-cover bg-black"
          />
          <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-4 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <button
              onClick={stopCamera}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground hover:scale-105 transition-transform"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full border-4 border-primary bg-primary/20 hover:bg-primary/40 transition-all hover:scale-105 flex items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/80" />
            </button>
            <div className="w-10" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full max-w-lg aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group px-[20px] py-0
            ${isDragging
              ? "border-primary glass-glow scale-[1.02]"
              : "border-foreground/10 glass glass-hover"
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
                className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:scale-105 transition-transform"
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

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={startCamera}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover border border-foreground/10 text-sm font-medium text-foreground hover:scale-[1.02] transition-all"
      >
        <Camera className="w-4 h-4 text-primary" />
        Use Camera
      </motion.button>
    </div>
  );
}
