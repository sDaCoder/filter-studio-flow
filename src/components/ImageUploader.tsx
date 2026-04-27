import { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Camera, X, SwitchCamera, Grid3X3, ZoomIn } from "lucide-react";

interface Props {
  onImageLoad: (file: File) => void;
}

export function ImageUploader({ onImageLoad }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialPinchDistance = useRef<number | null>(null);
  const initialZoom = useRef(1);

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

  const startCamera = useCallback(async (facing: "environment" | "user" = facingMode) => {
    // Stop existing stream first
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setZoomLevel(1);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 50);
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraActive(false);
    setZoomLevel(1);
    setShowGrid(false);
  }, []);

  const toggleFacingMode = useCallback(() => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    startCamera(newMode);
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Apply zoom crop
    if (zoomLevel > 1) {
      const sw = video.videoWidth / zoomLevel;
      const sh = video.videoHeight / zoomLevel;
      const sx = (video.videoWidth - sw) / 2;
      const sy = (video.videoHeight - sh) / 2;
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(video, 0, 0);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
        stopCamera();
        onImageLoad(file);
      }
    }, "image/jpeg", 0.95);
  }, [onImageLoad, stopCamera, zoomLevel]);

  // Pinch-to-zoom handlers
  const getDistance = (touches: React.TouchList) => {
    const a = touches[0];
    const b = touches[1];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialPinchDistance.current = getDistance(e.touches);
      initialZoom.current = zoomLevel;
    }
  }, [zoomLevel]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance.current !== null) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialPinchDistance.current;
      const newZoom = Math.min(Math.max(initialZoom.current * scale, 1), 5);
      setZoomLevel(newZoom);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    initialPinchDistance.current = null;
  }, []);

  if (cameraActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-lg rounded-2xl overflow-hidden glass border border-foreground/10"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transition-transform duration-100 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Grid overlay */}
            <AnimatePresence>
              {showGrid && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Vertical lines */}
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                  {/* Horizontal lines */}
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Zoom indicator */}
          <AnimatePresence>
            {zoomLevel > 1 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1.5"
              >
                <ZoomIn className="w-3 h-3 text-white/80" />
                <span className="text-xs font-mono text-white/90">{zoomLevel.toFixed(1)}×</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top controls: grid & flip */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={() => setShowGrid(prev => !prev)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                showGrid
                  ? "bg-primary/80 text-primary-foreground"
                  : "bg-black/40 backdrop-blur-sm text-white/80 hover:text-white"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFacingMode}
              className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom controls: close & capture */}
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
        onClick={() => startCamera()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass glass-hover border border-foreground/10 text-sm font-medium text-foreground hover:scale-[1.02] transition-all"
      >
        <Camera className="w-4 h-4 text-primary" />
        Use Camera
      </motion.button>
    </div>
  );
}
