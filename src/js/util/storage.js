/**
* h5 本地存储
*/
const { localStorage, sessionStorage, location } = window;
const KEY = location.pathname;
const getKEY = (key, G) => G ? key : `${KEY}${key}`;

class Storage {
    constructor(props) {
        this.storage = props;
    }
    // 获取长度
    get longth() {
        let i = 0;
        for (const key in this.storage) {
            if (key.indexOf(KEY) === 0) i++;
        }
        return i;
    }
    // 获取
    get(key, G = false) {
        return JSON.parse(this.storage.getItem(getKEY(key, G)));
    }
    // 设置
    set(key, val, G = false) {
        this.storage.setItem(getKEY(key, G), JSON.stringify(val));
    }
    // 删除项
    remove(key, G = false) {
        this.storage.removeItem(getKEY(key, G));
    }
    // 清除全部
    clear(G = false) {
        if (G) {
            this.storage.clear();
        } else {
            for (const key in this.storage) {
                if (key.indexOf(KEY) === 0) this.remove(key.replace(KEY, ''));
            }
        }
    }
    has(key, G = false) {
        return this.storage.hasOwnProperty(getKEY(key, G));
    }
}

export const local = new Storage(localStorage);
export const session = new Storage(sessionStorage);

export default {
    local, session
};
