// Capability detection, never user-agent or model sniffing.
const flex=document.createElement('div');
flex.style.cssText='position:absolute;visibility:hidden;display:flex;flex-direction:column;row-gap:1px';
flex.appendChild(document.createElement('div'));flex.appendChild(document.createElement('div'));
document.body.appendChild(flex);
document.documentElement.classList.add(flex.scrollHeight===1?'supports-flex-gap':'no-flex-gap');
flex.parentNode.removeChild(flex);
function updateHeight(){
 const viewport=window.visualViewport;
 const height=viewport&&viewport.height?viewport.height:window.innerHeight;
 document.documentElement.style.setProperty('--app-height',Math.round(height)+'px');
}
updateHeight();window.addEventListener('resize',updateHeight);
if(window.visualViewport)window.visualViewport.addEventListener('resize',updateHeight);
