'use strict';
// 测试阶段：断电由按钮触发，手电限时默认暂停，可手动开始、暂停与调时。
Object.assign(state,{powerTestPhase:'idle',flashlightReady:false,powerSeconds:20});
let powerTimer=null;
function updatePowerTest(){
 const controls=$('powerTestControls');controls.hidden=state.firstNight;
 $('testPowerCut').hidden=state.powerOut;
 $('powerCountdownControls').hidden=!state.powerOut||state.powerTestPhase!=='searching';
 $('powerCountdown').textContent='手电倒计时 '+state.powerSeconds+'秒'+(powerTimer?'':' · 已暂停');
 $('togglePowerCountdown').textContent=powerTimer?'暂停':'开始计时';
}
function stopPowerTimer(){clearInterval(powerTimer);powerTimer=null}
function tickPowerTimer(){
 if(state.powerTestPhase!=='searching')return;
 state.powerSeconds=Math.max(0,state.powerSeconds-1);updatePowerTest();
 if(!state.powerSeconds)powerGameOver('你没能及时找到手电筒。');
}
function triggerPowerCut(){
 if(state.firstNight||state.powerOut)return;
 closePanel();feedback('');stopPowerTimer();state.powerOut=true;state.powerSeconds=20;
 state.callPhase='power-cut';syncBackgroundMusic();
 if(['yard','garden'].includes(state.room)){powerGameOver('黑暗中，有人突然扑向你。',true);return}
 state.powerTestPhase='searching';$('stage').classList.add('power-blackout');
 $('blackoutCover').hidden=false;updateRoomControls();updatePowerTest();
 if(!state.picked)powerGameOver('屋里陷入黑暗。你没有带上手电筒。');
}
function openBlackoutInventory(){
 if(state.powerTestPhase!=='searching'&&state.powerTestPhase!=='ready')return false;
 if(!state.picked){powerGameOver('你没有带上手电筒。');return true}
 openPanel('工具箱 · 1 / 4');
 const bag=document.createElement('div');bag.className='bag';
 const button=document.createElement('button');button.className='slot occupied';button.textContent=state.flashlightReady?'手电筒 · 已取出':'取出手电筒';
 button.onclick=()=>{stopPowerTimer();state.flashlightReady=true;state.powerTestPhase='ready';closePanel();updatePowerTest();feedback('你握住了手电筒。')};bag.append(button);
 for(let i=0;i<3;i++){const empty=document.createElement('div');empty.className='slot';empty.textContent='空位';bag.append(empty)}
 $('panelBody').append(bag);return true;
}
function powerGameOver(reason,jump=false){
 stopPowerTimer();stopStairs();stopDialogueAudio();stopRingtone();backgroundMusic.pause();
 state.powerTestPhase='over';state.callPhase='gameover';
 $('gameScreen').inert=true;$('powerGameOver').hidden=false;
 $('gameOverReason').textContent=reason;
 $('powerGameOver').classList.toggle('with-jumpscare',jump);
 $('jumpScare').hidden=!jump;
 if(jump&&state.soundEnabled&&ringAudio){
  // 短促撞击，避免持续高音。
  const length=Math.floor(ringAudio.sampleRate*.25),buffer=ringAudio.createBuffer(1,length,ringAudio.sampleRate),samples=buffer.getChannelData(0);
  for(let i=0;i<length;i++)samples[i]=(Math.random()*2-1)*Math.exp(-i/length*10)*.16;
  const source=ringAudio.createBufferSource();source.buffer=buffer;source.connect(ringAudio.destination);source.start();
 }
}
function resetPowerTest(){
 stopPowerTimer();state.powerOut=false;state.flashlightReady=false;state.powerTestPhase='idle';
 $('powerGameOver').hidden=true;$('gameScreen').inert=false;
 $('blackoutCover').hidden=true;$('stage').classList.remove('power-blackout');
 enterSecondDay();updatePowerTest();
}
$('testPowerCut').onclick=triggerPowerCut;
$('togglePowerCountdown').onclick=()=>{
 if(powerTimer)stopPowerTimer();else if(state.powerTestPhase==='searching')powerTimer=setInterval(()=>{if(!document.hidden)tickPowerTimer()},1000);
 updatePowerTest();
};
for(const [id,delta] of [['lessPowerTime',-5],['morePowerTime',5]])$(id).onclick=()=>{
 state.powerSeconds=Math.max(0,state.powerSeconds+delta);updatePowerTest();if(!state.powerSeconds)powerGameOver('你没能及时找到手电筒。');
};
$('retryPowerTest').onclick=resetPowerTest;
// 黑屏期间保留底部工具栏，场景中的导航和物件均无法点击。
$('stage').addEventListener('click',event=>{if(state.powerOut){event.stopImmediatePropagation();event.preventDefault()}},true);
window.addEventListener('pagehide',stopPowerTimer);
updatePowerTest();
