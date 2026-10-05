'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CardScannerPage() {
  const [status, setStatus] = useState<string>('idle');
  const router = useRouter();

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setStatus('processing');
    
    // Simulate OCR processing for now
    setTimeout(() => {
      setStatus('done');
      router.push('/add/manual?mock=true');
    }, 2000);
  };

  return (
    <div className="p-4 max-w-xl mx-auto flex flex-col gap-6 mt-6 h-full min-h-[80vh]">
      <h1 className="text-2xl font-bold text-gray-900">Scan Business Card</h1>
      
      {status === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 min-h-[400px]">
          <div className="text-5xl">📸</div>
          <p className="text-gray-500 text-center max-w-[250px]">Upload or take a photo of the business card</p>
          <div className="relative">
            <Button size="lg" className="w-full">Open Camera</Button>
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
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium animate-pulse">Reading card details...</p>
        </div>
      )}
    </div>
  );
}
