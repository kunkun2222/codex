'use strict';
// 卧室与第一晚电话集中在此文件，便于独立编辑对白和节奏。
Object.assign(state,{soundEnabled:false,callPhase:'idle',callLine:0,callCompleted:false});
const familyDialogue=[
 {speaker:'奶奶',text:'到家了吧？路上累不累？房子好久没住人，你先安顿好，别忙着收拾。'},
 {speaker:'你',text:'到了，奶奶。我刚准备睡觉，东西明天再整理。'},
 {speaker:'奶奶',text:'好，早点休息。明天去菜地看看，靠墙那几棵南瓜应该熟了，摘一个回来煮粥。'},
 {speaker:'爷爷 · 电话那头',text:'乖孙孙，过几天爷爷来看你。'},
 {speaker:'奶奶',text:'听见你爷爷说的了吧？别惦记我们。门锁好，被子盖好，睡吧。'}
];
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
 try{ringAudio??=new(window.AudioContext||window.webkitAudioContext)();await ringAudio.resume()}catch{state.soundEnabled=false;updateSoundButtons()}
}
function updateSoundButtons(){
 for(const id of ['soundToggle','soundGameButton']){
  $(id).setAttribute('aria-pressed',String(state.soundEnabled));
  $(id).textContent=state.soundEnabled?'铃声：开':'铃声：关'+(id==='soundToggle'?' · 点击开启':'');
 }
 if($('muteCall'))$('muteCall').textContent=state.soundEnabled?'关闭铃声':'开启铃声';
}
async function toggleSound(){
 state.soundEnabled=!state.soundEnabled;
 if(state.soundEnabled){await prepareAudio();if(state.callPhase==='ringing')startRingtone()}
 else stopRingtone();
 updateSoundButtons();
}
function stopRingtone(){
 clearInterval(ringInterval);clearTimeout(ringTimeout);ringInterval=null;ringTimeout=null;
 if(ringMaster&&ringAudio)ringMaster.gain.setValueAtTime(0,ringAudio.currentTime);
 for(const node of ringNodes){try{node.stop()}catch{}}
 ringNodes.clear();
}
function ringPulse(){
 if(!state.soundEnabled||!ringAudio||ringAudio.state!=='running')return;
 ringMaster=ringAudio.createGain();ringMaster.gain.value=.075;ringMaster.connect(ringAudio.destination);
 for(const offset of [0,.37]){
  const gain=ringAudio.createGain(),t=ringAudio.currentTime+offset;
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.5,t+.01);gain.gain.setValueAtTime(.5,t+.23);gain.gain.linearRampToValueAtTime(0,t+.26);gain.connect(ringMaster);
  for(const frequency of [880,1175]){const osc=ringAudio.createOscillator();osc.type='square';osc.frequency.value=frequency;osc.connect(gain);ringNodes.add(osc);osc.onended=()=>ringNodes.delete(osc);osc.start(t);osc.stop(t+.27)}
 }
}
function startRingtone(){
 stopRingtone();if(!state.soundEnabled)return;
 ringPulse();ringInterval=setInterval(ringPulse,1800);
 ringTimeout=setTimeout(stopRingtone,12000);
}
async function beginSleep(){
 if(['fading','ringing','talking'].includes(state.callPhase))return;
 await prepareAudio();
 state.callPhase='fading';$('nightSequence').hidden=false;$('nightCard').hidden=true;
 $('nightSequence').classList.remove('blackout');$('gameScreen').inert=true;
 await waitFor(40);$('nightSequence').classList.add('blackout');
 await waitFor(matchMedia('(prefers-reduced-motion: reduce)').matches?80:2050);
 if(state.callCompleted){showNightEnd();return}
 state.callPhase='ringing';showIncoming();startRingtone();
}
function showIncoming(){
 $('nightCard').hidden=false;
 $('nightCard').innerHTML='<p class="incoming-label">来电</p><h2>奶奶</h2><div class="call-phone-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><use href="#i-phone"/></svg></div><p>手机突然响了起来。</p><button id="answerCall" class="answer-call">接听电话</button><button id="muteCall" class="call-mute"></button>';
 $('answerCall').onclick=answerCall;$('muteCall').onclick=toggleSound;updateSoundButtons();$('answerCall').focus({preventScroll:true});
}
function answerCall(){
 stopRingtone();state.callPhase='talking';state.callLine=0;showCallLine();
}
function showCallLine(){
 const line=familyDialogue[state.callLine];
 $('nightCard').innerHTML='<p class="incoming-label">通话中 · 奶奶</p><h2 id="callSpeaker"></h2><p id="callWords" class="call-words" aria-live="polite"></p><button id="nextCallLine" class="answer-call"></button><p class="call-caption">当前为文字对白，暂无人物配音</p>';
 $('callSpeaker').textContent=line.speaker;$('callWords').textContent=line.text;
 $('nextCallLine').textContent=state.callLine===familyDialogue.length-1?'挂断电话':'继续听';
 $('nextCallLine').onclick=()=>{if(state.callLine<familyDialogue.length-1){state.callLine++;showCallLine()}else completeFamilyCall()};
 $('nextCallLine').focus({preventScroll:true});
}
function completeFamilyCall(){
 stopRingtone();state.callCompleted=true;state.rested=true;
 addNote('奶奶来电：明天去菜园，摘靠墙的南瓜。');
 addNote('爷爷在电话那头说：“乖孙孙，过几天爷爷来看你。”');
 showNightEnd();
}
function showNightEnd(){
 state.callPhase='finished';$('nightCard').hidden=false;
 $('nightCard').innerHTML='<p class="incoming-label">第一夜</p><h2>电话那头，还是熟悉的声音。</h2><p class="call-words">你放下手机，重新躺好。<br>这一夜，平安无事。</p><p class="call-caption">本段试玩结束，次日剧情尚未开放。</p><button id="returnBedroom" class="answer-call">返回卧室查看</button>';
 $('returnBedroom').onclick=()=>{$('nightSequence').hidden=true;$('nightSequence').classList.remove('blackout');$('gameScreen').inert=false;render('bedroom');$('goDownstairs').focus()};$('returnBedroom').focus();
}
function showBedroomPhone(){
 if(state.room!=='bedroom'||!state.callCompleted)return false;
 openPanel('老式手机');const p=document.createElement('p');p.textContent='最近通话：奶奶。暂无短信。';$('panelBody').append(p);return true;
}
$('soundToggle').onclick=toggleSound;$('soundGameButton').onclick=toggleSound;
window.addEventListener('pagehide',stopRingtone);
window.addEventListener('blur',stopRingtone);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRingtone()});
updateSoundButtons();

if(new URLSearchParams(location.search).get('preview')==='bedroom'){
 state.started=true;enterGame();render('bedroom');
}
