import React, { useRef } from 'react';
import QRCode from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import { X, Download } from 'lucide-react';

export default function QRCodeModal({ qrCode, onClose }) {
  const qrRef = useRef();

  const downloadPDF = () => {
    const element = qrRef.current;
    const options = {
      margin: 10,
      filename: `qrcode-${qrCode.codigo}.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* QR Code */}
        <div
          ref={qrRef}
          className="bg-white p-6 rounded-lg flex flex-col items-center justify-center mb-6"
        >
          <QRCode
            value={`https://bahiatrucks-davi.vercel.app/validar/${qrCode.codigo}`}
            size={300}
            level="H"
            includeMargin={true}
            fgColor="#5a9d7d"
            bgColor="#ffffff"
          />
          <p className="mt-4 text-center text-gray-600 font-mono text-sm">
            {qrCode.codigo}
          </p>
          <p className="mt-2 text-center text-gray-500 text-xs">
            Status: <span className="text-green-600 font-semibold">Disponível</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={downloadPDF}
            className="flex-1 bg-[#5a9d7d] hover:bg-[#4a8c6a] text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
