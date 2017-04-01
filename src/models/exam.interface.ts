import { ExamQuestion } from './exam-question.interface';

export interface Exam {
  bDisabled?: boolean;
  examTime?: number; // minutes
  id?: number;
  accountId?: number;
  moduleId?: string;
  createdAt?: string;
  updatedAt?: string;
  examQuestions?: ExamQuestion[];
  passScore?: number;
  startTime?: string;
  examFinalTime?: string;
}
