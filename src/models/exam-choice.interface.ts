
export interface ExamChoice {
  content: string;
  bImage: boolean;
  bAnswer: boolean;
  bChose: boolean;
  bDisabled: boolean;
  id: number;
  examQuestionId: number;
  choiceId: number;
  examId: number;
  createdAt: string;
  updatedAt: string;
}
