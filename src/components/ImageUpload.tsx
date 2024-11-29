import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { useImageStore } from '../store/useImageStore';
import { validateImage } from '../utils/validation';

export function ImageUpload() {
  const addImages = useImageStore((state) => state.addImages);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadProgress(0);

      const validFiles = acceptedFiles.filter((file) => {
        const validation = validateImage(file);
        if (!validation.isValid && validation.error) {
          toast.error(validation.error);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        return;
      }

      const newImages = validFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        tags: [],
        filters: {
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
          vintage: 0,
          dramatic: 0,
          soft: 0,
          vibrant: 0,
        },
      }));

      try {
        for (let i = 0; i < newImages.length; i++) {
          setUploadProgress(((i + 1) / newImages.length) * 100);
        }
        addImages(newImages);
        toast.success(`Successfully uploaded ${newImages.length} images`);
      } catch (error) {
        toast.error('Error uploading images. Please try again.');
        console.error('Upload error:', error);
      }
    },
    [addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center">Drag & Drop Images</h2>
      <p className="text-lg text-center">
        Upload images in various formats (.png, .jpg, .jpeg, .gif, .webp).
        Maximum size: 5MB per image.
      </p>
      <button
        {...getRootProps()}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg inline-flex items-center gap-3 transition-colors"
      >
        <input {...getInputProps()} />
        <Upload className="w-6 h-6" />
        Upload New Images
      </button>
      {isDragActive && (
        <p className="text-sm text-green-100 mt-2">
          Drop the images to upload them now!
        </p>
      )}
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full mt-2">
          <div
            className="bg-green-500 text-xs font-medium text-center p-0.5 leading-none rounded-full"
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}%
          </div>
        </div>
      )}
    </div>
  );
}