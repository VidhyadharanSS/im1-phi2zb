import React from 'react';
import { Sliders, Palette, Droplet, Sun, EyeOff, Edit } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

interface FilterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  icon?: React.ElementType;
}

function FilterSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  icon: Icon,
}: FilterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-600" />}
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}

export function ImageFilters({ imageId }: { imageId: string }) {
  const { images, updateImage } = useImageStore();
  const image = images.find((img) => img.id === imageId);

  if (!image?.filters) return null;

  const updateFilter = (key: keyof typeof image.filters, value: number) => {
    updateImage(imageId, {
      filters: {
        ...image.filters,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-5 p-5 bg-white rounded-lg shadow-lg">
      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
        <Edit className="w-5 h-5 text-gray-600" />
        Image Adjustments
      </h3>

      <div className="space-y-4">
        <FilterSlider
          label="Brightness"
          value={image.filters.brightness}
          onChange={(value) => updateFilter('brightness', value)}
          min={0}
          max={200}
          step={5}
          icon={Sun}
        />
        <FilterSlider
          label="Contrast"
          value={image.filters.contrast}
          onChange={(value) => updateFilter('contrast', value)}
          min={0}
          max={200}
          step={5}
          icon={EyeOff}
        />
        <FilterSlider
          label="Saturation"
          value={image.filters.saturation}
          onChange={(value) => updateFilter('saturation', value)}
          min={0}
          max={200}
          step={5}
          icon={Droplet}
        />
        <FilterSlider
          label="Blur"
          value={image.filters.blur}
          onChange={(value) => updateFilter('blur', value)}
          min={0}
          max={10}
          step={1}
          icon={Palette}
        />
        <FilterSlider
          label="Vintage"
          value={image.filters.vintage}
          onChange={(value) => updateFilter('vintage', value)}
          min={0}
          max={200}
          step={5}
          icon={Droplet}
        />
        <FilterSlider
          label="Dramatic"
          value={image.filters.dramatic}
          onChange={(value) => updateFilter('dramatic', value)}
          min={0}
          max={200}
          step={5}
          icon={Droplet}
        />
        <FilterSlider
          label="Soft"
          value={image.filters.soft}
          onChange={(value) => updateFilter('soft', value)}
          min={0}
          max={200}
          step={5}
          icon={Droplet}
        />
        <FilterSlider
          label="Vibrant"
          value={image.filters.vibrant}
          onChange={(value) => updateFilter('vibrant', value)}
          min={0}
          max={200}
          step={5}
          icon={Droplet}
        />
      </div>
    </div>
  );
}
