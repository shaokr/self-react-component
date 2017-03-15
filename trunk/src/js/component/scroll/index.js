/**
 * 滚动条
 */
import './index.less';
import {Component} from 'react';

// import TreeList from './tree-list';

// export default class extends Component {
//     constructor(props) {
//         super(props);
//         this.scroll = 0;
//         this.setId = 0;
//     }
//     componentDidUpdate() {
//         let {children, scrollbarYC, childrenZ} = this.refs;
//         scrollbarYC.style.height = childrenZ.scrollHeight + 'px';
//     }
//     render() {
//         // let
//         return (
// 			<div className={this.props.className + ' ccwork-scroll'} onWheel={this._onScroll.bind(this)}>
// 				<div ref="children" className="ccwork-scroll-children">
//                     <div ref="childrenZ">
//                         {this.props.children}
//                     </div>
// 				</div>

// 				<div ref="scrollbarY" className="ccwork-scroll-scrollbar">
//                     <div ref="scrollbarYC"></div>
//                 </div>
// 			</div>
//         );
//     }
//     _onScroll(e) {
//         let {scrollbarY, children, childrenZ} = this.refs;
//         if ( children.offsetHeight < childrenZ.offsetHeight){
//             let min = 0;
//             let max = childrenZ.scrollHeight - children.offsetHeight;
//             let {target} = e;

//             let Y = e.deltaY > 0 ? 100 : -100;
//             this.scroll += Y;
//             if (this.scroll < min) {
//                 this.scroll = min;
//             } else if (this.scroll > max) {
//                 this.scroll = max;
//             }

//             childrenZ.style.transform = `translateY(${-this.scroll}px)`;
//         }
//         // scrollbarY.scrollTop = scrollbarY.scrollTop + e.deltaY;
//         // clearTimeout(this.setId);
//         // this.setId = setTimeout(() => {
//         //     this.scroll = '';
//         // }, 100);
//         // if (target != scrollbarY) {
//         //     if (scrollbarY.scrollTop != target.scrollTop) scrollbarY.scrollTop = target.scrollTop;
//         // } else {
//         //     if (children.scrollTop != target.scrollTop) children.scrollTop = target.scrollTop;
//         // }
//     }
// }

export default class extends Component {
    constructor(props) {
        super(props);
        this.scroll = 0;
        this.setId = 0;
    }
    componentDidMount() {
        let {scrollbarYC, childrenZ} = this.refs;
        scrollbarYC.style.height = childrenZ.scrollHeight + 'px';
    }
    componentDidUpdate() {
        let {scrollbarYC, childrenZ} = this.refs;
        scrollbarYC.style.height = childrenZ.scrollHeight + 'px';
    }
    render() {
        // let
        return (
			<div className={this.props.className + ' ccwork-scroll'} >
				<div ref="children" className="ccwork-scroll-children" onScroll={this._onScroll.bind(this)}>
                    <div ref="childrenZ">
                        {this.props.children}
                    </div>
				</div>

				<div ref="scrollbarY" className="ccwork-scroll-scrollbar" onScroll={this._onScroll.bind(this)}>
                    <div ref="scrollbarYC"></div>
                </div>
			</div>
        );
    }
    _onScroll(e) {
        let {scrollbarY, children, childrenZ} = this.refs;
        let {target} = e;
        if (this.scroll == target || !this.scroll) {
            this.scroll = target;
            if (target != scrollbarY) {
                if (scrollbarY.scrollTop != target.scrollTop) scrollbarY.scrollTop = target.scrollTop;
            } else {
                if (children.scrollTop != target.scrollTop) children.scrollTop = target.scrollTop;
            }
        }
        clearTimeout(this.setId);
        this.setId = setTimeout(() => {
            this.scroll = '';
        }, 100);
    }
};
