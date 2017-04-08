import { AppState } from './services/app-state.service';
export let app;

App({
  onLaunch () {
    // 调用API从本地缓存中获取数据
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    AppState.instance.reload();
    AppState.instance.setCurrentAccount({
      "accountNumber": '421477451206',
      "expiredDate": "2018-03-12",
      "bExported": false,
      "bDisabled": false,
      "availableCount": 20,
      "usedCount": 6,
      "id": 5985,
      "ownerId": 2,
      "lastUpdatedById": 2,
      "createdAt": "2017-03-12T01:53:27.000Z",
      "updatedAt": "2017-03-24T15:57:55.000Z"
    });
  },
  getUserInfo(cb) {
    if (app.globalData.userInfo) {
      typeof cb === "function" && cb(app.globalData.userInfo);
    } else {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              app.globalData.userInfo = res.userInfo;
              typeof cb === "function" && cb(app.globalData.userInfo);
            }
          });
        }
      });
    }
  },
  globalData: {
    userInfo: null
  }
});

app = getApp();
