import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-12 sm:h-10 bg-white border-t border-slate-200 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between shrink-0 z-10 gap-1.5 sm:gap-0 select-none">
      <div className="text-[11px] font-bold text-slate-400 text-center sm:text-left">
        &copy; {new Date().getFullYear()} DIGITAL SIGNS | ACADEMY{' '}
        <span className="mx-1.5 text-slate-300">•</span>{' '}
        <span className="text-blue-600 uppercase tracking-widest">Learn • Create • Grow</span>
      </div>
      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Network Stable</span>
        </span>
        <span className="text-slate-300">•</span>
        <span>Secure Portal v2.4</span>
      </div>
    </footer>
  );
};

