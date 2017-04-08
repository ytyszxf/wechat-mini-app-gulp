import { User } from '../models/user.interface';
import { Account } from '../models/account.interface';
import { Module } from '../models/module.interface';
import { Exam } from '../models/exam.interface';

interface PersistanceState {
  currentModule: Module;
  currentAccount: Account;
  modules: Module[];
  user: User;
}

export class AppState {
  public static instance = new AppState();

  private _currentModule: Module;
  private _currentAccount: Account;
  private _modules: Module[];
  private _user: User;
  private _code: string;

  public get code() {
    return this._code;
  }

  public get currentModule() {
    return this._currentModule;
  }

  public get currentAccount() {
    return this._currentAccount;
  }

  public get modules() {
    return this._modules;
  }

  public get user() {
    return this._user;
  }

  public setCurrentModule(m: Module) {
    this._currentModule = m;
    this.store();
  }

  public setCurrentAccount(user: Account) {
    this._currentAccount = user;
    this.store();
  }

  public setModules(modules: Module[]) {
    this._modules = modules;
  }

  public setUser(user: User) {
    this._user = user;
  }

  public setCode(code: string) {
    this._code = code;
  }

  public reload() {
    let data: PersistanceState = wx.getStorageSync('state');
    if (!data) { return; }
    this._currentModule = data.currentModule;
    this._currentAccount = data.currentAccount;
    this._modules = data.modules;
    this._user = data.user;
  }

  public store() {
    let data: PersistanceState = {
      currentModule: this._currentModule,
      currentAccount: this._currentAccount,
      modules: this._modules,
      user: this._user
    };

    wx.setStorageSync('state', data);
  }
}

export const appState = AppState.instance;
