export const applyFilter = (
  canvas: HTMLCanvasElement,
  filter: string,
  value: number
): HTMLCanvasElement => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filter) {
    case 'brightness':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * (value / 100));
        data[i + 1] = Math.min(255, data[i + 1] * (value / 100));
        data[i + 2] = Math.min(255, data[i + 2] * (value / 100));
      }
      break;

    case 'contrast':
      const factor = (259 * (value + 255)) / (255 * (259 - value));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
      }
      break;

    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      break;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};