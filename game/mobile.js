'use strict';
const stageWrap=document.querySelector('.stage-wrap');
function fitGameStage(){
 const width=Math.min(stageWrap.clientWidth,stageWrap.clientHeight*16/9);
 if(width<=0)return;
 $('stage').style.width=width+'px';$('stage').style.height=width*9/16+'px';
}
new ResizeObserver(fitGameStage).observe(stageWrap);
window.addEventListener('orientationchange',()=>requestAnimationFrame(fitGameStage));
$('fullscreenButton').onclick=async()=>{
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();try{await screen.orientation?.lock?.('landscape')}catch{}}
  else feedback('此浏览器不支持网页全屏，可将手机横过来游玩。');
 }catch{feedback('未能进入全屏，可直接横屏游玩。')}
};
document.addEventListener('fullscreenchange',()=>{$('fullscreenButton').textContent=document.fullscreenElement?'退出全屏':'全屏';fitGameStage()});
fitGameStage();

const portraitPhone=matchMedia('(pointer: coarse) and (orientation: portrait) and (max-width: 1024px)');
let resumeCallAfterRotate=false;
function enforceLandscape(){
 const blocked=portraitPhone.matches,dialog=$('rotateRequired');
 document.body.classList.toggle('portrait-blocked',blocked);
 if(blocked){
  if(!dialog.open)dialog.showModal();
  backgroundMusic.pause();
  if(dialogueAudio&&!dialogueAudio.paused){resumeCallAfterRotate=true;dialogueAudio.pause()}
  if(ringAudio?.state==='running')ringAudio.suspend().catch(()=>{});
 }else{
  if(dialog.open)dialog.close();
  if(audioStarted&&state.soundEnabled){
   if(ringAudio?.state==='suspended')ringAudio.resume().catch(()=>{});
   syncBackgroundMusic();
   if(resumeCallAfterRotate&&dialogueAudio&&state.callPhase==='talking')dialogueAudio.play().catch(()=>{});
  }
  resumeCallAfterRotate=false;fitGameStage();
 }
}
$('rotateRequired').addEventListener('cancel',event=>event.preventDefault());
portraitPhone.addEventListener('change',enforceLandscape);
enforceLandscape();
