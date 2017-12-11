/**
 * 监听document中的事件
 * e: 事件触发的元素
 * contains：是否是自己或子组件
 * documentClick(e, contains){
 * }
 */
import _ from 'lodash';
import { Component } from 'react';

const getKey = item => `document${_.upperFirst(item)}`;
const getOnKey = item => `on${_.upperFirst(item)}`;
const getIsKey = item => `is${_.upperFirst(item)}`;

export default eventList => Comp => class extends Component {
    constructor(props) {
        super(props);
        this.eventList = eventList;
        this.invokeProps = this.invokeProps.bind(this);
        this.invokeDom = this.invokeDom.bind(this);
        _.forEach(eventList, (item) => {
            const isKey = getIsKey(item);
            this[isKey] = false;

            const key = getKey(item);
            this[key] = (e) => {
                this.invokeDom(key, e, this[isKey]);
                this[isKey] = false;
            };

            const onKey = getOnKey(item);
            this[onKey] = (e) => {
                this[isKey] = true;
                this.invokeProps(onKey, e);
            };
        });
    }
    componentDidMount() {
        _.forEach(eventList, (item) => {
            document.addEventListener(item, this[getKey(item)]);
        });
    }
    componentWillUnmount() {
        _.forEach(eventList, (item) => {
            document.removeEventListener(item, this[getKey(item)]);
        });
    }
    /**
     * 执行props上的方法
     * @param {*} key props中的key
     * @param {*} req 参数
     */
    invokeProps(key, ...args) {
        const _fun = _.get(this, ['props', key]);
        if (_.isFunction(_fun)) _fun(...args);
    }
    /**
     * 执行props上的方法
     * @param {*} key props中的key
     * @param {*} req 参数
     */
    invokeDom(key, ...args) {
        const _fun = _.get(this, ['dom', key]);
        if (_.isFunction(_fun)) _fun(...args);
    }
    get onEve() {
        const onObj = {};
        _.forEach(this.eventList, (item) => {
            const key = getOnKey(item);
            onObj[key] = this[key];
        });
        return onObj;
    }
    dom = ''
    render() {
        return <Comp {...this.props} {...this.onEve} ref={(d) => { this.dom = d; }} />;
    }
};
