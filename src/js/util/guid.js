/**
 * 获取guid
 */
import uuid from 'uuid/v4';

export function guid() {
    return uuid().replace(/-/g, '').toUpperCase();
}

export default guid;