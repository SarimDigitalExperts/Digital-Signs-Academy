import React from 'react';
import { ClipboardCheck, Sparkles } from 'lucide-react';
import { QuestionItem, ExamAnswers } from '../types';
import { isQuestionAnswered } from '../utils/formatters';

interface QuestionNavigatorProps {
  questions: QuestionItem[];
  currentIndex: number;
  answers: ExamAnswers;
  onSelectQuestion: (index: number) => void;
  onGoToReview: () => void;
  answeredCount?: number;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
  onGoToReview,
  answeredCount,
}) => {
  // Compute answered count if not provided
  const total = questions.length;
  const answered =
    answeredCount !== undefined
      ? answeredCount
      : questions.filter((q) => isQuestionAnswered(q, answers)).length;
  const percentage = Math.min(100, Math.round((answered / total) * 100));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
      {/* Sidebar Progress Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Exam Progress
          </h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {percentage}% Complete
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-300 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span>Answers saved automatically to local device</span>
        </p>
      </div>

      {/* Questions Palette List */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Questions List ({answered}/{total})
          </h4>
          <span className="text-[10px] text-slate-400 font-medium">Click to navigate</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = isQuestionAnswered(q, answers);
            const numFormatted = q.number < 10 ? `0${q.number}` : `${q.number}`;
            const isPractical = q.type === 'practical';

            let btnClasses =
              'aspect-square rounded-md border border-slate-200 bg-white text-slate-600 text-sm hover:border-blue-300 hover:text-blue-600';

            if (isCurrent) {
              btnClasses =
                'aspect-square rounded-md border-2 border-blue-600 bg-blue-50 text-blue-700 font-bold text-sm shadow-xs';
            } else if (isAnswered) {
              btnClasses =
                'aspect-square rounded-md bg-emerald-600 text-white font-bold text-sm shadow-xs hover:bg-emerald-700';
            }

            return (
              <button
                key={q.id}
                id={`nav-q-${q.id}`}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={`transition-all flex flex-col items-center justify-center select-none ${btnClasses}`}
                title={`Question ${q.number}: ${
                  isPractical ? 'Canva Practical Task' : q.type.toUpperCase()
                } (${isAnswered ? 'Answered' : 'Unanswered'})`}
              >
                {isPractical ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : (
                  <span>{numFormatted}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border-2 border-blue-600 bg-blue-50 inline-block" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border border-slate-200 bg-white inline-block" />
            <span>Unanswered</span>
          </div>
        </div>
      </div>

      {/* Review Button Footer */}
      <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 mt-auto">
        <button
          type="button"
          onClick={onGoToReview}
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>Review Answers</span>
        </button>
      </div>
    </div>
  );
};

