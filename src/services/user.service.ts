import { User } from '../models/user.interface';
import { Account } from '../models/account.interface';

export class UserService {
  private _user: User;
  private _code: string;

  public get user() {
    return this._user;
  }

  constructor() {
    this.restore();
  }

  public store() {
    wx.setStorageSync('account', this._user);
  }

  public setUser(user: User) {
    this._user = user;
    this.store();
  }

  public getUser(): Promise<User> {
    if (this._user) {
      return Promise.resolve(this._user);
    }
    return new Promise<User>((resolve, reject) => {
      wx.showLoading({
        title: '加载账户中'
      });
      this.ensureLogin()
        .then(() => {
          wx.getUserInfo({
            withCredentials: true,
            success: (user) => {
              this.getAccount(user.encryptedData, user.iv)
                .then((account) => {
                  this._user = <User> user.userInfo;
                  this._user.account = account;
                  this.store();
                  resolve(this._user);
                })
                .catch(() => {
                  reject();
                });
            },
            fail: () => {
              console.log('failed');
              reject();
            },
            complete: () => {
              wx.hideLoading();
            }
          });
        })
        .catch(() => {
          this._user = null;
        });
    });
  }

  public ensureLogin() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: () => {
          if (this.user) {
            resolve();
          } else {
            this.login()
              .then(() => {
                resolve();
              })
              .catch(() => {
                reject();
              });
          }
        },
        fail: () => {
          this.login()
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        }
      });
    });
  }

  private login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            this._code = res.code;
            resolve();
          } else {
            reject(res.errMsg);
          }
        },
        fail: () => {
          reject();
        }
      });
    });
  }

  private getAccount(encryptedData: string, iv: string): Promise<Account> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://tzsbmn.com/api/Accounts/wxAccount?'
        + `encryptedData=${encodeURIComponent(encryptedData)}`
        + `&iv=${encodeURIComponent(iv)}`
        + `&code=${encodeURIComponent(this._code)}`,
        method: 'GET',
        success: (res) => {
          let account: Account = res.data.data;
          resolve(account);
        },
        fail: (err) => {
          reject();
        }
      });
    });
  }

  private restore() {
    this._user = wx.getStorageSync('account');
  }
}

export const userService = new UserService();
