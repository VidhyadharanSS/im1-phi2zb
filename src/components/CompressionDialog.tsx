import React, { useState } from 'react';
import { Minimize2, Settings } from 'lucide-react';
import { toast } from 'react-toastify';

interface CompressionDialogProps {
  onCompress: (options: CompressionOptions) => Promise<void>;
  onClose: () => void;
}

interface CompressionOptions {
  type: 'lossless' | 'custom';
  width?: number;
  height?: number;
  quality?: number;
}

export function CompressionDialog({
  onCompress,
  onClose,
}: CompressionDialogProps) {
  const [type, setType] = useState<'lossless' | 'custom'>('lossless');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [quality, setQuality] = useState(80);

  const handleCompress = async () => {
    try {
      await onCompress({
        type,
        width: type === 'custom' ? width : undefined,
        height: type === 'custom' ? height : undefined,
        quality: type === 'custom' ? quality : undefined,
      });
      onClose();
    } catch (error) {
      toast.error('Compression failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <div className="flex items-center gap-2 mb-4">
          <Minimize2 className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Compression Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Compression Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'lossless' | 'custom')}
              className="w-full p-2 border rounded"
            >
              <option value="lossless">Lossless</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {type === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality (%)
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{quality}%</div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCompress}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Compress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
