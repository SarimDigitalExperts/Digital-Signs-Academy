import React from 'react';
import { QuestionItem } from '../types';

interface ProgressBarProps {
  currentQuestion: QuestionItem;
  currentIndex: number;
  totalQuestions: number; // usually 22
  answeredCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
  answeredCount,
}) => {
  const isPractical = currentQuestion.type === 'practical';
  const displayQuestionNum = isPractical ? 'Practical Task' : `Question ${currentQuestion.number} of ${totalQuestions}`;
  const percentage = Math.min(100, Math.round(((currentIndex + 1) / (totalQuestions + 1)) * 100));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm sm:text-base">
            {displayQuestionNum}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
          </span>
          {currentQuestion.type !== 'mcq' && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              Manual Evaluation
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            Progress: <strong className="text-slate-800">{answeredCount}</strong> answered
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-blue-600">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Track and fill bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate max-w-[280px] sm:max-w-md font-medium text-slate-700">
          {currentQuestion.sectionName}
        </span>
        <span className="font-mono text-slate-400">
          Item {currentIndex + 1} of {totalQuestions + 1}
        </span>
      </div>
    </div>
  );
};
