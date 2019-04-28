/**
 * 电子公告主要框
 */
import { Component } from 'react';
import _ from 'lodash';
import { prefix } from 'config/const';
import classnames from 'classnames';

import avatarBase64 from 'helpers/avatar-base64';
import { langMix } from 'helpers/lang';

import Icon from 'component/icon';

import Avatar from '../avatar';
import { Checked } from '../circle';

import lang from '../lang';

import './index.less';

const _prefix = `${prefix}-tree-search`;

const Li = ({ onCheck, item, selected, list, disableKeys }) => {
  const key = item.key.toString();
  const data = list[key] || {};
  const show = selected.has(key) || data.checked;
  const checkedType = show ? 1 : 9999;
  const isDisabled = _.indexOf(disableKeys, item.key) !== -1;
  const css = classnames({
    'type-immutable':
      (!data.isChangeChecked && data.isChangeChecked !== undefined) ||
      isDisabled, // 不可变化
    'type-normal': data.isChangeChecked
  });
  return (
    <li className={css} onClick={() => onCheck(item)}>
      <Avatar
        name={item.name}
        avatar={item.avatar || avatarBase64(item.name, item.key)}
        icon={item.icon}
        dataKey={item.key}
        color={item.color}
      />
      <div className="list-content">
        <div>{item.name}</div>
        <small>{item.small}</small>
      </div>
      <Checked className="tree-checkbox" type={checkedType} />
    </li>
  );
};

@langMix(lang)
export default class Selected extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      listShow: false,
      list: [],
      loading: false,
      from: '0',
      scrollEnd: false
    };

    this.setTimeoutId = 0;

    this.onChange = this.onChange.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onClickThis = this.onClickThis.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    // this.onChangeHandle = this.onChangeHandle.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.onBlurHandler, false);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.onBlurHandler, false);
  }
  // 点击清除按钮
  onClose() {
    this.setState({
      value: '',
      list: []
    });
  }
  // 处理onChange结果公共函数
  onChangeHandle = _res => {
    // _.throttle(_res => {
    // console.log(_res);
    const {
      store: { list }
    } = this.props;
    let result = [];
    const { hits: res, from, val } = _res;
    if (typeof _res === 'string' && _res) {
      const children = [];
      try {
        const regExp = new RegExp(
          _res
            .replace(/[ 　]/g, '')
            .split('')
            .join('[\\s\\S]*')
        );
        _.forEach(list, item => {
          const name = _.get(item, 'name');
          // console.log(name);
          if (_.isString(name) && name.match(regExp)) {
            children.push({
              icon: item.icon,
              avatar: item.avatar,
              name: item.name,
              key: item.key
            });
          }
        });
      } catch (e) {}
      if (children.length) {
        result = [
          {
            title: lang.searchResult, // '查找结果',
            children
          }
        ];
      } else {
        result = [
          {
            title: lang.searchNull, //'没有查找到数据',
            children
          }
        ];
      }
    } else if (_.isArray(res)) {
      if (val === '') return;
      if (this.state.scrollEnd) return;
      if (val === this.state.value && this.state.loading) {
        this.setState({
          from,
          loading: false
        });
        const { list: newList } = this.state;
        if (newList.length) {
          if (res.length) {
            for (let value of res[0].children) {
              newList[0].children.push(value);
            }
            result = newList;
          } else {
            this.setState({
              scrollEnd: true
            });
            result = newList;
          }
        } else {
          result = res;
        }
      } else {
        this.setState({
          from: '0',
          loading: false
        });
        if (!res.length) {
          result = [
            {
              title: lang.searchNull, //'没有查找到数据',
              children: []
            }
          ];
        } else {
          result = res;
        }
      }
    }
    this.setState({
      list: result
    });
  };
  // }, 1000);
  // 值修改

  onChange(event) {
    // console.log(event.target.value);
    const { onChange } = this.props;
    this.setState({
      value: event.target.value,
      from: '0',
      list: [
        {
          title: '',
          children: []
        }
      ],
      loading: false,
      scrollEnd: false
    });
    this.onChangeMiddle({ ...event }, onChange);
  }
  onChangeMiddle = _.throttle(
    (event, onChange) => {
      // console.log(event.target);
      onChange(event, this.onChangeHandle);
    },
    600,
    { leading: false }
  );
  // 滚动事件
  onScroll(e) {
    if (
      !this.state.loading &&
      e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop < 50
    ) {
      this.setState({
        loading: true
      });
      const event = {
        target: {
          value: this.state.value,
          getAttribute: attr => {
            if (attr === 'from') return this.state.from;
          }
        }
      };
      const { onChangemore } = this.props;
      onChangemore(event, this.onChangeHandle);
    }
  }
  // 失去焦点
  onBlurHandler() {
    const { listShow } = this.state;
    if (listShow) {
      this.setState({
        listShow: false
      });
    }
  }
  // 元素内点击
  onClickThis(e) {
    e.nativeEvent.stopImmediatePropagation();
    const { listShow } = this.state;
    if (!listShow) {
      this.setState({
        listShow: true
      });
    }
  }
  // 获取列表数据
  get list() {
    const { list, listShow, value, loading } = this.state;
    if (listShow && value) {
      const {
        store: { selected, list: storeList },
        action: { onCheck }
      } = this.props;
      return (
        <div className={`${_prefix}-list scroll`} onScroll={this.onScroll}>
          {_.map(list, (item, index) => {
            const { title, children } = item;
            return (
              <div key={index} className={`${_prefix}-group`}>
                <h4 className={`${_prefix}-group--title`}>{title}</h4>
                <ul>
                  {_.map(children, item2 => {
                    const { key } = item2;
                    if (typeof key !== 'undefined') {
                      return (
                        <Li
                          key={key}
                          onCheck={onCheck}
                          selected={selected}
                          list={storeList}
                          item={item2}
                          disableKeys={this.props.disableKeys}
                        />
                      );
                    }
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      );
    }
  }
  get closeIcon() {
    if (this.state.value) {
      return (
        <Icon
          type="close"
          className={`${_prefix}--close`}
          onClick={this.onClose}
        />
      );
    }
  }
  render() {
    const { placeholder } = this.props;
    const { from } = this.state;
    return (
      <label
        className={_prefix}
        htmlFor="male"
        onClickCapture={this.onClickThis}
      >
        <Icon className={`${_prefix}--search`} type="search" />
        <input
          type="text"
          id="male"
          value={this.state.value}
          placeholder={placeholder}
          onChange={this.onChange}
          from={from}
        />
        {this.closeIcon}
        {this.list}
      </label>
    );
  }
}
