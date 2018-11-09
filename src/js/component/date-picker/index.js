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
import {
  isSameDay,
  isBetween,
  isBetweenDay,
  hourList,
  minuteAndSecondList,
  getDisabledTime
} from './tool';

import MonthPicker from './month';
import WeekPicker from './week';
import RangePicker from './range';

export { MonthPicker };
export { WeekPicker };
export { RangePicker };

// @documentOn(['onClick'])
@langMix(lang)
export default class extends Component {
  static defaultProps = {
    allowClear: true, //	是否显示清除按钮	boolean	true
    className: '', //	选择器 className	string	''
    disabled: false, //	禁用	boolean	false
    disabledDate: '', //	不可选择的日期	(currentDate: moment) => boolean	无
    disabledDateTime: '',
    minDate: '', // 最小可选时间
    maxDate: '', // 最大可选时间
    // getCalendarContainer: '', //	定义浮层的容器，默认为 body 上新建 div	function(trigger)	无
    defaultValue: +new Date(),
    showTime: false,
    // locale: '', //	国际化配置	object	默认配置
    // open: false, //	控制弹层是否展开	boolean	-
    // placeholder: lang.inputPlaceholder, //	输入框提示文字	string|RangePicker[]	-
    // popupStyle: '', //	格外的弹出日历样式	object	{}
    size: 'default', //	输入框大小，large 高度为 32px，small 为 22px，默认是 28px	string	无
    style: '', // 自定义输入框样式	object	{}
    onOpenChange() {}, //	弹出日历和关闭日历的回调	function(status)	无
    onChange() {}
  };
  constructor(props) {
    super(props);
    this.state = {
      calendarVal: moment(props.defaultValue),
      style: {}
    };
    this.date = this.state.calendarVal;
  }
  get minDate() {
    const { minDate } = this.props;
    if (!_.isNaN(minDate * 1)) {
      return minDate * 1;
    }
    return minDate;
  }
  get maxDate() {
    const { maxDate } = this.props;
    if (!_.isNaN(maxDate * 1)) {
      return maxDate * 1;
    }
    return maxDate;
  }
  onChange = date => {
    const { onChange } = this.props;
    const { minDate, maxDate } = this;
    if (!isBetween(date, minDate, maxDate)) {
      const _minDate = moment(minDate);
      const _maxDate = moment(maxDate);
      if (_minDate.isAfter(date)) {
        date = _minDate;
      } else if (_maxDate.isBefore(date)) {
        date = _maxDate;
      }
    }
    if (_.isFunction(onChange)) {
      onChange(date);
    }
    this.setState({
      calendarVal: date
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
    const { disabledDate } = this.props;
    const { minDate, maxDate } = this;
    if (disabledDate) return disabledDate;
    return date => !isBetweenDay(date, minDate, maxDate);
  }
  get disabledDateTime() {
    const { disabledDateTime } = this.props;
    const { minDate, maxDate } = this;
    if (disabledDateTime) return disabledDateTime;
    return date => {
      const _isSameDay = isSameDay(date);
      // 是否在范围内
      if (isBetweenDay(date, minDate, maxDate)) {
        if (_isSameDay(minDate)) {
          return getDisabledTime(minDate, 'min');
        }
        if (_isSameDay(maxDate)) {
          return getDisabledTime(maxDate, 'max');
        }
        return {};
      }
      return {
        disabledHours: () => hourList.list,
        disabledMinutes: () => minuteAndSecondList.list,
        disabledSeconds: () => minuteAndSecondList.list
      };
    };
  }
  get calendar() {
    const { showTime } = this.props;
    let panelProps = {};
    if (_.isObject(showTime)) {
      panelProps = showTime;
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
        // onChange={console.log.bind(this, 'qweqweqw')}
        disabledDate={this.disabledDate}
        disabledTime={this.disabledDateTime}
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
    const { onOpenChange, open } = this.props;
    // return this.calendar;
    return (
      <Picker
        dropdownClassName={`${prefixDatePicker}-picker`}
        calendar={this.calendar}
        value={calendarVal}
        onChange={this.onChange}
        onOpenChange={onOpenChange}
        // open={open}
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
