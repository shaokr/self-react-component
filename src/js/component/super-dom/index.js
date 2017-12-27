import { Component } from 'react';
import ReactDOM from 'react-dom';
import QueueAnim from 'rc-queue-anim';
import PromiseClass from 'util/promise-class';


export class ShowDom {
    isShow = false; // 是否已经显示
    dom = document.createElement('div');
    // 初始化
    init = (component) => {
        this.remove(); // 删除上一次的元素

        this.initPromise = new PromiseClass(); // 赋值新的promise
        this.removePromise = new PromiseClass(); // 赋值新的promise

        this.isShow = true;
        document.body.appendChild(this.dom);
        this.rectdom = ReactDOM.render(component, this.dom);
        this.initPromise.resolve(true);
        return this.rectdom;
    }
    // 删除dom元素
    remove = () => {
        if (this.initPromise) {
            this.initPromise.promise.then(() => {
                if (this.isShow) {
                    this.isShow = false;
                    this.removePromise.resolve(true);
                    document.body.removeChild(this.dom);
                }
            });
        }
    }
    onUpdate() {

    }
    update(nextProps, nextState) {

    }

}


export default Comp => class SuperDom extends Component {
    constructor(props) {
        super(props);

        this.rootDom = props.getContainer || document.createElement('div');
        this.remove = this.remove.bind(this);
        this.removeChild = this.removeChild.bind(this);
        this.appendChild = this.appendChild.bind(this);
        this.onEnd = this.onEnd.bind(this);
        if (props.rdom) {
            props.rdom.removePromise.promise.then(this.remove);
        }
        this.state = {
            appOK: false
        };
    }
    componentWillUpdate(nextProps, nextState) {
        const { props } = this;
        if (props.rdom) {
            props.rdom.update(nextProps, nextState);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.appendChild();
        } else {
            this.removeChild();
        }
    }
    componentDidMount() {
        if (this.props.visible) {
            this.appendChild();
        }
    }
    componentWillUnmount() {
        this.remove();
    }
    // 删除
    remove() {
        const { getContainer } = this.props;
        if (!getContainer) {
            this.removeChild();
        }
    }
    // 添加dom元素到页面
    appendChild() {
        const { appOK } = this.state;
        if (!appOK) {
            document.body.appendChild(this.rootDom);
            this.setState({
                appOK: true
            });
        }
    }
    // 删除dom元素
    removeChild() {
        // if (this.appOK) {
        //     this.appOK = null;
        //     document.body.removeChild(this.rootDom);
        // }
        this.setState({
            appOK: false
        });
    }
    onEnd({ type }) {
        if (type === 'leave') {
            document.body.removeChild(this.rootDom);
        }
    }
    render() {
        return ReactDOM.createPortal(
            <QueueAnim animConfig={{ opacity: [1, 0] }} onEnd={this.onEnd}>
                { this.state.appOK && <Comp key="JustForAnimation" {...this.props} />}
            </QueueAnim>
        , this.rootDom);
    }
};
