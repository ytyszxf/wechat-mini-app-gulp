import { ExamQuestion } from '../../models/exam-question.interface';
import { ExamService } from '../exam/exam.service';
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
  content?: Array<{
    type: 'text' | 'img';
    content?: string;
    url?: string;
  }>;
  questions?: ExamQuestion[];
  questionIndex?: number;
  exam?: Exam;
  choices?: ExamChoice[];
  questionType?: string;
  url?: string;
  footerActive?: boolean;
  result?: ExamResult;
  correctAnwser?: string;
}

let state: State = {
  content: [],
  questions: [],
  questionIndex: 0,
  exam: {},
  choices: [],
  questionType: '',
  url: 'http://tzsbmn.com/',
  footerActive: false,
  result: {},
  correctAnwser: ''
};

Page<State>({
  data: state,
  /**
   * @override Page.onLoad
   */
  onLoad(option) {
    

    let examId = option.examId;
    let exam = examState.historyExams.find((d) => d.id == examId);
    if (!exam) {
      wx.redirectTo({
        url: '../index/index'
      });
      return;
    }
    let mode = option.mode;
    let examQuestions = mode === 'full' ? exam.examQuestions
      : ExamService.getWrongQuestions(exam);

    this.setData({
      exam: exam,
      questions: examQuestions,
      questionIndex: 0
    });
    (<Function> this['updateView'])();
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
    let content = Utils.findImages(this.data.questions[myState.questionIndex].content);
    let question = this.data.questions[this.data.questionIndex];

    let choiceAnnotation = 'ABCDEFGHIJKLNM';
    if (question.questionTypeId === 1) {
      let correctAnswer = question.examChoices
        .find((choice) => choice.bAnswer).content;
      this.setData({ correctAnwser: correctAnswer });
    } else {
      let correctAnswers = [];
      question.examChoices.forEach((choice,index) => {
        if (choice.bAnswer) {
          correctAnswers.push(choiceAnnotation[index]);
        }
      });
      this.setData({ correctAnwser: correctAnswers.join(' ') });
    }
    this.setData({ content: content });
    console.log(`content:`, content);
    (<Function> this['getChoices'])();
    (<Function> this['setQuestionType'])();
  },
  getChoices() {
    let questionIndex = this.data.questionIndex;
    let choices = this.data.questions[questionIndex].examChoices;
    console.log(choices);
    this.setData({
      choices: choices
    });
  },
  onChooseQuestion(e) {
    let index = e.currentTarget.dataset.questionIndex;
    (<Function> this['onToggleFooter'])();
    (<Function> this['goIndex'])(index);
  },
  setQuestionType() {
    let questionTypes = ['判断题', '单选题', '多选题', '逻辑题'];
    let currentQuestion = this.data.questions[this.data.questionIndex];
    this.setData({
      questionType: questionTypes[currentQuestion.questionTypeId - 1]
    });
  },
  goNext() {
    let index = this.data.questionIndex + 1;
    index = index < this.data.questions.length ?
      index : this.data.questions.length - 1;
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
