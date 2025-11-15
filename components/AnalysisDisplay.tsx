import React from 'react';
import { LoaderIcon } from './icons/LoaderIcon';

interface AnalysisDisplayProps {
  summary: string | null;
  isLoading: boolean;
}

const renderFormattedText = (text: string) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  return lines.map((line, index) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      const content = line.slice(2, -2);
      return (
        <h3 key={index} className="text-lg font-semibold text-cyan-400 mt-4 mb-2">
          {content}
        </h3>
      );
    }
    if (line.startsWith('- ')) {
      const content = line.slice(2);
      return (
        <li key={index} className="flex items-start gap-2">
          <span className="text-cyan-400 mt-1.5">&#8226;</span>
          <span>{content}</span>
        </li>
      );
    }
    return <p key={index} className="text-slate-300">{line}</p>;
  });
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center min-h-[250px]">
        <LoaderIcon />
        <p className="mt-4 text-slate-400 text-lg">Analyzing video content...</p>
        <p className="text-slate-500">This may take a moment.</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
        Video Analysis
      </h2>
      <div className="space-y-3 text-base leading-relaxed">
        {renderFormattedText(summary)}
      </div>
    </div>
  );
};

export default AnalysisDisplay;