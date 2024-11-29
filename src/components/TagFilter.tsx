import React from 'react';
import Select from 'react-select';
import { Tag } from 'lucide-react';

interface TagOption {
  value: string;
  label: string;
  category: string;
}

const TAG_CATEGORIES = {
  Nature: ['landscape', 'wildlife', 'sunset', 'mountains', 'ocean'],
  People: ['portrait', 'group', 'candid', 'street', 'fashion'],
  Objects: ['architecture', 'food', 'technology', 'vehicles', 'art'],
};

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
}

export function TagFilter({
  selectedTags,
  onTagsChange,
  availableTags,
}: TagFilterProps) {
  const options: TagOption[] = Object.entries(TAG_CATEGORIES).flatMap(
    ([category, tags]) =>
      tags.map((tag) => ({
        value: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
        category,
      }))
  );

  const groupedOptions = Object.keys(TAG_CATEGORIES).map((category) => ({
    label: category,
    options: options.filter((option) => option.category === category),
  }));

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Tag className="w-4 h-4" />
        Filter by Tags
      </label>
      <Select
        isMulti
        options={groupedOptions}
        value={options.filter((option) => selectedTags.includes(option.value))}
        onChange={(selected) => {
          onTagsChange((selected as TagOption[]).map((option) => option.value));
        }}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Select tags..."
      />
    </div>
  );
}
