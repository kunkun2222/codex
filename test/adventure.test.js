import test from 'node:test';
import assert from 'node:assert/strict';
import {BASE_QUESTIONS,BRANCHES,HOMES,TOTAL_STEPS,buildRoute,pruneAnswers,analyze} from '../src/adventure.js';
function complete(picks={}){const answers={};for(let i=0;i<TOTAL_STEPS;i++){const q=buildRoute(answers)[i];answers[q.id]=picks[q.id]??0}return answers}
test('all 64 branch combinations complete with 15 distinct active questions',()=>{
 const paths=new Set();
 for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++){
  const answers=complete({letter:a,room:b,farewell:c});const route=buildRoute(answers);
  assert.equal(route.length,15);assert.equal(new Set(route.map(q=>q.id)).size,15);
  for(const [id,choice]of [['letter',a],['room',b],['farewell',c]])assert(route.some(q=>q.id===BRANCHES[id][choice].id));
  paths.add(route.map(q=>q.id).join(','));
  const result=analyze(answers);assert(result.evidence.every(e=>route.some(q=>q.title===e.title&&q.options[answers[q.id]].text===e.choice)));
  for(const score of Object.values(result.scores))assert(score>=0&&score<=1);
 }
 assert.equal(paths.size,64);
});
test('changing a fork removes the abandoned answer and rejects an incomplete new path',()=>{
 const old=complete({letter:0});const changed=pruneAnswers({...old,letter:1});
 assert(!('letter-ask' in changed));assert(!('letter-trace' in changed));assert.throws(()=>analyze(changed));
 changed['letter-trace']=2;const final=analyze(changed);
 assert(!final.routeIds.includes('letter-ask'));assert(final.routeIds.includes('letter-trace'));
 assert.deepEqual(analyze({...changed,'letter-ask':3}),final);
});
test('question schema has 24 unique scenes and four valid choices each',()=>{
 const bank=[...BASE_QUESTIONS,...Object.values(BRANCHES).flat()];assert.equal(bank.length,24);assert.equal(new Set(bank.map(q=>q.id)).size,24);
 for(const q of bank){assert.equal(q.options.length,4);for(const option of q.options){assert(option.text);assert(Object.values(option.weights).every(n=>n>=0))}}
 assert.throws(()=>analyze({}));assert.throws(()=>analyze({...complete(),arrival:9}));
});
test('all 12 homes are reachable; tie handling is deterministic and inputs stay unchanged',()=>{
 let seed=31337;const found=new Set();
 for(let n=0;n<10000&&found.size<12;n++){const answers={};for(let i=0;i<15;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;answers[buildRoute(answers)[i].id]=seed>>>30}const before=JSON.stringify(answers);const result=analyze(answers);assert.equal(JSON.stringify(answers),before);assert.deepEqual(analyze(answers),result);found.add(result.name)}
 assert.equal(found.size,HOMES.length);
});
test('people with a shared home can receive different personal side notes and actual-choice echoes',()=>{
 const groups=new Map();let seed=988;
 for(let n=0;n<500;n++){const answers={};for(let i=0;i<15;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;answers[buildRoute(answers)[i].id]=seed>>>30}const r=analyze(answers);const fingerprint=JSON.stringify([r.personalNote,r.restNote,r.evidence]);if(!groups.has(r.name))groups.set(r.name,new Set());groups.get(r.name).add(fingerprint)}
 assert([...groups.values()].every(variants=>variants.size>1));
});
