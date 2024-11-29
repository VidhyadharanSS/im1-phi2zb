import { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { ImageFile } from '../types/image';

export function useImageEditor(selectedImage: ImageFile | undefined) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!canvasRef.current || !selectedImage) return;

    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
    });

    const canvas = fabricRef.current;

    fabric.Image.fromURL(selectedImage.preview, (img) => {
      img.scaleToWidth(800);
      canvas.add(img);
      canvas.centerObject(img);
      addToHistory();
    });

    return () => {
      canvas.dispose();
    };
  }, [selectedImage]);

  const addToHistory = () => {
    if (!fabricRef.current) return;
    const json = fabricRef.current.toJSON();
    setHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      JSON.stringify(json),
    ]);
    setHistoryIndex((prev) => prev + 1);
  };

  const undo = () => {
    if (historyIndex <= 0 || !fabricRef.current) return;
    const newIndex = historyIndex - 1;
    const canvas = fabricRef.current;
    canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
      setHistoryIndex(newIndex);
      canvas.renderAll();
    });
  };

  const redo = () => {
    if (historyIndex >= history.length - 1 || !fabricRef.current) return;
    const newIndex = historyIndex + 1;
    const canvas = fabricRef.current;
    canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
      setHistoryIndex(newIndex);
      canvas.renderAll();
    });
  };

  return {
    canvasRef,
    fabricRef,
    activeFilter,
    setActiveFilter,
    history,
    historyIndex,
    undo,
    redo,
    addToHistory,
  };
}
