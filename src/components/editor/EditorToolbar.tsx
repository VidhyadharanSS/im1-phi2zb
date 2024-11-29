import React from 'react';
import {
  Pencil,
  Type,
  Square,
  Circle,
  Eraser,
  RotateCw,
  Undo,
  Redo,
} from 'lucide-react';

interface EditorToolbarProps {
  onDrawToggle: () => void;
  onAddText: () => void;
  onAddShape: (type: 'rect' | 'circle') => void;
  onSelectMode: () => void;
  onRotate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function EditorToolbar({
  onDrawToggle,
  onAddText,
  onAddShape,
  onSelectMode,
  onRotate,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: EditorToolbarProps) {
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onDrawToggle}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Draw"
      >
        <Pencil className="w-5 h-5" />
      </button>
      <button
        onClick={onAddText}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Add Text"
      >
        <Type className="w-5 h-5" />
      </button>
      <button
        onClick={() => onAddShape('rect')}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Add Rectangle"
      >
        <Square className="w-5 h-5" />
      </button>
      <button
        onClick={() => onAddShape('circle')}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Add Circle"
      >
        <Circle className="w-5 h-5" />
      </button>
      <button
        onClick={onSelectMode}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Select/Move"
      >
        <Eraser className="w-5 h-5" />
      </button>
      <button
        onClick={onRotate}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Rotate"
      >
        <RotateCw className="w-5 h-5" />
      </button>
      <button
        onClick={onUndo}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Undo"
        disabled={!canUndo}
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={onRedo}
        className="p-2 hover:bg-blue-100 rounded-lg tooltip"
        title="Redo"
        disabled={!canRedo}
      >
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
}
