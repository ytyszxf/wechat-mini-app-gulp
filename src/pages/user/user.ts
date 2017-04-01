import { User } from '../../models/user.interface';
import { Utils } from '../../utils/util';

let app = getApp();

interface State {
  userInfo?: User;
}

let state: State = {};

Page({
  data: state,
  onLoad() {
    app.getUserInfo((user) => {
      //更新数据
      this.setData({
        userInfo: user
      });
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
  }
});
