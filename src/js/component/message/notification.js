import { Component } from 'react';
import _ from 'lodash';
import PromiseClass from 'util/promise-class';
import { prefixMessage } from 'config/const';
import QueueAnim from 'rc-queue-anim';

import { ShowDom } from '../super-dom';

import Notice from './notice';

let seed = 0;
const now = Date.now();
const getUuid = () => `rcNotification_${now}_${seed++}`;

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notices: []
    };

    this.remove = this.remove.bind(this);
    this.PromiseClass = new PromiseClass();
  }
  componentDidMount() {
    this.PromiseClass.resolve(true);
  }
  add = async notice => {
    await this.PromiseClass.promise;
    const key = notice.key || getUuid();
    const { notices } = this.state;
    notice.key = key;
    if (!_.find(notices, item => item.key === key)) {
      setTimeout(() => {
        notices.push(notice);
        this.setState({
          notices
        });
      }, notices.delay * 1000);
    }
  };
  animateRemove(key) {
    const { notices } = this.state;
    _.forEach(notices, item => {
      if (item.key === key) {
        item.close = true;
      }
    });
    this.setState({
      notices
    });
  }
  remove(key) {
    const notices = _.filter(this.state.notices, item => item.key !== key);
    this.PromiseClass = new PromiseClass();
    this.setState(
      {
        notices
      },
      () => {
        this.PromiseClass.resolve(true);
      }
    );
  }
  /**
   * 刷新能力
   */
  refresh(key, obj) {
    const notices = _.map(this.state.notices, item => {
      if (item.key === key) {
        _.assign({}, item, obj);
        item.refresh = +new Date();
      }
      return item;
    });
    this.setState({
      notices
    });
  }
  render() {
    return (
      <div className={`${prefixMessage}-modal-warp`}>
        <QueueAnim type="top">
          {_.map(this.state.notices, notice => (
            <Notice
              key={notice.key}
              close={notice.close}
              keys={notice.key}
              duration={notice.duration * 1000}
              refresh={notice.refresh}
              onClose={() => {
                this.remove(notice.key);
                if (_.isFunction(notice.onClose)) notice.onClose();
              }}
            >
              {notice.content}
            </Notice>
          ))}
        </QueueAnim>
      </div>
    );
  }
}

Notification.newInstance = properties => {
  const props = properties | {};

  const rdom = new ShowDom();
  const notifiaction = rdom.init(<Notification {...props} visible />);
  return {
    notice: noticeProps => {
      notifiaction.add(noticeProps);
    },
    animateRemove: key => {
      notifiaction.animateRemove(key);
    },
    removeNotice: key => {
      notifiaction.remove(key);
    },
    refresh: key => {
      notifiaction.refresh(key);
    },
    component: notifiaction
    // destroy: () => {
    //     ReactDom.unmountComponentAtNode(div);
    //     document.body.removeChild(div);
    // }
  };
};

export default Notification;
