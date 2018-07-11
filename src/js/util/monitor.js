/**
 * 事件监听
 * Created by zombie on 2017/1/19.
 */
let keyCount = 1;
export default class Monitor {
  constructor() {
    this.list = {};
  }
  // 注册
  on = (fun = () => {}) => {
    const key = `key-${keyCount++}-${+new Date()}`;
    this.list[key] = fun;
    return key;
  };
  // 注册一次执行后关闭
  once = fn => {
    const _id = this.on(res => {
      this.off(_id);
      return fn(res);
    });
    return _id;
  };
  // // 删除
  off = key => {
    delete this.list[key];
    return true;
  };
  go = res => {
    const resList = [];
    for (const key in this.list) {
      try {
        resList.push(this.list[key](res));
      } catch (e) {
        resList.push(new Error(e));
      }
    }
    return resList;
  };
  // // 删除所有事件注册
  offAll = () => {
    this.list = {};
    return true;
  };
}
