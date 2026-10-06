'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createWorker } from 'tesseract.js';
import { parseBusinessCard } from '@/lib/ocr/parser';
import { parseCardWithAI } from '@/app/actions/ocr';

export default function CardScannerPage() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState<string>('');
  const router = useRouter();

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setStatus('processing');
    
    const file = e.target.files[0];
    const imgUrl = URL.createObjectURL(file);
    
    // Helper to convert file to base64
    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

    try {
      setProgress('Analyzing with AI Vision Engine...');
      
      // Try Cloud AI (Gemini) first for 100% perfect accuracy
      let parsed: any = null;
      try {
        const base64 = await toBase64(file);
        parsed = await parseCardWithAI(base64, file.type);
      } catch (aiError: any) {
        // Fallback to local Tesseract if AI fails or no API key is set
        console.warn("AI parsing failed or key missing, falling back to local OCR", aiError);
        setProgress('AI key missing. Falling back to local OCR engine...');
        
        const worker = await createWorker('eng', 1, {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(`Reading text: ${Math.round(m.progress * 100)}%`);
            }
          }
        });
        await worker.setParameters({
          tessedit_pageseg_mode: 11 as any, // Sparse text mode
        });
        
        setProgress('Analyzing business card...');
        const { data: { text } } = await worker.recognize(imgUrl);
        await worker.terminate();
        
        setProgress('Parsing details...');
        parsed = parseBusinessCard(text);
      }
      
      setStatus('done');
      
      // Build query string
      const params = new URLSearchParams();
      if (parsed.firstName) params.append('fn', parsed.firstName);
      if (parsed.lastName) params.append('ln', parsed.lastName);
      if (parsed.company) params.append('company', parsed.company);
      if (parsed.jobTitle) params.append('title', parsed.jobTitle);
      if (parsed.email) params.append('email', parsed.email);
      if (parsed.phone) params.append('phone', parsed.phone);
      if (parsed.website) params.append('website', parsed.website);
      
      params.append('ocr', 'true');
      
      router.push(`/add/manual?${params.toString()}`);
      
    } catch (err) {
      console.error(err);
      alert('Failed to read business card. Please try again or add manually.');
      setStatus('idle');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-6 mt-6 h-full min-h-[80vh]">
      <h1 className="text-2xl font-bold text-gray-900">Scan Business Card</h1>
      
      {status === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 min-h-[400px] p-6 relative">
          <div className="text-5xl">📸</div>
          <p className="text-gray-500 text-center max-w-[250px]">Upload or take a photo of the business card</p>
          <div className="relative w-full">
            <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14">Open Camera</Button>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleCapture}
            />
          </div>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[400px]">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-900 font-medium animate-pulse">{progress}</p>
        </div>
      )}
    </div>
  );
}
