import { examState } from '../../services/exam-state.service';
import { ExamService } from '../exam/exam.service';
import { AppState, appState } from '../../services/app-state.service';
import { appendFileSync } from 'fs';
import { Utils } from '../../utils/util';

let app = getApp();

interface State {

}

let state: State = {};


let pageSettings: IPage<State> = {
  data: state,
  onLoad() {
    wx.setNavigationBarTitle({
      title: `${AppState.instance.currentModule.name}模拟考试`.replace(/ /, '')
    });
  },
  navigateTo(e) {
    let ref = e.currentTarget.dataset.ref;
    switch (ref) {
      case 'index':
        Utils.redictTo('../index/index');
        break;
      case 'user':
        Utils.redictTo('../user/user');
        break;
      case 'test':
        Utils.redictTo('../test/test');
        break;
      default:
        break;
    }
  },
  startExam() {
    if (examState.currentExam) {
      wx.navigateTo({
        url: '../exam/exam'
      });
      return;
    }
    wx.showModal({
      title: '提示信息',
      content: '进入模拟将扣除1点积分，是否继续？',
      showCancel: true,
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        if (wx.showLoading) {
          wx.showLoading({
            title: '下载试卷中'
          });
        }
        ExamService.createExam(appState.currentModule.id)
          .then((exam) => {
            examState.setCurrentExam(exam);
            examState.setTimeLeft(exam.examTime * 60 * 1000);
            if (wx.hideLoading) {
              wx.hideLoading();
            }
            console.log(exam);
            wx.navigateTo({
              url: '../exam/exam'
            });
          })
          .catch((err) => {
            if (wx.hideLoading) {
              wx.hideLoading();
            }
            console.log(err);
          });
      }
    });
  }
};

Page(pageSettings);
