import imageCompression from 'browser-image-compression';

export async function compressImage(file: File) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/png',
    initialQuality: 0.8,
    alwaysKeepResolution: true,
    preserveExif: true,
    onProgress: (progress: number) => {
      console.log('Compression progress:', progress);
    },
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log('Original file size:', file.size / 1024 / 1024, 'MB');
    console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

export async function getCompressedImageUrl(file: File): Promise<string> {
  const compressedFile = await compressImage(file);
  return URL.createObjectURL(compressedFile);
}