
let app = getApp();


let pageSettings: IPage = {
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },
  onLoad: function () {
    let that: IPage = this;
    app.getUserInfo((user) => {
      //更新数据
      that.setData({
        userInfo: user
      });
    });
  }
};

Page(pageSettings);
