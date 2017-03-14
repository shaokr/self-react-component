/**
 * Event System write by Hu 2014-12-28
 * use to communicate between chat box and client
 * listen component after componentDidMount
 * unbind in compoentWillUnmount function to prevent memory leak.
 */
let toString = Object.prototype.toString

/**
 * Class of Event
 */
function EventSys() {
    this._events = {} // event collection
}

/**
 * monitor event
 * @param  {String}   name The name that to be bind
 * @param  {Function} cb   callback
 * @return undefined
 */
EventSys.prototype.on = function (name, cb, once) {
    if (!cb || toString.call(cb) !== '[object Function]') {
        throw new Error('On method must pass two params')
    }
    this._events[name] = this._events[name] || []
    if (once) {
        return (this._events[name] = [cb])
    }
    this._events[name].push(cb)
}

/**
 * emit a event
 * @param  {String} name   The name to emit
 * @param  {Object} params params pass in callback
 * @return undefined
 */
EventSys.prototype.emit = function (name, params) {
    let cbs = this._events[name]
    let i, len
    if (!cbs || !cbs.length) return
    for (i = 0, len = cbs.length; i < len; i++) {
        cbs[i].call(this, params)
    }
}

/**
 * remove events
 * @param  {String|Boolean} name The name that to be remove
 * @return undefined
 */
EventSys.prototype.off = function (name) {
    if (!name) {
        return (this._events = {})
    }

    if (typeof name === 'string') {
        this._events[name] && delete this._events[name]
    }
}

module.exports = EventSys
