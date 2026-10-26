'use strict';
const viewer=document.getElementById('viewer');
let opener=null;
function dismiss(){viewer.close();opener?.focus()}
document.querySelectorAll('[data-image]').forEach(button=>{
  button.addEventListener('click',()=>{
    opener=button;
    const title=button.dataset.title;
    document.getElementById('viewerTitle').textContent=title;
    const image=document.getElementById('largeImage');
    image.src=button.dataset.image;
    image.alt=title;
    document.getElementById('original').href=button.dataset.image;
    viewer.showModal();
  });
});
document.getElementById('closeViewer').addEventListener('click',dismiss);
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dismiss()}});
