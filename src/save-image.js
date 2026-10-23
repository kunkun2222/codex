// Browser website delivery. The mini-tool build replaces this entire module.
export async function deliverCard(canvas,name){
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
 if(!blob)throw new Error('Could not create card');
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');
 link.href=url;
 link.download=`暮光小镇-${name}.png`;
 link.click();
 setTimeout(()=>URL.revokeObjectURL(url),10000);
 return '卡片已生成。如手机弹出图片，请长按保存。';
}
