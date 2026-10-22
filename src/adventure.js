// An original reflective story, not a validated psychological inventory.
// O: exploration, A: autonomy, C: connection, K: practical care,
// R: reflection, S: structure. Multiple choices contribute to every dimension.
export const DIMENSIONS={
 O:{name:'探索',text:'你愿意给未知留一点位置，新的可能常能让你重新投入。'},
 A:{name:'自主',text:'你重视自己作决定的空间，也愿意听见内心真实的意愿。'},
 C:{name:'联结',text:'你会把人与人之间的回应放进考虑，相遇本身对你有分量。'},
 K:{name:'照料',text:'你容易留意具体的需要，常通过实际的小事让生活变得温暖。'},
 R:{name:'反思',text:'你愿意停下来理解来龙去脉，也珍惜经验背后的意义。'},
 S:{name:'秩序',text:'你喜欢让重要的事有着落，清楚的安排能为你腾出心里的空间。'}
};
const option=(text,weights)=>({text,weights});
const question=(id,title,description,scene,options)=>({id,title,description,scene,options});
export const TOTAL_STEPS=15;
export const BASE_QUESTIONS=[
 question('arrival','欢迎来到暮光小镇','门票背面可以写一句话。\n你想让小镇先知道……','08-paths',[
  option('我想遇见一点意料之外',{O:2,A:1}),option('我想暂时不用赶路',{A:2,R:1}),option('我想有个人一起看看',{C:2,K:1}),option('我想找回一点自己的节奏',{S:2,R:1})]),
 question('supper','一桌留给陌生人的晚餐','店主请每个人为这顿饭添一点什么。\n你愿意……','01-supper',[
  option('带来一种没尝过的小食',{O:2,K:1}),option('问问大家今天遇见了什么',{C:2,R:1}),option('把桌上的食物分成小份',{K:2,S:1}),option('留张小纸条，再安静入座',{R:2,A:1})]),
 question('letter','一封没有地址的信','信封只写着“请在今晚之前送到”。\n你决定先……','04-postcards',[
  option('问问附近店里有没有线索',{C:2,O:1}),option('看看邮戳和信封的痕迹',{R:2,S:1}),option('交到广场的失物招领处',{S:2,K:1}),option('在原地等一会儿失主',{K:2,A:1})]),
 question('garden','花园里的半小时','你约好了半小时后离开。\n主人却刚讲到故事最有趣的地方。','05-garden',[
  option('留下听完，再调整后面的路',{C:2,O:1}),option('记住故事，下次回来再听',{S:2,R:1}),option('问能否边走边接着讲',{C:2,A:1}),option('告别前，先留一句自己的回应',{R:2,K:1})]),
 question('gift','礼物并不总是合心意','一位新朋友送你一件亲手做的小物，\n它很用心，却不是你喜欢的样子。','07-gift',[
  option('先告诉对方我喜欢哪处细节',{K:2,C:1}),option('聊聊它是怎样做出来的',{R:2,C:1}),option('谢谢心意，再找适合它的位置',{A:2,S:1}),option('邀请对方一起改出新用法',{O:2,K:1})]),
 question('room','旅馆只剩两间客房','一间看得到流星，但楼下很热闹；\n另一间安静，窗外只有藤蔓。','02-corner',[
  option('选流星房，问好散场时间',{O:2,S:1}),option('选安静房，睡前去外面看星',{A:2,O:1}),option('先聊聊今晚住着哪些旅人',{C:2,R:1}),option('看看两间房，再凭感受决定',{R:2,A:1})]),
 question('bookshop','一本只剩结尾的书','书店有本旧书，前面的页都不见了。\n店主问，你愿意怎样带走它？','06-bookshop',[
  option('替它想一个不一样的开头',{O:2,R:1}),option('问店主记得多少原来的故事',{R:2,C:1}),option('把留下的页整理装订好',{S:2,K:1}),option('约个人，各自写半段故事',{C:2,O:1})]),
 question('rain','一场打乱计划的雨','桥边开始下雨，原定的路走不通了。\n你会先做哪件事？','09-night',[
  option('找另一条能绕过去的小路',{A:2,O:1}),option('看看雨势，再安排接下来的路',{S:2,R:1}),option('问问同路的人打算怎么走',{C:2,S:1}),option('先找个地方，让大家避避雨',{K:2,C:1})]),
 question('farewell','面包店的最后一晚','店主明天要搬走，请你带走一样东西。\n你会选择……','01-supper',[
  option('写满修改痕迹的旧配方本',{R:2,S:1}),option('挂过很多年的小木招牌',{R:2,K:1}),option('最后一篮面包，找人一起吃',{C:2,K:1}),option('一团面种，带到别处养起来',{O:2,A:1})]),
 question('lantern','灯会还差最后一点准备','你答应布置灯会，自己的小屋也还没收拾。\n离天黑只剩一点时间。','08-paths',[
  option('说清能帮多久，再按时回去',{A:2,S:1}),option('和大家分工，把两边都安排好',{S:2,C:1}),option('先完成答应的事，再慢慢安顿',{K:2,S:1}),option('问能否把自己的布置带来一起做',{O:2,C:1})]),
 question('wish','一盏可以留下心愿的灯','灯里只能放进一句话，不一定马上实现。\n此刻你更愿意写……','03-keepsakes',[
  option('愿我仍敢去试没走过的路',{O:2,A:1}),option('愿重要的人听见彼此的心意',{C:2,K:1}),option('愿我懂得自己在珍惜什么',{R:2,A:1}),option('愿我把想做的事慢慢做成',{S:2,K:1})]),
 question('rest','今晚，先把自己接回来','灯已经替你亮着。经历这一天，\n哪件小事最能让你舒服一些？','10-rest',[
  option('独自坐一会儿，不急着回应',{A:2,R:1}),option('找个信任的人说说今天',{C:2,R:1}),option('出门散散步，让风换换心情',{O:2,A:1}),option('泡杯热饮，整理出舒服的角落',{K:2,S:1})])
];
// Four meaningful responses to each of three choices, then back to the shared story.
export const BRANCHES={
 letter:[
 question('letter-ask','两个不一样的答案','一位说信属于花匠，一位说属于钟表匠。\n他们都讲得很笃定。','04-postcards',[
  option('问问两人各自为什么这样想',{R:2,C:1}),option('找两位收信人分别确认',{S:2,K:1}),option('先走到最近的一家问问',{O:2,A:1}),option('请他们帮忙找一条共同线索',{C:2,S:1})]),
 question('letter-trace','线索通向一条陌生路','邮戳上画着河对岸的温室。\n天色正好，但你还没去过那里。','08-paths',[
  option('确认过桥的路，再出发',{S:2,O:1}),option('带上信，沿途慢慢找',{A:2,O:1}),option('问有没有人也往那边走',{C:2,O:1}),option('再找一处细节核对目的地',{R:2,S:1})]),
 question('letter-desk','管理员接过了那封信','“要是找到主人，你希望知道后续吗？”\n你想了想……','03-keepsakes',[
  option('留个口信，知道送到了就好',{S:2,K:1}),option('想听听这封信背后的故事',{R:2,C:1}),option('愿意等一会儿，当面交给对方',{C:2,K:1}),option('交给这里就好，我接着逛逛',{A:2,O:1})]),
 question('letter-wait','等候也遇见了岔路','仍没人回来找信，灯会快开始了。\n你决定……','04-postcards',[
  option('留下去向，把信交给招领处',{S:2,K:1}),option('请隔壁店主接着留意一会儿',{C:2,A:1}),option('再等到钟响，把时间留给这里',{K:2,R:1}),option('带去灯会入口找找线索',{O:2,C:1})])],
 room:[
 question('room-stars','流星房传来一份邀请','你刚安顿好，楼下邀你加入夜谈。\n窗外的星星也正慢慢亮起来。','02-corner',[
  option('带杯茶下楼，先坐一会儿',{C:2,O:1}),option('先看会儿星，想去时再下楼',{A:2,R:1}),option('问夜谈聊什么，再作决定',{R:2,S:1}),option('邀请他们晚点一起看星',{O:2,C:1})]),
 question('room-quiet','安静房门口的轻轻敲门声','一位旅人问能否借你窗边的椅子。\n你本来打算独自看会儿书。','02-corner',[
  option('把椅子借给对方，继续看书',{A:2,K:1}),option('问问对方想坐在哪里',{C:2,K:1}),option('说明想安静一会儿，稍后再借',{A:2,S:1}),option('借椅子时，顺便聊聊手上的书',{R:2,C:1})]),
 question('room-guests','你认识了今晚的旅人','有人想早起，有人想聊到很晚。\n他们问你怎样安排才舒服。','02-corner',[
  option('先讲自己的作息，听听大家的',{A:2,C:1}),option('一起约个安静下来的时间',{S:2,C:1}),option('去公共客厅，给早睡的人留安静',{K:2,S:1}),option('安排一小段夜谈，话题随缘',{O:2,C:1})]),
 question('room-look','两间房，各有一点喜欢','你看完房间，还是有些难选。\n老板笑着说：“可以慢慢想。”','02-corner',[
  option('想想今晚最需要照顾的是什么',{R:2,A:1}),option('选一间，把另一种体验留给明天',{S:2,O:1}),option('问问同住的人，听一个新角度',{C:2,R:1}),option('在门口站一会儿，跟随直觉',{A:2,O:1})])],
 farewell:[
 question('farewell-recipe','配方本的最后一页','纸上写着：“还没试过用苹果代替糖。”\n你想怎样续上这一页？','06-bookshop',[
  option('先照旧配方做一次，记住原味',{S:2,R:1}),option('试着改一小份，留下自己的记录',{O:2,S:1}),option('问店主，当时为什么想这样改',{R:2,C:1}),option('找人一起试，分一口刚出炉的味道',{C:2,K:1})]),
 question('farewell-sign','木招牌将有一个新位置','招牌上的字已经有些模糊了。\n你准备把它……','07-gift',[
  option('保留旧痕迹，挂在看得见的地方',{R:2,A:1}),option('修好松动的部分，再妥善挂起',{K:2,S:1}),option('写下它的来历，让来客也读到',{R:2,C:1}),option('做成新物件，让它继续被使用',{O:2,K:1})]),
 question('farewell-bread','最后一篮面包，要送给谁','广场已经亮灯，你闻到篮里的香气。\n你想先……','01-supper',[
  option('找个空位，邀请路过的人一起吃',{C:2,O:1}),option('留一份给一直忙碌的店主',{K:2,R:1}),option('和刚认识的旅人约个小小告别',{C:2,S:1}),option('挑一块自己喜欢的，再分享其余',{A:2,K:1})]),
 question('farewell-starter','面种还需要每天照看','店主教完照料的方法，问你想把它带去哪。\n你想到……','05-garden',[
  option('带回自己的厨房，慢慢养大',{S:2,A:1}),option('约朋友轮流照看，分享第一炉',{C:2,K:1}),option('试试不同的做法，记下变化',{O:2,R:1}),option('先在小镇住几日，把手艺学稳',{R:2,S:1})])]
};
export function buildRoute(answers){
 const route=[];
 for(const q of BASE_QUESTIONS){
  route.push(q);
  if(BRANCHES[q.id]&&Number.isInteger(answers[q.id])&&BRANCHES[q.id][answers[q.id]]) route.push(BRANCHES[q.id][answers[q.id]]);
 }
 return route;
}
export function pruneAnswers(answers){
 const reachable=new Set(buildRoute(answers).map(q=>q.id));
 return Object.fromEntries(Object.entries(answers).filter(([id])=>reachable.has(id)));
}

const originalHomes=[
{name:'雨声阁楼',image:'rainy-attic',imageAlt:'雨滴滑过阁楼拱窗，窗边的软垫、热茶与暖灯等你歇息',en:'THE RAINY ATTIC',line:'你可以慢慢来，雨会替你守住这一刻。',text:'你会留意一句话里的停顿，也珍惜不必急着回应的时刻。安静能让你听见自己的节奏，细腻也让许多日常有了光。',wish:'今晚，可以先把别人的心事放在门外。这张椅子，只留给你。',color:'#758d91'},
{name:'面包花园',image:'bread-garden',imageAlt:'爬满蔷薇的面包小屋前，花园木桌上摆着刚出炉的面包',en:'THE BREAD GARDEN',line:'平凡的日子里，也有刚刚好的甜。',text:'你与生活的联系，常藏在可以触摸的小事里。一份热食、一盆新叶、一张整理好的桌子，都可能让你重新安定下来。你有把日子慢慢过暖的力量。',wish:'今晚，不必照顾好所有事情。也给自己留一块最松软的面包。',color:'#ad906c'},
{name:'晚风灯塔',image:'evening-lighthouse',imageAlt:'海边的小灯塔亮着蜂蜜色的灯，花径通向温暖的守塔小屋',en:'THE EVENING LIGHTHOUSE',line:'风经过的地方，总有一盏灯认得你。',text:'你愿意给未知留一扇窗。换一条路、看看远处，有时就能带给你新的呼吸。你可以喜欢远方，也可以在熟悉的地方好好停靠。',wish:'今晚，不必决定下一站。抵达这里，就已经很好。',color:'#768c82'},
{name:'蔷薇茶室',image:'rose-tearoom',imageAlt:'浅粉蔷薇包围的小茶室，门廊下为你留着一杯热茶',en:'THE ROSE TEAROOM',line:'有些温暖，只需要一起坐一会儿。',text:'你常在彼此陪伴的小片刻里找到安心。一杯茶的时间、一句随口的问候，都能变成珍贵的连接。你让相遇有了温度，也值得被认真回应。',wish:'今晚，你不必一直做那个体贴的人。茶已经有人替你泡好了。',color:'#ae8585'},
{name:'月光书屋',image:'moonlit-library',imageAlt:'月光照着林间书屋，敞开的门里是暖灯、书架和柔软的椅子',en:'THE MOONLIT LIBRARY',line:'没说完的故事，可以在这里接着写。',text:'你喜欢在细节背后发现故事，也愿意为一个念头停留。想象让你的世界宽阔，独处的时光也常有自己的丰盛。那些暂时没有答案的问题，可以先收进书页。',wish:'今晚，不必把一切想明白。翻到喜欢的一页，就可以休息。',color:'#8c839e'},
{name:'苹果树小院',image:'apple-courtyard',imageAlt:'苹果树下的小院里，果篮、毛毯与花草陪着一扇亮灯的窗',en:'THE APPLE COURTYARD',line:'在自己的小天地里，重新长出一点力气。',text:'你珍惜缓缓发生的变化。一点点整理、一次小小尝试，都能让生活重新有了方向。你可能比自己想象的更懂得，怎样为心里重要的事留出位置。',wish:'今晚，不必等到所有事情完成才休息。小院会替你照看未完的事。',color:'#82916d'}
];
const themes=[
 {pair:['R','A'],tension:'你愿意先把感受想清楚，再让别人靠近。可以留意：等待“足够确定”的时候，你是否也推迟了表达一句还没整理好的需要？',fatigue:'如果你一直负责理解气氛，却很少说明自己此刻的感受，安静也可能变成独自消化。',action:'找一个安全的人，说一句“我还没想清楚，但我想先告诉你”。'},
 {pair:['K','S'],tension:'你能把关心变成具体的行动。可以留意：当你暂时帮不上忙时，你是否仍允许自己安心地被喜欢？',fatigue:'当每次相聚都变成你在准备、收尾和照顾，温暖也可能慢慢成为任务。',action:'下一次接受一份照顾时，先说谢谢，不急着马上回报。'},
 {pair:['O','A'],tension:'你珍惜自由，也愿意自己寻找方向。可以留意：当你累了，会不会仍说“我再看看”，而没有让别人知道你也想有个依靠？',fatigue:'若每次遇到不确定都只能独自往前，探索也可能变成没有停靠的赶路。',action:'把一次独自处理，换成一个具体请求，例如“陪我走一小段吧”。'},
 {pair:['C','K'],tension:'你重视回应，也会照顾相处的温度。可以留意：为了让大家舒服，你有没有太快答应，来不及听见自己真正的偏好？',fatigue:'当维持气氛总由你负责，你可能很难分清“我愿意”和“我怕让人失望”。',action:'下次答应之前，给自己一句“让我想一会儿，再回复你”。'},
 {pair:['R','O'],tension:'你喜欢理解更深的意义，也愿意保留不同的可能。可以留意：你是否等到想得足够完整，才允许自己开始一次很小的尝试？',fatigue:'当每件小事都需要一个完整解释，思考可能挤占亲身体验的空间。',action:'选一个没有想透的念头，只做十分钟，暂时不评价它。'},
 {pair:['S','A'],tension:'你重视自己的节奏，也喜欢让事情有着落。可以留意：只有把清单完成，你才觉得自己有资格休息吗？',fatigue:'若每次变化都意味着要重新掌握全部安排，日常的小意外也会额外耗费力气。',action:'今天留一件不紧急的小事到明天，先做一件让身体舒服的事。'},
 {pair:['O','C'],name:'星图温室',en:'THE STARLIGHT GREENHOUSE',image:'apple-courtyard',line:'每一颗好奇心，都可以慢慢发芽。',tension:'你容易被新可能与新相遇点亮。可以留意：为了不错过任何一条路，你是否迟迟没把时间真正留给眼前这一条？',fatigue:'当每一个新邀请都值得尝试，日程可能越来越满，心却没有落脚处。',action:'为一个最想尝试的方向，留半小时不被其他新想法打断的时间。'},
 {pair:['R','S'],name:'琥珀钟屋',en:'THE AMBER CLOCK HOUSE',image:'rainy-attic',line:'珍贵的时光，可以留下，也可以流动。',tension:'你珍惜经验，也喜欢事物之间有连续的线索。可以留意：为了不辜负过去，你是否把某个已经不合适的安排留得太久？',fatigue:'当每次改变都像在告别一个重要的自己，决定会变得格外沉重。',action:'留下一件能代表回忆的小物，同时放下一条已经不适合现在的规矩。'},
 {pair:['O','K'],name:'雾溪木屋',en:'THE MISTY CREEK CABIN',image:'apple-courtyard',line:'溪水会转弯，你也可以有自己的方向。',tension:'你愿意接住变化，也能留意沿途的需要。可以留意：当你总能适应环境时，是否反而少问了一句“我自己想往哪里走”？',fatigue:'若每次转弯都由新的需要决定，灵活也可能变成不断调整自己。',action:'做下一个小决定前，先写一句不需要迁就任何人的偏好。'},
 {pair:['C','S'],name:'山雀驿站',en:'THE SPARROW WAYSTATION',image:'bread-garden',line:'把人们聚在一起，也为自己留一个座位。',tension:'你会把人与安排连接起来，让事情向前推进。可以留意：当没有人需要你组织或回应时，你是否仍能自在地待在其中？',fatigue:'若每段关系都需要你主动维系、每次相聚都等你安排，陪伴也可能像值班。',action:'参加一次不用由你安排的相聚，允许自己只是其中一个人。'},
 {pair:['A','K'],name:'银蕨庭院',en:'THE SILVER FERN GARDEN',image:'rose-tearoom',line:'门可以由你打开，温柔也可以有边界。',tension:'你愿意关心别人，也珍惜自己的空间。可以留意：有时你是否用独自承担来守住边界，让想靠近的人不知道怎样帮你？',fatigue:'当“自己处理最省事”成为唯一选择，你可能需要照料很多，却很少被照料。',action:'挑一件风险很小的事，告诉信任的人你愿意接受哪一种帮助。'},
 {pair:['O','S'],name:'萤火工坊',en:'THE FIREFLY WORKSHOP',image:'moonlit-library',line:'把心里的微光，做成可以触摸的东西。',tension:'你既喜欢新想法，也希望亲手把它做出来。可以留意：你是否想先做得像样，才愿意让别人看到尚未完成的过程？',fatigue:'若每次尝试都同时背着新意与完成度的要求，原本的好奇会变得紧绷。',action:'给一个未完成的小作品找位观众，明确告诉对方你只想分享过程。'}
];
export const HOMES=themes.map((theme,index)=>{
 const base=originalHomes[index<6?index:0];
 return {...base,...theme,imageAlt:originalHomes.find(h=>h.image===(theme.image||base.image)).imageAlt};
});
export function analyze(answers){
 const route=buildRoute(answers);
 if(route.length!==TOTAL_STEPS||route.some(q=>!Number.isInteger(answers[q.id])||!q.options[answers[q.id]])) throw new Error('Complete the active route before analyzing');
 const raw={},maximum={},groups={};
 for(const key of Object.keys(DIMENSIONS)){raw[key]=0;maximum[key]=0;groups[key]=new Set()}
 for(const q of route){
  const chosen=q.options[answers[q.id]];
  for(const key of Object.keys(DIMENSIONS)){
   raw[key]+=chosen.weights[key]||0;
   maximum[key]+=Math.max(...q.options.map(o=>o.weights[key]||0));
   if(chosen.weights[key])groups[key].add(q.id.split('-')[0]);
  }
 }
 const scores=Object.fromEntries(Object.keys(DIMENSIONS).map(key=>[key,raw[key]/(maximum[key]||1)]));
 // Route-specific denominators stop a branch from receiving more weight merely
 // because its options contain more opportunities to express a dimension.
 const ranked=HOMES.map((home,index)=>({index,score:3*scores[home.pair[0]]+2*scores[home.pair[1]]})).sort((a,b)=>b.score-a.score||a.index-b.index);
 const home=HOMES[ranked[0].index];
 const [first,second]=home.pair;
 const supported=groups[first].size>=3&&groups[second].size>=3;
 const close=ranked[0].score-ranked[1].score<0.06;
 const evidence=route.map(q=>({q,choice:q.options[answers[q.id]]})).sort((a,b)=>((b.choice.weights[first]||0)+(b.choice.weights[second]||0))-((a.choice.weights[first]||0)+(a.choice.weights[second]||0)));
 const distinct=[];
 for(const item of evidence){if(!distinct.some(e=>e.q.id.split('-')[0]===item.q.id.split('-')[0]))distinct.push(item);if(distinct.length===2)break}
 const third=Object.keys(scores).filter(key=>!home.pair.includes(key)&&groups[key].size>=3).sort((a,b)=>scores[b]-scores[a])[0];
 const personalNote=third?`另一条反复出现的线索是「${DIMENSIONS[third].name}」：${DIMENSIONS[third].text}`:'这次旅程也保留了一些尚未定形的部分，不必急着为它们命名。';
 const restNotes=[
  '你为今晚选择了暂时不用回应的独处。可以让这段安静有个温柔的边界，而不是把所有事情都留给自己消化。',
  '你为今晚选择了向信任的人说说今天。可以告诉对方，此刻你想被倾听，还是希望一起找办法。',
  '你为今晚选择了走出去，让身体和风一起换换节奏。散步可以只是散步，不必再完成一个目标。',
  '你为今晚选择了照料身边的小角落。可以只整理出一处舒服的位置，不必等一切都收拾妥当才休息。'
 ];
 return {...home,personalNote,restNote:restNotes[answers.rest],text:`这次旅程里，你的选择更靠近「${DIMENSIONS[first].name}」与「${DIMENSIONS[second].name}」。${DIMENSIONS[first].text}${DIMENSIONS[second].text}`,
 wish:`今晚可以试试：${home.action}`,strengths:home.pair.map(key=>DIMENSIONS[key]),
 tension:supported?home.tension:'这次选择还没有形成足够一致的线索。先不急着认领一种矛盾；你可以观察，不同情境下，哪些需要会自然地排到前面。',
 evidence:distinct.map(({q,choice})=>({title:q.title,choice:choice.text})),
 nuance:close?'几个倾向相当接近，这间小屋只是此刻较贴近你的一个落脚点。':'这是这次选择呈现的倾向，也可以随着处境和心情改变。',scores,routeIds:route.map(q=>q.id)};
}
