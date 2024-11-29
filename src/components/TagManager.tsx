import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { X, GripVertical } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';
import Select from 'react-select';

const TAG_CATEGORIES = {
  Nature: ['landscape', 'wildlife', 'sunset', 'mountains', 'ocean'],
  People: ['portrait', 'group', 'candid', 'street', 'fashion'],
  Objects: ['architecture', 'food', 'technology', 'vehicles', 'art'],
};

export function TagManager({ imageId }: { imageId: string }) {
  const { images, addTag, removeTag, reorderTags } = useImageStore();
  const [newTag, setNewTag] = useState('');

  const image = images.find((img) => img.id === imageId);
  if (!image) return null;

  const tagOptions = Object.entries(TAG_CATEGORIES).flatMap(
    ([category, tags]) =>
      tags.map((tag) => ({
        value: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
        category,
      }))
  );

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTag(imageId, newTag.trim());
      setNewTag('');
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    reorderTags(imageId, result.source.index, result.destination.index);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <form onSubmit={handleAddTag} className="flex gap-2 mb-4">
        <Select
          options={tagOptions}
          value={null}
          onChange={(option) => {
            if (option) {
              addTag(imageId, option.value);
            }
          }}
          className="flex-1"
          placeholder="Add new tag..."
          isClearable
        />
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Or type custom tag..."
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tags">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-2"
            >
              {image.tags.map((tag, index) => (
                <Draggable key={tag} draggableId={tag} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full group"
                    >
                      <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                      {tag}
                      <button
                        onClick={() => removeTag(imageId, tag)}
                        className="p-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
