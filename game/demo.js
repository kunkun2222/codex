'use strict';
const $=id=>document.getElementById(id);
const state={room:'yard',picked:false,read:false,notes:['回乡第一天：检查房子，准备长住和装修。'],started:false,mainLight:false,stairLight:false,tvMode:0,powerOut:false};
const scenes={
 yard:{label:'老宅前院'},
 garden:{label:'屋旁菜园'},
 living:{label:'一楼客厅'},
 entrance:{label:'一楼大门口'},
 dark:{label:'一楼大门口'}
};
function addNote(text){if(!state.notes.includes(text))state.notes.push(text)}
function feedback(text){$('feedback').textContent=text}
function action(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;$('actions').append(b)}
function spot(label,x,y,fn,width=10,height=12){const b=document.createElement('button');b.className='hotspot';b.setAttribute('aria-label',label);b.style.left=x+'%';b.style.top=y+'%';b.style.width=width+'%';b.style.height=height+'%';if(label.includes('开关'))b.style.zIndex='2';b.onclick=fn;$('hotspots').append(b)}
function render(room=state.room){state.room=room;const data=scenes[room];$('sceneLabel').textContent=data.label;$('clock').textContent=room==='dark'?'22:17':'18:40';$('feedback').textContent='';$('hotspots').replaceChildren();$('actions').replaceChildren();$('backdrop').className='backdrop'+(['living','dark'].includes(room)?' interior':'')+(room==='dark'?' dark':'')+(room==='garden'?' garden':'');$('artNotice').hidden=true;$('stage').dataset.room=room;$('turnBack').hidden=!['living','entrance'].includes(room);$('turnBack').setAttribute('aria-label',room==='entrance'?'转身回到客厅':'向后转身，回到大门口');$('turnBack').querySelector('span').textContent=room==='entrance'?'客厅':'大门口';$('backdrop').classList.toggle('entrance',room==='entrance'||room==='dark');
 updateRoomControls();
 if(room==='yard'){
 spot('进入老宅',37,61,()=>render('living'),18,38);
 spot('电闸',61,52,()=>feedback('总闸挂在右侧外墙上。记住它的位置，也许会用得到。'));
 spot('查看菜园',81,64,()=>render('garden'));
 action(state.read?'打开手机':'查看新短信',phone);
 }
 if(room==='garden'){
 spot('检查瓜柄',57,43,()=>{feedback('切口很整齐，还没干透。也许刚被人摘走了。');addNote('菜园的南瓜不见了，瓜柄切口很新。')});
 action('回到前院',()=>render('yard'));
 }
 if(room==='living'){
 spot('客厅灯开关',2,39,toggleMainLight,5,12);
 spot('楼梯灯开关',84.8,44,toggleStairLight,5,12);
 spot('爷爷奶奶的卧室',11,48,()=>{feedback('你轻轻转动把手。门紧锁着，里面没有回应。');addNote('一楼爷爷奶奶的卧室门紧锁。')},14,60);
 spot('电视',45,50,cycleTv,17,19);
 spot('厨房门',92,48,()=>feedback('厨房门关着。你贴近听了听，里面没有动静。'),14,65);
 spot(state.picked?'查看手电筒':'拿起手电筒',72,86,()=>{if(!state.picked){state.picked=true;addNote('已拿到手电筒。');$('capacity').textContent='1/4'}render('living');feedback('茶几上的手电筒还能用。你把它收进工具箱。')},15,12);
 spot('上楼休息',75,48,()=>{state.powerOut=true;addNote('准备上楼时突然停电。总闸在屋外。');render('dark')},15,48);
 }
 if(room==='entrance'){
 spot('查看门锁',50,48,()=>{feedback('门锁完好，已经锁好了。');$('actions').replaceChildren();action('打开门，回到院子',()=>render('yard'))},28,56);
 }
 if(room==='dark'){
 spot('门把手',50,50,()=>{feedback('手指刚碰上去，把手就在另一侧轻轻向下压了一点。你缩回了手。');addNote('有人正在外面试探门把手。');finish()});
 action(state.picked?'打开手电，先听一听':'屏住呼吸，先听一听',()=>{feedback('你没有动。门外的声音也停了。');finish()});
 }
}
function finish(){if(!$('actions').querySelector('[data-end]')){action('本段结束 · 返回开始界面',home);$('actions').lastElementChild.dataset.end='true'}}
function openPanel(title){$('panelTitle').textContent=title;$('panelBody').replaceChildren();$('panel').showModal()}
function phone(){openPanel('老式手机');$('panelBody').innerHTML='<div class="phone"><div class="phone-label">MOBILE</div><div class="phone-screen" id="phoneScreen"></div><div class="phone-keypad" aria-hidden="true">'+['1','2','3','4','5','6','7','8','9','*','0','#'].map(k=>'<span style="text-align:center">'+k+'</span>').join('')+'</div></div><button class="panel-action" id="readSms">查看奶奶的短信</button><p class="panel-note">只能接打电话与收发短信。当前试玩开放短信。</p>';$('phoneScreen').textContent=state.read?'奶奶 · 短信\n靠墙那几棵南瓜该熟了。摘一个，晚上煮粥。进屋记得锁门。':'18:40    ▂▄▆\n\n1 条未读短信\n来自：奶奶';$('readSms').onclick=()=>{state.read=true;$('unread').hidden=true;addNote('奶奶说菜园靠墙的南瓜应该成熟了。');$('phoneScreen').textContent='奶奶 · 短信\n靠墙那几棵南瓜该熟了。摘一个，晚上煮粥。进屋记得锁门。'};}
function inventory(){openPanel('工具箱 · '+(state.picked?'1':'0')+' / 4');const bag=document.createElement('div');bag.className='bag';for(let i=0;i<4;i++){const slot=document.createElement(i===0&&state.picked?'button':'div');slot.className='slot'+(i===0&&state.picked?' occupied':'');if(i===0&&state.picked){slot.innerHTML='<svg aria-hidden="true"><use href="#i-light"/></svg><span>手电筒</span>';slot.onclick=()=>{if(state.room==='dark'){closePanel();feedback('手电照向门口。门缝里看不见人，却传来极轻的呼吸声。');finish()}else{slot.querySelector('span').textContent='手电筒 · 可以使用'}}}else slot.textContent='空位';bag.append(slot)}$('panelBody').append(bag);const p=document.createElement('p');p.className='panel-note';p.textContent='最多携带四件物品。试玩中可拾取一支手电筒。';$('panelBody').append(p)}
function notes(){openPanel('备忘录');const ul=document.createElement('ul');ul.className='notes';for(const text of state.notes){const li=document.createElement('li');li.textContent=text;ul.append(li)}$('panelBody').append(ul)}
function closePanel(){$('panel').close()}
function home(){closePanel();$('gameScreen').hidden=true;$('startScreen').hidden=false;$('startLabel').textContent=state.started?'继续游戏':'开始游戏';$('startGame').focus()}
$('startGame').onclick=()=>{if(state.started){enterGame()}else{beginPrologue()}};$('home').onclick=home;$('phoneButton').onclick=phone;$('inventoryButton').onclick=inventory;$('notesButton').onclick=notes;$('closePanel').onclick=closePanel;$('hintToggle').onclick=()=>{const hidden=$('stage').classList.toggle('hide-hints');$('hintToggle').textContent='标记：'+(hidden?'关':'开');$('hintToggle').setAttribute('aria-pressed',String(!hidden))};

// 背景加载完成后，留出一秒纯场景，再淡入开始界面。
async function revealStartScreen(){
 const background=new Image();
 background.src='assets/house-exterior-v5.png';
 try{await background.decode()}catch{/* 图片无法加载时仍允许进入游戏。 */}
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  $('startScreen').dataset.backgroundReady='true';
  setTimeout(()=>{
   $('startScreen').classList.add('intro-visible');
   $('startScreen').inert=false;
  },1000);
 }));
}
revealStartScreen();

const prologuePages=[
 [
  '三十岁这年，你辞掉了科技公司的工作。',
  '这些年，你攒下了一笔钱，也习惯了深夜的消息、没完没了的会议，以及醒来就要查看手机的生活。离职后的第一个早晨，你睡到自然醒，却不知道该去哪里。',
  '你想起了乡下的老宅。',
  '一年前，爷爷奶奶搬进城里，把钥匙留给了你。你总说有空就回去看看，却一次次被工作耽搁。那把钥匙压在抽屉深处，直到收拾东西时，才重新翻了出来。'
 ],
 [
  '你决定搬回去住。',
  '房子需要重新装修，院子也该收拾了。不过这些都可以慢慢来。你想种点菜，学着做饭，过几天不用赶时间的日子。',
  '车子驶进村子，路两旁渐渐没了人家。你记得这段路，小时候放学，总觉得怎么走都走不到头。',
  '老宅就在最里面，和记忆中差不多。',
  '你下车，拖着行李走到门前，找出了那把旧钥匙。',
  '终于到家了。'
 ]
];
let prologuePage=0,prologueBusy=false;
const transitionTime=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?0:650;
const waitFor=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function fillPrologue(){
 $('prologueText').replaceChildren();
 for(const text of prologuePages[prologuePage]){const p=document.createElement('p');p.textContent=text;$('prologueText').append(p)}
 $('prologue').dataset.page=String(prologuePage+1);
 $('advancePrologue').setAttribute('aria-label',prologuePage===0?'继续故事':'进入老宅');
}
function enterGame(){
 state.started=true;$('startScreen').hidden=true;$('prologue').hidden=true;$('gameScreen').hidden=false;
 render();$('phoneButton').focus();
}
async function beginPrologue(){
 prologuePage=0;prologueBusy=true;$('advancePrologue').disabled=true;
 $('startScreen').hidden=true;$('prologue').hidden=false;$('prologue').classList.remove('text-visible');
 fillPrologue();
 await waitFor(100);
 $('prologue').classList.add('text-visible');
 await waitFor(transitionTime());
 prologueBusy=false;$('advancePrologue').disabled=false;$('advancePrologue').focus({preventScroll:true});
}
$('advancePrologue').onclick=async()=>{
 if(prologueBusy)return;
 prologueBusy=true;$('advancePrologue').disabled=true;
 $('prologue').classList.remove('text-visible');
 await waitFor(transitionTime());
 if(prologuePage===0){
  prologuePage=1;fillPrologue();await waitFor(100);
  $('prologue').classList.add('text-visible');await waitFor(transitionTime());
  prologueBusy=false;$('advancePrologue').disabled=false;$('advancePrologue').focus({preventScroll:true});
 }else{
  enterGame();
  $('gameScreen').classList.add('scene-arrival');
 }
};

$('turnBack').onclick=()=>render(state.room==='entrance'?'living':'entrance');

const tvModes=['关机','新闻联播','电影频道','动画片'];
const tvImages=['','assets/tv-news.svg','assets/tv-movie.svg','assets/tv-cartoon.svg'];
function updateRoomControls(){
 const living=state.room==='living';
 const powered=!state.powerOut;
 $('backdrop').classList.toggle('main-light-off',living&&(!state.mainLight||!powered));
 $('backdrop').classList.toggle('entrance-light-off',state.room==='entrance'&&(!state.mainLight||!powered));
 $('roomEffects').hidden=!living;
 $('stairLighting').hidden=!(living&&powered&&state.stairLight);
 $('tvPicture').hidden=!(living&&powered&&state.tvMode>0);
 $('tvPicture').style.backgroundImage=state.tvMode>0?'url("'+tvImages[state.tvMode]+'")':'none';
 $('stage').dataset.mainLight=String(powered&&state.mainLight);
 $('stage').dataset.stairLight=String(powered&&state.stairLight);
 $('stage').dataset.tvMode=String(powered?state.tvMode:0);
}
function toggleMainLight(){
 if(state.powerOut){feedback('你按了按开关，没有反应。整栋房子都停电了。');return}
 state.mainLight=!state.mainLight;updateRoomControls();
 feedback(state.mainLight?'啪嗒。客厅灯亮了。':'你关掉了客厅灯，房间又暗下来。');
}
function toggleStairLight(){
 if(state.powerOut){feedback('楼梯灯没有亮，已经停电了。');return}
 state.stairLight=!state.stairLight;updateRoomControls();
 feedback(state.stairLight?'楼梯灯亮了，台阶清楚了一些。':'楼梯灯熄灭了。');
}
function cycleTv(){
 if(state.powerOut){feedback('电视没有反应，已经停电了。');return}
 state.tvMode=(state.tvMode+1)%tvModes.length;updateRoomControls();
 feedback(state.tvMode===0?'你关掉了电视。':'电视切换到：'+tvModes[state.tvMode]+'。');
}

for(const src of ['assets/living-room-v3-on.png','assets/living-room-v3-off.png',...tvImages.slice(1)]){const image=new Image();image.src=src}
