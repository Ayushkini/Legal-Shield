import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white py-6 shadow-md print:hidden">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Legal Shield</h1>
            <p className="text-xs text-slate-400">Consumer Defense & Analysis Tool</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-sm font-medium bg-slate-800 px-3 py-1 rounded-full text-blue-200">
            AI-Powered Protection
          </span>
        </div>
      </div>
    </header>
  );
};