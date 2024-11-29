import React from 'react';
import { Clock, Undo } from 'lucide-react';

interface EditHistoryProps {
  history: {
    action: string;
    timestamp: Date;
    preview?: string;
  }[];
  onRevert: (index: number) => void;
}

export function EditHistory({ history, onRevert }: EditHistoryProps) {
  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Edit History
      </h3>
      <div className="space-y-4">
        {history.map((event, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{event.action}</span>
                <button
                  onClick={() => onRevert(index)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Undo className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-gray-500">
                {event.timestamp.toLocaleTimeString()}
              </span>
              {event.preview && (
                <img
                  src={event.preview}
                  alt={`Edit ${index + 1}`}
                  className="w-20 h-20 object-cover rounded mt-2"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
