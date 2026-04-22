import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string>('');
  const elementId = 'qr-reader';

  useEffect(() => {
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().catch(() => {});
        },
        undefined
      )
      .catch((err: unknown) => {
        setError(String(err));
      });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-sm rounded-xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">Quét mã QR CCCD</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {error ? (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            Không thể truy cập camera: {error}
          </div>
        ) : (
          <div id={elementId} className="overflow-hidden rounded-lg" />
        )}
        <p className="mt-3 text-center text-xs text-gray-500">
          Hướng camera vào mã QR trên CCCD để điền tự động
        </p>
      </div>
    </div>
  );
}
