/**
 * 时间控件
 * https://github.com/fis-components/rc-calendar
 */
import { Component } from 'react';
import _ from 'lodash';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'rc-calendar/assets/index.css';
import Calendar from 'rc-calendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';

import Input from '../input';

import PromiseClass from 'util/promise-class';

import Floating from '../floating';
import classnames from 'classnames';
import { prefixDatePicker, prefixInput } from 'config/const';
import documentOn from 'helpers/document-on';
import { createRef } from 'helpers/ref-tool';

import './style.less';
import {
  MONTHS,
  WEEKDAYS_LONG,
  WEEKDAYS_SHORT,
  CLASSNAMES,
  CLASSNAMES_INPUT
} from './config';

export default class extends Component {
  static defaultProps = {
    allowClear: true, //	是否显示清除按钮	boolean	true
    className: '', //	选择器 className	string	''
    disabled: false, //	禁用	boolean	false
    disabledDate: false, //	不可选择的日期	(currentDate: moment) => boolean	无
    getCalendarContainer: '', //	定义浮层的容器，默认为 body 上新建 div	function(trigger)	无
    // locale: '', //	国际化配置	object	默认配置
    open: false, //	控制弹层是否展开	boolean	-
    placeholder: '', //	输入框提示文字	string|RangePicker[]	-
    popupStyle: '', //	格外的弹出日历样式	object	{}
    size: 'default', //	输入框大小，large 高度为 32px，small 为 22px，默认是 28px	string	无
    style: '', // 自定义输入框样式	object	{}
    onOpenChange: '' //	弹出日历和关闭日历的回调	function(status)	无
  };
  constructor(props) {
    super(props);
    this.state = {
      calendarShow: false
    };
  }
  onShowCalendar = () => {
    this.setState(state => {
      state.calendarShow = true;
      return state;
    });
  };
  componentDidMount() {
    // console.log(this.input.current);
    this.mainDom.resolve(this.input.current);
  }
  input = createRef();
  mainDom = new PromiseClass();
  render() {
    const { calendarShow } = this.state;
    return (
      <div style={{ height: 900 }}>
        <Input onFocus={this.onShowCalendar} ref={this.input} />
        <Floating
          visible={calendarShow}
          parentDom={this.mainDom.promise}
          // placement="topLeft"
        >
          <Calendar locale={zhCN} showWeekNumber showOk />
        </Floating>
      </div>
    );
  }
}
// import { DatePicker } from 'antd';

// export default DatePicker;
