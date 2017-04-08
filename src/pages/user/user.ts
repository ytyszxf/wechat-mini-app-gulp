import { userService, UserService } from '../../services/user.service';
import { appState } from '../../services/app-state.service';
import { User } from '../../models/user.interface';
import { Utils } from '../../utils/util';
import { AccountService } from './account.service';

let app = getApp();

interface State {
  userInfo?: User;
  accountNumber?: string;
}

let state: State = {};

Page<State>({
  data: state,
  onLoad() {
    userService.getUser()
      .then((user) => {
        this.setData({
          userInfo: user
        });
      });
  },
  onShow() {
    if (this.data.userInfo && this.data.userInfo.account) {
      AccountService
        .getAccountInfo(this.data.userInfo.account.accountNumber)
        .then((account) => {
          let userInfo: User = Object.assign({}, this.data.userInfo);
          userInfo.account = account;
          userService.setUser(userInfo);
          this.setData({ userInfo });
        })
        .catch(() => {
          wx.showToast({ title: '加载账户信息失败' });
        });
    }
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
  rechargeAccount() {
    if (wx.showLoading) {
      wx.showLoading({
        title: '为账户充值中'
      });
    }
    AccountService.recharge(this.data.accountNumber)
      .then(() => {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        wx.showToast({
          title: '充值成功'
        });
        this.setData({
          userInfo: userService.user,
          accountNumber: ''
        });
      })
      .catch((err) => {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        wx.showToast({
          title: err.message
        });
      });
  },
  accountInput(e) {
    let value = e.detail.value;
    let newState: State = {
      accountNumber: value
    };
    this.setData(newState);
  }
});
