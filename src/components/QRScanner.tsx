import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onScan: (value: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);

  const startScanning = () => {
    setScanning(true);
    const scanner = new Html5QrcodeScanner('qr-reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    }, false);

    scanner.render(
      (decodedText) => {
        scanner.clear();
        setScanning(false);
        onScan(decodedText);
      },
      (error) => {
        console.warn(error);
      }
    );
  };

  return (
    <div className="mt-4">
      {!scanning ? (
        <button
          onClick={startScanning}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Scan QR Code
        </button>
      ) : (
        <div id="qr-reader" className="w-full max-w-sm mx-auto" />
      )}
    </div>
  );
}