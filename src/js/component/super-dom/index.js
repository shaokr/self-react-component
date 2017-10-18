import { Component } from 'react';
import ReactDOM from 'react-dom';
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
        if (props.rdom) {
            props.rdom.removePromise.promise.then(this.remove);
        }
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
        if (!this.appOK) {
            this.appOK = document.body.appendChild(this.rootDom);
        }
    }
    // 删除dom元素
    removeChild() {
        if (this.appOK) {
            this.appOK = null;
            document.body.removeChild(this.rootDom);
        }
    }
    render() {
        return ReactDOM.createPortal(<Comp {...this.props} />, this.rootDom);
    }
};
