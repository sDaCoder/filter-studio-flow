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
        <h3 className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-widest">Presets</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[11px] font-mono text-muted-foreground hover:text-primary rounded-lg hover:bg-white/10"
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
            className="h-7 text-xs font-mono glass-subtle rounded-lg border-0"
          />
          <Button
            size="sm"
            className="h-7 text-xs font-mono rounded-lg bg-primary/90 hover:bg-primary"
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

      <div className="grid grid-cols-3 gap-1.5">
        {allPresets.map((preset) => (
          <motion.button
            key={preset.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onApply(preset)}
            className="relative group rounded-xl overflow-hidden glass glass-hover transition-all hover:glass-glow"
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
              <div className="aspect-square bg-muted/30" />
            )}
            <div className="absolute bottom-0 inset-x-0 glass p-1 border-0 border-t">
              <span className="text-[9px] font-mono font-medium text-foreground">{preset.name}</span>
            </div>
            {preset.custom && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(preset.id); }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-lg bg-destructive/80"
              >
                <Trash2 className="w-2.5 h-2.5 text-destructive-foreground" />
              </button>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
