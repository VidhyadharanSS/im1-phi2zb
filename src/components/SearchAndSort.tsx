import React from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

export function SearchAndSort() {
  const { editorState, setSearchQuery, setSortOrder, setSortBy } =
    useImageStore();
  const { searchQuery, sortOrder, sortBy } = editorState;

  return (
    <div className="flex gap-4 items-center">
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tags or images."
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="size">Size</option>
      </select>

      <button
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
      >
        {sortOrder === 'asc' ? (
          <SortAsc className="w-5 h-5" />
        ) : (
          <SortDesc className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
