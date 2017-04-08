import { examState } from '../../services/exam-state.service';
import { ExamChoice } from '../../models/exam-choice.interface';
import { Exam } from '../../models/exam.interface';
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
  url: 'http://tzsbmn.com/'
};

Page<State>({
  data: state,
  /**
   * @override Page.onLoad
   */
  onShow() {
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
  /**
   * @override Page.onUnload
   */
  onHide() {
    let data: State = this.data;
    clearInterval(<NodeJS.Timer> this.data.timer);
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
    let questionTypes = ['判断题', '单选题', '单选题', '逻辑题'];
    let currentQuestion = this.data.exam.examQuestions[this.data.questionIndex];
    this.setData({
      questionType: questionTypes[currentQuestion.questionTypeId]
    });
  },
  goNext() {
    let index = this.data.questionIndex + 1;
    index = index < this.data.exam.examQuestions.length ?
      index : this.data.exam.examQuestions.length - 1;
    this.setData({
      questionIndex: index
    });
    (<Function>this['updateView'])();
    examState.setCurrentIndex(index);
  },
  goPrevious() {
    let index = this.data.questionIndex - 1;
    index = index < 0 ? 0 : index;
    this.setData({
      questionIndex: index
    });
    (<Function>this['updateView'])();
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
