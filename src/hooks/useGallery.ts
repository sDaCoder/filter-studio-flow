import { useCallback, useEffect, useState } from "react";

export interface GalleryItem {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: number;
  width: number;
  height: number;
}

const STORAGE_KEY = "pixellab.gallery";

function readStorage(): GalleryItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeStorage(items: GalleryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>(() => readStorage());

  // Sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addItem = useCallback((item: Omit<GalleryItem, "id" | "createdAt">) => {
    const next: GalleryItem = {
      ...item,
      id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    };
    setItems((prev) => {
      const updated = [next, ...prev];
      try {
        writeStorage(updated);
      } catch (err) {
        console.error("Gallery storage full", err);
        throw err;
      }
      return updated;
    });
    return next;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      writeStorage(updated);
      return updated;
    });
  }, []);

  const getItem = useCallback((id: string) => readStorage().find((i) => i.id === id), []);

  const clearAll = useCallback(() => {
    writeStorage([]);
    setItems([]);
  }, []);

  return { items, addItem, removeItem, getItem, clearAll };
}

export function getGalleryItem(id: string): GalleryItem | undefined {
  return readStorage().find((i) => i.id === id);
}
