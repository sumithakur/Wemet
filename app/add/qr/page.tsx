'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BrowserQRCodeReader } from '@zxing/browser';

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let controls: any = null;
    const codeReader = new BrowserQRCodeReader();

    if (videoRef.current && scanning) {
      codeReader.decodeFromVideoDevice(undefined, videoRef.current, (res, err) => {
        if (res) {
          setResult(res.getText());
          setScanning(false);
        }
        if (err && err.name === 'NotAllowedError') {
          setCameraError(true);
        }
      }).then((c) => {
        controls = c;
      }).catch((e) => {
        console.error(e);
        setCameraError(true);
      });
    }

    return () => {
      if (controls) {
        controls.stop();
      }
    };
  }, [scanning]);

  // Fallback for file upload if camera fails (e.g. non-HTTPS mobile)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const imgUrl = URL.createObjectURL(file);
    
    const codeReader = new BrowserQRCodeReader();
    try {
      const img = new Image();
      img.src = imgUrl;
      img.onload = async () => {
        try {
          const res = await codeReader.decodeFromImageElement(img);
          setResult(res.getText());
          setScanning(false);
        } catch (err) {
          alert('Could not detect QR code in this image.');
        }
      }
    } catch (err) {
      alert('Failed to read image.');
    }
  };

  const isUrl = result?.startsWith('http://') || result?.startsWith('https://');

  return (
    <div className="p-6 max-w-xl mx-auto flex flex-col gap-6 h-full min-h-[80vh]">
      <h1 className="text-2xl font-bold text-gray-900">Scan QR Code</h1>
      
      {!result ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-2xl overflow-hidden relative min-h-[400px]">
          {cameraError ? (
            <div className="text-center p-8 flex flex-col gap-4 text-white">
              <div className="text-4xl mb-2">📷🚫</div>
              <h2 className="font-semibold text-lg">Camera Unavailable</h2>
              <p className="text-sm text-gray-400">Mobile browsers block live cameras on local networks (HTTP). Please upload a photo instead.</p>
              
              <div className="relative mt-4">
                <Button variant="secondary" className="w-full">Upload QR Photo</Button>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          ) : (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-white/20 m-12 rounded-xl pointer-events-none"></div>
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red-500/50 shadow-[0_0_10px_red] animate-[scan_2s_ease-in-out_infinite] pointer-events-none"></div>
              <p className="absolute bottom-6 text-white text-sm bg-black/60 backdrop-blur px-4 py-2 rounded-full font-medium tracking-wide">Position QR in frame</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 mt-8">
          <div className="p-6 bg-gray-50 text-gray-900 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-sm tracking-wider uppercase text-gray-400 mb-4">Detected Payload</h3>
            <p className="break-all font-mono text-sm bg-white p-4 rounded-xl border border-gray-100">{result}</p>
          </div>
          
          {isUrl ? (
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => window.open(result, '_blank')} className="bg-blue-600 text-white hover:bg-blue-700 h-12 rounded-xl">
                Open Link
              </Button>
              <Button onClick={() => router.push(`/add/manual?qr=${encodeURIComponent(result)}`)} className="bg-gray-900 text-white h-12 rounded-xl hover:bg-gray-800">
                Save Contact
              </Button>
            </div>
          ) : (
            <Button onClick={() => router.push(`/add/manual?qr=${encodeURIComponent(result)}`)} className="bg-gray-900 text-white h-12 rounded-xl hover:bg-gray-800">
              Use this Contact
            </Button>
          )}
          
          <Button onClick={() => setScanning(true)} variant="outline" className="h-12 rounded-xl mt-2">Scan Another</Button>
        </div>
      )}
    </div>
  );
}
