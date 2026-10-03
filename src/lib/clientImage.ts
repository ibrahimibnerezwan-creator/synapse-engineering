/** Resize phone photos before sending them through Vercel or storing inline. */
export async function prepareImage(file: File, mimeType = 'image/webp', maxBytes = 300_000): Promise<File> {
  if (!/^image\/(?:jpeg|png|webp|gif)$/.test(file.type)) throw new Error('Choose a JPEG, PNG, WebP or GIF photo.');
  if (file.size > 20_000_000) throw new Error('Choose a photo smaller than 20 MB.');
  const source = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const item = new Image();
      item.onload = () => resolve(item);
      item.onerror = () => reject(new Error('This photo could not be read. Convert it to JPEG or PNG first.'));
      item.src = source;
    });
    for (const max of [1400, 1100, 850, 600]) {
      const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Your browser could not prepare the photo.');
      if (mimeType === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mimeType, 0.82));
      if (blob && blob.size <= maxBytes) return new File([blob], file.name.replace(/\.[^.]+$/, '') + (blob.type === 'image/webp' ? '.webp' : '.jpg'), { type: blob.type });
    }
    throw new Error('This photo is still too large. Choose a smaller photo or crop it first.');
  } finally { URL.revokeObjectURL(source); }
}

export function inlineImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('Could not read the photo.'));
    reader.readAsDataURL(file);
  });
}
