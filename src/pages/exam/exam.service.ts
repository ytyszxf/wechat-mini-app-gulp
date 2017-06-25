import { examState } from '../../services/exam-state.service';
import { Exam } from '../../models/exam.interface';
import { ExamResult } from '../../models/exam-result.interface';
import { userService } from '../../services/user.service';
import { Utils } from '../../utils/util';

export class ExamService {
  public static createExam(moduleID: number): Promise<Exam> {
    return new Promise((resolve, reject) => {
      let accountNumber = userService.user.account.accountNumber;
      let url = `http://www.tzsbmn.com/api/Exams/createExam?`
        + `accountNumber=${accountNumber}`
        + `&moduleId=${moduleID}`;
      wx.request({
        method: 'POST',
        url: url,
        success: (res) => {
          if (res.statusCode !== 200) {
            reject(res.data.error);
            return;
          }
          userService.user.account.usedCount += 1;
          userService.store();
          let exam: Exam = res.data.data.result;
          exam.startTime = (new Date()).toString();
          exam.examQuestions.forEach((question) => {
            if (question.questionTypeId !== 1) {
              question.examChoices = question.examChoices.sort((a, b) => {
                return Math.random() > 0.5 ? 1 : -1;
              });
            } else {
              question.examChoices = question.examChoices.sort((a, b) => {
                return a.content === '对' ? -1 : 1;
              });
            }
          });
          resolve(exam);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  public static getWrongQuestions(exam: Exam) {
    let wrongQuestions = exam.examQuestions.filter((question) => {
      let correct = question.examChoices
        .reduce((flag, choice) => {
          return choice.bChose === choice.bAnswer && flag;
        }, true);
      return !correct;
    });

    return wrongQuestions;
  }

  public static submitExam(exam: Exam, timeConsumption: number) {
    let examResult = ExamService.getExamResult(exam, timeConsumption);
    exam.finished = true;
    examState.setCurrentExam(exam);
    examState.setFinishedExam(exam);
    examState.addHistoryExam(exam);
    examState.addExamResult(examResult);

    return examResult;
  }

  private static getAnsweredQuestionCount(exam: Exam) {
    return exam.examQuestions.filter((question) => {
      return !!question.examChoices.find((choice) => choice.bChose);
    }).length;
  }

  private static getExamResult(exam: Exam, timeConsumption: number) {
    let incorrectCount = ExamService.getWrongQuestions(exam).length;

    let result: ExamResult = {
      finalScore: exam.examQuestions.length - incorrectCount,
      timeConsumption: Utils.formatTimeHM(timeConsumption),
      startTime: Utils.date2LocalTime(exam.startTime),
      incorrectCount: incorrectCount,
      examFinished: true,
      totalNumber: exam.examQuestions.length,
      passScore: exam.passScore,
      examId: exam.id,
      questionAnswered: this.getAnsweredQuestionCount(exam)
    };

    return result;
  }
}
