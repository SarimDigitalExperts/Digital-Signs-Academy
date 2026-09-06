import { EXAM_METADATA, EXAM_QUESTIONS } from '../data/examData';
import { ExamAnswers, ExamSessionState, QuestionItem } from '../types';

/**
 * Format date to human friendly format matching prompt:
 * Example: "06 September 2026, 08:30 PM"
 */
export function formatHumanDateTime(dateInput: Date | number | string): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  const formattedHours = String(hours).padStart(2, '0');

  return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
}

/**
 * Format elapsed milliseconds into "X Hour Y Minutes" or "Y Minutes"
 */
export function formatTimeUsed(elapsedMs: number): string {
  if (elapsedMs < 0) elapsedMs = 0;
  const totalMinutes = Math.floor(elapsedMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'} ${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`;
  }
  if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`;
  }
  return `${seconds} Seconds`;
}

/**
 * Format seconds into HH : MM : SS
 */
export function formatTimerHms(secondsRemaining: number): {
  formatted: string;
  hours: string;
  minutes: string;
  seconds: string;
} {
  const safeSecs = Math.max(0, Math.floor(secondsRemaining));
  const h = Math.floor(safeSecs / 3600);
  const m = Math.floor((safeSecs % 3600) / 60);
  const s = safeSecs % 60;

  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');

  return {
    formatted: `${hh} : ${mm} : ${ss}`,
    hours: hh,
    minutes: mm,
    seconds: ss,
  };
}

/**
 * Calculate objective score from MCQs (0 - 15)
 */
export function calculateObjectiveScore(mcqAnswers: Record<number, string>): number {
  let score = 0;
  EXAM_QUESTIONS.forEach((q) => {
    if (q.type === 'mcq') {
      if (mcqAnswers[q.id] && mcqAnswers[q.id] === q.correctOption) {
        score += q.marks;
      }
    }
  });
  return score;
}

/**
 * Check if a single question has been answered
 */
export function isQuestionAnswered(question: QuestionItem, answers: ExamAnswers): boolean {
  if (question.type === 'mcq') {
    return Boolean(answers.mcq[question.id]);
  }
  if (question.type === 'short') {
    const text = answers.short[question.id];
    return Boolean(text && text.trim().length > 0);
  }
  if (question.type === 'application') {
    const fieldMap = answers.application[question.id];
    if (!fieldMap) return false;
    // Considered answered if at least one subfield has meaningful text
    return Object.values(fieldMap).some((val) => val && val.trim().length > 0);
  }
  if (question.type === 'practical') {
    const link = answers.practical.canvaDesignLink;
    return Boolean(link && link.trim().length > 0);
  }
  return false;
}

/**
 * Compute progress summary
 */
export function getExamCompletionStats(answers: ExamAnswers) {
  // Written questions 1-22
  const writtenQuestions = EXAM_QUESTIONS.filter((q) => q.id <= 22);
  let writtenAnswered = 0;
  let mcqAnswered = 0;
  let shortAnswered = 0;
  let applicationAnswered = 0;

  writtenQuestions.forEach((q) => {
    if (isQuestionAnswered(q, answers)) {
      writtenAnswered++;
      if (q.type === 'mcq') mcqAnswered++;
      else if (q.type === 'short') shortAnswered++;
      else if (q.type === 'application') applicationAnswered++;
    }
  });

  const practicalTask = EXAM_QUESTIONS.find((q) => q.type === 'practical');
  const practicalAnswered = practicalTask ? isQuestionAnswered(practicalTask, answers) : false;

  const totalAnswered = writtenAnswered + (practicalAnswered ? 1 : 0);
  const totalQuestionsCount = 22; // As specified in prompt: 22 written questions
  const totalItemsCount = EXAM_QUESTIONS.length; // 23 with practical

  return {
    writtenAnswered,
    writtenTotal: 22,
    totalAnswered,
    totalQuestionsCount,
    totalItemsCount,
    unansweredWritten: Math.max(0, 22 - writtenAnswered),
    mcqAnswered,
    mcqTotal: 15,
    shortAnswered,
    shortTotal: 5,
    applicationAnswered,
    applicationTotal: 2,
    practicalAnswered: practicalAnswered ? 1 : 0,
    practicalTotal: 1,
  };
}

/**
 * Build payload for FormSubmit with meaningful field names
 */
export function serializeExamForFormSubmit(session: ExamSessionState): Record<string, string> {
  const { student, startTime, submissionTime, autoSubmitted, answers } = session;

  const startFormatted = startTime ? formatHumanDateTime(startTime) : 'N/A';
  const subFormatted = submissionTime ? formatHumanDateTime(submissionTime) : formatHumanDateTime(Date.now());
  const elapsed = (submissionTime || Date.now()) - (startTime || Date.now());
  const timeUsed = formatTimeUsed(elapsed);
  const objectiveScore = calculateObjectiveScore(answers.mcq);

  const payload: Record<string, string> = {
    // FormSubmit Config
    _subject: `Digital Signs Academy — Digital Marketing Batch 02 Exam Submission: ${student.fullName} (${student.rollNumber})`,
    _replyto: student.email,
    _template: 'table',
    _captcha: 'false',

    // Student Information
    student_name: student.fullName,
    student_email: student.email,
    phone: student.phone,
    roll_number: student.rollNumber,
    city: student.city || 'Not provided',

    // Exam Information
    academy: EXAM_METADATA.academyName,
    course: EXAM_METADATA.courseName,
    batch: 'Batch 02',
    chapter: 'Chapter 01 — Canva & Graphic Design',
    exam_start: startFormatted,
    exam_submission: subFormatted,
    time_used: timeUsed,
    time_allowed: '2 Hours (120 Minutes)',
    auto_submitted: autoSubmitted ? 'Yes (Timer Expired)' : 'No (Manual Student Submission)',
    objective_score: `${objectiveScore} / 15 Marks (Auto Graded)`,
    manual_evaluation_status: 'Pending Instructor Review (35 Marks remaining: Short, Application, Practical)',
  };

  // Serialize MCQs (q1 - q15)
  EXAM_QUESTIONS.filter((q) => q.type === 'mcq').forEach((q) => {
    const selected = answers.mcq[q.id];
    const isCorrect = selected === q.correctOption;
    payload[`q${q.id}`] = `[${q.prompt}] | Selected: ${selected || 'Unanswered'} | Correct: ${q.correctOption} | Score: ${isCorrect ? '1/1' : '0/1'}`;
  });

  // Serialize Short Questions (q16 - q20)
  EXAM_QUESTIONS.filter((q) => q.type === 'short').forEach((q) => {
    const answer = answers.short[q.id] || 'No answer provided';
    payload[`q${q.id}`] = `[${q.prompt}] | Answer: ${answer} | Marks: Manual Evaluation (Max 3)`;
  });

  // Serialize Application Questions (q21 - q22)
  EXAM_QUESTIONS.filter((q) => q.type === 'application').forEach((q) => {
    const fieldMap = answers.application[q.id] || {};
    const formattedFields = Object.entries(fieldMap)
      .map(([k, v]) => `${k.toUpperCase()}: ${v || 'None'}`)
      .join(' || ');
    payload[`q${q.id}`] = `[${q.prompt}] | Response: ${formattedFields || 'No answer provided'} | Marks: Manual Evaluation (Max 5)`;
  });

  // Serialize Practical Task
  payload['canva_design_link'] = answers.practical.canvaDesignLink || 'No link provided';
  if (answers.practical.designNotes) {
    payload['practical_task_notes'] = answers.practical.designNotes;
  }
  payload['practical_task_marks'] = 'Manual Evaluation (Max 10)';

  return payload;
}
