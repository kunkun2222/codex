const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
let chromium;
try{({chromium}=require('playwright'))}catch{
 ({chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:1366,height:768}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(__dirname,'../game/index.html')).href);
  await page.evaluate(()=>{localStorage.clear();state.soundEnabled=false;enterSecondDay()});
  await page.locator('#hotspots button[aria-label="进入老宅"]').click();
  assert.equal(await page.evaluate(()=>state.mainLight),true);
  await page.getByRole('button',{name:'客厅灯开关',exact:true}).click();
  await page.getByRole('button',{name:'向后转身，回到大门口',exact:true}).click();
  await page.getByRole('button',{name:'转身回到客厅',exact:true}).click();
  assert.equal(await page.evaluate(()=>state.mainLight),false);
  console.log('PASS: second day starts lit without overriding manual switches');

  await page.getByRole('button',{name:'拿起手电筒',exact:true}).click();
  await page.getByRole('button',{name:'取消',exact:true}).click();
  assert.equal(await page.evaluate(()=>state.picked),false);
  await page.getByRole('button',{name:'拿起手电筒',exact:true}).click();
  await page.getByRole('button',{name:'确认',exact:true}).click();
  assert.equal(await page.evaluate(()=>state.picked),true);
  assert.equal(await page.locator('#capacity').textContent(),'1/4');
  assert.equal(await page.getByRole('button',{name:'拿起手电筒',exact:true}).count(),0);
  assert.match(await page.locator('#backdrop').evaluate(el=>getComputedStyle(el).backgroundImage),/off-no-flashlight/);
  await page.getByRole('button',{name:'客厅灯开关',exact:true}).click();
  assert.match(await page.locator('#backdrop').evaluate(el=>getComputedStyle(el).backgroundImage),/on-no-flashlight/);
  await page.evaluate(async()=>{const image=new Image();image.src='assets/living-room-v3-on-no-flashlight.webp';await image.decode()});
  await page.waitForTimeout(100);
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'guizhai-flashlight-taken.png')});
  await page.getByRole('button',{name:'客厅灯开关',exact:true}).click();
  console.log('PASS: flashlight disappears from both lit and unlit backgrounds');

  await page.getByRole('button',{name:'爷爷奶奶的卧室',exact:true}).click();
  assert.equal(await page.evaluate(()=>state.room),'grandparents');
  await page.getByRole('button',{name:'查看衣柜',exact:true}).click();
  assert.match(await page.locator('#panelBody').textContent(),/衣架歪斜/);
  await page.getByRole('button',{name:'返回房间',exact:true}).click();
  await page.getByRole('button',{name:'查看地上的纸条',exact:true}).click();
  assert.match(await page.locator('.handwritten-note').textContent(),/有些工具在二楼杂物间，钥匙就摆在抽屉里。/);
  await page.getByRole('button',{name:'返回房间',exact:true}).click();
  await page.getByRole('button',{name:'查看抽屉',exact:true}).click();
  await page.getByRole('button',{name:'拾取杂物间钥匙',exact:true}).click();
  await page.getByRole('button',{name:'取消',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'拾取杂物间钥匙',exact:true}).count(),1);
  await page.getByRole('button',{name:'拾取杂物间钥匙',exact:true}).click();
  await page.getByRole('button',{name:'确认',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'拾取杂物间钥匙',exact:true}).count(),0);
  assert.equal(await page.locator('#capacity').textContent(),'2/4');
  console.log('PASS: note and key confirmation, cancellation and removal');

  assert.equal(await page.evaluate(()=>state.room),'drawer');
  assert.match(await page.locator('#backdrop').getAttribute('class'),/drawer-empty/);
  await page.reload();await page.locator('#startGame').click();
  assert.equal(await page.evaluate(()=>state.room),'drawer');
  assert.equal(await page.getByRole('button',{name:'拾取杂物间钥匙',exact:true}).count(),0);
  await page.getByRole('button',{name:'返回房间',exact:true}).click();
  await page.getByRole('button',{name:'返回客厅',exact:true}).click();
  await page.getByRole('button',{name:'上楼',exact:true}).click();
  await page.getByRole('button',{name:'杂物间',exact:true}).click();
  await page.getByRole('button',{name:'取消',exact:true}).click();
  assert.equal(await page.evaluate(()=>state.storageUnlocked),false);
  await page.getByRole('button',{name:'杂物间',exact:true}).click();
  await page.getByRole('button',{name:'确认',exact:true}).click();
  assert.equal(await page.evaluate(()=>state.storageUnlocked),true);
  assert.equal(await page.locator('#capacity').textContent(),'1/4');
  assert.equal(await page.evaluate(()=>state.items.includes('storageKey')),false);
  await page.getByRole('button',{name:'通往阁楼的木梯',exact:true}).click();
  assert.match(await page.locator('#feedback').textContent(),/今天先不上去/);
  await page.reload();await page.locator('#startGame').click();
  assert.equal(await page.evaluate(()=>state.storageUnlocked),true);
  assert.deepEqual(await page.evaluate(()=>state.items),['flashlight']);
  assert.equal(await page.evaluate(()=>state.mainLight),false);
  console.log('PASS: key unlock, attic restriction, items and lights persist');

  await page.locator('#inventoryButton').click();
  await page.getByRole('button',{name:'手电筒',exact:true}).click();
  page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'放回原处',exact:true}).click();
  assert.equal(await page.locator('#capacity').textContent(),'0/4');
  await page.locator('#closePanel').click();
  await page.evaluate(()=>render('living'));
  assert.match(await page.locator('#backdrop').evaluate(el=>getComputedStyle(el).backgroundImage),/living-room-v3-off.webp/);
  assert.equal(await page.getByRole('button',{name:'拿起手电筒',exact:true}).count(),1);
  await page.evaluate(()=>{openGrandparentsRoom();openDrawer()});
  assert.equal(await page.getByRole('button',{name:'拾取杂物间钥匙',exact:true}).count(),0);
  assert.match(await page.locator('#backdrop').getAttribute('class'),/drawer-empty/);
  const temp=require('node:os').tmpdir();
  await page.screenshot({path:path.join(temp,'guizhai-drawer-desktop.png')});
  await page.setViewportSize({width:844,height:390});
  await page.screenshot({path:path.join(temp,'guizhai-drawer-mobile.png')});
  const bounds=await page.getByRole('button',{name:'返回房间',exact:true}).boundingBox();
  assert.ok(bounds.x>=0&&bounds.x+bounds.width<=844);
  await page.getByRole('button',{name:'返回房间',exact:true}).click();
  await page.screenshot({path:path.join(temp,'guizhai-grandparents-mobile.png')});
  await page.setViewportSize({width:1366,height:768});
  await page.screenshot({path:path.join(temp,'guizhai-grandparents-desktop.png')});
  assert.equal(await page.evaluate(()=>Array.from(document.images).filter(image=>!image.complete||image.naturalWidth===0).length),0);
  console.log('PASS: returned flashlight reappears; consumed key never respawns');

  await page.evaluate(()=>{
   itemDefinitions.testA={name:'A'};itemDefinitions.testB={name:'B'};itemDefinitions.testC={name:'C'};
   state.storageUnlocked=false;state.items=['flashlight','testA','testB','testC'];confirmPickup('storageKey');
  });
  assert.equal(await page.getByRole('button',{name:'确认',exact:true}).isDisabled(),true);
  await page.evaluate(()=>{state.items=['flashlight'];state.picked=true;saveProgress()});
  console.log('PASS: four-slot limit enforced');

  await page.evaluate(()=>{
   const record=JSON.parse(localStorage.getItem(saveKey));
   delete record.state.items;delete record.state.dayLightsSet;delete record.state.storageUnlocked;
   localStorage.setItem(saveKey,JSON.stringify(record));
  });
  await page.reload();await page.locator('#startGame').click();
  assert.deepEqual(await page.evaluate(()=>state.items),['flashlight']);
  assert.equal(await page.evaluate(()=>state.mainLight),true);
  assert.deepEqual(errors,[]);
  console.log('PASS: old save migration retains flashlight and enables day lights');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
