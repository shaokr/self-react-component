import _ from 'lodash';
import fedColor from 'fed-const';

const bgColor = _.get(fedColor, 'USER_AVATAR_BG_COLOR_CONF', [
  '#FA7976',
  '#B7A0F1',
  '#6890F3',
  '#57BAB3',
  '#61C7F1',
  '#FAA77D'
]);

const list = {};
export default id => {
  if (list[id]) {
    return list[id];
  }

  const bg = bgColor[id % bgColor.length];
  list[id] =
    bg ||
    `rgb(${_.random(80, 244)}, ${_.random(129, 208)}, ${_.random(92, 205)})`;
  return list[id];
};
