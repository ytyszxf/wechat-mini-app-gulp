import { ExamResult } from '../../models/exam-result.interface';
import { examState } from '../../services/exam-state.service';

interface State {
  examResults?: ExamResult[];
  averageScore?: number;
  passCount?: number;
  questionAnswered?: number;
}

let state: State = {
  examResults: [],
  averageScore: 0,
  passCount: 0,
  questionAnswered: 0
};

Page<State>({
  data: state,
  onShow() {
    let examResults = examState.examResults;
    let avgScore = examState.examResults.reduce((val, result) => result.finalScore + val, 0)
      / examState.examResults.length;
    avgScore = Math.ceil(avgScore);
    this.setData({
      examResults: examResults,
      averageScore: avgScore,
      passCount: examResults.filter((result) => result.finalScore >= result.passScore).length,
      questionAnswered: examResults
        .reduce((value, result) => value + (result.questionAnswered || 0), 0) || 0
    });
  },
});
