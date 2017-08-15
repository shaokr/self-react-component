// /**
//  * systemjs加载配置
//  */

import Systemjs from 'systemjs';
import cdnHost from 'config/cdn-host';
import _ from 'lodash';

let mainData = {
    js: `${__BUILD_PATH__}main${__BUILD_EXT__}.js`,
    css: `${__BUILD_PATH__}main${__BUILD_EXT__}.css`
};

let mapListObj = { // 自定义map和依赖关系,可覆盖cdn中的配置(注释的是例子
    map: {
        'mainCss': mainData.css,
        'treeIcon': `//at.alicdn.com/t/font_pwbftnqb8dea5rk9.js`,
        'Apiutil': '//localhost:8080/web-api-config/trunk/dist/util.js'
        // 'ReactDom': `${cdnHost}js/react/15.4.0/react-dom.min.js`,
    },
    meta: { // map的依赖关系
        // 'ReactDom': {
        //     deps: ['React']
        // }
    }
};

let mainListObj = { // 载入文件的配置
    [mainData.js]: { // 入口文件
        // ToLoad: true, // 是否马上加载
         // 依赖库
        deps: ['mainCss', 'React', 'ReactRouter', 'mobx', 'mobxReact', 'treeIcon']
    },
    './tool-tree.js': { // 入口文件
        ToLoad: true, // 是否马上加载
         // 依赖库
        deps: ['mainCss', 'React', 'ReactRouter', 'mobx', 'mobxReact', 'treeIcon', './tree.css', './tree.js', 'Apiutil']
    }
};

Systemjs.import(`${cdnHost}/config/1.0.6/config.js`).then((res) => {
    // res中的map查看cdn目录下config.js文件
    Systemjs.config(res(cdnHost));
    Systemjs.config(mapListObj);
    Systemjs.config({
        meta: mainListObj
    });

    _.forEach(mainListObj, (item, key) => {
        if (item.ToLoad) {
            Systemjs.import(key);
        }
    });
});
