/**
 * systemjs加载配置
 */

import Systemjs from 'systemjs';
import cdnHost from 'config/cdn-host';

const { SystemJSConfigMain } = window;

const mapListObj = {
  // 自定义map和依赖关系,可覆盖cdn中的配置(注释的是例子
  map: {
    // 'ReactDom': 'host/js/react/15.4.0/react-dom.min.js',
    treeIcon: `//at.alicdn.com/t/font_232637_v7d429dlco3l3di.js`,
    Apiutil: '//localhost:8080/web-api-config/trunk/dist/util.js',
    bridgeWs: '//localhost:8080/web-bridge-ws/dist/bridge.js',
    React: 'host:js/react/15.4.0/react-with-addons.js',
    ReactDom: 'host:js/react/15.4.0/react-dom.js'
  },
  meta: {
    // map的依赖关系
    // 'ReactDom': {
    //     deps: ['React']
    // }
  }
};

const mainListObj = {
  // 载入文件的配置
  _main: {
    // 入口文件 签名
    // ToLoad: true, // 是否马上加载
    // 依赖库
    deps: ['react', 'mobx', 'mobx-react']
  },
  '_tool-tree-pc-management': {
    // 入口文件 签名
    // ToLoad: true, // 是否马上加载
    // 依赖库
    deps: ['react', 'mobx', 'mobx-react', 'Apiutil', '_component']
  },
  '_tool-tree-web-module': {
    // 入口文件 签名
    // ToLoad: true, // 是否马上加载
    // 依赖库
    deps: ['react', 'mobx', 'mobx-react', 'bridgeWs', '_component']
  },
  _component: {
    // 入口文件 签名
    ToLoad: true, // 是否马上加载
    // 依赖库
    deps: ['react', 'mobx', 'mobx-react', 'antd']
  },
  '_react-web-module': {
    // ToLoad: true, // 是否马上加载
    deps: ['react', 'mobx', 'mobx-react', 'bridgeWs']
  }
};

for (const key in mainListObj) {
  const _key = key.slice(1);
  if (SystemJSConfigMain[_key]) {
    mainListObj[key].deps = mainListObj[key].deps.concat(
      SystemJSConfigMain[_key].css
    );
  }
}
Systemjs.import(`${cdnHost}/config/2.1.0/config.js`).then(res => {
  // res中的map查看cdn目录下config.js文件
  Systemjs.config(res(cdnHost, true));
  Systemjs.config(mapListObj);
  Systemjs.config({
    meta: mainListObj
  });

  for (const key in mainListObj) {
    const item = mainListObj[key];
    if (item.ToLoad) {
      Systemjs.import(key);
    }
  }
});
