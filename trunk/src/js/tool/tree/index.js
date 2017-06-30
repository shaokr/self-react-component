import Systemjs from 'systemjs';

export const a = async () => {
    await Systemjs.import('Apiutil');
};
console.log(import('config/config'));
export default {
    a
};
