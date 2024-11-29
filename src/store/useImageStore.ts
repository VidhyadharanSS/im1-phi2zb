import { create } from 'zustand';
import { ImageFile, EditorState, StreamingState } from '../types/image';
import { createFuzzySearch } from '../utils/fuzzySearch';

interface ImageStore {
  images: ImageFile[];
  editorState: EditorState;
  streamingState: StreamingState;
  addImages: (newImages: ImageFile[]) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setSelectedImage: (id: string | null) => void;
  setEditorMode: (mode: EditorState['mode']) => void;
  setTool: (tool: EditorState['tool']) => void;
  updateImage: (id: string, updates: Partial<ImageFile>) => void;
  addTag: (imageId: string, tag: string) => void;
  removeTag: (imageId: string, tag: string) => void;
  toggleStreaming: (imageId: string) => void;
  toggleImageSelection: (imageId: string) => void;
  setStreamingState: (updates: Partial<StreamingState>) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: EditorState['sortOrder']) => void;
  setSortBy: (by: EditorState['sortBy']) => void;
  getFilteredAndSortedImages: () => ImageFile[];
  getSelectedImages: () => ImageFile[];
  reorderImages: (sourceIndex: number, destinationIndex: number) => void;
  reorderTags: (
    imageId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
}

export const useImageStore = create<ImageStore>((set, get) => ({
  images: [],
  editorState: {
    selectedId: null,
    mode: 'view',
    tool: 'move',
    searchQuery: '',
    sortOrder: 'asc',
    sortBy: 'name',
    lastEdited: new Date().toISOString(),
  },
  streamingState: {
    isPlaying: false,
    interval: 2000,
    currentIndex: 0,
    loop: true,
    shuffle: false,
    transition: 'fade',
    volume: 100,
  },

  // ... rest of the store implementation remains the same ...

  getFilteredAndSortedImages: () => {
    const state = get();
    const { searchQuery, sortOrder, sortBy } = state.editorState;
    let filteredImages = state.images;

    if (searchQuery) {
      const fuzzySearch = createFuzzySearch(filteredImages);
      filteredImages = fuzzySearch(searchQuery);
    }

    return [...filteredImages].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.lastModified - b.lastModified;
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'lastEdited':
          comparison =
            new Date(a.lastEdited || 0).getTime() -
            new Date(b.lastEdited || 0).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  },

  reorderImages: (sourceIndex: number, destinationIndex: number) =>
    set((state) => {
      const newImages = [...state.images];
      const [removed] = newImages.splice(sourceIndex, 1);
      newImages.splice(destinationIndex, 0, removed);
      return { images: newImages };
    }),

  reorderTags: (
    imageId: string,
    sourceIndex: number,
    destinationIndex: number
  ) =>
    set((state) => {
      const newImages = state.images.map((img) => {
        if (img.id === imageId) {
          const newTags = [...img.tags];
          const [removed] = newTags.splice(sourceIndex, 1);
          newTags.splice(destinationIndex, 0, removed);
          return { ...img, tags: newTags };
        }
        return img;
      });
      return { images: newImages };
    }),
}));
