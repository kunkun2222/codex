import './style.css';
const questions = [
['一碗热气，迎接远道而来的你','小店的主人说：“先吃点东西吧。”\n如果每一份都刚好合你的口味，你想拿起……',['一小碗热汤面','一块刚烤好的面包','一碟温热的米糕','一份绵软的烤土豆']],
['找一个位置，慢慢坐下','食物还冒着热气。屋子里的四个角落，\n你想在哪儿多待一会儿？',['能听见雨声的窗边','灯光刚好照到的长桌一角','摆着旧书的小书架旁','能看见厨房忙碌身影的位置']],
['口袋里，多了一点小小的陪伴','出门前，店主请你带走一件小物。\n你伸手拿起了……',['一枚光滑的浅色石子','一张手绘的小镇地图','一个会轻响的铜铃','一册留着空白页的口袋本']],
['风捎来了一场小意外','一阵风吹散了门口晾着的明信片。\n你最先注意到的是……',['落在脚边的那句祝福','几张卡片飞向的小路','正在弯腰拾卡片的人','卡片背面不同的邮戳']],
['有一份邀请，留给路过的你','花园的木门半开着，有人邀你稍坐。\n你愿意一起做什么？',['替花盆换一个舒服的位置','尝尝刚泡好的花草茶','听听这座花园的来历','沿着篱笆散一小段步']],
['把午后的时间，借给一件小事','镇上的书店正准备打烊。\n你顺手帮店主……',['把散落的书签夹回书里','为明天的橱窗挑一本书','给窗台上的植物浇水','把门外的坐垫收进来']],
['一份没有署名的礼物','长椅上有个纸包，写着“送给有缘人”。\n拆开时，你希望看见……',['一小袋可以种下的花籽','一段写在纸上的小故事','一张标记着风景的地图','一枚手工缝制的布徽章']],
['天色渐晚，路还很温柔','前面几条路都能抵达住处。\n今晚，你想走哪一条？',['经过苹果园的石子路','沿着小溪伸展的木栈道','能看见山坡的缓缓长路','穿过亮灯街巷的窄路']],
['夜晚，也有自己的声音','小屋已经近在眼前。\n哪一种声音让你想放慢脚步？',['树叶被风翻动的沙沙声','远处传来的一小段琴声','屋檐下细细密密的雨声','隔壁隐约的说笑与杯碟声']],
['今晚的最后一点时间，属于你','门已经为你打开，灯也暖暖地亮着。\n睡前，你想先……',['泡一杯热饮，看一会儿窗外','写下今天遇到的一件小事','把带回来的小物摆在床头','翻几页床边那本没读过的书']]
];
const questionScenes = [
  {file:'01-supper', title:'热气与灯火', alt:'乡间小店的木桌上，热食与烛光静静等待来客'},
  {file:'02-corner', title:'一个小角落', alt:'窗边、书架与暖灯围成小店里舒适的角落'},
  {file:'03-keepsakes', title:'口袋里的礼物', alt:'木桌上摆着浅色石子、手绘地图、铜铃与口袋本'},
  {file:'04-postcards', title:'风的来信', alt:'微风将明信片吹过蔷薇环绕的小屋门廊'},
  {file:'05-garden', title:'花园的邀请', alt:'敞开的蔷薇木门后，是摆着茶具和花盆的乡间花园'},
  {file:'06-bookshop', title:'书页之间', alt:'即将打烊的乡间书店里，书架与窗台植物映着暖灯'},
  {file:'07-gift', title:'偶然的礼物', alt:'花园长椅上放着一份系着亚麻丝带的神秘纸包'},
  {file:'08-paths', title:'暮色中的路', alt:'暮色中的乡间小路通向苹果园、小溪与亮灯的小镇'},
  {file:'09-night', title:'听见夜晚', alt:'细雨与树叶环绕着夜幕中亮着暖灯的小屋'},
  {file:'10-rest', title:'为自己停留', alt:'月光照进小屋卧室，床边的灯、热茶和书本等待着你'}
];
const homes = [
{name:'雨声阁楼',en:'THE RAINY ATTIC',line:'你可以慢慢来，雨会替你守住这一刻。',text:'你会留意一句话里的停顿，也珍惜不必急着回应的时刻。安静能让你听见自己的节奏，细腻也让许多日常有了光。',wish:'今晚，可以先把别人的心事放在门外。这张椅子，只留给你。',color:'#758d91'},
{name:'面包花园',en:'THE BREAD GARDEN',line:'平凡的日子里，也有刚刚好的甜。',text:'你与生活的联系，常藏在可以触摸的小事里。一份热食、一盆新叶、一张整理好的桌子，都可能让你重新安定下来。你有把日子慢慢过暖的力量。',wish:'今晚，不必照顾好所有事情。也给自己留一块最松软的面包。',color:'#ad906c'},
{name:'晚风灯塔',en:'THE EVENING LIGHTHOUSE',line:'风经过的地方，总有一盏灯认得你。',text:'你愿意给未知留一扇窗。换一条路、看看远处，有时就能带给你新的呼吸。你可以喜欢远方，也可以在熟悉的地方好好停靠。',wish:'今晚，不必决定下一站。抵达这里，就已经很好。',color:'#768c82'},
{name:'蔷薇茶室',en:'THE ROSE TEAROOM',line:'有些温暖，只需要一起坐一会儿。',text:'你常在彼此陪伴的小片刻里找到安心。一杯茶的时间、一句随口的问候，都能变成珍贵的连接。你让相遇有了温度，也值得被认真回应。',wish:'今晚，你不必一直做那个体贴的人。茶已经有人替你泡好了。',color:'#ae8585'},
{name:'月光书屋',en:'THE MOONLIT LIBRARY',line:'没说完的故事，可以在这里接着写。',text:'你喜欢在细节背后发现故事，也愿意为一个念头停留。想象让你的世界宽阔，独处的时光也常有自己的丰盛。那些暂时没有答案的问题，可以先收进书页。',wish:'今晚，不必把一切想明白。翻到喜欢的一页，就可以休息。',color:'#8c839e'},
{name:'苹果树小院',en:'THE APPLE COURTYARD',line:'在自己的小天地里，重新长出一点力气。',text:'你珍惜缓缓发生的变化。一点点整理、一次小小尝试，都能让生活重新有了方向。你可能比自己想象的更懂得，怎样为心里重要的事留出位置。',wish:'今晚，不必等到所有事情完成才休息。小院会替你照看未完的事。',color:'#82916d'}
];
// Each choice contributes to several homes; a single preference never determines the result.
const weights=[[[3,1],[1,5],[0,4],[5,2]],[[0,2],[3,1],[4,0],[1,3]],[[0,5],[2,4],[3,2],[4,5]],[[4,0],[2,5],[3,1],[4,2]],[[5,1],[3,0],[4,3],[2,5]],[[0,4],[4,2],[5,1],[1,3]],[[5,1],[4,0],[2,4],[3,5]],[[1,5],[0,2],[2,4],[3,1]],[[5,2],[4,3],[0,4],[3,1]],[[0,1],[4,5],[5,3],[2,4]]];
let step=-1, answers=Array(10).fill(null), result=null;
let advanceTimer=null;
const app=document.querySelector('#app');
const icons=['✧','❋','☾','❦'];
const preloadedScenes = new Set();
function preloadNextScene(){
  if(step < 0 || step >= questionScenes.length - 1) return;
  const src = `/scenes/${questionScenes[step + 1].file}.webp`;
  if(preloadedScenes.has(src)) return;
  preloadedScenes.add(src);
  const image = new Image();
  image.fetchPriority = 'low';
  image.src = src;
}
function header(){return `<header><a class="brand" href="#" aria-label="返回首页">✧ <span>暮光小镇</span></a><span class="header-note">给心灵的一次短暂旅行</span><button class="about" aria-label="关于这个测试">?</button></header>`}
function render(){clearTimeout(advanceTimer);advanceTimer=null;document.body.classList.toggle('is-quiz',step>=0&&step<10);app.innerHTML=header()+(step===-1?landing():step<10?quiz():resultPage());document.querySelector('.brand').onclick=e=>{e.preventDefault();step=-1;render()};document.querySelector('.about').onclick=()=>{const d=document.createElement('dialog');d.innerHTML='<button class="close" aria-label="关闭">×</button><span class="eyebrow">A LITTLE NOTE</span><h2>只是一次温柔的探索</h2><p>这是原创的趣味测试，不是心理诊断，也不定义你的性格。结果只是一份关于此刻偏好的小小想象。答案仅保留在当前页面，刷新即可清除。</p><p>愿你选得自在，也愿每个结果都能给你一点温暖。</p>';app.append(d);d.querySelector('button').onclick=()=>d.close();d.showModal()};bind();preloadNextScene()}
function landing(){return `<main class="landing"><div class="hero-copy"><span class="eyebrow"><i></i> A LITTLE JOURNEY TO YOURSELF</span><h1>今晚，有一盏灯<br>为<span>你</span>而亮。</h1><p class="intro">穿过晚风与花园，走进暮色里的小镇。<br>跟随直觉，找到那间愿意为你留灯的小屋。</p><button class="primary" id="begin">寻找我的小屋 <span>⟶</span></button><div class="journey-meta"><span>✧ 10 次随心选择</span><b>·</b><span>约 3 分钟的温柔时光</span></div></div><div class="scene-label"><span>THE TWILIGHT VILLAGE</span><p>不必成为谁，带着自己来就好。</p></div><div class="float-note"><span>☾</span> 天快黑了，进来坐坐吧。</div></main><footer><span>一段小小的旅程 · 六间温暖的小屋</span><span>趣味探索，无关对错</span></footer>`}
function quiz(){const q=questions[step];const scene=questionScenes[step];return `<main class="quiz"><div class="quiz-top"><button class="back" id="back">← ${step?'上一站':'回到小镇'}</button><span>旅途 · ${String(step+1).padStart(2,'0')} / 10</span></div><div class="progress"><i style="width:${(step+1)*10}%"></i></div><div class="question-layout"><div class="story-art"><img class="chapter-image" src="/scenes/${scene.file}.webp" alt="${scene.alt}" decoding="async"><div class="art-caption">CHAPTER ${String(step+1).padStart(2,'0')}<p>${scene.title}</p></div></div><section class="question"><span class="eyebrow">FOLLOW YOUR HEART</span><h2>${q[0]}</h2><p class="question-desc">${q[1].replace('\n','<br>')}</p><div class="options">${q[2].map((v,i)=>`<button class="option ${answers[step]===i?'selected':''}" data-answer="${i}" aria-pressed="${answers[step]===i}"><span>${icons[i]}</span>${v}<b>${answers[step]===i?'✓':'＋'}</b></button>`).join('')}</div><div class="question-bottom"><span>✧ 轻触选择，跟随心意去下一站</span><span class="answer-status" role="status" aria-live="polite"></span></div></section></div></main>`}
function compute(){const scores=Array(6).fill(0);answers.forEach((v,i)=>{const w=weights[i][v];scores[w[0]]+=2;scores[w[1]]+=1});return homes[scores.indexOf(Math.max(...scores))]}
function resultPage(){const r=result;return `<main class="result"><span class="eyebrow">A PLACE THAT FEELS LIKE YOU</span><p class="result-kicker">今晚，为你留灯的是</p><h1>${r.name}</h1><p class="result-line">${r.line}</p><div class="result-card" style="--accent:${r.color}"><div class="result-art"><span>✧ ${r.en} ✧</span></div><div class="letter"><span class="eyebrow">DEAR YOU,</span><p>${r.text}</p><p>${r.wish}</p><span class="signature">愿你今夜好眠。<br>—— 暮光小镇</span></div></div><div class="result-actions"><button class="primary" id="save">保存我的小屋卡片 ↓</button><button class="text-button" id="restart">再走一次小镇 ↺</button></div><p class="result-disclaimer">这是一份关于此刻的温柔想象，不是对你的定义。</p><p id="save-status" role="status"></p></main>`}
function chooseAnswer(button){
  if(advanceTimer!==null) return;
  const selectedStep=step;
  answers[step]=Number(button.dataset.answer);
  document.querySelectorAll('[data-answer]').forEach(option=>{
    const selected=option===button;
    option.classList.toggle('selected',selected);
    option.setAttribute('aria-pressed',String(selected));
    option.disabled=true;
    option.querySelector('b').textContent=selected?'✓':'＋';
  });
  document.querySelector('.answer-status').textContent=step===9?'小屋的灯亮了…':'出发…';
  advanceTimer=setTimeout(()=>{
    advanceTimer=null;
    if(step!==selectedStep) return;
    step++;
    if(step===10) result=compute();
    render();
    window.scrollTo({top:0,behavior:'instant'});
    const heading=document.querySelector('.question h2, .result h1');
    heading?.setAttribute('tabindex','-1');
    heading?.focus({preventScroll:true});
  },380);
}
function bind(){
  document.querySelector('#begin')?.addEventListener('click',()=>{step=0;render();window.scrollTo(0,0)});
  document.querySelector('#back')?.addEventListener('click',()=>{step--;render();window.scrollTo(0,0)});
  document.querySelectorAll('[data-answer]').forEach(button=>button.onclick=()=>chooseAnswer(button));
  document.querySelector('#restart')?.addEventListener('click',()=>{answers.fill(null);step=0;render();window.scrollTo(0,0)});
  document.querySelector('#save')?.addEventListener('click',saveCard);
}
async function saveCard(){const status=document.querySelector('#save-status');try{await document.fonts.ready;const c=document.createElement('canvas');c.width=1080;c.height=1500;const x=c.getContext('2d');x.fillStyle='#f5f0e6';x.fillRect(0,0,1080,1500);const img=new Image();img.src='/village.png';await img.decode();x.drawImage(img,0,100,1080,750);x.fillStyle='#f5f0e6';x.fillRect(0,800,1080,700);x.textAlign='center';x.fillStyle='#586851';x.font='24px "Twilight WenKai", serif';x.fillText('暮 光 小 镇 · 今 晚 为 我 留 灯 的 是',540,80);x.font='64px "Twilight WenKai", serif';x.fillText(result.name,540,900);x.font='26px "Twilight WenKai", serif';x.fillText(result.line,540,965);x.textAlign='left';x.font='29px "Twilight WenKai", serif';let y=1050;for(const paragraph of [result.text,result.wish]){let line='';for(const char of paragraph){if(x.measureText(line+char).width>880){x.fillText(line,100,y);y+=49;line=''}line+=char}x.fillText(line,100,y);y+=75}x.textAlign='center';x.font='20px "Twilight WenKai", serif';x.fillStyle='#8c8b7d';x.fillText('一份关于此刻的温柔想象 · 愿你今夜好眠',540,1440);const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`暮光小镇-${result.name}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);status.textContent='卡片已生成。如手机弹出图片，请长按保存。'}catch{status.textContent='暂时没能生成卡片，请稍后再试。'}}
render();
