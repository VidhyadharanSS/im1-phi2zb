import React from 'react';
import { Sliders, Palette, Droplet, Sun, EyeOff, Edit } from 'lucide-react';

interface FilterPanelProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterPanel({
  activeFilter,
  onFilterChange,
}: FilterPanelProps) {
  const extendedFilters = [
    'none',
    'grayscale',
    'sepia',
    'invert',
    'blur',
    'vintage',
    'dramatic',
    'soft',
    'vibrant',
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <h3 className="font-medium mb-3 flex items-center gap-2 text-gray-800">
        <Sliders className="w-5 h-5" />
        Image Filters
      </h3>
      <div className="space-y-2">
        {extendedFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`block w-full text-left px-3 py-2 rounded transition-colors ${
              activeFilter === filter
                ? 'bg-blue-100 text-blue-800'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
