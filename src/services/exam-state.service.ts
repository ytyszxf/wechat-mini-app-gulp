import { Exam } from '../models/exam.interface';

export class ExamState {
  private _currentExam: Exam;
  private _currentIndex: number;
  private _timeLeft: number;

  public get currentExam() {
    return this._currentExam;
  }

  public get currentIndex() {
    return this._currentIndex;
  }

  public get timeLeft() {
    return this._timeLeft;
  }

  constructor() {
    this._reload();
  }

  public setCurrentExam(exam: Exam) {
    this._currentExam = exam;
    wx.setStorageSync('exam.currentExam', exam);
  }

  public setCurrentIndex(index: number) {
    this._currentIndex = index;
    wx.setStorageSync('exam.currentIndex', index);
  }

  public setTimeLeft(timeLeft: number) {
    this._timeLeft = timeLeft;
    wx.setStorageSync('exam.timeLeft', timeLeft);
  }

  private _reload() {
    this._currentExam = wx.getStorageSync('exam.currentExam');
    this._currentIndex = wx.getStorageSync('exam.currentIndex');
    this._timeLeft = wx.getStorageSync('exam.timeLeft');
  }
}

export const examState = new ExamState();
