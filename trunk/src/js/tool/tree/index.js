import Systemjs from 'systemjs';

export const getDept = async () => {
    const api = await Systemjs.import('Apiutil');
    const res = await api.fetch('manage.dept.get', {

    });
    // manage.dept.get
    // manage.dept.list
};
export default {
};
