export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  rotation?: number;
  scale?: { x: number; y: number };
  position?: { x: number; y: number };
  tags: string[];
  isStreaming?: boolean;
  selected?: boolean;
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
  };
}

export interface EditorState {
  selectedId: string | null;
  mode: 'view' | 'edit' | 'stream' | 'tag';
  tool: 'move' | 'crop' | 'rotate' | 'scale' | 'filter';
  searchQuery: string;
  sortOrder: 'asc' | 'desc';
  sortBy: 'name' | 'date' | 'size';
}

export interface StreamingState {
  isPlaying: boolean;
  interval: number;
  currentIndex: number;
  loop: boolean;
  shuffle: boolean;
}
