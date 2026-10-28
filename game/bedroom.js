'use strict';
// 卧室与第一晚电话集中在此文件，便于独立编辑对白和节奏。
Object.assign(state,{soundEnabled:true,callPhase:'idle',callLine:0,callCompleted:false});
const familyDialogue=[
 {speaker:'奶奶',text:'到家了吧？路上累不累？房子好久没住人，你先安顿好，别忙着收拾。'},
 {speaker:'你',text:'到了，奶奶。我刚准备睡觉，东西明天再整理。'},
 {speaker:'奶奶',text:'好，早点休息。明天去菜地看看，靠墙那几棵南瓜应该熟了，摘一个回来煮粥。'},
 {speaker:'爷爷 · 电话那头',text:'乖孙孙，过几天爷爷来看你。'},
 {speaker:'奶奶',text:'听见你爷爷说的了吧？别惦记我们。门锁好，被子盖好，睡吧。'}
];
// 原创合成氛围音乐与木楼梯脚步；媒体文件随游戏提供。
const backgroundMusic=new Audio('assets/audio/old-house-loop-v2.mp3');
backgroundMusic.loop=true;backgroundMusic.volume=.32;
let stairsBuffer=null,stairsSource=null,audioStarted=false;
function syncBackgroundMusic(){
 backgroundMusic.volume=['ringing','talking'].includes(state.callPhase)?.08:.32;
 if(!state.soundEnabled||document.hidden||['footsteps','morning','ending'].includes(state.callPhase))backgroundMusic.pause();
 else if(audioStarted)backgroundMusic.play().catch(()=>{});
}
function stopStairs(){if(stairsSource){try{stairsSource.stop()}catch{}stairsSource=null}}
async function unlockGameAudio(){
 if(!state.soundEnabled)return;
 audioStarted=true;syncBackgroundMusic();await prepareAudio();
}
function startStairs(){
 if(!state.soundEnabled||!ringAudio||!stairsBuffer)return;
 stopStairs();stairsSource=ringAudio.createBufferSource();stairsSource.buffer=stairsBuffer;
 const gain=ringAudio.createGain();gain.gain.value=.85;
 stairsSource.connect(gain);gain.connect(ringAudio.destination);stairsSource.start();
}
let dialogueAudio=null;
function stopDialogueAudio(){if(dialogueAudio){dialogueAudio.pause();dialogueAudio.currentTime=0;dialogueAudio=null}}
function playDialogueAudio(){
 stopDialogueAudio();
 const clip={0:'grandma-01',2:'grandma-03',3:'grandpa-04',4:'grandma-05'}[state.callLine];
 if(!state.soundEnabled||state.callPhase!=='talking'||!clip)return;
 dialogueAudio=new Audio('assets/audio/'+clip+'.mp3');
 dialogueAudio.onended=()=>{if(state.callPhase==='talking'){if(state.callLine<familyDialogue.length-1){state.callLine++;showCallLine()}else showHangup()}};
 dialogueAudio.play().catch(()=>{const caption=document.querySelector('.call-caption');if(caption)caption.textContent='配音未能播放，可继续阅读字幕。'});
}
let ringAudio=null,ringMaster=null,ringInterval=null,ringTimeout=null;
const ringNodes=new Set();
function renderBedroom(){
 spot('查看窗台',60,47,()=>{feedback('窗台积着薄灰，中间却像被擦过。也许是爷爷奶奶搬家时碰到的？');addNote('卧房：窗台有薄灰，其中一处被擦过。')},29,15);
 spot('查看地上的书本和奖状',74,84,()=>{feedback('本子、书和旧奖状被扔在地上，抽屉也敞着。也许是爷爷奶奶搬家时翻乱了？');addNote('卧房：抽屉被翻动，不值钱的书本和旧奖状散落在地。')},34,25);
 spot('床',20,66,chooseSleep,35,35);
}
function chooseSleep(){
 openPanel('要休息了吗？');
 const p=document.createElement('p');p.textContent='赶了一天的路，你有些睁不开眼。';$('panelBody').append(p);
 const choices=document.createElement('div');choices.className='sleep-choices';
 const sleep=document.createElement('button');sleep.textContent='睡觉';sleep.onclick=()=>{closePanel();beginSleep()};
 const later=document.createElement('button');later.textContent='等会';later.onclick=closePanel;
 choices.append(sleep,later);$('panelBody').append(choices);
}
async function prepareAudio(){
 if(!state.soundEnabled)return;
 try{ringAudio??=new(window.AudioContext||window.webkitAudioContext)();await ringAudio.resume();
 if(!stairsBuffer){const response=await fetch('assets/audio/stairs-at-night-v2.mp3');if(response.ok)stairsBuffer=await ringAudio.decodeAudioData(await response.arrayBuffer())}
 }catch{state.soundEnabled=false;updateSoundButtons()}
}
function updateSoundButtons(){
 for(const id of ['soundToggle','soundGameButton']){
  $(id).setAttribute('aria-pressed',String(state.soundEnabled));
  $(id).textContent=state.soundEnabled?'声音：开':'声音：关'+(id==='soundToggle'?' · 点击开启':'');
 }
 if($('muteCall'))$('muteCall').textContent=state.soundEnabled?'关闭声音':'开启声音';
}
async function toggleSound(){
 state.soundEnabled=!state.soundEnabled;
 if(state.soundEnabled){audioStarted=true;await prepareAudio();if(state.callPhase==='ringing')startRingtone()}
 else {stopRingtone();stopDialogueAudio();stopStairs()}
 if(state.soundEnabled&&state.callPhase==='talking')playDialogueAudio();
 syncBackgroundMusic();updateSoundButtons();
}
function stopRingtone(){
 clearInterval(ringInterval);clearTimeout(ringTimeout);ringInterval=null;ringTimeout=null;
 if(ringMaster&&ringAudio)ringMaster.gain.setValueAtTime(0,ringAudio.currentTime);
 for(const node of ringNodes){try{node.stop()}catch{}}
 ringNodes.clear();
}
function ringPulse(){
 if(!state.soundEnabled||!ringAudio||ringAudio.state!=='running')return;
 ringMaster=ringAudio.createGain();ringMaster.gain.value=.12;ringMaster.connect(ringAudio.destination);
 [784,988,1175,988,784,988].forEach((frequency,i)=>{
  const t=ringAudio.currentTime+i*.17,gain=ringAudio.createGain(),osc=ringAudio.createOscillator();
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.45,t+.008);gain.gain.exponentialRampToValueAtTime(.001,t+.14);gain.connect(ringMaster);
  osc.type='triangle';osc.frequency.value=frequency;osc.connect(gain);ringNodes.add(osc);osc.onended=()=>ringNodes.delete(osc);osc.start(t);osc.stop(t+.15);
 });
}
function startRingtone(){
 stopRingtone();if(!state.soundEnabled)return;
 ringPulse();ringInterval=setInterval(ringPulse,1800);
 // 来电保持响铃，直到玩家接听或关闭声音。
}
async function beginSleep(){
 if(['fading','ringing','talking'].includes(state.callPhase))return;
 await prepareAudio();
 state.callPhase='fading';$('nightSequence').hidden=false;$('nightCard').hidden=true;
 $('nightSequence').classList.remove('blackout');$('gameScreen').inert=true;
 await waitFor(40);$('nightSequence').classList.add('blackout');
 await waitFor(matchMedia('(prefers-reduced-motion: reduce)').matches?80:2050);
 if(state.callCompleted){showNightEnd();return}
 state.callPhase='ringing';syncBackgroundMusic();showIncoming();startRingtone();
}
function showIncoming(){
 $('unread').hidden=false;
 $('nightCard').hidden=false;
 $('nightCard').innerHTML='<button id="nightPhoneButton" class="night-phone-launch" aria-label="打开来电手机"><svg viewBox="0 0 32 32"><use href="#i-phone"/></svg><i class="call-dot"></i><span>手机</span></button>';
 $('nightPhoneButton').onclick=openIncomingPhone;
 $('nightPhoneButton').focus({preventScroll:true});
}
function phoneShell(){
 $('nightCard').innerHTML='<div class="retro-phone"><div class="retro-speaker"></div><div class="retro-brand">MOBILE</div><div class="retro-screen"><div class="retro-status">▂▄▆ <span>▰</span></div><h2>奶奶</h2><div id="phoneStatus" class="retro-call-status"></div></div><div id="phoneSubtitle" class="player-subtitle" aria-live="polite"></div><div class="retro-softkeys"><button id="phoneAccept" class="phone-accept" aria-label="接通电话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3 3 5c-1 7 9 17 16 16l2-3-5-4-2 2c-3-1-5-3-6-6l2-2Z"/></svg></button><button id="phoneEnd" class="phone-end" aria-label="挂断电话"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14v-4c5-5 13-5 18 0v4l-5-1v-3h-8v3Z"/></svg></button></div><div class="retro-keypad" aria-hidden="true">'+['1','2 ABC','3 DEF','4 GHI','5 JKL','6 MNO','7 PQRS','8 TUV','9 WXYZ','*','0','＃'].map(k=>'<span>'+k+'</span>').join('')+'</div></div>';
}
function openIncomingPhone(){
 phoneShell();$('phoneStatus').textContent='来电';
 $('phoneAccept').onclick=answerCall;
 $('phoneEnd').disabled=true;
 $('phoneAccept').focus({preventScroll:true});
}
function answerCall(){
 stopRingtone();$('unread').hidden=true;state.callPhase='talking';state.callLine=0;syncBackgroundMusic();showCallLine();
}
function showHangup(){
 $('phoneStatus').textContent='通话结束';$('phoneEnd').disabled=false;$('phoneEnd').onclick=completeFamilyCall;
 $('phoneAccept').disabled=true;
 $('phoneEnd').focus({preventScroll:true});
}
function showCallLine(){
 stopDialogueAudio();
 const line=familyDialogue[state.callLine];phoneShell();
 $('phoneStatus').textContent='通话中';
 $('phoneEnd').disabled=true;
 const advance=()=>{if(state.callLine<familyDialogue.length-1){state.callLine++;showCallLine()}else showHangup()};
 if(line.speaker==='你'){
  const subtitle=$('phoneSubtitle');subtitle.textContent=line.text;subtitle.tabIndex=0;subtitle.setAttribute('role','button');subtitle.setAttribute('aria-label',line.text+' 点击继续');subtitle.onclick=advance;subtitle.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();advance()}};
  $('phoneAccept').onclick=advance;subtitle.focus({preventScroll:true});
 }else{
  // 听家人说话时不显示台词；无声模式仍能用接听键推进。
  $('phoneAccept').onclick=advance;
  playDialogueAudio();
 }
}
function completeFamilyCall(){
 stopRingtone();stopDialogueAudio();state.callCompleted=true;state.rested=true;
 addNote('奶奶来电：明天去菜园，摘靠墙的南瓜。');
 addNote('爷爷在电话那头说：“乖孙孙，过几天爷爷来看你。”');
 showNightEnd();
}
async function showNightEnd(){
 if(['ending','footsteps','morning'].includes(state.callPhase))return;
 state.callPhase='ending';syncBackgroundMusic();
 const card=$('nightCard');
 card.classList.add('night-fade-out');
 await waitFor(matchMedia('(prefers-reduced-motion: reduce)').matches?80:2600);
 card.hidden=true;card.classList.remove('night-fade-out');
 state.callPhase='footsteps';startStairs();
 card.hidden=false;card.innerHTML='<p class="stairs-thought">楼梯的声音？谁在上楼？<br>应该是我听错了吧……</p>';
 await waitFor(8500);stopStairs();card.hidden=true;
 state.callPhase='morning';card.hidden=false;
 card.innerHTML='<h2 class="day-title">第二天</h2>';
}
function showBedroomPhone(){
 if(state.callPhase==='ringing'){openIncomingPhone();return true}
 if(state.room!=='bedroom'||!state.callCompleted)return false;
 openPanel('老式手机');const p=document.createElement('p');p.textContent='最近通话：奶奶。暂无短信。';$('panelBody').append(p);return true;
}
$('soundToggle').onclick=toggleSound;$('soundGameButton').onclick=toggleSound;
window.addEventListener('pagehide',()=>{stopRingtone();stopDialogueAudio();stopStairs();backgroundMusic.pause()});
window.addEventListener('blur',()=>{stopRingtone();stopDialogueAudio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopRingtone();stopDialogueAudio();stopStairs()}syncBackgroundMusic()});
document.addEventListener('pointerdown',()=>{unlockGameAudio()},{passive:true});
document.addEventListener('keydown',()=>{unlockGameAudio()});
updateSoundButtons();

if(new URLSearchParams(location.search).get('preview')==='bedroom'){
 state.started=true;enterGame();render('bedroom');
}
