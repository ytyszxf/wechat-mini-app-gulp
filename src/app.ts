export let app;

App({
  onLaunch: function () {
    // 调用API从本地缓存中获取数据
    let logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },
  getUserInfo: function (cb) {
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
