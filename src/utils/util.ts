import { appState } from '../services/app-state.service';
export class Utils {
  public static formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return [year, month, day]
      .map(Utils.formatNumber).join('/')
      + ' '
      + [hour, minute, second].map(Utils.formatNumber).join(':');
  }

  public static formatTimeHM(ms) {
    let h, m, s;
    h = ~~(ms / (3600 * 1000));
    m = ~~(ms / (60 * 1000)) % 60;
    s = ~~(ms / 1000) % 60;

    if (h) {
      return `${h}小时${m}分${s}秒`;
    } else {
      return `${m}分${s}秒`;
    }
  }

  public static date2MS(date: string): number {
    return (new Date(date)).getTime();
  }

  public static date2LocalTime(date: string | Date) {
    let _date: Date = date instanceof Date ? date : new Date(date);
    return [_date.getFullYear(), _date.getMonth(), _date.getDate()].join('-')
      + ' ' + [_date.getHours(), _date.getMinutes()].join(':');
  }

  public static now() {
    return (new Date()).getTime();
  }

  public static findImages(content: string) {
    let reg = /tu_[0-9]*/;
    let matches = [];
    let found: RegExpExecArray = null;
    let preIndex = 0;
    let input = content;
    while (found = reg.exec(input)) {
      matches.push({
        text: found[0],
        index: preIndex + found.index
      });
      preIndex += found.index + found[0].length;
      input = input.substr(preIndex, input.length);
    }

    let result = [];
    let index = 0;
    content.split(reg).forEach((c) => {
      if (c === '') {
        result.push({
          type: 'img',
          url: matches[index++].text + '.jpg'
        });
      } else {
        result.push({
          type: 'text',
          content: c
        });
        if (index < matches.length) {
          result.push({
            type: 'img',
            url: matches[index++].text + '.jpg'
          });
        }
      }
    });
    return result;
  }

  public static redictTo(url) {
    wx.redirectTo({
      url: url
    });
  }

  private static formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
}
