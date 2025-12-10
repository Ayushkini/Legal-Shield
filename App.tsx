import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { AnalysisView } from './components/AnalysisView';
import { ResponseView } from './components/ResponseView';
import { AnalysisResult, AppState, FileData, Tone } from './types';
import { analyzeLegalDocument, generateDefenseLetter } from './services/geminiService';
import { Loader2, FileText, AlertOctagon } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppState>('upload');
  const [file, setFile] = useState<FileData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [letter, setLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (uploadedFile: FileData) => {
    setFile(uploadedFile);
    setStatus('analyzing');
    setError(null);

    try {
      const result = await analyzeLegalDocument(uploadedFile.base64, uploadedFile.mimeType);
      setAnalysis(result);
      setStatus('review');
    } catch (err) {
      console.error(err);
      setError("We encountered an issue analyzing this document. Please ensure it's a clear legal letter and try again.");
      setStatus('upload');
      setFile(null);
    }
  };

  const handleGenerateDefense = async (tone: Tone, jurisdiction: string) => {
    if (!analysis) return;
    setStatus('generating');
    
    // Update jurisdiction in analysis state if user changed it
    const updatedAnalysis = { ...analysis, jurisdiction };
    
    try {
      const generatedLetter = await generateDefenseLetter(updatedAnalysis, tone);
      setLetter(generatedLetter);
      setStatus('complete');
    } catch (err) {
      console.error(err);
      setError("Failed to generate the response letter. Please try again.");
      setStatus('review');
    }
  };

  const handleReset = () => {
    setStatus('upload');
    setFile(null);
    setAnalysis(null);
    setLetter(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        
        {/* Progress Steps (Visual only) - Hidden on print */}
        <div className="max-w-2xl mx-auto mb-12 flex justify-center items-center space-x-4 text-sm font-medium print:hidden">
            <div className={`flex items-center ${status === 'upload' ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${status === 'upload' ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>1</span>
                Upload
            </div>
            <div className="w-8 h-px bg-slate-300"></div>
            <div className={`flex items-center ${['analyzing', 'review'].includes(status) ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${['analyzing', 'review'].includes(status) ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>2</span>
                Analyze
            </div>
             <div className="w-8 h-px bg-slate-300"></div>
            <div className={`flex items-center ${['generating', 'complete'].includes(status) ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 border ${['generating', 'complete'].includes(status) ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>3</span>
                Defend
            </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center shadow-sm print:hidden">
            <AlertOctagon className="w-5 h-5 mr-3" />
            {error}
          </div>
        )}

        {/* View Switching */}
        {status === 'upload' && (
          <div className="flex flex-col items-center animate-fade-in print:hidden">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
              Don't Let Them Intimidate You.
            </h2>
            <p className="text-lg text-slate-600 mb-10 text-center max-w-2xl">
              Upload your eviction notice, debt collection letter, or landlord demand. 
              Our AI will find the flaws in their case and write your defense.
            </p>
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse print:hidden">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
            <h3 className="text-xl font-semibold text-slate-800">Analyzing Document Structure...</h3>
            <p className="text-slate-500 mt-2">Identifying sender, demands, and logical inconsistencies.</p>
          </div>
        )}

        {status === 'review' && analysis && (
          <AnalysisView 
            analysis={analysis} 
            onGenerateDefense={handleGenerateDefense} 
            isGenerating={false} 
          />
        )}

        {status === 'generating' && analysis && (
           <div className="flex flex-col items-center justify-center py-20 animate-fade-in print:hidden">
             <div className="relative">
               <FileText className="w-16 h-16 text-slate-200" />
               <Loader2 className="w-8 h-8 text-blue-600 animate-spin absolute bottom-0 right-0 bg-white rounded-full p-1" />
             </div>
             <h3 className="text-xl font-semibold text-slate-800 mt-6">Drafting Your Defense Letter...</h3>
             <p className="text-slate-500 mt-2">Applying consumer protection principles to your case.</p>
           </div>
        )}

        {status === 'complete' && letter && (
          <ResponseView letter={letter} onReset={handleReset} />
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Legal Shield AI. Built for consumer empowerment.
        </div>
      </footer>
    </div>
  );
};

export default App;