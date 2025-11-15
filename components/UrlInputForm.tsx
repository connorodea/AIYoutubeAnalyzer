import React, { useState } from 'react';
import { LoaderIcon } from './icons/LoaderIcon';

interface UrlInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const UrlInputForm: React.FC<UrlInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-4 sm:p-6 rounded-xl shadow-lg backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter YouTube Video URL..."
            className="w-full bg-slate-700/50 text-slate-200 border border-slate-600 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-cyan-600 hover:to-fuchsia-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderIcon />
              Analyzing...
            </>
          ) : (
            'Analyze Video'
          )}
        </button>
      </form>
    </div>
  );
};

export default UrlInputForm;