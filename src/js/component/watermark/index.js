import { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';

import { prefixWatermark } from 'config/const';

import './index.less';

export default class Watermark extends Component {
    constructor(props) {
        super(props);
        this.setWatermark = this.setWatermark.bind(this);
        this.state = {
            parent: false
        };
    }
    componentDidMount() {
        this.setId = setInterval(() => {
            const parent = _.get(this, ['crw', 'offsetParent']);
            if (parent) {
                this.setState({
                    parent
                });
                clearInterval(this.setId);
            }
        }, 500);
    }
    componentDidUpdate() {
        this.setWatermark();
    }
    /**
     * 设置水印
     */
    setWatermark() {
        const fontsize = 14;
        const { text } = this;
        const width = this.crw.width;
        const height = this.crw.height;
        const crw = this.crw;

        const cw = document.createElement('canvas');
        const cwWidth = 70 * text.length;
        cw.width = cwWidth;
        cw.height = cwWidth;
        const ctx = cw.getContext('2d');
        
        ctx.clearRect(0, 0, cwWidth, cwWidth);
        ctx.rotate((-30 * Math.PI) / 180);
        ctx.font = `${fontsize}px microsoft yahei`;
        // ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        _.forEach(text, (item, index) => {
            ctx.fillText(item, 0, (cwWidth / text.length) * (index + 1));
        });
        ctx.rotate((30 * Math.PI) / 180);

        const ctxr = crw.getContext('2d');
        ctxr.clearRect(0, 0, width, height);
        const pat = ctxr.createPattern(cw, 'repeat');
        ctxr.fillStyle = pat;
        ctxr.fillRect(0, 0, width, height);
    }
    get text() {
        const { text } = this.props;
        if (_.isString(text)) {
            return [text];
        }
        if (_.isArray(text)) {
            return text;
        }
    }
    get height() {
        const { state, props } = this;
        let height = 0;
        if (!_.isUndefined(props.height)) {
            height = props.height;
        } else if (state.parent) {
            height = state.parent.clientHeight;
        }
        return height;
    }
    get width() {
        const { state, props } = this;
        let width = 0;
        if (!_.isUndefined(props.width)) {
            width = props.width;
        } else if (state.parent) {
            width = state.parent.clientWidth;
        }
        return width;
    }
    get className() {
        return classnames([
            prefixWatermark, this.props.className
        ]);
    }
    render() {
        if (!this.props.text) return null;
        return <canvas className={this.className} style={this.style} width={this.width} height={this.height} ref={(d) => { this.crw = d; }} />;
    }
}

Watermark.defaultProps = {
    className: '',
    text: ''
};
