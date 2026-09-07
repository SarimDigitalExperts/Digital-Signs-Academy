import React, { useState } from 'react';
import {
  Clock,
  Award,
  HelpCircle,
  BookOpen,
  CheckSquare,
  ShieldCheck,
  Wifi,
  Save,
  ArrowRight,
  User,
  Mail,
  Phone,
  Hash,
  MapPin,
  RotateCcw,
} from 'lucide-react';
import { EXAM_METADATA } from '../data/examData';
import { StudentInfo } from '../types';

interface LandingScreenProps {
  initialStudent?: StudentInfo;
  hasSavedSession?: boolean;
  onStartExam: (student: StudentInfo) => void;
  onResumeExam?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  initialStudent,
  hasSavedSession = false,
  onStartExam,
  onResumeExam,
}) => {
  const [formData, setFormData] = useState<StudentInfo>(
    initialStudent || {
      fullName: '',
      email: '',
      phone: '',
      rollNumber: '',
      city: '',
      confirmed: false,
    }
  );

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isNameValid = formData.fullName.trim().length >= 2;
  const isPhoneValid = formData.phone.trim().length >= 7;
  const isRollValid = formData.rollNumber.trim().length >= 1;
  const isConfirmed = formData.confirmed;

  const isFormValid = isEmailValid && isNameValid && isPhoneValid && isRollValid && isConfirmed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onStartExam({
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      rollNumber: formData.rollNumber.trim(),
      city: formData.city?.trim() || '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Resume Active Session Alert if exists */}
      {hasSavedSession && onResumeExam && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
              <RotateCcw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 text-sm sm:text-base">
                In-Progress Examination Detected
              </h3>
              <p className="text-xs sm:text-sm text-blue-700">
                You have an active examination session saved on this device. You can resume your test with all your answers intact.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onResumeExam}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Resume Examination</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Welcome Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 sm:p-8 text-white border-b border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
              ONLINE EXAM PORTAL
            </span>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-orange-500 text-white uppercase tracking-wider">
              BATCH 02
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
            DIGITAL SIGNS <span className="text-orange-500 font-extrabold">|</span> ACADEMY
          </h1>

          <div className="mt-2 space-y-0.5">
            <h2 className="text-base sm:text-xl font-bold text-slate-200">
              {EXAM_METADATA.courseName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {EXAM_METADATA.examName} &bull; <span className="text-white font-semibold">{EXAM_METADATA.topic}</span>
            </p>
          </div>
        </div>

        {/* 4 Info Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Duration</span>
            <span className="text-base sm:text-lg font-bold text-slate-800">2 Hours</span>
            <span className="text-[11px] text-slate-400">120 Minutes</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Marks</span>
            <span className="text-base sm:text-lg font-bold text-slate-800">50 Marks</span>
            <span className="text-[11px] text-slate-400">15 MCQ + 35 Manual</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Questions</span>
            <span className="text-base sm:text-lg font-bold text-slate-800">22 Questions</span>
            <span className="text-[11px] text-slate-400">+ Practical Task</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Subject</span>
            <span className="text-base sm:text-lg font-bold text-slate-800">Vibe Coding</span>
            <span className="text-[11px] text-slate-400">All Chapters</span>
          </div>
        </div>

        {/* Helpful Candidate Notices */}
        <div className="px-5 sm:px-8 py-4 bg-amber-50/70 border-b border-amber-200/60 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs sm:text-sm text-amber-900">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Please make sure you have a stable internet connection before starting.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Save className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Your answers are saved automatically on this device.</span>
          </div>
        </div>

        {/* Student Information Form */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Student Identification Form</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Please enter your official enrollment details below. These will be securely recorded with your exam submission.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Student Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Student Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Enter your full legal name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    onBlur={() => handleBlur('fullName')}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white rounded-lg border text-sm transition-all outline-hidden ${
                      touched.fullName && !isNameValid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {touched.fullName && !isNameValid && (
                  <p className="text-xs text-red-600 mt-1">Please enter your full name.</p>
                )}
              </div>

              {/* Student Email */}
              <div>
                <label htmlFor="studentEmail" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Student Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="studentEmail"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white rounded-lg border text-sm transition-all outline-hidden ${
                      touched.email && !isEmailValid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {touched.email && !isEmailValid && (
                  <p className="text-xs text-red-600 mt-1">Please enter a valid email address.</p>
                )}
              </div>

              {/* WhatsApp / Phone Number */}
              <div>
                <label htmlFor="studentPhone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  WhatsApp / Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="studentPhone"
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white rounded-lg border text-sm transition-all outline-hidden ${
                      touched.phone && !isPhoneValid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {touched.phone && !isPhoneValid && (
                  <p className="text-xs text-red-600 mt-1">Please enter a valid phone number.</p>
                )}
              </div>

              {/* Roll Number / Student ID */}
              <div>
                <label htmlFor="rollNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Roll Number / Student ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    id="rollNumber"
                    type="text"
                    required
                    placeholder="e.g., VC-B02-045"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    onBlur={() => handleBlur('rollNumber')}
                    className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white rounded-lg border text-sm transition-all outline-hidden ${
                      touched.rollNumber && !isRollValid
                        ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }`}
                  />
                </div>
                {touched.rollNumber && !isRollValid && (
                  <p className="text-xs text-red-600 mt-1">Roll number or student ID is required.</p>
                )}
              </div>
            </div>

            {/* City (Optional) */}
            <div>
              <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / Location <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g., Lahore, Karachi, Islamabad"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 focus:bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm transition-all outline-hidden"
                />
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="pt-2">
              <label
                htmlFor="examConfirmation"
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 cursor-pointer select-none transition-colors"
              >
                <input
                  id="examConfirmation"
                  type="checkbox"
                  checked={formData.confirmed}
                  onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded-sm text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <span className="text-xs sm:text-sm text-slate-700 font-medium">
                  I confirm that the information provided above is correct and I am ready to begin the examination.
                </span>
              </label>
            </div>

            {/* Start Exam Button */}
            <div className="pt-4">
              <button
                id="btnStartExam"
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3.5 px-8 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 ${
                  isFormValid
                    ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer shadow-lg shadow-orange-500/20 active:scale-[0.99]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Start Examination Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!isFormValid && (
                <p className="text-center text-xs text-slate-400 mt-2">
                  Complete all required fields (*) and check the confirmation box to begin.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
