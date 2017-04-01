import { Utils } from '../../utils/util';

let app = getApp();


let pageSettings: IPage = {
  data: {
    motto: 'Hello World',
    
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../test/test'
    });
  },
  onLoad() {
    
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
};

Page(pageSettings);
