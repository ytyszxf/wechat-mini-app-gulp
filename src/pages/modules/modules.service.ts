import { Module } from '../../models/module.interface';
import { appState } from '../../services/app-state.service';

export class ModulesService {
  public static getModules() {
    return new Promise<Module[]>((resolve, reject) => {
      wx.request({
        url: 'https://tzsbmn.com/api/Modules?'
        + 'filter[where][bChildModule]=false'
        + '&filter[include]=childModules&filter[where][bDisabled]=false',
        method: 'GET',
        success: (res) => {
          appState.setModules(res.data);
          resolve(res.data);
        },
        fail: (err) => {
          reject(err);
          wx.showToast({
            title: '加载模块失败'
          });
        }
      });
    });
  }
}
