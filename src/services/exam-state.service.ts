import { ExamResult } from '../models/exam-result.interface';
import { Exam } from '../models/exam.interface';

export class ExamState {
  private _currentExam: Exam;
  private _currentIndex: number;
  private _timeLeft: number;
  private _finishedExam: Exam;
  private _historyExams: Exam[];
  private _examResults: ExamResult[] = [];

  public get currentExam() {
    return this._currentExam;
  }

  public get currentIndex() {
    return this._currentIndex;
  }

  public get timeLeft() {
    return this._timeLeft;
  }

  public get finishedExam() {
    return this._finishedExam;
  }

  public get historyExams() {
    return this._historyExams;
  }

  public get examResults() {
    return this._examResults;
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

  public setFinishedExam(exam: Exam) {
    this._finishedExam = exam;
  }

  public addHistoryExam(exam: Exam) {
    this._historyExams.push(exam);
    wx.setStorageSync('exam.history', this._historyExams);
  }

  public addExamResult(examResult: ExamResult) {
    this._examResults.push(examResult);
    wx.setStorageSync('exam.examResults', this._examResults);
  }

  private _reload() {
    this._currentExam = wx.getStorageSync('exam.currentExam');
    this._currentIndex = wx.getStorageSync('exam.currentIndex');
    this._timeLeft = wx.getStorageSync('exam.timeLeft');
    this._historyExams = wx.getStorageSync('exam.history') || [];
    this._examResults = wx.getStorageSync('exam.examResults') || [];
  }
}

export const examState = new ExamState();
