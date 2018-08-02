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
  container: `${prefixDatePicker}-container`,
  wrapper: `${prefixDatePicker}-wrapper`,
  interactionDisabled: `${prefixDatePicker}--interactionDisabled`,

  months: `${prefixDatePicker}-months`,
  month: `${prefixDatePicker}-month`,

  navBar: `${prefixDatePicker}-navbar`,
  navButton: `${prefixDatePicker}-navbar__button`,
  get navButtonPrev() {
    return `${this.navButton} ${prefixDatePicker}-navbar__button--prev`;
  },
  get navButtonNext() {
    return `${this.navButton} ${prefixDatePicker}-navbar__button--next`;
  },
  navButtonInteractionDisabled: `${prefixDatePicker}-navbar__button--disabled`,

  caption: `${prefixDatePicker}-caption`,
  weekdays: `${prefixDatePicker}-weekdays`,
  weekdaysRow: `${prefixDatePicker}-weekdays__row`,
  weekday: `${prefixDatePicker}-weekdays__day`,
  body: `${prefixDatePicker}-body`,
  week: `${prefixDatePicker}-week`,
  todayButton: `${prefixDatePicker}-todayButton`,

  day: `${prefixDatePicker}-day`,
  today: `${prefixDatePicker}-day--today`,
  selected: `${prefixDatePicker}-day--selected`,
  disabled: `${prefixDatePicker}-day--disabled`,
  outside: `${prefixDatePicker}-day--outside`,

  footer: `${prefixDatePicker}-footer`
};

export const CLASSNAMES_INPUT = {
  container: `${prefixDatePicker}-container`,
  overlayWrapper: `${prefixDatePicker}-input-overlayWrapper`,
  overlay: `${prefixDatePicker}-input-overlay`
};
