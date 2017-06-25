import { ModulesService } from './modules.service';
import { AppState, appState } from '../../services/app-state.service';
import { Module } from '../../models/module.interface';

interface State {
  modules: Module[];
}

let state: State = {
  modules: [],
};

Page<State>({
  data: state,
  onLoad() {
    if (appState.modules) {
      this.setData({ modules: appState.modules || [] });
      if (AppState.instance.currentModule) {
        wx.navigateTo({
          url: '../index/index'
        });
        return;
      }
      return;
    }
    (<Function> this['refreshModules'])();
  },
  goModule(e) {
    let m: Module = e.currentTarget.dataset.target;
    AppState.instance.setCurrentModule(m);
    wx.switchTab({
      url: '../index/index'
    });
  },
  refreshModules() {
    return new Promise((resolve, reject) => {
      if (wx.showLoading) {
        wx.showLoading({ title: '加载模块', mask: true });
      }
      ModulesService.getModules()
        .then((modules) => {
          if (wx.hideLoading) {
            wx.hideLoading();
          }
          this.setData({ modules: modules || [] });
          resolve();
        })
        .catch(() => {
          if (wx.hideLoading) {
            wx.hideLoading();
          }
          resolve();
        });
    });
  },
  onPullDownRefresh() {
    (<Function> this['refreshModules'])()
      .then(() => {
        wx.stopPullDownRefresh();
      });
  }
});
