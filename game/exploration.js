'use strict';
const itemDefinitions={
 flashlight:{name:'手电筒',icon:'<svg aria-hidden="true"><use href="#i-light"/></svg>'},
 storageKey:{name:'杂物间钥匙',icon:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m14 14 13 13m-5-5 4-4m-8 0 4-4"/></svg>'}
};
function panelText(text,className=''){
 const p=document.createElement('p');p.textContent=text;p.className=className;$('panelBody').append(p);return p;
}
function panelButton(text,handler,parent=$('panelBody')){
 const button=document.createElement('button');button.textContent=text;button.onclick=handler;parent.append(button);return button;
}
function pickupReturn(id){closePanel();if(id==='storageKey')openDrawer()}
function confirmPickup(id){
 const item=itemDefinitions[id];
 if(state.items.includes(id)||(id==='storageKey'&&state.storageUnlocked))return;
 openPanel(item.name);
 panelText('确定要收进工具箱吗？');
 const status=panelText('工具箱：'+state.items.length+' / 4','panel-note');
 const choices=document.createElement('div');choices.className='sleep-choices';
 const confirm=panelButton('确认',()=>{
  if(state.items.includes(id)||(id==='storageKey'&&state.storageUnlocked))return;
  if(state.items.length>=4){status.textContent='工具箱已满，最多只能携带4件物品。';return}
  state.items.push(id);state.picked=state.items.includes('flashlight');
  addNote('已拿到'+item.name+'。');$('capacity').textContent=state.items.length+'/4';
  saveProgress();render();pickupReturn(id);feedback('你把'+item.name+'收进了工具箱。');
 },choices);
 confirm.disabled=state.items.length>=4;
 if(confirm.disabled)status.textContent='工具箱已满，最多只能携带4件物品。';
 panelButton('取消',()=>pickupReturn(id),choices);$('panelBody').append(choices);
}
function openGrandparentsRoom(){
 closePanel();render('grandparents');
}
function inspectWardrobe(){
  addNote('爷爷奶奶房：衣柜敞开，衣服被拖到地上，像是有人取走过衣物。');
  openPanel('敞开的衣柜');panelText('衣架歪斜着，有几件衣服还挂在柜门边。地上的衣服被踩皱了。');
  panelButton('返回房间',openGrandparentsRoom);
}
function inspectGrandparentsNote(){
  openPanel('地上的纸条');panelText('有些工具在二楼杂物间，钥匙就摆在抽屉里。','handwritten-note');
  state.read=true;addNote('奶奶的纸条：有些工具在二楼杂物间，钥匙就摆在抽屉里。');
  panelButton('返回房间',openGrandparentsRoom);
}
function openDrawer(){
 closePanel();render('drawer');
}
function renderGrandparentsScene(){
 const drawer=state.room==='drawer';
 $('backdrop').classList.add(drawer?'drawer':'grandparents');
 $('backdrop').classList.toggle('drawer-empty',drawer&&(state.items.includes('storageKey')||state.storageUnlocked));
 $('goDownstairs').hidden=false;
 $('goDownstairs').querySelector('span').textContent=drawer?'返回房间':'返回客厅';
 $('goDownstairs').setAttribute('aria-label',drawer?'返回房间':'返回客厅');
 if(drawer){
  if(!state.items.includes('storageKey')&&!state.storageUnlocked)spot('拾取杂物间钥匙',58,39.5,()=>confirmPickup('storageKey'),15,15);
 }else{
  spot('查看衣柜',83,44,inspectWardrobe,24,57);
  spot('查看地上的纸条',66.4,72.2,inspectGrandparentsNote,7,8);
  spot('查看抽屉',17.2,67.5,openDrawer,12,14);
 }
}
const originalSceneBack=$('goDownstairs').onclick;
$('goDownstairs').onclick=()=>{
 if(state.room==='drawer')openGrandparentsRoom();
 else if(state.room==='grandparents')render('living');
 else originalSceneBack();
};
for(const src of ['assets/grandparents-bedroom-v1.webp','assets/sewing-drawer-key-v1.webp','assets/sewing-drawer-empty-v1.webp','assets/living-room-v3-on-no-flashlight.webp','assets/living-room-v3-off-no-flashlight.webp']){const image=new Image();image.src=src}
function showInventory(){
 openPanel('工具箱 · '+state.items.length+' / 4');
 const bag=document.createElement('div');bag.className='bag';
 for(let i=0;i<4;i++){
  const id=state.items[i],item=itemDefinitions[id];
  const slot=document.createElement(item?'button':'div');slot.className='slot'+(item?' occupied':'');
  if(item){slot.innerHTML=item.icon;const label=document.createElement('span');label.textContent=item.name;slot.append(label);
   slot.onclick=()=>{
    openPanel(item.name);panelText(id==='storageKey'?'用来打开二楼杂物间。':'一支可以使用的手电筒。');
    panelButton('放回原处',()=>{
     if(!window.confirm('把'+item.name+'放回原来的位置吗？'))return;
     state.items=state.items.filter(value=>value!==id);state.picked=state.items.includes('flashlight');
     $('capacity').textContent=state.items.length+'/4';render();saveProgress();showInventory();
    });panelButton('返回工具箱',showInventory);
   };
  }else slot.textContent='空位';
  bag.append(slot);
 }
 $('panelBody').append(bag);
}
function inspectStorageDoor(){
 if(state.storageUnlocked){feedback('杂物间的门已经解锁。');return}
 if(!state.items.includes('storageKey')){feedback('杂物间锁着，需要钥匙。');return}
 openPanel('杂物间');panelText('使用杂物间钥匙开门吗？');
 const choices=document.createElement('div');choices.className='sleep-choices';
 panelButton('确认',()=>{
  state.storageUnlocked=true;state.items=state.items.filter(id=>id!=='storageKey');
  $('capacity').textContent=state.items.length+'/4';closePanel();saveProgress();
  feedback('咔哒。杂物间的门锁打开了，钥匙已从工具箱中移除。');
 },choices);
 panelButton('取消',closePanel,choices);$('panelBody').append(choices);
}
