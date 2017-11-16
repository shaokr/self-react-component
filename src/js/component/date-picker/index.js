import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { prefixDatePicker } from 'config/const';


export default class DatePicker extends Component {
    render() {
        return (
            <div> 1</div>
        );
    }
}
DatePicker.defaultProps = {
    allowClear: true, //	是否显示清除按钮	boolean	true
    className: '', //	选择器 className	string	''
    disabled: false, //	禁用	boolean	false
    disabledDate: false, //	不可选择的日期	(currentDate: moment) => boolean	无
    getCalendarContainer: '', //	定义浮层的容器，默认为 body 上新建 div	function(trigger)	无
    locale: '', //	国际化配置	object	默认配置
    open: false, //	控制弹层是否展开	boolean	-
    placeholder: '', //	输入框提示文字	string|RangePicker[]	-
    popupStyle: '', //	格外的弹出日历样式	object	{}
    size: 'default', //	输入框大小，large 高度为 32px，small 为 22px，默认是 28px	string	无
    style: '', // 自定义输入框样式	object	{}
    onOpenChange: '' //	弹出日历和关闭日历的回调	function(status)	无
};
