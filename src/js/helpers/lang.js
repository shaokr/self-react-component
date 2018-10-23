import { Component } from 'react';
import _ from 'lodash';
import Monitor from 'util/monitor';

String.prototype.langReplace = function(...arr) {
  let _str = this.toString();
  if (_str) {
    _.forEach(arr, (item, index) => {
      _str = _str.replace(new RegExp(`\\$${index}`, 'g'), item);
    });
  }
  return _str;
};

export const langMix = lang => Comp =>
  class extends Component {
    static getDerivedStateFromProps(props, state) {
      lang.data = props.lang;
    }
    state = {
      lang: lang.data
    };
    id = '';
    constructor(props) {
      super(props);
      lang.data = props.lang;
      this.id = lang._monitor.on(data => {
        this.setState({ lang: data });
      });
    }
    componentWillUnmount() {
      lang._monitor.off(this.id);
    }
    getLangKey = (key1, key2 = key1) =>
      _.get(this.renderDom, ['props', 'lang', key1]) || _.get(lang, key2);
    getLangProps = (key1, key2 = key1, key3 = key2) => {
      const val = _.get(this.renderDom, ['props', key1]);
      if (_.isUndefined(val)) {
        return this.getLangKey(key2, key3);
      } else {
        return val;
      }
    };
    render() {
      this.renderDom = (
        <Comp
          {...this.props}
          getLangKey={this.getLangKey}
          getLangProps={this.getLangProps}
        />
      );
      return this.renderDom;
    }
  };

export default class {
  _monitor = new Monitor();
  get data() {
    return this._lang;
  }
  set data(value) {
    this._lang = _.assign({}, this._lang, value);
  }
  constructor(props) {
    this.data = props;
    _.forEach(this.data, (item, key) =>
      Object.defineProperty(this, key, {
        get: function() {
          return this.data[key];
        }
      })
    );
  }
}
