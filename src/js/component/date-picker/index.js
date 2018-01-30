import { Component } from 'react';
import _ from 'lodash';
import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Input from 'component/input';

import classnames from 'classnames';
import { prefixDatePicker, prefixInput } from 'config/const';

import './style.less';
import { MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT, CLASSNAMES, CLASSNAMES_INPUT } from './config';

class ThisDayPickerInput extends Component {
    render() {
        return <Input ref={el => (this.input = el)} {...this.props} />;
    }
}

export default class DatePicker extends Component {
    render() {
        return (
            <DayPickerInput
                component={ThisDayPickerInput}
                classNames={CLASSNAMES_INPUT}
                dayPickerProps={{
                    classNames: CLASSNAMES,
                    months: MONTHS,
                    weekdaysLong: WEEKDAYS_LONG,
                    weekdaysShort: WEEKDAYS_SHORT
                }}
            />
        );
    }
}
DatePicker.defaultProps = {
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
// import { DatePicker } from 'antd';

// export default DatePicker;
