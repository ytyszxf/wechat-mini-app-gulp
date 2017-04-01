import { ExamChoice } from '../../models/exam-choice.interface';
import { Exam } from '../../models/exam.interface';
import { AppState } from '../../services/app-state.service';
import { examData } from '../../mocks/data';
import { Utils } from '../../utils/util';

let touchStartPosition = null;

interface State {
  timer: NodeJS.Timer;
  timeLeft: string;
  content: Array<{
    type: 'text' | 'img';
    content?: string;
    url?: string;
  }>;
  questionIndex: number;
  exam: Exam;
  choices: ExamChoice[];
  questionType: string;
  url: string;
}

let state: State = {
  timer: null,
  timeLeft: '',
  content: [],
  questionIndex: 0,
  exam: {},
  choices: [],
  questionType: '',
  url: 'http://tzsbmn.com/'
};

Page({
  data: state,
  /**
   * @override Page.onLoad
   */
  onLoad(option) {
    if (!AppState.instance.currentExam) {
      AppState.instance.setCurrentExam(examData);
    }
    this.setData({
      exam: AppState.instance.currentExam
    });
    (<Function> this['updateTimeLeft'])();
    (<Function> this['updateView'])();
  },
  updateTimeLeft() {
    let exam: Exam = this.data.exam;
    let timer = setInterval(() => {
      let now = Utils.now();
      let timeConsume = exam.examTime * 60 * 1000 - (now - Utils.date2MS(exam.startTime));

      this.setData({
        timeLeft: Utils.formatTimeHM(timeConsume)
      });
    }, 100);

    this.setData({
      timer: timer
    });
  },
  /**
   * @override Page.onUnload
   */
  onUnload() {
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
    let data: State = this.data;
    let questionIndex = data.questionIndex;
    let choices = data.exam.examQuestions[questionIndex].examChoices;
    console.log(choices);
    this.setData({
      choices: choices
    });
  },
  onQuectionChecked(e) {
    let choices: ExamChoice[] = this.data.choices;
    choices.forEach((choice) => {
      choice.bChose = false;
      if ((<string[]>e.detail.value).find((id) => parseInt(id, 0) === choice.id)) {
        choice.bChose = true;
      }
    });
    this.setData({
      choices: choices
    });
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
  },
  setQuestionType() {
    let myState: State = this.data;
    let questionTypes = ['判断题', '单选题', '单选题', '逻辑题'];
    this.setData({
      questionType: questionTypes[myState.exam.examQuestions[myState.questionIndex].questionTypeId]
    });
  },
  goNext() {
    let myState: State = this.data;
    let index = myState.questionIndex + 1;
    index = index < myState.exam.examQuestions.length ?
      index : myState.exam.examQuestions.length - 1;
    this.setData({
      questionIndex: index
    });
    (<Function> this['updateView'])();
  },
  goPrevious() {
    let myState: State = this.data;
    let index = myState.questionIndex - 1;
    index = index < 0 ? 0 : index;
    this.setData({
      questionIndex: index
    });
    (<Function> this['updateView'])();
  },
  onTouchStart(e) {
    console.log(e);
    touchStartPosition = e.touches[0].clientX;
  },
  onTouchEnd(e) {
    if (e.changedTouches[0].clientX - touchStartPosition > 30) {
      (<Function> this['goPrevious'])();
    } else if (e.changedTouches[0].clientX - touchStartPosition < -30) {
      (<Function> this['goNext'])();
    }
  }
});
