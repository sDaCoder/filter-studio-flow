import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download } from "lucide-react";
import { applyFiltersToCanvas, FilterState } from "@/lib/imageProcessor";

interface Props {
  image: HTMLImageElement | null;
  filters: FilterState;
  fileName: string;
}

const RESOLUTIONS = [
  { label: "Original", scale: 1 },
  { label: "2x", scale: 2 },
  { label: "0.5x", scale: 0.5 },
  { label: "0.25x", scale: 0.25 },
];

export function DownloadDialog({ image, filters, fileName }: Props) {
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [quality, setQuality] = useState(92);
  const [resScale, setResScale] = useState(1);

  const handleDownload = useCallback(() => {
    if (!image) return;
    const w = Math.round(image.naturalWidth * resScale);
    const h = Math.round(image.naturalHeight * resScale);
    const canvas = applyFiltersToCanvas(image, filters, w, h);
    const dataUrl = canvas.toDataURL(`image/${format}`, quality / 100);
    const a = document.createElement("a");
    const baseName = fileName.replace(/\.[^.]+$/, "");
    a.download = `${baseName}-edited.${format}`;
    a.href = dataUrl;
    a.click();
  }, [image, filters, format, quality, resScale, fileName]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 h-7 text-[11px] font-mono bg-primary text-primary-foreground hover:bg-primary/90">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">Export Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest">Format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as "png" | "jpeg" | "webp")}>
              <SelectTrigger className="font-mono text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (Lossless)</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {format !== "png" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest">Quality</label>
                <span className="text-[10px] font-mono text-muted-foreground">{quality}%</span>
              </div>
              <Slider min={10} max={100} step={1} value={[quality]} onValueChange={([v]) => setQuality(v)} />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest">Resolution</label>
            <Select value={String(resScale)} onValueChange={(v) => setResScale(Number(v))}>
              <SelectTrigger className="font-mono text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RESOLUTIONS.map(r => (
                  <SelectItem key={r.scale} value={String(r.scale)}>
                    {r.label} {image ? `(${Math.round(image.naturalWidth * r.scale)}×${Math.round(image.naturalHeight * r.scale)})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
