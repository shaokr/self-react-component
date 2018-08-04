/**
 * 时间控件
 * https://github.com/fis-components/rc-calendar
 */
import { Component } from 'react';
import _ from 'lodash';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'rc-calendar/assets/index.css';
import Calendar from 'rc-calendar';
import Picker from 'rc-calendar/lib/Picker';

import { Panel } from '../time-picker';
import moment from 'moment';

import Input from '../input';

import PromiseClass from 'util/promise-class';

import classnames from 'classnames';
import { prefixDatePicker } from 'config/const';
import { langMix } from 'helpers/lang';

import './style.less';

import lang from './lang';
import MonthPicker from './month';
import WeekPicker from './week';
import RangePicker from './range';

export { MonthPicker };
export { WeekPicker };
export { RangePicker };
moment.defineLocale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(
    '_'
  ),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_')
});

class DisabledDateTimeTool {
  constructor(leng) {
    this.leng = leng;
    this.list = _.range(leng);
  }
  start = start => _.slice(this.list, 0, start);
  end = end => _.slice(this.list, end + 1, this.leng);
}
// 获取
const getDisabledDateTime = (date, type) => {
  type = type === 'min' ? 'start' : 'end';
  date = moment(date);
  const hour = date.hour();
  const minute = date.minute();
  const second = date.second();

  const hourList = new DisabledDateTimeTool(24);
  const minuteAndSecondList = new DisabledDateTimeTool(60);
  console.log(hourList);
  const disabledHours = () => hourList[type](hour);
  const disabledMinutes = hours => {
    if (hours === hour) return minuteAndSecondList[type](minute);
  };
  const disabledSeconds = (hours, minutes) => {
    if (hours === hour && minute === minutes)
      return minuteAndSecondList[type](second);
  };
  return {
    disabledHours,
    disabledMinutes,
    disabledSeconds
  };
};

// @documentOn(['onClick'])
@langMix(lang)
export default class extends Component {
  static defaultProps = {
    allowClear: true, //	是否显示清除按钮	boolean	true
    className: '', //	选择器 className	string	''
    disabled: false, //	禁用	boolean	false
    // disabledDate: '', //	不可选择的日期	(currentDate: moment) => boolean	无
    // disabledDateTime: '',
    minDate: '2018-8-1 10:20:15', // 最小可选时间
    maxDate: '2018-8-10 10:59:59', // 最大可选时间
    getCalendarContainer: '', //	定义浮层的容器，默认为 body 上新建 div	function(trigger)	无
    defaultValue: +new Date(),
    // showTime: false,
    // locale: '', //	国际化配置	object	默认配置
    open: false, //	控制弹层是否展开	boolean	-
    // placeholder: lang.inputPlaceholder, //	输入框提示文字	string|RangePicker[]	-
    popupStyle: '', //	格外的弹出日历样式	object	{}
    size: 'default', //	输入框大小，large 高度为 32px，small 为 22px，默认是 28px	string	无
    style: '', // 自定义输入框样式	object	{}
    onOpenChange: '' //	弹出日历和关闭日历的回调	function(status)	无
  };
  constructor(props) {
    super(props);
    this.state = {
      calendarShow: false,
      calendarVal: moment(props.defaultValue),
      style: {}
    };
  }
  onShowCalendar = () => {
    this.setState(state => {
      state.calendarShow = true;
      return state;
    });
  };
  onChange = mDate => {
    const { props } = this;
    if (_.isFunction(props.onChange)) {
      props.onChange(mDate);
    }
    this.setState({
      calendarShow: false,
      calendarVal: mDate
    });
  };
  inputVal = value => {
    if (value) {
      const { showTime } = this.props;
      return value.format(showTime ? lang.dateTimeFormat : lang.dateFormat);
    }
    return '';
  };
  get disabledDate() {
    const { minDate, disabledDate, maxDate } = this.props;
    if (disabledDate) return disabledDate;
    // const _minDate = moment(minDate);
    // const _maxDate = moment(maxDate);
    return date => {
      const isMinDate = minDate ? date.diff(minDate) >= 0 : true;
      const isMaxDate = maxDate ? date.diff(maxDate, 'days') <= 0 : true;
      return !(isMinDate && isMaxDate);
    };
  }
  get disabledDateTime() {
    const { minDate, disabledDateTime, maxDate } = this.props;
    const { calendarVal } = this.state;
    if (disabledDateTime) return disabledDateTime(calendarVal);
    if (calendarVal.diff(minDate, 'days') === 0) {
      return getDisabledDateTime(minDate, 'min');
    }
    if (calendarVal.diff(maxDate, 'days') === 0) {
      return getDisabledDateTime(maxDate, 'max');
    }
    return {};
    //   }
    // }
  }
  get calendar() {
    const { calendarShow, style, calendarVal } = this.state;
    const { showTime, disabledDate } = this.props;
    let panelProps = {
      ...this.disabledDateTime
    };
    if (_.isObject(showTime)) {
      panelProps = showTime;
    }
    function disabledDate2(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    }
    return (
      <Calendar
        locale={lang}
        className={`${prefixDatePicker}-calendar`}
        // onSelect={this.onSelect}
        // value={calendarVal}
        // disabledTimedisabledTime
        // formatter="YYYY-MM-DD"
        // showDateInput
        // disabledDate={disabledDate}
        disabledDate={this.disabledDate}
        // monthCellContentRender={console.log}
        timePicker={
          showTime ? (
            <Panel
              {...panelProps}
              className={classnames([
                `${prefixDatePicker}-panel`,
                panelProps.className
              ])}
            />
          ) : null
        }
        dateInputPlaceholder={this.inputPlaceholder}
      />
    );
  }
  get inputPlaceholder() {
    return this.props.getLangProps('placeholder', 'inputPlaceholder');
  }
  render() {
    const { calendarVal } = this.state;
    return (
      <Picker
        dropdownClassName={`${prefixDatePicker}-picker`}
        calendar={this.calendar}
        value={calendarVal}
        onChange={this.onChange}
      >
        {({ value }) => (
          <Input
            placeholder={this.inputPlaceholder}
            value={this.inputVal(value)}
          />
        )}
      </Picker>
    );
  }
}
// import { DatePicker } from 'antd';

// export default DatePicker;
