import { createWorker } from 'tesseract.js';

export async function recognizeText(imageUrl: string | Buffer): Promise<string> {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageUrl);
    return text;
  } finally {
    await worker.terminate();
  }
}
