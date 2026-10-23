// Conservative API contract: bundled js-api.md, snapshot 2026-09-23.
// Online verification was unavailable at packaging time; platform/device tests remain required.
export async function deliverCard(canvas){
 const miniTool=window.xhs&&window.xhs.miniTool;
 if(!miniTool||typeof miniTool.saveImageToPhotosAlbum!=='function'){
  return '当前环境暂不支持保存到相册。请在支持此功能的小红书客户端内打开。';
 }
 let data=canvas.toDataURL('image/jpeg',0.82);
 if((data.length-data.indexOf(',')-1)*3/4>1024*1024)data=canvas.toDataURL('image/jpeg',0.65);
 if((data.length-data.indexOf(',')-1)*3/4>1024*1024)throw new Error('Card exceeds temporary image budget');
 let filePath=data;
 if(typeof miniTool.writeTempFile==='function'){
  const temporary=await miniTool.writeTempFile({data});
  if(!temporary||!temporary.filePath)throw new Error('No temporary file returned');
  filePath=temporary.filePath;
 }
 await miniTool.saveImageToPhotosAlbum({filePath});
 return '卡片已保存到相册。';
}
