import { ExamService } from './exam.service';
import { examState } from '../../services/exam-state.service';
import { ExamChoice } from '../../models/exam-choice.interface';
import { Exam } from '../../models/exam.interface';
import { ExamResult } from '../../models/exam-result.interface';

import { Utils } from '../../utils/util';

let touchStartPosition: {
  x: number;
  y: number;
} = null;

interface State {
  startTime?: number;
  timer?: NodeJS.Timer;
  timeLeft?: string;
  startTimeLeft?: number;
  content?: Array<{
    type: 'text' | 'img';
    content?: string;
    url?: string;
  }>;
  questionIndex?: number;
  exam?: Exam;
  choices?: ExamChoice[];
  questionType?: string;
  url?: string;
  footerActive?: boolean;
  result?: ExamResult;
}

let state: State = {
  startTime: Utils.now(),
  timer: null,
  timeLeft: '',
  startTimeLeft: 0,
  content: [],
  questionIndex: 0,
  exam: {},
  choices: [],
  questionType: '',
  url: 'http://tzsbmn.com/',
  footerActive: false,
  result: {}
};

Page<State>({
  data: state,
  /**
   * @override Page.onLoad
   */
  onShow() {
    if (!examState.currentExam) {
      wx.redirectTo({
        url: '../index/index'
      });
      return;
    }
    this.setData({
      exam: examState.currentExam,
      startTimeLeft: examState.timeLeft,
      startTime: Utils.now(),
      questionIndex: examState.currentIndex || 0
    });
    (<Function> this['updateTimeLeft'])();
    (<Function> this['updateView'])();
  },
  updateTimeLeft() {
    let exam: Exam = this.data.exam;
    let timer = setInterval(() => {
      let now = Utils.now();
      let timeLeft = this.data.startTimeLeft - (now - this.data.startTime);
      examState.setTimeLeft(timeLeft);
      this.setData({
        timeLeft: Utils.formatTimeHM(timeLeft)
      });
    }, 100);

    this.setData({
      timer: timer
    });
  },
  onChooseQuestion(e) {
    let index = e.currentTarget.dataset.questionIndex;
    (<Function> this['onToggleFooter'])();
    (<Function> this['goIndex'])(index);
  },
  onSubmitExam() {
    wx.showModal({
      title: '提示信息',
      content: '确定要提交考卷吗？',
      showCancel: true,
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        let timeLeft = (this.data.startTimeLeft - (Utils.now() - this.data.startTime));
        timeLeft = timeLeft < 0 ? 0 : timeLeft;
        let timeConsumption = this.data.exam.examTime * 60 * 1000 - timeLeft;
        let result = ExamService.submitExam(this.data.exam, timeConsumption);
        this.setData({result});
      }
    });
  },
  /**
   * @override Page.onUnload
   */
  onHide() {
    clearInterval(<NodeJS.Timer> this.data.timer);
  },
  onToggleFooter() {
    this.setData({
      footerActive: !this.data.footerActive
    });
  },
  /**
   * @private
   */
  updateView() {
    let myState: State = this.data;
    let content = Utils.findImages(myState.exam.examQuestions[myState.questionIndex].content);
    this.setData({ content: content });
    console.log(`content:`, content);
    (<Function> this['getChoices'])();
    (<Function> this['setQuestionType'])();
  },
  getChoices() {
    let questionIndex = this.data.questionIndex;
    let choices = this.data.exam.examQuestions[questionIndex].examChoices;
    console.log(choices);
    this.setData({
      choices: choices
    });
  },
  onQuectionChecked(e) {
    let choices: ExamChoice[] = this.data.choices;
    choices.forEach((choice) => {
      choice.bChose = false;
      if ((<string[]> e.detail.value).find((id) => parseInt(id, 0) === choice.id)) {
        choice.bChose = true;
      }
    });
    this.setData({
      choices: choices
    });
    this.data.exam.examQuestions[this.data.questionIndex].examChoices = choices;
    examState.setCurrentExam(this.data.exam);
  },
  onRadioQuectionChecked(e) {
    let choices: ExamChoice[] = this.data.choices;
    choices.forEach((choice) => {
      choice.bChose = false;
      if (parseInt(e.detail.value, 0) === choice.id) {
        choice.bChose = true;
      }
    });
    this.setData({
      choices: choices
    });
    this.data.exam.examQuestions[this.data.questionIndex].examChoices = choices;
    examState.setCurrentExam(this.data.exam);
  },
  setQuestionType() {
    let questionTypes = ['判断题', '单选题', '多选题', '逻辑题'];
    let currentQuestion = this.data.exam.examQuestions[this.data.questionIndex];
    this.setData({
      questionType: questionTypes[currentQuestion.questionTypeId - 1]
    });
  },
  goNext() {
    let index = this.data.questionIndex + 1;
    index = index < this.data.exam.examQuestions.length ?
      index : this.data.exam.examQuestions.length - 1;
    (<Function>this['goIndex'])(index);
  },
  goPrevious() {
    let index = this.data.questionIndex - 1;
    index = index < 0 ? 0 : index;
    (<Function>this['goIndex'])(index);
  },
  goIndex(index: number) {
    this.setData({
      questionIndex: index
    });
    (<Function> this['updateView'])();
    examState.setCurrentIndex(index);
  },
  onTouchStart(e) {
    console.log(e);
    touchStartPosition = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  },
  onTouchEnd(e) {
    if (Math.abs(e.changedTouches[0].clientY - touchStartPosition.y) > 30) {
      return;
    }
    if (e.changedTouches[0].clientX - touchStartPosition.x > 50) {
      (<Function> this['goPrevious'])();
    } else if (e.changedTouches[0].clientX - touchStartPosition.x < -50) {
      (<Function> this['goNext'])();
    }
  }
});
