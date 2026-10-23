import test from 'node:test';import assert from 'node:assert/strict';
import {deliverCard} from '../src/minitool-image.js';
const small='data:image/jpeg;base64,YWJj';
test('missing album capability gives an honest fallback without downloading',async()=>{
 globalThis.window={};let encoded=false;
 const result=await deliverCard({toDataURL(){encoded=true;return small}});
 assert.match(result,/暂不支持/);assert.equal(encoded,false);
});
test('native save receives the temporary file returned by the documented API',async()=>{
 const calls=[];globalThis.window={xhs:{miniTool:{async writeTempFile(options){calls.push(options);return {filePath:'tmp/card.jpg'}},async saveImageToPhotosAlbum(options){calls.push(options)}}}};
 assert.match(await deliverCard({toDataURL:()=>small}),/已保存/);
 assert.deepEqual(calls,[{data:small},{filePath:'tmp/card.jpg'}]);
});
test('older supported bridge can receive a data URI when temporary files are unavailable',async()=>{
 let saved;globalThis.window={xhs:{miniTool:{async saveImageToPhotosAlbum(options){saved=options.filePath}}}};
 await deliverCard({toDataURL:()=>small});assert.equal(saved,small);
});
test('native errors are not reported as a successful save',async()=>{
 globalThis.window={xhs:{miniTool:{async saveImageToPhotosAlbum(){throw Error('album permission denied')}}}};
 await assert.rejects(deliverCard({toDataURL:()=>small}),/permission denied/);
});
test('large generated images retry compression and enforce the one-MiB ceiling',async()=>{
 const big='data:image/jpeg;base64,'+'A'.repeat(1500000);const qualities=[];
 globalThis.window={xhs:{miniTool:{async saveImageToPhotosAlbum(){throw Error('Must not reach native API')}}}};
 await assert.rejects(deliverCard({toDataURL(type,quality){qualities.push(quality);return big}}),/budget/);
 assert.deepEqual(qualities,[0.82,0.65]);
});
