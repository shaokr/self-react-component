import { Component } from 'react';
import ReactDOM from 'react-dom';
import PromiseClass from 'util/promise-class';


export class ShowDom {
    isRemove = true; // 是否已经删除
    // 初始化
    init = (component) => {
        this.remove(); // 删除上一次的元素
        this.initPromise = new PromiseClass(); // 赋值新的promise
        this.isRemove = false; // 设置为还为删除

        this.dom = document.createElement('div');
        document.body.appendChild(this.dom);
        this.rectdom = ReactDOM.render(component, this.dom);

        this.initPromise.resolve = true;
        return this.rectdom;
    }
    // 删除dom元素
    remove = () => {
        if (this.initPromise) {
            this.initPromise.promise.then(() => {
                if (this.dom) {
                    document.body.removeChild(this.dom);
                    this.dom = null;
                }
            });
        }
    }
}


export default Comp => class SuperDom extends Component {
    constructor(props) {
        super(props);

        this.rootDom = props.getContainer || document.createElement('div');
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
        const { getContainer } = this.props;
        if (!getContainer) {
            if (this.appOK) {
                document.body.removeChild(this.rootDom);
            }
        }
    }
    render() {
        return null;
    }
};
