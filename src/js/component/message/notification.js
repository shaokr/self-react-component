/* global document : true*/
import { Component } from 'react';
import ReactDom from 'react-dom';
import _ from 'lodash';

import superDom, { ShowDom } from '../super-dom';

import prefix from './prefix';
import Notice from './notice';

let seed = 0;
const now = Date.now();
const getUuid = () => (`rcNotification_${now}_${seed++}`);

class Notification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notices: []
        };

        this.remove = this.remove.bind(this);
    }
    add(notice) {
        const key = notice.key || getUuid();
        const { notices } = this.state;

        notice.key = key;
        if (!_.find(notices, item => (item.key === key))) {
            notices.push(notice);
            this.setState({
                notices
            });
        }
    }
    animateRemove(key) {
        const { notices } = this.state;
        _.forEach(notices, (item) => {
            if (item.key === key) {
                item.close = true;
            }
        });
        this.setState({
            notices
        });
    }
    remove(key) {
        const notices = _.filter(this.state.notices, item => (item.key !== key));
        this.setState({
            notices
        });
    }
    render() {
        return (
            <div className={`${prefix}-modal-warp`}>
                {
                    _.map(this.state.notices, notice => <Notice key={notice.key} close={notice.close} keys={notice.key} duration={notice.duration} onClose={this.remove}>{notice.content}</Notice>)
                }
            </div>
        );
    }
}

// Notification.newInstance = (properties) => {
//     const props = properties | {};
//     const div = document.createElement('div');

//     document.body.appendChild(div);

//     const notifiaction = ReactDom.render(<Notification {...props} />, div);

//     return {
//         notice: (noticeProps) => {
//             notifiaction.add(noticeProps);
//         },
//         removeNotice: (key) => {
//             notifiaction.remove(key);
//         },
//         animateRemove: (key) => {
//             notifiaction.animateRemove(key);
//         },
//         component: notifiaction,
//         destroy: () => {
//             ReactDom.unmountComponentAtNode(div);
//             document.body.removeChild(div);
//         }
//     };
// };
Notification.newInstance = (properties) => {
    const props = properties | {};

    const rdom = new ShowDom();
    const notifiaction = rdom.init(<Notification {...props} visible />);
    return {
        notice: (noticeProps) => {
            notifiaction.add(noticeProps);
        },
        animateRemove: (key) => {
            notifiaction.animateRemove(key);
        },
        component: notifiaction,
        // destroy: () => {
        //     ReactDom.unmountComponentAtNode(div);
        //     document.body.removeChild(div);
        // }
    };
};



export default Notification;
