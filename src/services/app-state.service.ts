import { Exam } from '../models/exam.interface';

export class AppState {
  public static instance = new AppState();

  private _currentExam: Exam;

  public get currentExam() {
    return this._currentExam;
  }

  public setCurrentExam(exam: Exam) {
    this._currentExam = exam;
  }
}
