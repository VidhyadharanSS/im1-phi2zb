import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
} from 'lucide-react';

interface StreamingControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  interval: number;
  onIntervalChange: (interval: number) => void;
  totalImages: number;
  currentIndex: number;
}

export function StreamingControls({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  interval,
  onIntervalChange,
  totalImages,
  currentIndex,
}: StreamingControlsProps) {
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(100);
  const [transition, setTransition] = useState('fade');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded ${
              isShuffle ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={onPrevious}
            className="p-2 rounded hover:bg-gray-100"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={onPlayPause}
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
          <button onClick={onNext} className="p-2 rounded hover:bg-gray-100">
            <SkipForward className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded ${
              isRepeat ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 mx-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {totalImages}
            </span>
            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${((currentIndex + 1) / totalImages) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-gray-500" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24"
            />
          </div>

          <select
            value={transition}
            onChange={(e) => setTransition(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="fade">Fade</option>
            <option value="slide">Slide</option>
            <option value="zoom">Zoom</option>
          </select>

          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={interval}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-600">{interval / 1000}s</span>
        </div>
      </div>
    </div>
  );
}
