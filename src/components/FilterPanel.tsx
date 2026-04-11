import { FilterState } from "@/lib/imageProcessor";
import { FilterSliderItem, FILTER_CONFIGS, RGB_CONFIGS } from "./FilterSlider";
import { PresetFilters } from "./PresetFilters";
import { Preset } from "@/lib/imageProcessor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sliders, Palette, Layers } from "lucide-react";

interface Props {
  filters: FilterState;
  imageSrc: string | null;
  customPresets: Preset[];
  onUpdateFilter: (key: keyof FilterState, value: number) => void;
  onCommit: () => void;
  onApplyPreset: (preset: Preset) => void;
  onSavePreset: (name: string) => void;
  onDeletePreset: (id: string) => void;
}

export function FilterPanel({
  filters, imageSrc, customPresets,
  onUpdateFilter, onCommit, onApplyPreset, onSavePreset, onDeletePreset,
}: Props) {
  return (
    <aside className="w-72 lg:w-80 border-l border-border bg-card flex flex-col">
      <Tabs defaultValue="adjust" className="flex flex-col flex-1">
        <TabsList className="grid grid-cols-3 mx-3 mt-3">
          <TabsTrigger value="adjust" className="gap-1 text-xs">
            <Sliders className="w-3.5 h-3.5" />
            Adjust
          </TabsTrigger>
          <TabsTrigger value="rgb" className="gap-1 text-xs">
            <Palette className="w-3.5 h-3.5" />
            RGB
          </TabsTrigger>
          <TabsTrigger value="presets" className="gap-1 text-xs">
            <Layers className="w-3.5 h-3.5" />
            Presets
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="adjust" className="p-4 space-y-5 mt-0">
            {FILTER_CONFIGS.map((config) => (
              <FilterSliderItem
                key={config.key}
                config={config}
                value={filters[config.key]}
                onChange={onUpdateFilter}
                onCommit={onCommit}
              />
            ))}
          </TabsContent>

          <TabsContent value="rgb" className="p-4 space-y-5 mt-0">
            {RGB_CONFIGS.map((config) => (
              <FilterSliderItem
                key={config.key}
                config={config}
                value={filters[config.key]}
                onChange={onUpdateFilter}
                onCommit={onCommit}
              />
            ))}
          </TabsContent>

          <TabsContent value="presets" className="p-4 mt-0">
            <PresetFilters
              imageSrc={imageSrc}
              onApply={onApplyPreset}
              customPresets={customPresets}
              onSave={onSavePreset}
              onDelete={onDeletePreset}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </aside>
  );
}
