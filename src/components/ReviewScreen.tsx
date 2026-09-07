import React from 'react';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Hash,
  Mail,
  Edit3,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { EXAM_QUESTIONS } from '../data/examData';
import { ExamAnswers, StudentInfo } from '../types';
import {
  formatHumanDateTime,
  formatTimerHms,
  getExamCompletionStats,
  isQuestionAnswered,
} from '../utils/formatters';

interface ReviewScreenProps {
  student: StudentInfo;
  startTime: number | null;
  secondsRemaining: number;
  answers: ExamAnswers;
  onReturnToExam: (targetQuestionIndex?: number) => void;
  onSubmitFinalExam: () => void;
  isSubmitting?: boolean;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  student,
  startTime,
  secondsRemaining,
  answers,
  onReturnToExam,
  onSubmitFinalExam,
  isSubmitting = false,
}) => {
  const stats = getExamCompletionStats(answers);
  const { formatted: timerFormatted } = formatTimerHms(secondsRemaining);

  const startFormatted = startTime ? formatHumanDateTime(startTime) : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Examination Review Screen
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your answered questions below before submitting your final exam.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onReturnToExam()}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Exam</span>
          </button>

          <button
            id="btnReviewSubmitExam"
            type="button"
            disabled={isSubmitting}
            onClick={onSubmitFinalExam}
            className="px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Submit Final Exam</span>
          </button>
        </div>
      </div>

      {/* Candidate & Session Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl shadow-slate-200/50">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          Candidate &amp; Examination Session Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <User className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Student Name</span>
              <span className="font-bold text-slate-900 truncate block">{student.fullName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <Mail className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email</span>
              <span className="font-medium text-slate-900 truncate block">{student.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <Hash className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Roll Number / ID</span>
              <span className="font-bold text-slate-900 truncate block">{student.rollNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <Clock className="w-5 h-5 text-orange-600 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Remaining Time</span>
              <span className="font-mono font-bold text-orange-600 block">{timerFormatted}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
          <span>
            Started on: <strong className="text-slate-700">{startFormatted}</strong>
          </span>
          <span>
            Phone: <strong className="text-slate-700">{student.phone}</strong>
          </span>
        </div>
      </div>

      {/* Answered / Unanswered Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Answered</span>
          <span className="text-2xl font-extrabold text-emerald-600">
            {stats.writtenAnswered} / {stats.writtenTotal}
          </span>
          <span className="text-[11px] text-slate-500">Written Questions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Unanswered</span>
          <span
            className={`text-2xl font-extrabold ${
              stats.unansweredWritten > 0 ? 'text-amber-600' : 'text-slate-400'
            }`}
          >
            {stats.unansweredWritten} / {stats.writtenTotal}
          </span>
          <span className="text-[11px] text-slate-500">
            {stats.unansweredWritten > 0 ? 'Pending answers' : 'All answered'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Section Breakdown</span>
          <div className="text-xs text-slate-700 mt-1 font-medium space-y-0.5">
            <div>MCQs: <strong className="text-slate-900">{stats.mcqAnswered} / {stats.mcqTotal}</strong></div>
            <div>Short: <strong className="text-slate-900">{stats.shortAnswered} / {stats.shortTotal}</strong></div>
            <div>App: <strong className="text-slate-900">{stats.applicationAnswered} / {stats.applicationTotal}</strong></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
          <span className="text-xs text-slate-400 uppercase font-semibold block">Practical Project</span>
          <div className="mt-1">
            {stats.practicalAnswered > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>URL Submitted</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>No URL</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-orange-600 font-bold block mt-1">100 Marks Task</span>
        </div>
      </div>

      {/* Unanswered Questions Warning Banner */}
      {stats.unansweredWritten > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h3 className="font-bold">You have {stats.unansweredWritten} unanswered question(s).</h3>
            <p className="text-amber-800 mt-0.5">
              Click any question item in the list below to return directly to it before submitting.
            </p>
          </div>
        </div>
      )}

      {/* Detailed Questions List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">
            Question Status &amp; Response Review
          </h2>
          <span className="text-xs text-slate-500">
            Click &ldquo;Edit / Review&rdquo; to jump to any item
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {EXAM_QUESTIONS.map((q, idx) => {
            const answered = isQuestionAnswered(q, answers);

            return (
              <div
                key={q.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors ${
                  !answered ? 'bg-amber-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      answered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {q.type === 'practical' ? 'P' : q.number}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-700">
                        {q.type === 'practical' ? 'Canva Practical Task' : `Question ${q.number}`}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({q.marks} {q.marks === 1 ? 'Mark' : 'Marks'})
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                        {q.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-900 truncate">
                      {q.prompt}
                    </p>

                    {/* Brief Preview of answer */}
                    <div className="mt-1 text-xs">
                      {q.type === 'mcq' && (
                        answers.mcq[q.id] ? (
                          <span className="text-emerald-700 font-medium">
                            Selected: Option {answers.mcq[q.id]}
                          </span>
                        ) : (
                          <span className="text-amber-700 italic">Not answered</span>
                        )
                      )}

                      {q.type === 'short' && (
                        answers.short[q.id] ? (
                          <span className="text-slate-600 line-clamp-1 italic">
                            &ldquo;{answers.short[q.id]}&rdquo;
                          </span>
                        ) : (
                          <span className="text-amber-700 italic">No answer written</span>
                        )
                      )}

                      {q.type === 'application' && (
                        answers.application[q.id] &&
                        Object.values(answers.application[q.id]).some((v) => typeof v === 'string' && v.trim().length > 0) ? (
                          <span className="text-emerald-700 font-medium">
                            Fields completed
                          </span>
                        ) : (
                          <span className="text-amber-700 italic">Fields pending</span>
                        )
                      )}

                      {q.type === 'practical' && (
                        answers.practical.canvaDesignLink ? (
                          <span className="text-blue-700 font-mono text-[11px] truncate block">
                            Live App: {answers.practical.canvaDesignLink}
                          </span>
                        ) : (
                          <span className="text-amber-700 italic">No Live App URL submitted</span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  {answered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Answered</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Unanswered</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => onReturnToExam(idx)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Jump to this question"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Submit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <button
          type="button"
          onClick={() => onReturnToExam()}
          className="w-full sm:w-auto px-5 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Exam</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmitFinalExam}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>Submit Final Examination</span>
        </button>
      </div>
    </div>
  );
};
