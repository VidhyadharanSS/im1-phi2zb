import React from 'react';
import { Sliders, Palette, Droplet, Sun } from 'lucide-react';

interface FilterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  icon: React.ReactNode;
}

function FilterSlider({
  label,
  value,
  onChange,
  min,
  max,
  icon,
}: FilterSliderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <input
        type="range"
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
      />
    </div>
  );
}

interface AdvancedFiltersProps {
  filters: {
    vintage: number;
    dramatic: number;
    soft: number;
    vibrant: number;
  };
  onChange: (key: keyof typeof filters, value: number) => void;
}

export function AdvancedFilters({ filters, onChange }: AdvancedFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5" />
        Advanced Filters
      </h3>
      <FilterSlider
        label="Vintage"
        value={filters.vintage}
        onChange={(value) => onChange('vintage', value)}
        min={0}
        max={100}
        icon={<Sun className="w-4 h-4" />}
      />
      <FilterSlider
        label="Dramatic"
        value={filters.dramatic}
        onChange={(value) => onChange('dramatic', value)}
        min={0}
        max={100}
        icon={<Droplet className="w-4 h-4" />}
      />
      <FilterSlider
        label="Soft"
        value={filters.soft}
        onChange={(value) => onChange('soft', value)}
        min={0}
        max={100}
        icon={<Sliders className="w-4 h-4" />}
      />
      <FilterSlider
        label="Vibrant"
        value={filters.vibrant}
        onChange={(value) => onChange('vibrant', value)}
        min={0}
        max={100}
        icon={<Palette className="w-4 h-4" />}
      />
    </div>
  );
}
