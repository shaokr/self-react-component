import _ from 'lodash';
import moment from 'moment';

import './moment-config';

/** 是否同一天 */
export const isSameDay = _.curry(
  (date1, date2) => (date2 ? moment(date1).isSame(date2, 'day') : false),
  2
);
export const isBetween = _.curry((date, dateStart, dateEnd) => {
  dateStart = dateStart ? dateStart : date;
  dateEnd = dateEnd ? dateEnd : date;
  return date.isBetween(dateStart, dateEnd, null, '[]');
}, 3);
// 判断是否在时间范围内~天判断
export const isBetweenDay = _.curry((date, dateStart, dateEnd) => {
  dateStart = dateStart ? dateStart : date;
  dateEnd = dateEnd ? dateEnd : date;
  return date.isBetween(dateStart, dateEnd, 'days', '[]');
}, 3);

class DisabledDateTimeTool {
  constructor(leng) {
    this.leng = leng;
    this.list = _.range(leng);
  }
  start = start => _.slice(this.list, 0, start);
  end = end => _.slice(this.list, end + 1, this.leng);
}
// 小时列表
export const hourList = new DisabledDateTimeTool(24);
// 分钟和秒列表
export const minuteAndSecondList = new DisabledDateTimeTool(60);

// 获取
export const getDisabledTime = _.curry((date, type) => {
  type = type === 'min' ? 'start' : 'end';
  date = moment(date);
  const hour = date.hour();
  const minute = date.minute();
  const second = date.second();

  const disabledHours = () => hourList[type](hour);
  const ltHour = hours => hour < hours; // 当前边缘是否小于选中的时间(小时
  const ltMinute = minutes => minute < minutes; // 当前边缘是否小于选中的时间(分钟
  const disabledMinutes = hours => {
    if (hours === hour) {
      return minuteAndSecondList[type](minute);
    }
    const _ltHour = ltHour(hours);
    if ((type === 'start' && !_ltHour) || (type === 'end' && _ltHour)) {
      return minuteAndSecondList.list;
    }
    return [];
  };
  const disabledSeconds = (hours, minutes) => {
    if (hours === hour && minutes === minute) {
      return minuteAndSecondList[type](second);
    }
    const _ltHour = ltHour(hours);
    const _ltMinute = ltMinute(minutes);
    // 大于边缘时间（小时 或者 相同小时并且 大于分钟
    if (
      (type === 'start' && !(_ltHour || (hours === hour && _ltMinute))) ||
      (type === 'end' && (_ltHour || (hours === hour && _ltMinute)))
    ) {
      return minuteAndSecondList.list;
    }
    return [];
  };
  return {
    disabledHours,
    disabledMinutes,
    disabledSeconds
  };
}, 2);
