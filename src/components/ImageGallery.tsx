import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tag, Play, Minimize2, Edit2 } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';
import { getCompressedImageUrl } from '../utils/compression';
import { TagManager } from './TagManager';
import { ImageEditor } from './ImageEditor';
import { CompressionControls } from './CompressionControls';
import { toast } from 'react-toastify';

export function ImageGallery() {
  const {
    getFilteredAndSortedImages,
    editorState,
    setSelectedImage,
    setEditorMode,
    updateImage,
    toggleStreaming,
    toggleImageSelection,
    reorderImages,
  } = useImageStore();

  const images = getFilteredAndSortedImages();

  const handleCompress = async (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (!image) return;

    try {
      const compressedUrl = await getCompressedImageUrl(image.file);
      updateImage(imageId, { preview: compressedUrl });

      const beforeSize = (image.file.size / (1024 * 1024)).toFixed(2);
      const afterSize = (
        (await fetch(compressedUrl).then((r) => r.blob())).size /
        (1024 * 1024)
      ).toFixed(2);

      toast.success(
        `Image compressed successfully! Size reduced from ${beforeSize}MB to ${afterSize}MB`
      );
    } catch (error) {
      toast.error('Error compressing image');
      console.error('Error:', error);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderImages(result.source.index, result.destination.index);
  };

  if (images.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No images found. Upload some images to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="space-y-4"
                    >
                      <div className="relative group bg-pink-300 rounded-lg p-2 aspect-square">
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="checkbox"
                            checked={image.selected || false}
                            onChange={() => toggleImageSelection(image.id)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-full h-full object-cover rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedImage(image.id);
                            setEditorMode('edit');
                          }}
                        />
                        <div className="absolute bottom-4 left-2 right-2 flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedImage(image.id);
                              setEditorMode('tag');
                            }}
                            className="bg-blue-500 px-2 py-1 rounded text-white hover:bg-blue-600 transition-colors flex items-center gap-1 flex-1"
                            title="Add Tags"
                          >
                            <Tag className="w-3 h-3" />
                            <span className="text-xs font-medium">Tag</span>
                          </button>
                          <button
                            onClick={() => toggleStreaming(image.id)}
                            className={`px-2 py-1 rounded text-white transition-colors flex items-center gap-1 flex-1 ${
                              image.isStreaming
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                            title={
                              image.isStreaming
                                ? 'Stop Streaming'
                                : 'Start Streaming'
                            }
                          >
                            <Play className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              {image.isStreaming ? 'Stop' : 'Stream'}
                            </span>
                          </button>
                          <button
                            onClick={() => handleCompress(image.id)}
                            className="bg-blue-500 px-2 py-1 rounded text-white hover:bg-blue-600 transition-colors flex items-center gap-1 flex-1"
                            title="Compress Image"
                          >
                            <Minimize2 className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              Compress
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedImage(image.id);
                              setEditorMode('edit');
                            }}
                            className="bg-blue-500 px-2 py-1 rounded text-white hover:bg-blue-600 transition-colors flex items-center gap-1 flex-1"
                            title="Edit Image"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span className="text-xs font-medium">Edit</span>
                          </button>
                        </div>
                      </div>

                      {editorState.mode === 'tag' &&
                        editorState.selectedId === image.id && (
                          <TagManager imageId={image.id} />
                        )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {editorState.mode === 'edit' && editorState.selectedId && <ImageEditor />}
    </div>
  );
}
