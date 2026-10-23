'use strict';
const $=id=>document.getElementById(id);
let picked=false;
$('sound').hidden=true;
$('police').hidden=true;
$('grandma').hidden=true;
$('noteForm').hidden=true;
$('inventory').innerHTML='<div class="slot empty">空</div><div class="slot empty">空</div><div class="slot empty">空</div><div class="slot empty">空</div>';
document.querySelector('.eyebrow').textContent='归宅 · 第一段试玩 / 约 2 分钟';
const scenes={
yard:{title:'终于，到家了。',label:'村子尽头 · 老宅前院',text:'离开科技公司的第三天，你带着行李回到了老宅。\n三十岁了，你想把这里重新装修，好好生活。\n院里的草长高了，屋里很安静。手机轻轻振了一下。'},
garden:{title:'南瓜去哪儿了？',label:'屋旁 · 菜园',text:'秋风拨动枯黄的藤叶。你蹲下来找了找，一个南瓜也没有。\n墙根下，几截瓜柄露着浅色的断口。'},
living:{title:'屋里有点凉。',label:'一楼 · 客厅',text:'你把行李放在沙发旁。旧木楼梯通向你小时候的卧房。\n厨房门半掩着，空气里有一丝熟悉的甜味。'},
dark:{title:'灯，灭了。',label:'一楼 · 客厅 / 22:17',text:'啪。\n你刚准备上楼，整栋房子突然陷入黑暗。\n记忆里，总闸在屋外。你摸出手机，屏幕的微光照亮了门把手。\n门外，传来一声很轻的鞋底摩擦声。'}
};
function button(parent,label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;$(parent).append(b)}
function note(text){if([...$('notes').children].some(n=>n.textContent===text))return;const li=document.createElement('li');li.textContent=text;$('notes').append(li)}
function show(room){const data=scenes[room];$('scene').classList.toggle('exterior',room==='yard');$('houseArt').hidden=room!=='yard';$('viewArt').hidden=room!=='yard';$('title').textContent=data.title;$('description').textContent=data.text;$('sceneLabel').textContent=data.label;$('feedback').textContent='';$('actions').replaceChildren();$('travel').replaceChildren();$('scene').classList.toggle('dark',room==='dark');$('clock').textContent=room==='dark'?'第一夜 · 22:17':'第一日 · 17:40';
if(room==='yard'){button('actions','查看奶奶的短信',sms);button('travel','去旁边的菜园',()=>show('garden'));button('travel','推门进屋',()=>show('living'))}
if(room==='garden'){button('actions','蹲下，检查瓜柄',()=>{$('feedback').textContent='切口很整齐，还没有干透。也许是别人摘走了？';note('菜园的南瓜不见了，瓜柄切口很新。')});button('travel','回到院子',()=>show('yard'))}
if(room==='living'){button('actions',picked?'看一眼手电筒':'拿起柜上的手电筒',()=>{if(!picked){picked=true;$('capacity').textContent='1 / 4';$('inventory').firstElementChild.textContent='手电筒';$('inventory').firstElementChild.classList.remove('empty');note('已拿到手电筒。')}$('feedback').textContent='按下开关，灯光闪了两下。还能用。'});button('actions','整理行李，准备上楼休息',()=>{note('入夜后突然停电，总闸在屋外。');show('dark')});button('travel','回院子看看',()=>show('yard'))}
if(room==='dark'){button('actions',picked?'打开手电，先听一听':'屏住呼吸，先听一听',()=>{$('feedback').textContent='你没有动。门外的声音也停了。';button('travel','第一段试玩结束 · 重新开始',()=>location.reload())});button('actions','伸手碰门把手',()=>{$('feedback').textContent='手指刚碰上去，把手就在另一侧轻轻向下压了一点。\n你缩回了手。';note('外面可能有人。');$('travel').replaceChildren();button('travel','第一段试玩结束 · 重新开始',()=>location.reload())})}
}
function sms(){$('phoneScreen').textContent='奶奶：靠墙那几棵南瓜该熟了。摘一个，晚上煮粥。进屋记得锁好门。';note('奶奶说：菜园靠墙的南瓜应该成熟了。')}
$('sms').onclick=sms;$('restart').onclick=e=>{e.preventDefault();location.reload()};$('closeDialog').onclick=()=>$('dialog').close();note('回乡第一天：看看房子，安顿下来。');show('yard');
