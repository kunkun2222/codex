'use strict';
const saveKey='guizhai-save-v1';
const initialGameState=JSON.parse(JSON.stringify(state));
const savePreview=new URLSearchParams(location.search).has('preview');
let savedGame=null,saveLoading=false;
const restartButton=document.createElement('button');
restartButton.id='restartGame';restartButton.className='restart-button';
restartButton.textContent='重新开始';restartButton.hidden=true;
const saveStatus=document.createElement('p');
saveStatus.id='saveStatus';saveStatus.className='save-status';saveStatus.setAttribute('role','status');
$('startGame').after(restartButton,saveStatus);

function refreshSaveMenu(){
 $('startLabel').textContent=savedGame||state.started?'继续游戏':'开始游戏';
 restartButton.hidden=!(savedGame||state.started);
}
function saveProgress(){
 if(savePreview||saveLoading||!state.started||state.powerOut)return;
 const record={version:1,savedAt:new Date().toISOString(),state:JSON.parse(JSON.stringify(state))};
 if(savedGame?.savedAt&&JSON.stringify(savedGame.state)===JSON.stringify(record.state))return;
 try{
  localStorage.setItem(saveKey,JSON.stringify(record));savedGame=record;
  saveStatus.textContent='进度已自动保存';
 }catch{saveStatus.textContent='浏览器无法保存进度，请勿关闭页面。'}
 refreshSaveMenu();
}
function readProgress(){
 try{
  const raw=localStorage.getItem(saveKey);
  if(raw){
   const record=JSON.parse(raw),data=record?.state;
   if(record.version!==1||!data||!Object.hasOwn(scenes,data.room)||data.started!==true||
    !Array.isArray(data.notes)||!data.notes.every(note=>typeof note==='string'))throw new Error('Invalid save');
   // 兼容只有手电筒标记的旧存档，不丢弃已有剧情进度。
   if(data.items===undefined)data.items=data.picked?['flashlight']:[];
   if(data.storageUnlocked===undefined)data.storageUnlocked=false;
   if(data.dayLightsSet===undefined)data.dayLightsSet=false;
   if(!Array.isArray(data.items)||data.items.length>4||new Set(data.items).size!==data.items.length||
    !data.items.every(id=>Object.hasOwn(itemDefinitions,id)))throw new Error('Invalid inventory');
   data.picked=data.items.includes('flashlight');
   if(data.storageUnlocked)data.items=data.items.filter(id=>id!=='storageKey');
   for(const [key,value] of Object.entries(initialGameState)){
    if(key==='notes')continue;
    if(typeof data[key]!==typeof value)throw new Error('Invalid save field');
   }
   if(!Number.isInteger(data.callLine)||data.callLine<0||data.callLine>=familyDialogue.length||
    !Number.isInteger(data.tvMode)||data.tvMode<0||data.tvMode>=tvModes.length||
    !['idle','fading','ringing','talking','ending','footsteps','morning','daytime'].includes(data.callPhase))throw new Error('Invalid save phase');
   savedGame=record;saveStatus.textContent='已找到本地存档';
  }else if(localStorage.getItem('guizhai-checkpoint')==='day2'){
   savedGame={version:1,state:{...initialGameState,notes:[...initialGameState.notes],started:true,firstNight:false,gardenUnlocked:true,rested:true,callCompleted:true,callPhase:'daytime'}};
   saveStatus.textContent='已找到第二天存档';
  }
 }catch{saveStatus.textContent='存档无法读取，可以重新开始。'}
 refreshSaveMenu();
}
function resumeProgress(){
 saveLoading=true;
 const data=savedGame.state;
 for(const key of Object.keys(initialGameState))state[key]=JSON.parse(JSON.stringify(data[key]));
 // 短暂的过场恢复为可交互节点，不重播整晚，也不恢复危险倒计时。
 if(['ending','footsteps','morning'].includes(state.callPhase)||(state.callPhase==='fading'&&state.callCompleted)){
  state.firstNight=false;state.gardenUnlocked=true;state.callPhase='daytime';state.room='yard';
 }
 if(state.callPhase==='fading')state.callPhase='ringing';
 state.powerOut=false;state.powerTestPhase='idle';state.flashlightReady=false;
 enterGame();updateSoundButtons();updatePowerTest();
 if(['ringing','talking'].includes(state.callPhase)){
  $('nightSequence').hidden=false;$('nightSequence').classList.add('blackout');
  $('nightCard').hidden=false;$('gameScreen').inert=true;
  if(state.callPhase==='talking')showCallLine();else{showIncoming();startRingtone()}
 }
 saveLoading=false;saveProgress();syncBackgroundMusic();
}
$('startGame').onclick=()=>{
 if(state.started)enterGame();
 else if(savedGame)resumeProgress();
 else beginPrologue();
};
restartButton.onclick=()=>{
 if(!window.confirm('重新开始会清除当前游戏进度，确定吗？'))return;
 try{
  localStorage.removeItem(saveKey);localStorage.removeItem('guizhai-checkpoint');
  localStorage.removeItem('guizhai-personal-notes');
 }catch{saveStatus.textContent='无法清除存档，请检查浏览器存储权限。';return}
 stopPowerTimer();stopRingtone();stopDialogueAudio();stopStairs();
 const soundEnabled=state.soundEnabled;
 Object.assign(state,JSON.parse(JSON.stringify(initialGameState)),{soundEnabled});
 savedGame=null;saveStatus.textContent='';
 $('nightSequence').hidden=true;$('nightCard').classList.remove('night-fade-out');
 $('powerGameOver').hidden=true;$('gameScreen').inert=false;
 $('blackoutCover').hidden=true;$('stage').classList.remove('power-blackout');
 refreshSaveMenu();updateSoundButtons();beginPrologue();
};
// 冒泡结束后保存，覆盖点击造成的房间、开关、物品与线索变化。
document.addEventListener('click',()=>queueMicrotask(saveProgress));
window.addEventListener('pagehide',saveProgress);
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveProgress()});
if(!savePreview)readProgress();
