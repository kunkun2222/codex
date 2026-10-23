import './style.css';
import {deliverCard} from './save-image.js';
import {TOTAL_STEPS,buildRoute,pruneAnswers,analyze} from './adventure.js';
let step=-1, answers={}, route=buildRoute(answers), result=null;
const sceneNames={'01-supper':'热气与灯火','02-corner':'一个小角落','03-keepsakes':'口袋里的礼物','04-postcards':'风的来信','05-garden':'花园的邀请','06-bookshop':'书页之间','07-gift':'偶然的礼物','08-paths':'暮色中的路','09-night':'听见夜晚','10-rest':'为自己停留'};
let advanceTimer=null;
const app=document.querySelector('#app');
const icons=['✧','❋','☾','❦'];
const preloadedScenes = new Set();
function preloadNextScene(){
  if(step < 0 || step >= route.length - 1) return;
  const src = `./scenes/${route[step + 1].scene}.webp`;
  if(preloadedScenes.has(src)) return;
  preloadedScenes.add(src);
  const image = new Image();
  image.fetchPriority = 'low';
  image.src = src;
}
function header(){return `<header><a class="brand" href="#" aria-label="返回首页">✧ <span>暮光小镇</span></a><span class="header-note">给心灵的一次短暂旅行</span><button class="about" aria-label="关于这个测试">?</button></header>`}
function render(){
 clearTimeout(advanceTimer);advanceTimer=null;
 document.body.classList.toggle('is-quiz',step>=0&&step<TOTAL_STEPS);
 app.innerHTML=header()+(step===-1?landing():step<TOTAL_STEPS?quiz():resultPage());
 document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();step=-1;render()});
 document.querySelector('.about').addEventListener('click',()=>{
  const dialog=document.createElement('dialog');
  dialog.innerHTML='<button class="close" aria-label="关闭">×</button><span class="eyebrow">A LITTLE NOTE</span><h2>只是一次温柔的探索</h2><p>这是原创的趣味测试，不是心理诊断，也不定义你的性格。结果只是一份关于此刻偏好的小小想象。题目来自原创故事，观察探索、自主、联结、照料、反思和秩序等偏好，不是经过验证的心理量表。答案仅保留在当前页面，刷新即可清除。</p><p>愿你选得自在，也愿每个结果都能给你一点温暖。</p>';
  app.append(dialog);
  dialog.querySelector('button').addEventListener('click',()=>{
   if(typeof dialog.close==='function')dialog.close();
   dialog.remove();
  });
  if(typeof dialog.showModal==='function')dialog.showModal();
  else{dialog.classList.add('fallback-dialog');dialog.setAttribute('open','');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true')}
 });
 bind();preloadNextScene();
}
function landing(){return `<main class="landing"><div class="hero-copy"><span class="eyebrow"><i></i> A LITTLE JOURNEY TO YOURSELF</span><h1>今晚，有一盏灯<br>为<span>你</span>而亮。</h1><p class="intro">穿过晚风与花园，走进暮色里的小镇。<br>跟随直觉，找到那间愿意为你留灯的小屋。</p><button class="primary" id="begin">寻找我的小屋 <span>⟶</span></button><div class="journey-meta"><span>✧ 15 次故事选择</span><b>·</b><span>约 5 分钟 · 含分支相遇</span></div></div><div class="scene-label"><span>THE TWILIGHT VILLAGE</span><p>不必成为谁，带着自己来就好。</p></div><div class="float-note"><span>☾</span> 天快黑了，进来坐坐吧。</div></main><footer><span>一段小小的旅程 · 十二间温暖的小屋</span><span>趣味探索，无关对错</span></footer>`}
function quiz(){
 const q=route[step];
 const title=sceneNames[q.scene];
 return `<main class="quiz"><div class="quiz-top"><button class="back" id="back">← ${step?'上一站':'回到小镇'}</button><span>旅途 · ${String(step+1).padStart(2,'0')} / ${TOTAL_STEPS}</span></div><div class="progress"><i style="width:${(step+1)/TOTAL_STEPS*100}%"></i></div><div class="question-layout"><div class="story-art"><img class="chapter-image" src="./scenes/${q.scene}.webp" alt="${title}的小镇插画" decoding="async"><div class="art-caption">${q.id.includes('-')?'A PATH YOU CHOSE':'CHAPTER '+String(step+1).padStart(2,'0')}<p>${q.id.includes('-')?'你的选择，带来新的相遇':title}</p></div></div><section class="question"><span class="eyebrow">FOLLOW YOUR HEART</span><h2>${q.title}</h2><p class="question-desc">${q.description.replace('\n','<br>')}</p><div class="options">${q.options.map((option,i)=>`<button class="option ${answers[q.id]===i?'selected':''}" data-answer="${i}" aria-pressed="${answers[q.id]===i}"><span>${icons[i]}</span><span class="option-text">${option.text}</span><b>${answers[q.id]===i?'✓':'＋'}</b></button>`).join('')}</div><div class="question-bottom"><span>✧ 轻触选择，故事会回应你的心意</span><span class="answer-status" role="status" aria-live="polite"></span></div></section></div></main>`;
}
function compute(){return analyze(answers)}
function resultPage(){const r=result;return `<main class="result"><span class="eyebrow">A PLACE THAT FEELS LIKE YOU</span><p class="result-kicker">今晚，为你留灯的是</p><h1>${r.name}</h1><p class="result-line">${r.line}</p><div class="result-card" style="--accent:${r.color}"><div class="result-art"><img class="result-image" src="./homes/${r.image}.webp" alt="${r.imageAlt}" decoding="async" fetchpriority="high"><span>✧ ${r.en} ✧</span></div><div class="letter"><span class="eyebrow">DEAR YOU,</span><h3>你习惯如何面对世界</h3><p>${r.text}</p><p>${r.personalNote}</p><p class="personal-rest">${r.restNote}</p><h3>你心里的一处拉扯</h3><p>${r.tension}</p><h3>可能让你累的情境</h3><p>${r.fatigue}</p><h3>一个可以试试的小动作</h3><p>${r.action}</p><details class="choice-echo"><summary>听听这次选择的回声</summary>${r.evidence.map(e=>`<p>在「${e.title}」里，你选了「${e.choice}」。</p>`).join('')}<p>这些是多次选择中的两处线索，分析会综合当前路线的全部答案。</p></details><p class="result-nuance">${r.nuance}</p><span class="signature">愿你今夜好眠。<br>—— 暮光小镇</span></div></div><div class="result-actions"><button class="primary" id="save">保存我的小屋卡片 ↓</button><button class="text-button" id="restart">再走一次小镇 ↺</button></div><p class="result-disclaimer">原创人格倾向探索，未经心理量表验证，不用于诊断，也不定义你。</p><p id="save-status" role="status"></p></main>`}
function chooseAnswer(button){
  if(advanceTimer!==null) return;
  const selectedStep=step;
  const currentQuestion=route[step];
  answers[currentQuestion.id]=Number(button.dataset.answer);
  answers=pruneAnswers(answers);
  route=buildRoute(answers);
  document.querySelectorAll('[data-answer]').forEach(option=>{
    const selected=option===button;
    option.classList.toggle('selected',selected);
    option.setAttribute('aria-pressed',String(selected));
    option.disabled=true;
    option.querySelector('b').textContent=selected?'✓':'＋';
  });
  document.querySelector('.answer-status').textContent=step===TOTAL_STEPS-1?'小屋的灯亮了…':'出发…';
  advanceTimer=setTimeout(()=>{
    advanceTimer=null;
    if(step!==selectedStep) return;
    step++;
    if(step===TOTAL_STEPS) result=compute();
    render();
    window.scrollTo(0,0);
    const heading=document.querySelector('.question h2, .result h1');
    heading?.setAttribute('tabindex','-1');
    heading?.focus({preventScroll:true});
  },380);
}
function bind(){
  document.querySelector('#begin')?.addEventListener('click',()=>{step=0;render();window.scrollTo(0,0)});
  document.querySelector('#back')?.addEventListener('click',()=>{step--;render();window.scrollTo(0,0)});
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>chooseAnswer(button)));
  document.querySelector('#restart')?.addEventListener('click',()=>{answers={};route=buildRoute(answers);result=null;step=0;render();window.scrollTo(0,0)});
  document.querySelector('#save')?.addEventListener('click',saveCard);
}
// Preserve the illustration's proportions on both the page and the keepsake.
function drawImageCover(context,image,x,y,width,height){
  const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);
  const sourceWidth=width/scale;
  const sourceHeight=height/scale;
  context.drawImage(image,(image.naturalWidth-sourceWidth)/2,(image.naturalHeight-sourceHeight)/2,sourceWidth,sourceHeight,x,y,width,height);
}
function wrapCardText(context,text){
 const lines=[];let line='';
 for(const character of text){
  if(context.measureText(line+character).width>880&&!/[，。！？、；：”’）》】]/u.test(character)){lines.push(line);line=''}
  line+=character;
 }
 if(line)lines.push(line);
 return lines;
}
function waitForImage(image){
 if(image.complete&&image.naturalWidth)return Promise.resolve();
 return new Promise((resolve,reject)=>{
  image.addEventListener('load',resolve,{once:true});
  image.addEventListener('error',()=>reject(new Error('Image unavailable')),{once:true});
 });
}
function roundedRectangle(context,x,y,width,height,radius){
 if(typeof context.roundRect==='function'){context.roundRect(x,y,width,height,radius);return}
 context.moveTo(x+radius,y);
 context.lineTo(x+width-radius,y);context.quadraticCurveTo(x+width,y,x+width,y+radius);
 context.lineTo(x+width,y+height-radius);context.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);
 context.lineTo(x+radius,y+height);context.quadraticCurveTo(x,y+height,x,y+height-radius);
 context.lineTo(x,y+radius);context.quadraticCurveTo(x,y,x+radius,y);
 context.closePath();
}
async function saveCard(){
  const status=document.querySelector('#save-status');
  const button=document.querySelector('#save');
  const currentResult=result;
  button.disabled=true;
  status.textContent='正在为你装好小屋与灯光…';
  try{
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    const canvas=document.createElement('canvas');
    canvas.width=1080;
    const context=canvas.getContext('2d');
    context.font='32px "Twilight WenKai", serif';
    const paragraphs=[currentResult.text,currentResult.wish].map(text=>wrapCardText(context,text));
    canvas.height=Math.max(1560,1060+paragraphs.reduce((total,lines)=>total+lines.length*51+26,0)+140);
    context.fillStyle='#211f30';
    context.fillRect(0,0,1080,canvas.height);
    const image=new Image();
    image.src=`./homes/${currentResult.image}.webp`;
    await waitForImage(image);
    context.save();
    context.beginPath();
    roundedRectangle(context,40,110,1000,710,28);
    context.clip();
    drawImageCover(context,image,40,110,1000,710);
    context.restore();
    context.textAlign='center';
    context.fillStyle='#eacddd';
    context.font='28px "Twilight WenKai", serif';
    context.fillText('暮 光 小 镇 · 今 晚 为 我 留 灯 的 是',540,70);
    context.fillStyle='#f9e0ec';
    context.font='64px "Twilight WenKai", serif';
    context.fillText(currentResult.name,540,915);
    context.font='29px "Twilight WenKai", serif';
    context.fillText(currentResult.line,540,980);
    context.textAlign='left';
    context.fillStyle='#e0d2e6';
    context.font='32px "Twilight WenKai", serif';
    let y=1060;
    for(const lines of paragraphs){
      for(const line of lines){context.fillText(line,100,y);y+=51}
      y+=26;
    }
    context.textAlign='center';
    context.font='23px "Twilight WenKai", serif';
    context.fillStyle='#c7b3ce';
    context.fillText('一份关于此刻的温柔想象 · 愿你今夜好眠',540,canvas.height-55);
    status.textContent=await deliverCard(canvas,currentResult.name);
  }catch{
    status.textContent='暂时没能生成卡片，请稍后再试。';
  }finally{
    button.disabled=false;
  }
}
render();
