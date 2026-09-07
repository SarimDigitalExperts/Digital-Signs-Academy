export type QuestionType = 'mcq' | 'short' | 'application' | 'practical';
export type SectionId = 'section-a' | 'section-b' | 'section-c' | 'practical';

export interface StudentInfo {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  city?: string;
  confirmed: boolean;
}

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface BaseQuestion {
  id: number;
  number: number;
  section: SectionId;
  sectionName: string;
  type: QuestionType;
  marks: number;
  prompt: string;
  hint?: string;
}

export interface MCQQuestionItem extends BaseQuestion {
  type: 'mcq';
  options: MCQOption[];
  correctOption: 'A' | 'B' | 'C' | 'D';
}

export interface ShortQuestionItem extends BaseQuestion {
  type: 'short';
  placeholder?: string;
}

export interface ApplicationFieldDef {
  key: string;
  label: string;
  placeholder: string;
}

export interface ApplicationQuestionItem extends BaseQuestion {
  type: 'application';
  subtitle?: string;
  fields: ApplicationFieldDef[];
}

export interface PracticalQuestionItem extends BaseQuestion {
  type: 'practical';
  taskTitle: string;
  taskDescription: string;
  requirements: string[];
}

export type QuestionItem =
  | MCQQuestionItem
  | ShortQuestionItem
  | ApplicationQuestionItem
  | PracticalQuestionItem;

export interface ExamAnswers {
  mcq: Record<number, string>; // questionId -> optionId ('A', 'B', etc.)
  short: Record<number, string>; // questionId -> string
  application: Record<number, Record<string, string>>; // questionId -> { fieldKey: value }
  practical: {
    canvaDesignLink: string; // Live Deployed Website / App URL
    githubRepoLink?: string; // GitHub Repository / Source Code URL
    designNotes?: string; // Technical Notes & Feature Breakdown
  };
}

export interface ExamSessionState {
  student: StudentInfo;
  startTime: number | null; // epoch ms
  startFormattedDate: string;
  startFormattedTime: string;
  startIso: string;
  submissionTime: number | null; // epoch ms
  submissionFormattedDate: string;
  submissionFormattedTime: string;
  submissionIso: string;
  timeUsed: string;
  autoSubmitted: boolean;
  status: 'landing' | 'exam' | 'review' | 'submitted';
  currentQuestionIndex: number;
  answers: ExamAnswers;
  objectiveScore: number;
  lastSavedAt: number | null;
}
