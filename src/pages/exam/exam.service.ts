import { Exam } from '../../models/exam.interface';
import { userService } from '../../services/user.service';

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

  public static submitExam(exam: Exam) {
    let wrongQuestions = exam.examQuestions.filter((question) => {
      let correct = question.examChoices
        .reduce((flag, choice) => {
          return choice.bChose === choice.bAnswer && flag;
        }, true);
      return !correct;
    });

    console.log(wrongQuestions);
  }
}
