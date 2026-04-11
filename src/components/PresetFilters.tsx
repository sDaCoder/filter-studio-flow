import { motion } from "framer-motion";
import { Preset, BUILT_IN_PRESETS, getCSSFilter } from "@/lib/imageProcessor";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  imageSrc: string | null;
  onApply: (preset: Preset) => void;
  customPresets: Preset[];
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
}

export function PresetFilters({ imageSrc, onApply, customPresets, onSave, onDelete }: Props) {
  const [showSave, setShowSave] = useState(false);
  const [presetName, setPresetName] = useState("");

  const allPresets = [...BUILT_IN_PRESETS, ...customPresets];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Presets</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => setShowSave(!showSave)}
        >
          <Plus className="w-3 h-3 mr-1" />
          Save
        </Button>
      </div>

      {showSave && (
        <div className="flex gap-2">
          <Input
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            className="h-8 text-xs"
            disabled={!presetName.trim()}
            onClick={() => {
              onSave(presetName.trim());
              setPresetName("");
              setShowSave(false);
            }}
          >
            Save
          </Button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {allPresets.map((preset) => (
          <motion.button
            key={preset.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onApply(preset)}
            className="relative group rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
          >
            {imageSrc ? (
              <div className="aspect-square overflow-hidden">
                <img
                  src={imageSrc}
                  alt={preset.name}
                  className="w-full h-full object-cover"
                  style={{ filter: getCSSFilter(preset.filters) }}
                />
              </div>
            ) : (
              <div className="aspect-square bg-muted" />
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background/90 to-transparent p-1.5">
              <span className="text-[10px] font-medium text-foreground">{preset.name}</span>
            </div>
            {preset.custom && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(preset.id); }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-destructive/80"
              >
                <Trash2 className="w-3 h-3 text-destructive-foreground" />
              </button>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
