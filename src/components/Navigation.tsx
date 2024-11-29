import React from 'react';
import { Image as ImageIcon, Edit, Grid } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

export function Navigation() {
  const { setEditorMode } = useImageStore();

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-5 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          ImagerML
        </h1>
        <div className="flex gap-8">
          <button
            onClick={() => setEditorMode('view')}
            className="flex items-center gap-3 text-lg hover:text-indigo-300 transition-colors"
          >
            Gallery View
          </button>
          <button
            onClick={() => setEditorMode('edit')}
            className="flex items-center gap-3 text-lg hover:text-indigo-300 transition-colors"
          >
            ImagerML Editor
          </button>
        </div>
      </div>
    </nav>
  );
}
