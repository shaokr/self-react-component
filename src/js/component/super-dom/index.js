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
        if (props.rdom) {
            props.rdom.removePromise.promise.then(this.remove);
        }
    }
    remove() {
        const { getContainer } = this.props;
        if (!getContainer) {
            if (this.appOK) {
                document.body.removeChild(this.rootDom);
            }
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (this.props.rdom) {
            this.props.rdom.update(nextProps, nextState);
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            if (!this.appOK) {
                this.appOK = document.body.appendChild(this.rootDom);
            }
        } else {
            this.appOK = null;
            document.body.removeChild(this.rootDom);
        }
        ReactDOM.render(<Comp {...nextProps} rootDom={this.rootDom} />, this.rootDom);
    }
    componentDidMount() {
        if (this.props.visible) {
            this.appOK = document.body.appendChild(this.rootDom);
        }
        ReactDOM.render(<Comp {...this.props} rootDom={this.rootDom} />, this.rootDom);
    }
    componentWillUnmount() {
        this.remove();
    }
    render() {
        return null;
    }
};
