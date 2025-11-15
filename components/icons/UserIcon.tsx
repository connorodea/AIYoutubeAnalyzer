import React from 'react';

export const UserIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-cyan-600 to-fuchsia-700 flex items-center justify-center shadow-inner">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  </div>
);