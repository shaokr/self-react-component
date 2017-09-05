import Systemjs from 'systemjs';
import param from 'util/param';

let debug = param.debug;


let i = 0;
let ct = 0;
document.addEventListener('touchstart', () => {
	clearTimeout(ct);
	i++
	if (i <= 4) {
		ct = setTimeout(() => {
			i = 0;
		}, 500);
	} else {
		ct = setTimeout(() => {
			debug = true;
		}, 5000);
	}
});

document.addEventListener('touchend', () => {
    if(i > 4){
      i= 0;
      clearTimeout(ct);
	}
});

const list = [];
function tool(key, data) {
	if(debug) {
		Systemjs.import('cc-debug-tool').then( (Tool) => {
			Tool(key,data);
		});
	} else {
		list.push([key, data]);
	}
}

export const log = () => tool('log', data);

export default tool;