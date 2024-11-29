import Fuse from 'fuse.js';
import { ImageFile } from '../types/image';

export function createFuzzySearch(images: ImageFile[]) {
  const fuse = new Fuse(images, {
    keys: ['tags'],
    threshold: 0.3,
    distance: 100,
  });

  return (query: string) => {
    if (!query) return images;
    return fuse.search(query).map((result) => result.item);
  };
}
