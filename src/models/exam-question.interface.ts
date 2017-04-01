import { ExamChoice } from './exam-choice.interface';
export enum QuestionType { 'logic', 'single', 'multiple', 'complex' };

export interface ExamQuestion {
  content: string;
  requiredChoice: number;
  bDisabled: boolean;
  id: number;
  examId: number;
  questionId: number;
  questionTypeId: QuestionType;
  createdAt: string;
  updatedAt: string;
  examChoices: ExamChoice[];
}
