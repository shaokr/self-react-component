/**
 * 头像
 */
import { Component } from 'react';
import _ from 'lodash';

import Button from 'component/button';

class Btn extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    // const { isSelect, onClick, isExistSelected } = this.props;
    // if (isExistSelected) {
    //     onClick(item);
    //     return;
    // }
    // if (item.key === 'yes') {
    //     if (!isSelect) onClick(item);
    // } else {
    //     onClick(item);
    // }
    const { item } = this.props;
    this.props.onClick(item);
  }
  // 获取样式类型
  get disabled() {
    // const { isSelect, isExistSelected, item } = this.props;
    // if (isExistSelected) {
    //   return false;
    // }
    // if (isSelect) {
    //   if (item.key === 'ok') {
    //     return true;
    //   }
    // }
    // 占英确认所有按钮不禁用 tianhong 2019/06/28
    return false;
  }
  get buttonProps() {
    const { disabled } = this;
    const { item } = this.props;
    const { key } = item;
    return {
      disabled,
      ...item,
      onClick: this.onClick
    };
  }
  render() {
    const { item } = this.props;
    console.log(this.buttonProps);
    return <Button {...this.buttonProps}>{item.txt}</Button>;
  }
}

export default class BottomBox extends Component {
  constructor(props) {
    super(props);
    // this.onClick = this.onClick.bind(this);
    // this.getType = this.getType.bind(this);
  }
  // 获取按钮列表
  get btnList() {
    const { bottomBtn } = this.props;
    return _.reverse(_.clone(bottomBtn));
  }
  render() {
    const { isSelect, onClick, isExistSelected } = this.props;
    return (
      <div className="tree-bottom">
        {_.map(this.btnList, (item, index) => (
          <Btn
            key={index}
            item={item}
            onClick={onClick}
            isSelect={isSelect}
            isExistSelected={isExistSelected}
          />
        ))}
      </div>
    );
  }
}
