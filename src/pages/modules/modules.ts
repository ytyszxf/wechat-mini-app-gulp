import { Module } from '../../models/module.interface';

interface State {
  modules: Module[];
}

let state: State = {
  modules: []
};

Page({
  data: state,
  onLoad() {
    wx.request({
      url: 'https://fancywhale.cn/api/Modules',
      method: 'GET',
      success: (res) => {
        this.setData({ modules: res.data });
      }
    });
  }
});
