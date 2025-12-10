import React, { useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  onFileSelect: (file: FileData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size too large. Please upload a file smaller than 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 part
      const base64 = result.split(',')[1];
      
      onFileSelect({
        name: file.name,
        mimeType: file.type,
        base64: base64,
        previewUrl: file.type.startsWith('image/') ? result : undefined
      });
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400'}
        `}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-100'}`}>
            <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-blue-600' : 'text-slate-500'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Upload Legal Letter
            </h3>
            <p className="text-slate-500 mt-1">
              Drag & drop or click to upload PDF or Image
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-md">
            <FileText className="w-3 h-3" />
            <span>Secure Processing</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
