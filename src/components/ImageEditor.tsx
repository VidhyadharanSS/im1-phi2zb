import React, { useEffect, useState } from 'react';
import { useImageStore } from '../store/useImageStore';
import {
  Save,
  X,
  ArrowLeft,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { EditorToolbar } from './editor/EditorToolbar';
import { FilterPanel } from './editor/FilterPanel';
import { AdvancedFilters } from './editor/AdvancedFilters';
import { EditHistory } from './editor/EditHistory';
import { useImageEditor } from '../hooks/useImageEditor';
import { fabric } from 'fabric';

export function ImageEditor() {
  const { images, editorState, updateImage, setEditorMode } = useImageStore();
  const selectedImage = images.find((img) => img.id === editorState.selectedId);

  const [editHistory, setEditHistory] = useState<
    {
      action: string;
      timestamp: Date;
      preview?: string;
    }[]
  >([]);

  const {
    canvasRef,
    fabricRef,
    activeFilter,
    setActiveFilter,
    historyIndex,
    history,
    undo,
    redo,
    addToHistory,
  } = useImageEditor(selectedImage);

  const [cropMode, setCropMode] = useState(false);
  const [filters, setFilters] = useState({
    vintage: 0,
    dramatic: 0,
    soft: 0,
    vibrant: 0,
  });

  useEffect(() => {
    if (!fabricRef.current || !selectedImage) return;

    // Set canvas dimensions to match image
    const img = fabricRef.current.getObjects()[0] as fabric.Image;
    if (img) {
      const scale = Math.min(800 / img.width!, 600 / img.height!);
      fabricRef.current.setDimensions({
        width: img.width! * scale,
        height: img.height! * scale,
      });
      img.scale(scale);
      fabricRef.current.renderAll();
    }
  }, [selectedImage]);

  const addToEditHistory = (action: string) => {
    const preview = fabricRef.current?.toDataURL();
    setEditHistory((prev) => [
      ...prev,
      {
        action,
        timestamp: new Date(),
        preview,
      },
    ]);
  };

  const handleCrop = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    if (!cropMode) {
      const cropRect = new fabric.Rect({
        width: canvas.width! * 0.8,
        height: canvas.height! * 0.8,
        left: canvas.width! * 0.1,
        top: canvas.height! * 0.1,
        fill: 'transparent',
        stroke: 'black',
        strokeDashArray: [5, 5],
        strokeWidth: 2,
        cornerColor: 'white',
        cornerStrokeColor: 'black',
        cornerSize: 10,
        transparentCorners: false,
      });
      canvas.add(cropRect);
      canvas.setActiveObject(cropRect);
    } else {
      const cropObj = canvas.getActiveObject();
      if (cropObj && cropObj.type === 'rect') {
        const img = canvas
          .getObjects()
          .find((obj) => obj instanceof fabric.Image) as fabric.Image;
        if (img) {
          const cropped = new fabric.Image(img.getElement(), {
            left: cropObj.left,
            top: cropObj.top,
            width: cropObj.width! * cropObj.scaleX!,
            height: cropObj.height! * cropObj.scaleY!,
          });
          canvas.remove(cropObj);
          canvas.remove(img);
          canvas.add(cropped);
          canvas.centerObject(cropped);
          addToEditHistory('Crop Image');
        }
      }
    }
    setCropMode(!cropMode);
  };

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (!fabricRef.current) return;
    const obj =
      fabricRef.current.getActiveObject() || fabricRef.current.getObjects()[0];
    if (!obj) return;

    if (direction === 'horizontal') {
      obj.set('flipX', !obj.flipX);
    } else {
      obj.set('flipY', !obj.flipY);
    }

    fabricRef.current.renderAll();
    addToEditHistory(`Flip ${direction}`);
  };

  const handleRotate = (clockwise: boolean) => {
    if (!fabricRef.current) return;
    const obj =
      fabricRef.current.getActiveObject() || fabricRef.current.getObjects()[0];
    if (!obj) return;

    obj.rotate((obj.angle || 0) + (clockwise ? 90 : -90));
    fabricRef.current.renderAll();
    addToEditHistory(`Rotate ${clockwise ? 'clockwise' : 'counterclockwise'}`);
  };

  const applyAdvancedFilter = (key: keyof typeof filters, value: number) => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const img = canvas
      .getObjects()
      .find((obj) => obj instanceof fabric.Image) as fabric.Image;
    if (!img) return;

    setFilters((prev) => ({ ...prev, [key]: value }));

    img.filters = [];

    // Apply vintage filter
    if (filters.vintage > 0) {
      img.filters.push(
        new fabric.Image.filters.Sepia(),
        new fabric.Image.filters.Contrast({ contrast: filters.vintage * 0.5 })
      );
    }

    // Apply dramatic filter
    if (filters.dramatic > 0) {
      img.filters.push(
        new fabric.Image.filters.Contrast({ contrast: filters.dramatic * 0.8 }),
        new fabric.Image.filters.Brightness({
          brightness: -filters.dramatic * 0.3,
        })
      );
    }

    // Apply soft filter
    if (filters.soft > 0) {
      img.filters.push(
        new fabric.Image.filters.Blur({ blur: filters.soft * 0.1 }),
        new fabric.Image.filters.Brightness({ brightness: filters.soft * 0.2 })
      );
    }

    // Apply vibrant filter
    if (filters.vibrant > 0) {
      img.filters.push(
        new fabric.Image.filters.Saturation({
          saturation: filters.vibrant * 2,
        }),
        new fabric.Image.filters.Contrast({ contrast: filters.vibrant * 0.3 })
      );
    }

    img.applyFilters();
    canvas.renderAll();
    addToEditHistory(`Apply ${key} filter`);
  };

  const handleRevertHistory = (index: number) => {
    if (!fabricRef.current || index >= history.length) return;
    fabricRef.current.loadFromJSON(JSON.parse(history[index]), () => {
      fabricRef.current?.renderAll();
    });
  };

  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[1200px] h-[800px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setEditorMode('view')}
              className="p-2 hover:bg-gray-100 rounded-full flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Gallery
            </button>
            <h2 className="text-xl font-semibold">Image Editor</h2>
          </div>
          <button
            onClick={() => setEditorMode('view')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-4 flex-1 overflow-hidden">
          <div className="flex flex-col gap-2">
            <EditorToolbar
              onDrawToggle={() =>
                fabricRef.current && (fabricRef.current.isDrawingMode = true)
              }
              onAddText={() => {
                /* Add text implementation */
              }}
              onAddShape={() => {
                /* Add shape implementation */
              }}
              onSelectMode={() =>
                fabricRef.current && (fabricRef.current.isDrawingMode = false)
              }
              onRotate={() => handleRotate(true)}
              onUndo={undo}
              onRedo={redo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
            />

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => handleFlip('horizontal')}
                className="p-2 hover:bg-blue-100 rounded-lg tooltip flex items-center gap-2"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFlip('vertical')}
                className="p-2 hover:bg-blue-100 rounded-lg tooltip flex items-center gap-2"
                title="Flip Vertical"
              >
                <FlipVertical className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRotate(true)}
                className="p-2 hover:bg-blue-100 rounded-lg tooltip flex items-center gap-2"
                title="Rotate Clockwise"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRotate(false)}
                className="p-2 hover:bg-blue-100 rounded-lg tooltip flex items-center gap-2"
                title="Rotate Counterclockwise"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleCrop}
                className={`p-2 hover:bg-blue-100 rounded-lg tooltip flex items-center gap-2 ${
                  cropMode ? 'bg-blue-100' : ''
                }`}
                title="Crop"
              >
                <Crop className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative border rounded-lg overflow-hidden bg-gray-50">
            <canvas ref={canvasRef} className="absolute inset-0" />
          </div>

          <div className="w-64 flex flex-col gap-4 overflow-y-auto">
            <FilterPanel
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            <AdvancedFilters filters={filters} onChange={applyAdvancedFilter} />

            <EditHistory history={editHistory} onRevert={handleRevertHistory} />

            <button
              onClick={() => {
                if (!fabricRef.current || !selectedImage) return;
                const dataUrl = fabricRef.current.toDataURL({
                  format: 'png',
                  quality: 1,
                });
                updateImage(selectedImage.id, { preview: dataUrl });
                toast.success('Image saved successfully!');
                setEditorMode('view');
              }}
              className="mt-auto flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
