import { Account } from './account.interface';

export enum sex {
  unknow, female, male
}

export interface User {
  openId: string;
  nickName: string;
  gender: sex;
  city: string;
  province: string;
  country: string;
  avatarUrl: string;
  unionId: number;
  watermark: {
    appid: string;
    timestamp: string;
  };
  account: Account;
}
