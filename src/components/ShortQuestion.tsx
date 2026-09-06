import React from 'react';
import { ShortQuestionItem } from '../types';

interface ShortQuestionProps {
  question: ShortQuestionItem;
  answerText?: string;
  onAnswerChange: (text: string) => void;
}

export const ShortQuestion: React.FC<ShortQuestionProps> = ({
  question,
  answerText = '',
  onAnswerChange,
}) => {
  const charCount = answerText.length;
  const wordCount = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;
  const formattedNum = question.number < 10 ? `0${question.number}` : `${question.number}`;

  return (
    <div className="space-y-8">
      {/* Header & Prompt */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
            Question {formattedNum}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase rounded border border-orange-200">
              Manual Evaluation
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {question.marks} Marks
            </span>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
          {question.prompt}
        </h2>

        {question.hint && (
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-700">Guideline:</strong> {question.hint}
          </p>
        )}
      </div>

      {/* Answer Area */}
      <div className="space-y-2">
        <label
          htmlFor={`short-answer-${question.id}`}
          className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
        >
          Candidate Written Response
        </label>
        <textarea
          id={`short-answer-${question.id}`}
          rows={6}
          value={answerText}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={question.placeholder || 'Write your detailed response here...'}
          className="w-full p-4 bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm sm:text-base leading-relaxed outline-hidden transition-all placeholder:text-slate-400 shadow-2xs"
        />

        {/* Counter and status */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
          <span>{wordCount} words &bull; {charCount} characters</span>
          {answerText.trim().length > 0 ? (
            <span className="text-emerald-600 font-medium">Answer saved automatically</span>
          ) : (
            <span className="italic text-[11px]">Saved automatically to device</span>
          )}
        </div>
      </div>
    </div>
  );
};

