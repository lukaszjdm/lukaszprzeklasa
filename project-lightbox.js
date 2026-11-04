(()=>{'use strict';
const groups=[...document.querySelectorAll('.project-block')].map(block=>({
 title:block.querySelector('.project-header h2')?.textContent.trim()||'Project photos',
 items:[...block.querySelectorAll('figure')].filter(f=>f.querySelector('img')).map(f=>({
  img:f.querySelector('img'),caption:f.querySelector('figcaption')?.textContent.trim()||f.querySelector('img').alt||'Project photo'
 }))
})).filter(g=>g.items.length);
if(!groups.length)return;
const dialog=document.createElement('div');dialog.className='project-lightbox';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Project photo viewer');dialog.setAttribute('aria-hidden','true');
dialog.innerHTML='<div class="lightbox-panel"><div class="lightbox-top"><div class="lightbox-project"></div><button class="lightbox-close" type="button" aria-label="Close photo viewer">×</button></div><div class="lightbox-stage"><button class="lightbox-arrow lightbox-prev" type="button" aria-label="Previous photo">‹</button><img class="lightbox-photo" alt=""><button class="lightbox-arrow lightbox-next" type="button" aria-label="Next photo">›</button></div><div class="lightbox-details"><p class="lightbox-caption"></p><div class="lightbox-counter" aria-live="polite"></div></div></div>';
document.body.appendChild(dialog);
const photo=dialog.querySelector('.lightbox-photo'),caption=dialog.querySelector('.lightbox-caption'),counter=dialog.querySelector('.lightbox-counter'),title=dialog.querySelector('.lightbox-project'),prev=dialog.querySelector('.lightbox-prev'),next=dialog.querySelector('.lightbox-next'),closeBtn=dialog.querySelector('.lightbox-close');
let activeGroup=null,index=0,returnFocus=null,touchX=null;
function render(){const item=activeGroup.items[index];photo.src=item.img.currentSrc||item.img.src;photo.alt=item.img.alt||item.caption;caption.textContent=item.caption;counter.textContent=(index+1)+' / '+activeGroup.items.length;title.textContent=activeGroup.title;prev.disabled=activeGroup.items.length<2;next.disabled=activeGroup.items.length<2}
function open(group,i){activeGroup=group;index=i;returnFocus=document.activeElement;render();dialog.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-open');closeBtn.focus()}
function close(){dialog.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');photo.removeAttribute('src');activeGroup=null;if(returnFocus?.isConnected)returnFocus.focus()}
function move(delta){if(!activeGroup)return;index=(index+delta+activeGroup.items.length)%activeGroup.items.length;render()}
groups.forEach(group=>group.items.forEach((item,i)=>{const img=item.img;img.setAttribute('tabindex','0');img.setAttribute('role','button');img.setAttribute('aria-label','View photo '+(i+1)+' of '+group.items.length+': '+item.caption);img.addEventListener('click',()=>open(group,i));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(group,i)}})}));
closeBtn.addEventListener('click',close);prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
document.addEventListener('keydown',e=>{if(!activeGroup)return;if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}else if(e.key==='ArrowRight'){e.preventDefault();move(1)}else if(e.key==='Tab'){const controls=[closeBtn,prev,next].filter(b=>!b.disabled);const at=controls.indexOf(document.activeElement);if(e.shiftKey&&at<=0){e.preventDefault();controls[controls.length-1].focus()}else if(!e.shiftKey&&at===controls.length-1){e.preventDefault();controls[0].focus()}}});
photo.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].screenX},{passive:true});photo.addEventListener('touchend',e=>{if(touchX===null)return;const d=e.changedTouches[0].screenX-touchX;if(Math.abs(d)>45)move(d>0?-1:1);touchX=null},{passive:true});
})();