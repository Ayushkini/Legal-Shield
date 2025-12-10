import React, { useState } from 'react';
import { AlertTriangle, User, Scale, CheckCircle2, FileWarning, ArrowRight, MapPin, SlidersHorizontal } from 'lucide-react';
import { AnalysisResult, Tone } from '../types';

interface AnalysisViewProps {
  analysis: AnalysisResult;
  onGenerateDefense: (tone: Tone, jurisdiction: string) => void;
  isGenerating: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, onGenerateDefense, isGenerating }) => {
  const [tone, setTone] = useState<Tone>('Firm');
  const [jurisdiction, setJurisdiction] = useState(analysis.jurisdiction || 'Federal');

  const getThreatColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'immediate action required': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Document Analysis</h2>
        <p className="text-slate-500">Review findings and customize your defense strategy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sender Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-3 text-blue-600">
            <User className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sender</h3>
          </div>
          <p className="text-md font-medium text-slate-900">{analysis.sender}</p>
        </div>

        {/* Demand Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-3 text-indigo-600">
            <Scale className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Demand</h3>
          </div>
          <p className="text-md font-medium text-slate-900">{analysis.demand}</p>
        </div>

         {/* Jurisdiction Card */}
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-3 text-purple-600">
            <MapPin className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Jurisdiction</h3>
          </div>
           <input 
             type="text" 
             value={jurisdiction}
             onChange={(e) => setJurisdiction(e.target.value)}
             className="w-full text-md font-medium text-slate-900 bg-slate-50 border-b border-slate-300 focus:outline-none focus:border-purple-500 pb-1"
           />
        </div>

        {/* Threat Level Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-2 mb-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Threat</h3>
          </div>
          <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold border ${getThreatColor(analysis.threatLevel)}`}>
            {analysis.threatLevel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Flaws Section */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg border-l-4 border-blue-600 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileWarning className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Identified Defense Points</h3>
            </div>
            
            <div className="space-y-4">
              {analysis.flaws.map((flaw, idx) => (
                <div key={idx} className="flex items-start p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-slate-700">{flaw}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy Controls */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-slate-900">Response Strategy</h3>
            </div>
            
            <label className="block text-sm text-slate-600 mb-2">Select Tone:</label>
            <div className="space-y-2">
              {(['Diplomatic', 'Firm', 'Aggressive'] as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    tone === t 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onGenerateDefense(tone, jurisdiction)}
            disabled={isGenerating}
            className={`
              mt-6 w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-white shadow-lg transition-all
              ${isGenerating 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'}
            `}
          >
            <span>{isGenerating ? 'Drafting...' : 'Generate Letter'}</span>
            {!isGenerating && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};