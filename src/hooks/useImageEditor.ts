import { useState, useCallback, useRef } from "react";
import { FilterState, DEFAULT_FILTERS, Preset } from "@/lib/imageProcessor";

interface HistoryEntry {
  filters: FilterState;
}

export function useImageEditor() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [history, setHistory] = useState<HistoryEntry[]>([{ filters: { ...DEFAULT_FILTERS } }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [compareMode, setCompareMode] = useState(false);
  const [customPresets, setCustomPresets] = useState<Preset[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("customPresets") || "[]");
    } catch { return []; }
  });

  const pushHistory = useCallback((newFilters: FilterState) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { filters: { ...newFilters } }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const updateFilter = useCallback((key: keyof FilterState, value: number) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      return next;
    });
  }, []);

  const commitFilter = useCallback(() => {
    pushHistory(filters);
  }, [filters, pushHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFilters({ ...history[newIndex].filters });
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFilters({ ...history[newIndex].filters });
    }
  }, [historyIndex, history]);

  const resetFilters = useCallback(() => {
    const reset = { ...DEFAULT_FILTERS };
    setFilters(reset);
    pushHistory(reset);
  }, [pushHistory]);

  const applyPreset = useCallback((preset: Preset) => {
    setFilters({ ...preset.filters });
    pushHistory(preset.filters);
  }, [pushHistory]);

  const saveCustomPreset = useCallback((name: string) => {
    const preset: Preset = {
      id: `custom-${Date.now()}`,
      name,
      filters: { ...filters },
      custom: true,
    };
    setCustomPresets(prev => {
      const next = [...prev, preset];
      localStorage.setItem("customPresets", JSON.stringify(next));
      return next;
    });
  }, [filters]);

  const deleteCustomPreset = useCallback((id: string) => {
    setCustomPresets(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem("customPresets", JSON.stringify(next));
      return next;
    });
  }, []);

  const loadImage = useCallback((file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setImageSrc(src);
        const reset = { ...DEFAULT_FILTERS };
        setFilters(reset);
        setHistory([{ filters: reset }]);
        setHistoryIndex(0);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
    setImageSrc(null);
    setFileName("");
    const reset = { ...DEFAULT_FILTERS };
    setFilters(reset);
    setHistory([{ filters: reset }]);
    setHistoryIndex(0);
    setCompareMode(false);
  }, []);

  return {
    image, imageSrc, fileName, filters, compareMode,
    customPresets, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1,
    updateFilter, commitFilter, undo, redo, resetFilters,
    applyPreset, saveCustomPreset, deleteCustomPreset,
    loadImage, clearImage, setCompareMode,
  };
}
