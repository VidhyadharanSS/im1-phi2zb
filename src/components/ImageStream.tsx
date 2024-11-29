import React, { useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Clock3 } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

export function ImageStream() {
  const { images, streamingState, setStreamingState } = useImageStore();
  const streamingImages = images.filter((img) => img.isStreaming);

  const nextImage = useCallback(() => {
    setStreamingState({
      currentIndex: (streamingState.currentIndex + 1) % streamingImages.length,
    });
  }, [streamingImages.length, streamingState.currentIndex]);

  const previousImage = () => {
    setStreamingState({
      currentIndex:
        streamingState.currentIndex === 0
          ? streamingImages.length - 1
          : streamingState.currentIndex - 1,
    });
  };

  useEffect(() => {
    let interval: number;
    if (streamingState.isPlaying && streamingImages.length > 0) {
      interval = setInterval(nextImage, streamingState.interval);
    }
    return () => clearInterval(interval);
  }, [
    streamingState.isPlaying,
    streamingState.interval,
    streamingImages.length,
  ]);

  if (streamingImages.length === 0) return null;

  const currentImage = streamingImages[streamingState.currentIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setStreamingState({ isPlaying: !streamingState.isPlaying })
            }
            className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            {streamingState.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={previousImage}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 mx-8">
          <img
            src={currentImage.preview}
            alt={currentImage.name}
            className="h-32 object-contain mx-auto"
          />
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="w-5 h-5 text-gray-500" />
          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={streamingState.interval}
            onChange={(e) =>
              setStreamingState({ interval: Number(e.target.value) })
            }
            className="w-32"
          />
          <span className="text-sm text-gray-600">
            {streamingState.interval / 1000}s
          </span>
        </div>
      </div>
    </div>
  );
}
