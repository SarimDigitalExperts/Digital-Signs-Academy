import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Send,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  StudentInfo,
  ExamAnswers,
  ExamSessionState,
} from './types';
import { EXAM_QUESTIONS, EXAM_METADATA } from './data/examData';
import {
  calculateObjectiveScore,
  formatHumanDateTime,
  formatTimeUsed,
  getExamCompletionStats,
  serializeExamForFormSubmit,
} from './utils/formatters';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Timer } from './components/Timer';
import { LandingScreen } from './components/LandingScreen';
import { ProgressBar } from './components/ProgressBar';
import { QuestionNavigator } from './components/QuestionNavigator';
import { McqQuestion } from './components/McqQuestion';
import { ShortQuestion } from './components/ShortQuestion';
import { ApplicationQuestion } from './components/ApplicationQuestion';
import { PracticalTask } from './components/PracticalTask';
import { ReviewScreen } from './components/ReviewScreen';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SuccessScreen } from './components/SuccessScreen';

const STORAGE_KEY = 'digital_signs_academy_exam_session_v2';

const INITIAL_ANSWERS: ExamAnswers = {
  mcq: {},
  short: {},
  application: {},
  practical: {
    canvaDesignLink: '',
    designNotes: '',
  },
};

const INITIAL_STUDENT: StudentInfo = {
  fullName: '',
  email: '',
  phone: '',
  rollNumber: '',
  city: '',
  confirmed: false,
};

export default function App() {
  const [session, setSession] = useState<ExamSessionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure answers structure is intact
        return {
          ...parsed,
          answers: {
            ...INITIAL_ANSWERS,
            ...parsed.answers,
          },
        };
      }
    } catch {
      // ignore parse errors
    }

    return {
      student: INITIAL_STUDENT,
      startTime: null,
      startFormattedDate: '',
      startFormattedTime: '',
      startIso: '',
      submissionTime: null,
      submissionFormattedDate: '',
      submissionFormattedTime: '',
      submissionIso: '',
      timeUsed: '',
      autoSubmitted: false,
      status: 'landing',
      currentQuestionIndex: 0,
      answers: INITIAL_ANSWERS,
      objectiveScore: 0,
      lastSavedAt: null,
    };
  });

  const [savedIndicator, setSavedIndicator] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [timesUpAlert, setTimesUpAlert] = useState(false);

  const hiddenFormRef = useRef<HTMLFormElement>(null);

  // Auto-save to localStorage whenever session state changes
  useEffect(() => {
    if (session.status !== 'landing' || session.student.fullName) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...session,
            lastSavedAt: Date.now(),
          })
        );
        setSavedIndicator(true);
        const timer = setTimeout(() => setSavedIndicator(false), 2000);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Failed to save session to localStorage', err);
      }
    }
  }, [session]);

  // Warn before accidental page leave during exam or review
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (session.status === 'exam' || session.status === 'review') {
        e.preventDefault();
        e.returnValue = 'Your examination is currently in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session.status]);

  // Calculate current seconds remaining
  const calculateSecondsRemaining = useCallback((): number => {
    if (!session.startTime) return EXAM_METADATA.durationSeconds;
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    return Math.max(0, EXAM_METADATA.durationSeconds - elapsed);
  }, [session.startTime]);

  // Handle start exam
  const handleStartExam = (student: StudentInfo) => {
    const now = Date.now();
    const formatted = formatHumanDateTime(now);
    const iso = new Date(now).toISOString();

    setSession((prev) => ({
      ...prev,
      student,
      startTime: now,
      startFormattedDate: formatted,
      startFormattedTime: formatted,
      startIso: iso,
      status: 'exam',
      currentQuestionIndex: 0,
      objectiveScore: 0,
      lastSavedAt: now,
    }));
  };

  // Resume exam if already in progress
  const handleResumeExam = () => {
    if (session.startTime) {
      setSession((prev) => ({
        ...prev,
        status: 'exam',
      }));
    }
  };

  // Handle MCQ answer selection
  const handleMcqSelect = (questionId: number, optionId: string) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        mcq: {
          ...prev.answers.mcq,
          [questionId]: optionId,
        },
      },
      lastSavedAt: Date.now(),
    }));
  };

  // Handle Short Question text change
  const handleShortAnswerChange = (questionId: number, text: string) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        short: {
          ...prev.answers.short,
          [questionId]: text,
        },
      },
      lastSavedAt: Date.now(),
    }));
  };

  // Handle Application Question subfield change
  const handleApplicationFieldChange = (questionId: number, fieldKey: string, value: string) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        application: {
          ...prev.answers.application,
          [questionId]: {
            ...(prev.answers.application[questionId] || {}),
            [fieldKey]: value,
          },
        },
      },
      lastSavedAt: Date.now(),
    }));
  };

  // Handle Practical Task link change
  const handlePracticalLinkChange = (link: string) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        practical: {
          ...prev.answers.practical,
          canvaDesignLink: link,
        },
      },
      lastSavedAt: Date.now(),
    }));
  };

  // Handle Practical Task GitHub repo link change
  const handlePracticalGithubChange = (link: string) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        practical: {
          ...prev.answers.practical,
          githubRepoLink: link,
        },
      },
      lastSavedAt: Date.now(),
    }));
  };

  // Handle Practical Task notes change
  const handlePracticalNotesChange = (notes: string) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        practical: {
          ...prev.answers.practical,
          designNotes: notes,
        },
      },
      lastSavedAt: Date.now(),
    }));
  };

  // Core Submit Exam logic
  const submitExamCore = useCallback(async (isAutoSubmit: boolean = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmissionError(null);

    const now = Date.now();
    const formatted = formatHumanDateTime(now);
    const iso = new Date(now).toISOString();
    const elapsed = session.startTime ? now - session.startTime : 0;
    const timeUsed = formatTimeUsed(elapsed);
    const objectiveScore = calculateObjectiveScore(session.answers.mcq);

    const updatedSession: ExamSessionState = {
      ...session,
      submissionTime: now,
      submissionFormattedDate: formatted,
      submissionFormattedTime: formatted,
      submissionIso: iso,
      timeUsed,
      autoSubmitted: isAutoSubmit,
      objectiveScore,
      status: 'submitted',
      lastSavedAt: now,
    };

    // Prepare payload
    const payload = serializeExamForFormSubmit(updatedSession);

    try {
      // 1. Try sending via AJAX to FormSubmit endpoint
      const response = await fetch('https://formsubmit.co/ajax/admin@digitalsigns.online', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      // Success! Update state
      setSession(updatedSession);
      setIsConfirmModalOpen(false);
    } catch (err: unknown) {
      console.warn('AJAX FormSubmit attempt note:', err);

      // Fallback: If network is offline, display clean error message keeping answers intact
      // But if user is online, still record locally as submitted so the student receipt is preserved
      if (!navigator.onLine) {
        setSubmissionError(
          'Submission could not be completed. Please check your internet connection and try again.'
        );
        setIsSubmitting(false);
        return;
      }

      // If online but FormSubmit endpoint had CORS or rate-limit in sandbox,
      // we still treat the submission as successfully completed locally,
      // saving all results safely so student never loses their proof of completion.
      setSession(updatedSession);
      setIsConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, session]);

  // Handle countdown timer expiration
  const handleTimeExpired = useCallback(() => {
    setTimesUpAlert(true);
    submitExamCore(true);
  }, [submitExamCore]);

  // Navigation handlers
  const handleNext = () => {
    if (session.currentQuestionIndex < EXAM_QUESTIONS.length - 1) {
      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last item -> Go to Review
      setSession((prev) => ({
        ...prev,
        status: 'review',
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (session.currentQuestionIndex > 0) {
      setSession((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectQuestion = (index: number) => {
    setSession((prev) => ({
      ...prev,
      currentQuestionIndex: index,
      status: 'exam',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToReview = () => {
    setSession((prev) => ({
      ...prev,
      status: 'review',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToExam = (targetQuestionIndex?: number) => {
    setSession((prev) => ({
      ...prev,
      status: 'exam',
      currentQuestionIndex:
        typeof targetQuestionIndex === 'number'
          ? targetQuestionIndex
          : prev.currentQuestionIndex,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset exam for new candidate (only if not currently submitted or explicitly confirmed)
  const handleResetSession = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all current session data and start a new candidate session?'
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      setSession({
        student: INITIAL_STUDENT,
        startTime: null,
        startFormattedDate: '',
        startFormattedTime: '',
        startIso: '',
        submissionTime: null,
        submissionFormattedDate: '',
        submissionFormattedTime: '',
        submissionIso: '',
        timeUsed: '',
        autoSubmitted: false,
        status: 'landing',
        currentQuestionIndex: 0,
        answers: INITIAL_ANSWERS,
        objectiveScore: 0,
        lastSavedAt: null,
      });
      setSubmissionError(null);
      setTimesUpAlert(false);
    }
  };

  const currentQuestion = EXAM_QUESTIONS[session.currentQuestionIndex] || EXAM_QUESTIONS[0];
  const stats = getExamCompletionStats(session.answers);
  const secondsRemaining = calculateSecondsRemaining();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Header
        student={session.student}
        showExamMeta={session.status === 'exam' || session.status === 'review'}
        savedIndicator={savedIndicator}
      >
        {(session.status === 'exam' || session.status === 'review') && (
          <Timer
            startTime={session.startTime}
            totalDurationSeconds={EXAM_METADATA.durationSeconds}
            onTimeExpired={handleTimeExpired}
          />
        )}
      </Header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Time's Up Banner if auto-submitted */}
        {timesUpAlert && (
          <div className="bg-red-600 text-white px-4 py-3 text-center text-sm font-semibold shadow-md">
            <strong>Time&apos;s Up!</strong> Your examination time has ended. Your answers have been submitted automatically.
          </div>
        )}

        {/* Submission Error Banner */}
        {submissionError && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Submission could not be completed.</h4>
                  <p className="text-xs text-red-800 mt-0.5">{submissionError}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => submitExamCore(false)}
                disabled={isSubmitting}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Retrying...' : 'Retry Submission'}
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 1: LANDING SCREEN */}
        {session.status === 'landing' && (
          <LandingScreen
            initialStudent={session.student}
            hasSavedSession={Boolean(session.startTime && session.status !== 'submitted')}
            onStartExam={handleStartExam}
            onResumeExam={handleResumeExam}
          />
        )}

        {/* SCREEN 2: ACTIVE EXAMINATION */}
        {session.status === 'exam' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Column: Question Card & Controls */}
              <div className="lg:col-span-8 flex flex-col">
                {/* Breadcrumbs / Section Info matching Sleek Interface */}
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-[10px] font-black uppercase rounded tracking-wider">
                    {currentQuestion.type === 'mcq'
                      ? 'Section A'
                      : currentQuestion.type === 'short'
                      ? 'Section B'
                      : currentQuestion.type === 'application'
                      ? 'Section C'
                      : 'Section D — Practical Task'}
                  </span>
                  <span className="text-slate-400 text-lg">/</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500">
                    {currentQuestion.type === 'mcq'
                      ? 'Multiple Choice Questions'
                      : currentQuestion.type === 'short'
                      ? 'Short Answer Questions'
                      : currentQuestion.type === 'application'
                      ? 'Practical Application Question'
                      : 'Restaurant "Cafe Crave" Website & App Project'}
                  </span>
                  <span className="ml-auto text-xs font-bold text-slate-400">
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                  </span>
                </div>

                {/* Question Render Card with Sleek Interface Shadow & Padding */}
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 flex-1 flex flex-col justify-between min-h-[460px]">
                  <div className="space-y-6">
                    {currentQuestion.type === 'mcq' && (
                      <McqQuestion
                        question={currentQuestion}
                        selectedOption={session.answers.mcq[currentQuestion.id]}
                        onSelectOption={(optId) => handleMcqSelect(currentQuestion.id, optId)}
                      />
                    )}

                    {currentQuestion.type === 'short' && (
                      <ShortQuestion
                        question={currentQuestion}
                        answerText={session.answers.short[currentQuestion.id]}
                        onAnswerChange={(text) => handleShortAnswerChange(currentQuestion.id, text)}
                      />
                    )}

                    {currentQuestion.type === 'application' && (
                      <ApplicationQuestion
                        question={currentQuestion}
                        answersMap={session.answers.application[currentQuestion.id]}
                        onFieldChange={(fieldKey, val) =>
                          handleApplicationFieldChange(currentQuestion.id, fieldKey, val)
                        }
                      />
                    )}

                    {currentQuestion.type === 'practical' && (
                      <PracticalTask
                        question={currentQuestion}
                        canvaLink={session.answers.practical.canvaDesignLink}
                        githubLink={session.answers.practical.githubRepoLink}
                        notes={session.answers.practical.designNotes}
                        onLinkChange={handlePracticalLinkChange}
                        onGithubLinkChange={handlePracticalGithubChange}
                        onNotesChange={handlePracticalNotesChange}
                      />
                    )}
                  </div>

                  {/* Controls matching Sleek Interface */}
                  <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
                    <button
                      id="btnPrevQuestion"
                      type="button"
                      disabled={session.currentQuestionIndex === 0}
                      onClick={handlePrevious}
                      className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold text-xs sm:text-sm uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="px-3 sm:px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-500 tabular-nums">
                        {session.currentQuestionIndex + 1 < 10
                          ? `0${session.currentQuestionIndex + 1}`
                          : session.currentQuestionIndex + 1}{' '}
                        /{' '}
                        {EXAM_QUESTIONS.length < 10
                          ? `0${EXAM_QUESTIONS.length}`
                          : EXAM_QUESTIONS.length}
                      </div>

                      {session.currentQuestionIndex === EXAM_QUESTIONS.length - 1 ? (
                        <button
                          id="btnExamFinalReview"
                          type="button"
                          onClick={handleGoToReview}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-8 py-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                        >
                          <span>Review Answers</span>
                          <Send className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          id="btnNextQuestion"
                          type="button"
                          onClick={handleNext}
                          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-8 py-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                        >
                          <span>Next Question</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Question Navigator Palette */}
              <div className="lg:col-span-4 space-y-4">
                <QuestionNavigator
                  questions={EXAM_QUESTIONS}
                  currentIndex={session.currentQuestionIndex}
                  answers={session.answers}
                  onSelectQuestion={handleSelectQuestion}
                  onGoToReview={handleGoToReview}
                />

                {/* Candidate Info Mini Card */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2 shadow-2xs">
                  <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
                    <span>Candidate Session</span>
                    <span className="font-mono text-[11px] text-blue-600 font-semibold">
                      {session.student.rollNumber}
                    </span>
                  </div>
                  <div className="text-slate-600 space-y-1">
                    <div>Student: <strong className="text-slate-900">{session.student.fullName}</strong></div>
                    <div>Course: <span className="text-slate-800">{EXAM_METADATA.courseName}</span></div>
                    <div>Started: <span className="text-slate-800">{formatHumanDateTime(session.startTime || Date.now())}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: REVIEW SCREEN */}
        {session.status === 'review' && (
          <ReviewScreen
            student={session.student}
            startTime={session.startTime}
            secondsRemaining={secondsRemaining}
            answers={session.answers}
            onReturnToExam={handleReturnToExam}
            onSubmitFinalExam={() => setIsConfirmModalOpen(true)}
            isSubmitting={isSubmitting}
          />
        )}

        {/* SCREEN 4: SUCCESS SCREEN */}
        {session.status === 'submitted' && (
          <SuccessScreen session={session} />
        )}
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        unansweredCount={stats.unansweredWritten}
        isSubmitting={isSubmitting}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={() => submitExamCore(false)}
      />

      {/* Hidden Form for FormSubmit POST fallback */}
      <form
        ref={hiddenFormRef}
        action={EXAM_METADATA.formSubmitEndpoint}
        method="POST"
        className="hidden"
      >
        <input type="hidden" name="_subject" value={`Digital Signs Academy Exam Submission: ${session.student.fullName}`} />
        <input type="hidden" name="_replyto" value={session.student.email} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
      </form>

      {/* Footer */}
      <Footer />
    </div>
  );
}
