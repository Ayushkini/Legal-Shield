export interface AnalysisResult {
  sender: string;
  demand: string;
  jurisdiction: string; // New: E.g., "California", "New York", or "Federal"
  threatLevel: 'Low' | 'Medium' | 'High' | 'Immediate Action Required';
  flaws: string[];
}

export interface FileData {
  name: string;
  mimeType: string;
  base64: string; 
  previewUrl?: string;
}

export type Tone = 'Firm' | 'Diplomatic' | 'Aggressive';

export type AppState = 'upload' | 'analyzing' | 'review' | 'generating' | 'complete';