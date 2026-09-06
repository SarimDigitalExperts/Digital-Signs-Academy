import React from 'react';
import { MCQQuestionItem } from '../types';

interface McqQuestionProps {
  question: MCQQuestionItem;
  selectedOption?: string;
  onSelectOption: (optionId: string) => void;
}

export const McqQuestion: React.FC<McqQuestionProps> = ({
  question,
  selectedOption,
  onSelectOption,
}) => {
  const formattedNum = question.number < 10 ? `0${question.number}` : `${question.number}`;

  return (
    <div className="space-y-8">
      {/* Header & Prompt */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
            Question {formattedNum}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
          {question.prompt}
        </h2>
      </div>

      {/* Options List */}
      <div className="space-y-3" role="radiogroup" aria-labelledby={`q-${question.id}-label`}>
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;

          return (
            <label
              key={opt.id}
              id={`option-${question.id}-${opt.id}`}
              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all group select-none ${
                isSelected
                  ? 'border-2 border-blue-600 bg-blue-50 shadow-xs'
                  : 'border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={opt.id}
                checked={isSelected}
                onChange={() => onSelectOption(opt.id)}
                className="sr-only"
              />

              {/* Radio Indicator */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors border ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white group-hover:border-blue-400'
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>

              {/* Option Text with Option Key */}
              <span
                className={`ml-4 text-sm sm:text-base transition-colors ${
                  isSelected
                    ? 'text-blue-800 font-bold italic'
                    : 'text-slate-700 font-medium group-hover:text-blue-700'
                }`}
              >
                <span className="font-semibold uppercase mr-1">{opt.id}.</span> {opt.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

