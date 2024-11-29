import React, { useState, useEffect } from 'react';
import { Minimize2, FileType, ArrowRight } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface CompressionControlsProps {
  file: File;
  onCompress: (compressedFile: File) => void;
}

export function CompressionControls({
  file,
  onCompress,
}: CompressionControlsProps) {
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [preview, setPreview] = useState({
    before: '0 MB',
    after: '0 MB',
  });

  useEffect(() => {
    setPreview((prev) => ({
      ...prev,
      before: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    }));
  }, [file]);

  const handleCompress = async () => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: `image/${format}`,
        initialQuality: quality,
      };

      const compressedFile = await imageCompression(file, options);
      setPreview((prev) => ({
        ...prev,
        after: `${(compressedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      }));
      onCompress(compressedFile);
    } catch (error) {
      console.error('Compression failed:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Minimize2 className="w-5 h-5" />
        Compression Settings
      </h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Quality</label>
        <input
          type="range"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          value={quality * 100}
          onChange={(e) => setQuality(Number(e.target.value) / 100)}
          min={10}
          max={100}
        />
        <div className="text-sm text-gray-500 mt-1">
          {Math.round(quality * 100)}%
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <FileType className="w-4 h-4" />
          Output Format
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
          className="w-full p-2 border rounded-md"
        >
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm">
        <div>
          <span className="font-medium">Before:</span> {preview.before}
        </div>
        <ArrowRight className="w-4 h-4" />
        <div>
          <span className="font-medium">After:</span> {preview.after}
        </div>
      </div>

      <button
        onClick={handleCompress}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Compress Image
      </button>
    </div>
  );
}
