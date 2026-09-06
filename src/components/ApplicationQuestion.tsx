import React from 'react';
import { ApplicationQuestionItem } from '../types';

interface ApplicationQuestionProps {
  question: ApplicationQuestionItem;
  answersMap?: Record<string, string>;
  onFieldChange: (fieldKey: string, value: string) => void;
}

export const ApplicationQuestion: React.FC<ApplicationQuestionProps> = ({
  question,
  answersMap = {},
  onFieldChange,
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

        {question.subtitle && (
          <p className="text-xs text-slate-500 font-medium">
            {question.subtitle}
          </p>
        )}
      </div>

      {/* Structured Subfields */}
      <div className="space-y-4 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
        {question.fields.map((field, index) => {
          const value = answersMap[field.key] || '';

          return (
            <div key={field.key} className="space-y-1.5">
              <label
                htmlFor={`app-${question.id}-${field.key}`}
                className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between"
              >
                <span>
                  <span className="text-blue-600 mr-1.5">{index + 1}.</span>
                  {field.label}
                </span>
                {value.trim().length > 0 && (
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                    Completed
                  </span>
                )}
              </label>

              <textarea
                id={`app-${question.id}-${field.key}`}
                rows={2}
                value={value}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full p-3.5 bg-white rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 text-sm outline-hidden transition-all placeholder:text-slate-400 shadow-2xs"
              />
            </div>
          );
        })}
      </div>

      <div className="text-[11px] text-slate-400 italic">
        Answers saved automatically to local device.
      </div>
    </div>
  );
};

