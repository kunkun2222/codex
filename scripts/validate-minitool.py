"""Static artifact gate; this is not platform simulator or real-device validation."""
from pathlib import Path, PurePosixPath
from html.parser import HTMLParser
import re, sys, json, hashlib, zipfile
root=Path(__file__).resolve().parents[1]
stage=root/'dist-minitool'
archive=root/'artifacts/twilight-village-minitool.zip'
errors=[]
def check(condition,message):
 if not condition: errors.append(message)
class EntryParser(HTMLParser):
 def handle_starttag(self,tag,attrs):
  values=dict(attrs)
  check(not any(k.startswith('on') for k in values),'inline event attribute')
  check(tag not in ['base','iframe','object'],'forbidden HTML tag: '+tag)
  if tag=='script':
   check('src' in values,'inline script')
   check(values.get('type','')!='module','module script')
  if tag=='meta' and values.get('name')=='viewport':
   for part in ['width=device-width','initial-scale=1','viewport-fit=cover']:check(part in values.get('content',''),'missing viewport '+part)
  for key in ['src','href']:
   if key in values: local_reference(values[key],stage/'index.html')
def local_reference(value,source):
 check(not re.match(r'^(?:/|https?:|//|javascript:|data:)',value,re.I),'non-local reference: '+value)
 target=(source.parent/value).resolve()
 check(target.is_relative_to(stage.resolve()) and target.is_file(),'missing/escaping resource: '+value)
files=[p for p in stage.rglob('*') if p.is_file()]
allowed={'.html','.css','.js','.png','.jpg','.jpeg','.gif','.webp','.svg','.woff','.woff2','.json'}
for p in files:
 check(p.suffix.lower() in allowed,'unsupported file: '+str(p))
 check(not any(part in ['node_modules','.git','.DS_Store'] for part in p.relative_to(stage).parts),'development file: '+str(p))
check([p.relative_to(stage).as_posix() for p in files if p.suffix=='.html']==['index.html'],'expected one root HTML entry')
html=(stage/'index.html').read_text()
EntryParser().feed(html)
check('http-equiv="Content-Security-Policy"' not in html,'must not create container CSP')
code=(stage/'assets/app.js').read_text()
for pattern in [r'\bfetch\s*\(',r'XMLHttpRequest',r'\bnew\s+(?:Worker|SharedWorker|WebSocket|EventSource|RTCPeerConnection)\s*\(',r'\bWebAssembly\b',r'\beval\s*\(',r'\bnew\s+Function\s*\(',r'\.download\s*=',r'\bwindow\.(?:open|prompt)\s*\(',r'\b(?:import|export)\s',r'navigator\.(?:clipboard|geolocation|bluetooth|usb|hid|serial|credentials|locks|serviceWorker)']:
 check(not re.search(pattern,code),'forbidden code: '+pattern)
check('saveImageToPhotosAlbum' in code and 'writeTempFile' in code,'missing documented native image path')
check('Object.fromEntries' not in code,'unsupported runtime builtin')
css=(stage/'assets/app.css').read_text()
for match in re.finditer(r'url\(([^)]+)\)',css):local_reference(match.group(1).strip('"\''),stage/'assets/app.css')
check('no-flex-gap' in css,'missing flex gap baseline')
check('padding-top:66.6667%' in css,'missing aspect ratio baseline')
check('--app-height' in css and '100vh' in css,'missing viewport baseline')
check(not re.search(r'#[0-9a-fA-F]{8}\b',css),'unconverted eight-digit alpha color')
check(len(list((stage/'homes').glob('*.webp')))==12,'expected 12 result images')
check(len(list((stage/'scenes').glob('*.webp')))==10,'expected 10 chapter images')
for p in files:
 if p.suffix in ['.js','.css','.html','.json']:check(not re.search(r'data:[^,\s]+;base64,[A-Za-z0-9+/=]{136536,}',p.read_text()),'large static base64: '+str(p))
with zipfile.ZipFile(archive) as z:
 check(z.testzip() is None,'corrupt zip')
 check('index.html' in z.namelist(),'zip root missing index')
 check(set(z.namelist())=={p.relative_to(stage).as_posix() for p in files},'zip files differ from audited stage')
 for info in z.infolist():
  name=PurePosixPath(info.filename)
  check(not name.is_absolute() and '..' not in name.parts,'unsafe zip path')
  check(hashlib.sha256(z.read(info.filename)).digest()==hashlib.sha256((stage/info.filename).read_bytes()).digest(),'zip content mismatch: '+info.filename)
check(archive.stat().st_size<=10*1024*1024,'zip exceeds hard limit')
result={'status':'passed' if not errors else 'failed','files':len(files),'size_bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'errors':errors,'scope':'static package checks only; online contract, platform simulator and devices are not verified'}
(root/'artifacts/minitool-static-check.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(bool(errors))
