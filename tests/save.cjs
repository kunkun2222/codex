const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const {createRequire}=require('node:module');
const runtimeRequire=createRequire(path.join(process.env.LOCALAPPDATA||process.cwd(),'unused.cjs'));
let chromium;
try{({chromium}=require('playwright'))}catch{
 ({chromium}=runtimeRequire(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')));
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1366,height:768}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const url=pathToFileURL(path.resolve(__dirname,'../game/index.html')).href;
  const key='guizhai-save-v1';
  await page.goto(url);
  await page.evaluate(()=>{localStorage.clear();state.soundEnabled=false});
  await page.locator('#startGame').click();
  await page.locator('#advancePrologue').click();
  await page.locator('#advancePrologue').click();
  await page.locator('#hotspots button[aria-label="进入老宅"]').click();
  await page.getByRole('button',{name:'客厅灯开关',exact:true}).click();
  await page.getByRole('button',{name:'上楼',exact:true}).click();
  await page.getByRole('button',{name:'我的房间',exact:true}).click();
  await page.getByRole('button',{name:'查看窗台',exact:true}).click();
  await page.reload();
  assert.equal(await page.locator('#startLabel').textContent(),'继续游戏');
  await page.locator('#startGame').click();
  assert.equal(await page.evaluate(()=>state.room),'bedroom');
  assert.equal(await page.evaluate(()=>state.mainLight),true);
  assert.equal(await page.evaluate(()=>state.notes.some(note=>note.startsWith('卧房：窗台'))),true);
  console.log('PASS: room, lights and clues survive reload');

  await page.evaluate(()=>{state.soundEnabled=false;state.callPhase='talking';state.callLine=2;showCallLine()});
  await page.reload();await page.locator('#startGame').click();
  assert.equal(await page.evaluate(()=>state.callLine),2);
  assert.equal(await page.evaluate(()=>state.callPhase),'talking');
  assert.equal(await page.locator('#nightSequence').isVisible(),true);
  await page.locator('#phoneAccept').click();
  assert.equal(await page.evaluate(()=>state.callLine),3);
  console.log('PASS: phone resumes at saved dialogue');

  await page.evaluate(()=>{state.callCompleted=true;state.rested=true;state.callPhase='footsteps';saveProgress()});
  await page.reload();await page.locator('#startGame').click();
  assert.equal(await page.evaluate(()=>state.firstNight),false);
  assert.equal(await page.evaluate(()=>state.room),'yard');
  await page.locator('#hotspots button[aria-label="进入老宅"]').click();
  await page.getByRole('button',{name:'拿起手电筒',exact:true}).click();
  await page.getByRole('button',{name:'确认',exact:true}).click();
  await page.reload();await page.locator('#startGame').click();
  assert.equal(await page.locator('#capacity').textContent(),'1/4');
  const safeSave=await page.evaluate(key=>localStorage.getItem(key),key);
  await page.locator('#testPowerCut').click();
  await page.evaluate(()=>saveProgress());
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),safeSave);
  await page.reload();await page.locator('#startGame').click();
  assert.equal(await page.evaluate(()=>state.powerOut),false);
  console.log('PASS: morning, inventory and safe blackout checkpoint');

  const beforePreview=await page.evaluate(key=>localStorage.getItem(key),key);
  await page.goto(url+'?preview=day2');
  await page.evaluate(()=>saveProgress());
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),beforePreview);
  console.log('PASS: gallery preview preserves save');

  await page.goto(url);
  page.once('dialog',dialog=>dialog.dismiss());await page.locator('#restartGame').click();
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),beforePreview);
  await page.evaluate(()=>localStorage.setItem('guizhai-personal-notes','test'));
  page.once('dialog',dialog=>dialog.accept());await page.locator('#restartGame').click();
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('guizhai-checkpoint')),null);
  assert.equal(await page.evaluate(()=>localStorage.getItem('guizhai-personal-notes')),null);
  await page.locator('#advancePrologue').click();await page.locator('#advancePrologue').click();
  assert.equal(await page.evaluate(()=>state.room),'yard');
  assert.equal(await page.evaluate(()=>state.picked),false);
  assert.equal(await page.evaluate(()=>state.firstNight),true);
  console.log('PASS: restart confirmation and clean new game');

  await page.evaluate(key=>{localStorage.removeItem(key);localStorage.setItem('guizhai-checkpoint','day2')},key);
  await page.reload();await page.locator('#startGame').click();
  assert.equal(await page.evaluate(()=>state.firstNight),false);
  console.log('PASS: legacy day-two migration');
  await page.locator('#home').click();
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'guizhai-save-desktop.png')});
  await page.setViewportSize({width:844,height:390});
  await page.screenshot({path:path.join(require('node:os').tmpdir(),'guizhai-save-mobile.png')});
  const bounds=await page.locator('#restartGame').boundingBox();
  assert.ok(bounds.y>=0&&bounds.y+bounds.height<=390);

  await page.evaluate(key=>localStorage.setItem(key,'{"version":1,"state":{}}'),key);
  await page.reload();
  assert.equal(await page.locator('#startLabel').textContent(),'开始游戏');
  assert.match(await page.locator('#saveStatus').textContent(),/无法读取/);
  console.log('PASS: corrupt save handled without crash');
  await page.evaluate(()=>{state.started=true;state.notes.push('storage test');Storage.prototype.setItem=()=>{throw new Error('blocked')};saveProgress()});
  assert.match(await page.locator('#saveStatus').textContent(),/无法保存/);
  assert.deepEqual(errors,[]);
  console.log('PASS: storage failure reported; no browser script errors');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
