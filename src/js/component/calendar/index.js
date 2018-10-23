import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import { prefixCalendar } from 'config/const';
import SuperDom from 'component/super-dom';

/**
 * 设置年
 */

@SuperDom
export default class calendar extends Component {
    render() {
        return (
            <div className={prefixCalendar}>
                
            </div>
        );
    }
}