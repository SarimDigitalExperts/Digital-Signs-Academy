import React from 'react';
import { User } from 'lucide-react';
import { StudentInfo } from '../types';
import { EXAM_METADATA } from '../data/examData';

interface HeaderProps {
  student?: StudentInfo;
  showExamMeta?: boolean;
  savedIndicator?: boolean;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  showExamMeta = false,
  savedIndicator = false,
  children,
}) => {
  return (
    <nav className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs z-40 sticky top-0">
      {/* Brand & Portal Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs shrink-0">
          <span className="text-white font-black text-xl italic tracking-tighter">DS</span>
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold leading-none text-slate-800 uppercase tracking-tight">
            Digital Signs <span className="text-orange-500 font-extrabold">|</span> Academy
          </h1>
          <p className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase mt-0.5">
            {showExamMeta ? `${EXAM_METADATA.courseName} • ${EXAM_METADATA.examName}` : 'Professional Examination Portal'}
          </p>
        </div>
      </div>

      {/* Right Controls: Remaining Time, Divider, Candidate Info */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Autosave badge indicator if triggered */}
        {savedIndicator && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Saved</span>
          </div>
        )}

        {/* Timer slot (children) */}
        {children}

        {/* Candidate Profile Info */}
        {student && student.fullName && (
          <>
            <div className="hidden sm:block h-10 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden xs:block">
                <p className="text-sm font-bold text-slate-800 truncate max-w-[130px] sm:max-w-[180px]">
                  {student.fullName}
                </p>
                <p className="text-[10px] text-orange-600 font-medium tracking-tight uppercase">
                  Batch 02 • Roll #{student.rollNumber || 'Candidate'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

