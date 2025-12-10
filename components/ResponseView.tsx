import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Pencil, Save, FileText, Download, FileType, CheckSquare, Send, Calendar } from 'lucide-react';
// @ts-ignore
import { jsPDF } from "jspdf";

interface ResponseViewProps {
  letter: string;
  onReset: () => void;
}

export const ResponseView: React.FC<ResponseViewProps> = ({ letter, onReset }) => {
  const [content, setContent] = useState(letter);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContent(letter);
  }, [letter]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Defense Letter</title></head>
      <body><pre style="font-family: 'Times New Roman', serif; font-size: 12pt; white-space: pre-wrap;">${content}</pre></body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Legal_Defense_Letter.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadText = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Legal_Defense_Letter.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });
    
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxLineWidth = pageWidth - (margin * 2);
    
    const splitText = doc.splitTextToSize(content, maxLineWidth);
    
    let currentHeight = 20;
    const lineHeight = 7;
    
    splitText.forEach((line: string) => {
      if (currentHeight + lineHeight > pageHeight - margin) {
        doc.addPage();
        currentHeight = 20;
      }
      doc.text(line, margin, currentHeight);
      currentHeight += lineHeight;
    });
    
    doc.save('Legal_Defense_Letter.pdf');
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Main Content Column */}
      <div className="lg:col-span-2">
        {/* Header / Toolbar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4 print:hidden">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Defense Draft</h2>
            <p className="text-slate-500">Review, edit, and download your response.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={onReset}
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors shadow-sm ${
                isEditing 
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Pencil className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Download Options Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-slate-200 shadow-sm print:hidden">
          <span className="text-sm font-semibold text-slate-500 ml-2 mr-2">Download:</span>
          <button onClick={handleDownloadPDF} className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 rounded-md transition-all">
            <FileType className="w-4 h-4 mr-2 text-red-600" /> PDF
          </button>
          <div className="w-px h-6 bg-slate-200"></div>
          <button onClick={handleDownloadWord} className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200 rounded-md transition-all">
            <FileText className="w-4 h-4 mr-2 text-blue-600" /> Word
          </button>
          <div className="w-px h-6 bg-slate-200"></div>
          <button onClick={handleDownloadText} className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-md transition-all">
            <Download className="w-4 h-4 mr-2 text-slate-600" /> Text
          </button>
          <div className="flex-grow"></div>
          <button onClick={handleCopy} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${copied ? 'text-green-600 bg-green-50' : 'text-slate-500 hover:bg-slate-100'}`}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Editor / Viewer */}
        <div className="relative">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[600px] p-8 md:p-12 rounded-xl shadow-lg border-2 border-blue-500 text-slate-800 leading-relaxed font-serif focus:outline-none focus:ring-4 focus:ring-blue-100 resize-y bg-white"
              spellCheck={false}
            />
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-slate-200 min-h-[600px] text-slate-800 leading-relaxed whitespace-pre-wrap font-serif">
              {content}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: Action Plan - Hidden on print */}
      <div className="lg:col-span-1 print:hidden">
        <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 sticky top-6">
          <div className="flex items-center space-x-2 mb-6">
            <CheckSquare className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold">Action Plan</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-slate-800 p-2 rounded-lg mr-4 mt-1">
                <Pencil className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-100">1. Fill Placeholders</h4>
                <p className="text-sm text-slate-400 mt-1">Replace [brackets] with your specific details (Account #, Dates).</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-slate-800 p-2 rounded-lg mr-4 mt-1">
                <Send className="w-4 h-4 text-green-300" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-100">2. Mail Certified</h4>
                <p className="text-sm text-slate-400 mt-1">Always use <strong>Certified Mail with Return Receipt</strong> so you have proof of delivery.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-slate-800 p-2 rounded-lg mr-4 mt-1">
                <Calendar className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-100">3. Set a Deadline</h4>
                <p className="text-sm text-slate-400 mt-1">If they don't respond within 30 days (for debt) or the statutory period, follow up.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
             <div className="p-4 bg-yellow-900/30 text-yellow-200 text-sm rounded-lg border border-yellow-800/50">
               <span className="font-bold mr-1">Reminder:</span> Do not sign anything that admits guilt. This letter is a request for validation.
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};