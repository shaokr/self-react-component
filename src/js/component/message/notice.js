import { Component } from 'react';
import classnames from 'classnames';
import prefix from './prefix';

import './index.less';

class Notice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            close: false
        };
    }
    componentDidMount() {
        this.clearCloseTimer();

        if (this.props.duration) {
            this.closeTimer = setTimeout(() => {
                this.close();
            }, this.props.duration * 1000);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.close) {
            this.close();
        }
    }
    componentDidUpdate() {
        this.componentDidMount();
    }
    clearCloseTimer() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    }
    close() {
        this.setState({
            close: true
        });
        this.clearCloseTimer();
        this.state.close = false;
        setTimeout(() => {
            this.props.onClose(this.props.keys);
        }, 300);
    }
    render() {
        const classes = classnames([
            `${prefix}-notice-wrap`,
            {
                [`${prefix}-notice-close`]: this.state.close
            }
        ]);

        return (
            <div className={classes}>
                { this.props.children }
            </div>
        );
    }
}

export default Notice;
