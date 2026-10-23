import {build} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'dist-minitool');
const artifacts=path.join(root,'artifacts');
const zip=path.join(artifacts,'twilight-village-minitool.zip');
await build({
 configFile:false,root,base:'./',publicDir:path.join(root,'public'),
 resolve:{alias:[{find:/^\.\/save-image\.js$/,replacement:path.join(root,'src/minitool-image.js')}]},
 build:{outDir:output,emptyOutDir:true,copyPublicDir:false,target:['es2017','chrome61'],cssTarget:['chrome61','safari18'],sourcemap:false,reportCompressedSize:false,
  lib:{entry:path.join(root,'src/minitool-entry.js'),name:'TwilightVillage',formats:['iife'],fileName:()=> 'assets/app.js',cssFileName:'app'},
  rollupOptions:{output:{inlineDynamicImports:true,assetFileNames:'assets/[name][extname]'}}
 }
});
function mkdir(directory){fs.mkdirSync(directory,{recursive:true})}
for(const directory of ['homes','scenes']){
 mkdir(path.join(output,directory));
 for(const name of fs.readdirSync(path.join(root,'public',directory)).filter(name=>name.endsWith('.webp'))){
  execFileSync('magick',[path.join(root,'public',directory,name),'-resize','720x720>','-quality','52',path.join(output,directory,name)]);
 }
}
execFileSync('magick',[path.join(root,'public/village.png'),'-resize','720x720>','-quality','52',path.join(output,'village.webp')]);
mkdir(path.join(output,'fonts'));
fs.copyFileSync(path.join(root,'public/fonts/twilight-wenkai.woff2'),path.join(output,'fonts/twilight-wenkai.woff2'));
fs.writeFileSync(path.join(output,'fonts/OFL.json'),JSON.stringify({font:'LXGW WenKai',license:fs.readFileSync(path.join(root,'public/fonts/OFL.txt'),'utf8')}));
const cssPath=path.join(output,'assets/app.css');
let css=fs.readFileSync(cssPath,'utf8');
css=css.replace(/url\((["']?)(?:\/|\.\.\/)?fonts\//g,'url($1../fonts/').replace(/url\((["']?)(?:\/|\.\.\/)?village\.png/g,'url($1../village.webp');
css=css.replace(/#[0-9a-fA-F]{8}\b/g,value=>{
 const rgb=[1,3,5].map(i=>parseInt(value.slice(i,i+2),16));
 const alpha=Math.round(parseInt(value.slice(7,9),16)/255*10000)/10000;
 return `rgba(${rgb.join(',')},${alpha})`;
}).replace('font-weight:400 700','font-weight:400');
fs.writeFileSync(cssPath,css);
fs.writeFileSync(path.join(output,'index.html'),'<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><meta name="theme-color" content="#211f30"><title>为你留一盏灯 · 心灵小屋测试</title><link rel="stylesheet" href="./assets/app.css"></head><body><div id="app"></div><script defer src="./assets/app.js"></script></body></html>');
const code=fs.readFileSync(path.join(output,'assets/app.js'),'utf8');
for(const prohibited of [/\bfetch\s*\(/,/\bXMLHttpRequest\b/,/\bWebAssembly\b/,/\beval\s*\(/,/\bnew\s+Function\b/,/\.download\s*=/,/\bwindow\.open\s*\(/,/\bnew\s+(Worker|WebSocket|SharedWorker)\s*\(/]){
 if(prohibited.test(code))throw Error('Forbidden code in mini-tool artifact: '+prohibited);
}
if(!code.includes('saveImageToPhotosAlbum'))throw Error('Native image delivery was not bundled');
mkdir(artifacts);
execFileSync('python3',['-c',`import sys,zipfile\nfrom pathlib import Path\nroot=Path(sys.argv[1])\nwith zipfile.ZipFile(sys.argv[2],'w',zipfile.ZIP_DEFLATED) as z:\n for p in sorted(root.rglob('*')):\n  if p.is_file(): z.write(p,p.relative_to(root).as_posix())\nwith zipfile.ZipFile(sys.argv[2]) as z:\n assert z.testzip() is None\n assert 'index.html' in z.namelist()\n`,output,zip]);
const size=fs.statSync(zip).size;
if(size>10*1024*1024)throw Error('Mini-tool ZIP exceeds 10 MiB');
const hash=crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex');
fs.writeFileSync(path.join(artifacts,'minitool-build.json'),JSON.stringify({zip:path.basename(zip),size,sha256:hash,target:['es2017','chrome61'],onlineDocumentation:'unverified: HTTP 403; bundled 1.8.0 skill baseline used',platformSimulator:'pending user validation',androidDevice:'pending user validation',iosDevice:'pending user validation'},null,2)+'\n');
console.log(`Mini-tool ZIP: ${zip}\nSize: ${(size/1024/1024).toFixed(2)} MiB\nSHA256: ${hash}`);
