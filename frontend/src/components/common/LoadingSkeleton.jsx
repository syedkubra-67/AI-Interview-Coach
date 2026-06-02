import React from 'react';

const LoadingSkeleton = ({
  variant = 'card', // card, text, table, chart
  rows = 3,
  className = '',
}) => {
  const getSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className={`space-y-2 animate-pulse ${className}`}>
            <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded-md w-1/2"></div>
            <div className="h-4 bg-slate-800 rounded-md w-5/6"></div>
          </div>
        );
      case 'table':
        return (
          <div className={`space-y-4 animate-pulse ${className}`}>
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-slate-800 pb-3">
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        );
      case 'chart':
        return (
          <div className={`flex items-end justify-between h-48 gap-3 animate-pulse border-b border-slate-800 pb-2 ${className}`}>
            <div className="bg-slate-800 w-full h-1/3 rounded-t-md"></div>
            <div className="bg-slate-800 w-full h-2/3 rounded-t-md"></div>
            <div className="bg-slate-800 w-full h-1/2 rounded-t-md"></div>
            <div className="bg-slate-800 w-full h-5/6 rounded-t-md"></div>
            <div className="bg-slate-800 w-full h-1/4 rounded-t-md"></div>
          </div>
        );
      case 'card':
      default:
        return (
          <div className={`glass-panel p-6 rounded-2xl animate-pulse space-y-4 border border-slate-800 ${className}`}>
            <div className="flex justify-between items-center">
              <div className="h-5 bg-slate-800 rounded w-1/3"></div>
              <div className="h-8 bg-slate-800 rounded-full w-12"></div>
            </div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            <div className="flex gap-2 pt-2">
              <div className="h-8 bg-slate-800 rounded-lg w-20"></div>
              <div className="h-8 bg-slate-800 rounded-lg w-24"></div>
            </div>
          </div>
        );
    }
  };

  return getSkeleton();
};

export default LoadingSkeleton;
