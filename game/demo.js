'use strict';
const $=id=>document.getElementById(id);
const state={room:'yard',picked:false,read:false,notes:['回乡第一天：检查房子，准备长住和装修。'],started:false};
const scenes={
 yard:{title:'终于，到家了。',label:'老宅前院',text:'离开科技公司的第三天，你带着行李回到了老宅。\n三十岁了，你想把这里重新装修，好好生活。\n屋里很安静。手机轻轻振了一下。'},
 garden:{title:'南瓜去哪儿了？',label:'屋旁菜园',text:'秋风拨动枯黄的藤叶。你找了找，一个成熟的南瓜也没有。\n墙根下，几截瓜柄露着浅色的断口。'},
 living:{title:'屋里有点凉。',label:'一楼客厅',text:'你把行李放在沙发旁。楼梯通向你小时候的卧房。\n厨房门半掩着，空气里有一丝熟悉的甜味。'},
 dark:{title:'灯，灭了。',label:'一楼客厅',text:'啪。整栋房子突然陷入黑暗。\n总闸在屋外。你摸出手机，微光照亮了门把手。\n门外，传来一声很轻的鞋底摩擦声。'}
};
function addNote(text){if(!state.notes.includes(text))state.notes.push(text)}
function feedback(text){$('feedback').textContent=text}
function action(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;$('actions').append(b)}
function spot(label,x,y,fn){const b=document.createElement('button');b.className='hotspot';b.textContent=label;b.setAttribute('aria-label',label);b.style.left=x+'%';b.style.top=y+'%';b.onclick=fn;$('hotspots').append(b)}
function render(room=state.room){state.room=room;const data=scenes[room];$('sceneLabel').textContent=data.label;$('clock').textContent=room==='dark'?'22:17':'18:40';$('chapter').textContent='第一章 / 回乡';$('title').textContent=data.title;$('description').textContent=data.text;$('feedback').textContent='';$('hotspots').replaceChildren();$('actions').replaceChildren();$('backdrop').className='backdrop'+(['living','dark'].includes(room)?' interior':'')+(room==='dark'?' dark':'')+(room==='garden'?' garden':'');$('artNotice').hidden=!['living','dark'].includes(room);
 if(room==='yard'){
 spot('进入老宅',38,55,()=>render('living'));
 spot('电闸',61,52,()=>feedback('总闸挂在右侧外墙上。记住它的位置，也许会用得到。'));
 spot('查看菜园',81,64,()=>render('garden'));
 action(state.read?'打开手机':'查看新短信',phone);
 }
 if(room==='garden'){
 spot('检查瓜柄',57,43,()=>{feedback('切口很整齐，还没干透。也许刚被人摘走了。');addNote('菜园的南瓜不见了，瓜柄切口很新。')});
 action('回到前院',()=>render('yard'));
 }
 if(room==='living'){
 spot(state.picked?'柜子':'拿起手电筒',70,48,()=>{if(!state.picked){state.picked=true;addNote('已拿到手电筒。');$('capacity').textContent='1/4'}feedback('按下开关，灯光闪了两下。还能用。')});
 spot('上楼休息',88,35,()=>{addNote('准备上楼时突然停电。总闸在屋外。');render('dark')});
 action('回到院子',()=>render('yard'));
 }
 if(room==='dark'){
 spot('门把手',8,48,()=>{feedback('手指刚碰上去，把手就在另一侧轻轻向下压了一点。你缩回了手。');addNote('有人正在外面试探门把手。');finish()});
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
$('startGame').onclick=()=>{state.started=true;$('startScreen').hidden=true;$('gameScreen').hidden=false;render();$('phoneButton').focus()};$('home').onclick=home;$('phoneButton').onclick=phone;$('inventoryButton').onclick=inventory;$('notesButton').onclick=notes;$('closePanel').onclick=closePanel;$('hintToggle').onclick=()=>{const hidden=$('stage').classList.toggle('hide-hints');$('hintToggle').textContent='标记：'+(hidden?'关':'开');$('hintToggle').setAttribute('aria-pressed',String(!hidden))};

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
