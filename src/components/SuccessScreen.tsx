import React from 'react';
import {
  CheckCircle2,
  Award,
  Clock,
  User,
  Hash,
  FileCheck,
  Printer,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ExamSessionState } from '../types';
import { EXAM_METADATA } from '../data/examData';
import { formatHumanDateTime } from '../utils/formatters';

interface SuccessScreenProps {
  session: ExamSessionState;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ session }) => {
  const { student, submissionTime, timeUsed, objectiveScore, autoSubmitted } = session;

  const submissionDateFormatted = submissionTime ? formatHumanDateTime(submissionTime) : formatHumanDateTime(Date.now());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 print:p-0 print:m-0">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-orange-500 text-white shadow-md mb-2">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          DIGITAL SIGNS <span className="text-orange-600">|</span> <span className="text-blue-600">ACADEMY</span>
        </h1>
        <p className="text-sm font-semibold text-slate-600">
          {EXAM_METADATA.courseName} &bull; {EXAM_METADATA.examName}
        </p>
      </div>

      {/* Main Success Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden print:border-none print:shadow-none">
        {/* Banner */}
        <div className="bg-emerald-600 px-6 py-8 text-white text-center">
          <div className="inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-xs mb-3">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Exam Submitted Successfully!
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Your {EXAM_METADATA.courseName} &mdash; {EXAM_METADATA.examName} ({EXAM_METADATA.subtitle}) examination has been successfully submitted.
          </p>
          {autoSubmitted && (
            <span className="inline-block mt-3 px-3 py-1 rounded-md text-xs font-bold bg-white/25 text-white uppercase tracking-wider">
              Submission Mode: Automatic Timer Expiry
            </span>
          )}
        </div>

        {/* Receipt / Candidate Submission Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Official Submission Receipt
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Student Name</span>
                  <span className="font-bold text-slate-900">{student.fullName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <Hash className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Roll Number</span>
                  <span className="font-bold text-slate-900">{student.rollNumber}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Submission Timestamp</span>
                  <span className="font-semibold text-slate-900">{submissionDateFormatted}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Total Time Used</span>
                  <span className="font-semibold text-slate-900">{timeUsed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scoring Block */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exam Grading &amp; Score Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Objective Score Box */}
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-xs uppercase font-bold text-blue-800 tracking-wider block">
                  Objective Score (MCQs)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-blue-900 mt-1">
                  {objectiveScore} <span className="text-lg font-bold text-blue-600">/ 15</span>
                </div>
                <span className="text-xs text-blue-700 mt-1 block">
                  Automatically Graded &bull; Section A
                </span>
              </div>

              {/* Manual Evaluation Box */}
              <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-xs uppercase font-bold text-amber-800 tracking-wider block">
                  Subjective &amp; Practical
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1.5 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <span>Pending</span>
                </div>
                <span className="text-xs text-amber-700 mt-1 block">
                  35 Marks Under Manual Review
                </span>
              </div>
            </div>

            {/* Total Final Score Notice */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold block">
                  Total Final Score:
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-800">
                  Pending Manual Evaluation (Max 50 Marks)
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200">
                In Review
              </span>
            </div>

            {/* Instructor Review Explanation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Manual Evaluation Notice:</strong> Your short questions (15 marks), application questions (10 marks), and Canva practical task (10 marks) will be thoroughly reviewed by the course instructor. Final results will be notified via email or your academy batch group.
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Exam session completed. Answers cannot be edited.</span>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print / Save Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
