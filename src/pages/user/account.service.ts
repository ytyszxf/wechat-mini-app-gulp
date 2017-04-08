import { Account } from '../../models/account.interface';
import { userService } from '../../services/user.service';

export class AccountService {
  public static recharge(accountNumber: string): Promise<Account> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://tzsbmn.com/api/Accounts/mergeWithAccount?'
        + `sourceAccountNumber=${accountNumber}`
        + `&targetAccountNumber=${userService.user.account.accountNumber}`,
        method: 'POST',
        success: (res) => {
          if (res.statusCode !== 200) {
            reject(res.data.error);
            return;
          }
          let account: Account = res.data.data;
          userService.user.account = account;
          userService.store();
          resolve(account);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  public static getAccountInfo(accountNumber: string): Promise<Account> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://tzsbmn.com/api/Accounts/getAccountInfo',
        method: 'POST',
        success: (res) => {
          if (res.statusCode !== 200) {
            reject(res.data.error);
            return;
          }
          let account: Account = res.data.data.message;
          resolve(account);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }
}
