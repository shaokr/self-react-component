import { Component } from 'react';
import classnames from 'classnames';
import QueueAnim from 'rc-queue-anim';
import { prefixMessage } from 'config/const';

import './index.less';

export default class Notice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      close: false
    };
    this.closeTimer = 0; // 喵
    this.onEnd = this.onEnd.bind(this);
    this.setCloseTimeout = this.setCloseTimeout.bind(this);
  }
  componentDidMount() {
    this.setCloseTimeout();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.close) {
      this.close();
    }
    if (nextProps.refresh !== this.props.refresh) {
      this.setCloseTimeout(nextProps.duration);
    }
  }
  onEnd(obj) {
    const { type } = obj;
    if (type === 'leave') {
      this.props.onClose();
    }
  }
  setCloseTimeout(duration = this.props.duration) {
    this.clearCloseTimer();
    if (duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, duration);
    }
  }
  clearCloseTimer() {
    clearTimeout(this.closeTimer);
  }
  close() {
    this.clearCloseTimer();
    this.setState({
      close: true
    });
  }
  render() {
    const classes = classnames([`${prefixMessage}-notice-wrap`]);
    return (
      <QueueAnim
        type="top"
        onEnd={this.onEnd}
        duration={[0, this.props.close ? 0 : 450]}
      >
        {!this.state.close && (
          <div key={this.props.keys} className={classes}>
            {this.props.children}
          </div>
        )}
      </QueueAnim>
    );
  }
}

Notice.defaultProps = {
  close: false,
  duration: 30000
};
