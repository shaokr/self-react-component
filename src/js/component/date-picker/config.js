import { prefixDatePicker } from 'config/const';

export const MONTHS = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
];
export const WEEKDAYS_LONG = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六'
];
export const WEEKDAYS_SHORT = ['一', '二', '三', '四', '五', '六', '日'];
export const CLASSNAMES = {
  container: `${prefixDatePicker}-Container`,
  wrapper: `${prefixDatePicker}-Wrapper`,
  interactionDisabled: `${prefixDatePicker}--InteractionDisabled`,
  navBar: `${prefixDatePicker}-NavBar`,
  navButton: `${prefixDatePicker}-NavButton`,
  navButtonPrev: `${prefixDatePicker}-NavButton--prev`,
  navButtonNext: `${prefixDatePicker}-NavButton--next`,
  navButtonInteractionDisabled: `${prefixDatePicker}-NavButton--interactionDisabled`,
  months: `${prefixDatePicker}-Months`,
  month: `${prefixDatePicker}-Month`,
  caption: `${prefixDatePicker}-Caption`,
  weekdays: `${prefixDatePicker}-Weekdays`,
  weekdaysRow: `${prefixDatePicker}-WeekdaysRow`,
  weekday: `${prefixDatePicker}-Weekday`,
  body: `${prefixDatePicker}-Body`,
  week: `${prefixDatePicker}-Week`,
  day: `${prefixDatePicker}-Day`,
  footer: `${prefixDatePicker}-Footer`,
  todayButton: `${prefixDatePicker}-TodayButton`,
  today: `${prefixDatePicker}-Day--today`,
  selected: `${prefixDatePicker}-Day--selected`,
  disabled: `${prefixDatePicker}-Day--disabled`,
  outside: `${prefixDatePicker}-Day--outside`
};

export const CLASSNAMES_INPUT = {
  container: `${prefixDatePicker}-Container`,
  overlayWrapper: `${prefixDatePicker}-Input-overlayWrapper`,
  overlay: `${prefixDatePicker}-Input-overlay`
};
