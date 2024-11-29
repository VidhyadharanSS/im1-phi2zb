import React from 'react';
import { ImageUpload } from './components/ImageUpload';
import { ImageGallery } from './components/ImageGallery';
import { ImageStream } from './components/ImageStream';
import { Navigation } from './components/Navigation';
import { SearchAndSort } from './components/SearchAndSort';
import { useImageStore } from './store/useImageStore';
import { getCompressedImageUrl } from './utils/compression';
import { Minimize2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { getSelectedImages, updateImage } = useImageStore();

  const handleCompressAll = async () => {
    const selectedImages = getSelectedImages();
    if (selectedImages.length === 0) {
      toast.warning('Please select images to compress');
      return;
    }

    toast.info(`Compressing ${selectedImages.length} images...`);

    try {
      for (const image of selectedImages) {
        const compressedUrl = await getCompressedImageUrl(image.file);
        updateImage(image.id, { preview: compressedUrl });
      }
      toast.success('All selected images compressed successfully!');
    } catch (error) {
      toast.error('Error compressing images');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 pb-48">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-xl p-8 mb-8 shadow-lg">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              ImagerML is an all-in-one platform for image uploading, editing,
              tagging, compressing, streaming filtering, and management with
              real-time collaboration and easy saving.
            </p>
            <ImageUpload />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-purple-900">Gallery</h2>
            <SearchAndSort />
          </div>
          <ImageGallery />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={handleCompressAll}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-lg"
          >
            <Minimize2 className="w-5 h-5" />
            Compress Selected
          </button>
        </div>

        <ImageStream />
      </main>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;