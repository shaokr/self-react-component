import avatarBgColor from './avatar-bg-color';

// base64转bold
function dataURItoBlob(base64Data) {
  let byteString;
  if (base64Data.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(base64Data.split(',')[1]);
  else byteString = unescape(base64Data.split(',')[1]);
  const mimeString = base64Data
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
}

function getBase64(params) {
  const { width = 22, height = 22, text = '', bgColor = 'rgb(0,0,0)' } = params;
  const myCanvas = document.createElement('canvas');
  myCanvas.width = width;
  myCanvas.height = height;
  const context = myCanvas.getContext('2d');

  context.beginPath();
  context.fillStyle = bgColor;
  context.fillRect(0, 0, width, height);
  context.fill();

  context.beginPath();
  context.font = '12px serif';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(`${text}`[0], width / 2, height / 2);
  context.fill();

  // 将canvas转换成文件
  const base64Data = myCanvas.toDataURL('images/png');

  return base64Data;
}
// 创建本地图片，debug用
export default (text, id) => getBase64({ text, bgColor: avatarBgColor(id) });
