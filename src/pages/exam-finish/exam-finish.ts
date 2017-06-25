import { examState } from '../../services/exam-state.service';

interface State {

}

let state: State = {

};

Page<State>({
  data: state,
  onShow() {
    examState.finishedExam
  },
});
